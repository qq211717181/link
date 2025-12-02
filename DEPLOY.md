# 部署指南 (Deployment Guide)

本项目支持多种部署方式，推荐使用 Docker 进行容器化部署，方便快捷。

## 方式一：Docker 部署 (推荐)

### 前置要求
- 服务器已安装 Docker 和 Docker Compose。

### 部署步骤

1. **上传代码**
   将整个项目目录上传到服务器。

2. **构建并启动**
   在项目根目录下运行：
   ```bash
   docker-compose up -d --build
   ```

3. **访问应用**
   访问 `http://服务器IP:3001` 即可。

### 数据持久化
- 数据库文件 (`ilinks.db`) 和上传的文件 (`uploads/`) 会自动映射到宿主机的 `server/` 目录下，重启容器数据不会丢失。

---

## 方式二：手动部署 (Node.js + PM2)

如果不使用 Docker，可以直接在服务器上运行 Node.js 服务。

### 前置要求
- 服务器已安装 Node.js (v18+) 和 NPM。
- 建议安装 PM2 用于进程管理 (`npm install -g pm2`)。

### 部署步骤

1. **构建前端**
   在本地或服务器上，进入项目根目录：
   ```bash
   npm install
   npm run build
   ```
   这将生成 `dist` 目录，包含所有静态资源。

2. **准备后端**
   进入 `server` 目录：
   ```bash
   cd server
   npm install --production
   ```

3. **配置环境变量**
   确保 `server` 目录下有 `.env` 文件，或者设置环境变量：
   ```bash
   export NODE_ENV=production
   export SERVE_STATIC=true
   ```

4. **启动服务**
   使用 PM2 启动后端服务：
   ```bash
   pm2 start server.js --name "ilinks"
   ```

5. **访问应用**
   访问 `http://服务器IP:3001`。

---

## 常见问题

### 端口冲突
如果 3001 端口被占用，可以在 `docker-compose.yml` 或 `.env` 中修改 `PORT` 变量。

### 静态资源 404
确保 `dist` 目录存在且位于 `server` 目录的上一级 (`../dist`)。我们在 `server.js` 中配置了自动服务该目录。
