const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database');

const authMiddleware = require('../middleware/auth');

// 注册
router.post('/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3个字符'),
        body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
        body('email').optional().isEmail().withMessage('请输入有效的邮箱')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;

        try {
            // 检查用户名是否存在
            const existingUser = await db.prepare('SELECT id FROM users WHERE username = ?').get(username);
            if (existingUser) {
                return res.status(400).json({ error: '用户名已存在' });
            }

            // 哈希密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 插入新用户
            const result = await db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)').run(
                username,
                hashedPassword,
                email || null
            );

            // 生成 JWT
            const token = jwt.sign(
                { userId: result.lastInsertRowid, username },
                process.env.JWT_SECRET,
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
                process.env.JWT_SECRET,
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
                    wallpaper: user.wallpaper
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
        const user = await db.prepare('SELECT id, username, email, wallpaper FROM users WHERE id = ?').get(req.userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        res.json(user);
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新壁纸
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

module.exports = router;
