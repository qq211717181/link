require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' })); // 增加限制以支持大文件导入
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 (如果需要上传图片等)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// 部署配置：生产环境服务静态文件
// 只有在 production 环境或者找不到 API 路由时才生效
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const startServer = (port, attempts = 0) => {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempts < 10) {
            const nextPort = port + 1;
            console.warn(`Port ${port} in use, retrying with port ${nextPort}`);
            startServer(nextPort, attempts + 1);
        } else {
            console.error('Failed to start server:', err);
            process.exit(1);
        }
    });
};

startServer(DEFAULT_PORT);
