const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

const authMiddleware = require('../middleware/auth');

const ensureJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not configured');
    }
    return secret;
};

// 配置 multer 处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'wallpaper-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB 限制
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// 注册
router.post('/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3个字符'),
        body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
        body('email')
            .optional({ nullable: true, checkFalsy: true })
            .isEmail()
            .withMessage('请输入有效的邮箱')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;
        const normalizedEmail = email?.trim() || null;
        const jwtSecret = ensureJwtSecret();
        if (!jwtSecret) {
            return res.status(500).json({ error: '服务器配置错误，请联系管理员' });
        }

        try {
            // 检查用户名是否存在
            const existingUser = await db.prepare('SELECT id FROM users WHERE username = ?').get(username);
            if (existingUser) {
                return res.status(400).json({ error: '用户名已存在' });
            }

            if (normalizedEmail) {
                const existingEmail = await db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
                if (existingEmail) {
                    return res.status(400).json({ error: '邮箱已被使用' });
                }
            }

            // 哈希密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 插入新用户
            const result = await db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)').run(
                username,
                hashedPassword,
                normalizedEmail
            );

            // 生成 JWT
            const token = jwt.sign(
                { userId: result.lastInsertRowid, username },
                jwtSecret,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: '注册成功',
                token,
                user: {
                    id: result.lastInsertRowid,
                    username
                }
            });
        } catch (error) {
            if (error?.message?.includes('UNIQUE constraint failed: users.email')) {
                return res.status(400).json({ error: '邮箱已被使用' });
            }
            console.error('注册错误:', error);
            res.status(500).json({ error: '服务器错误' });
        }
    }
);

// 登录
router.post('/login',
    [
        body('username').trim().notEmpty().withMessage('请输入用户名'),
        body('password').notEmpty().withMessage('请输入密码')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        console.log('登录请求:', { username, password: '***' });
        const jwtSecret = ensureJwtSecret();
        if (!jwtSecret) {
            return res.status(500).json({ error: '服务器配置错误，请联系管理员' });
        }

        try {
            // 查找用户 - 支持用户名或邮箱
            const user = await db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);
            console.log('查询到的用户:', user ? { id: user.id, username: user.username, email: user.email } : 'null');

            if (!user) {
                console.log('用户不存在:', username);
                return res.status(401).json({ error: '用户名或密码错误' });
            }

            // 验证密码
            console.log('开始验证密码...');
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('密码验证结果:', isValidPassword);

            if (!isValidPassword) {
                console.log('密码错误');
                return res.status(401).json({ error: '用户名或密码错误' });
            }

            // 生成 JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                jwtSecret,
                { expiresIn: '7d' }
            );

            console.log('登录成功:', user.username);
            res.json({
                message: '登录成功',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    wallpaper: user.wallpaper,
                    ui_settings: user.ui_settings ? JSON.parse(user.ui_settings) : null
                }
            });
        } catch (error) {
            console.error('登录错误:', error);
            res.status(500).json({ error: '服务器错误' });
        }
    }
);

// 获取当前用户信息
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await db.prepare('SELECT id, username, email, wallpaper, ui_settings FROM users WHERE id = ?').get(req.userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        // Parse JSON string
        if (user.ui_settings) {
            try {
                user.ui_settings = JSON.parse(user.ui_settings);
            } catch (e) {
                user.ui_settings = null;
            }
        }
        res.json(user);
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 上传壁纸
router.post('/wallpaper/upload', authMiddleware, upload.single('wallpaper'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '请选择要上传的图片' });
        }

        // 获取用户当前的壁纸
        const user = await db.prepare('SELECT wallpaper FROM users WHERE id = ?').get(req.userId);

        // 如果有旧壁纸且是本地文件，删除它
        if (user && user.wallpaper && user.wallpaper.startsWith('/uploads/')) {
            const oldFilePath = path.join(__dirname, '..', user.wallpaper);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // 保存新壁纸路径
        const wallpaperPath = `/uploads/${req.file.filename}`;
        await db.prepare('UPDATE users SET wallpaper = ? WHERE id = ?').run(wallpaperPath, req.userId);

        res.json({
            message: '壁纸上传成功',
            wallpaper: wallpaperPath
        });
    } catch (error) {
        console.error('上传壁纸错误:', error);
        // 如果出错，删除已上传的文件
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新壁纸（保留URL方式）
router.put('/wallpaper', authMiddleware, async (req, res) => {
    try {
        const { wallpaper } = req.body;
        await db.prepare('UPDATE users SET wallpaper = ? WHERE id = ?').run(wallpaper, req.userId);
        res.json({ message: '壁纸更新成功', wallpaper });
    } catch (error) {
        console.error('更新壁纸错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新 UI 设置
router.put('/ui-settings', authMiddleware, async (req, res) => {
    try {
        const { ui_settings } = req.body;
        const settingsStr = JSON.stringify(ui_settings);
        await db.prepare('UPDATE users SET ui_settings = ? WHERE id = ?').run(settingsStr, req.userId);
        res.json({ message: '设置更新成功', ui_settings });
    } catch (error) {
        console.error('更新设置错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

module.exports = router;
