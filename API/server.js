const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db'); 
const app = express();

// ==================== 基础配置 ====================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 已创建上传目录:', uploadDir);
}

// ==================== 路由处理 ====================
const regionsRouter = require('./routes/regions');
const newsRouter = require('./routes/news');
const resourcesRouter = require('./routes/resources');
const surveysRouter = require('./routes/surveys');
const nationalPlatformsRouter = require('./routes/nationalPlatforms');
const enterprisePlatformsRouter = require('./routes/enterprisePlatforms');
const policyLibraryRouter = require('./routes/policyLibrary');
const eduResourcesRouter = require('./routes/eduResources');
const researchPlatformsRouter = require('./routes/researchPlatforms');
const educationThinktanksRouter = require('./routes/educationThinktanks');
const userStatsRouter = require('./routes/user-stats');
const userRouter = require('./routes/user');
const registerRouter = require('./routes/register');
const aboutPageRouter = require('./routes/aboutPage');
const authRouter = require('./routes/auth'); // 新增auth路由

// 使用路由
app.use('/api/regions', regionsRouter);
app.use('/api/news', newsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/surveys', surveysRouter);
app.use('/api/national-platforms', nationalPlatformsRouter);
app.use('/api/enterprise-platforms', enterprisePlatformsRouter);
app.use('/api/policy-library', policyLibraryRouter);
app.use('/api/edu-resources', eduResourcesRouter);
app.use('/api/research-platforms', researchPlatformsRouter);
app.use('/api/education-thinktanks', educationThinktanksRouter);
app.use('/api/user-stats', userStatsRouter);
app.use('/api/users', userRouter);
app.use('/api/register', registerRouter);
app.use('/api/about-page', aboutPageRouter);
app.use('/api/auth', authRouter); // 新增auth路由

// ==================== 健康检查 ====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== 404处理 ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '资源未找到',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// ==================== 错误处理中间件 ====================
app.use((err, req, res, next) => {
  console.error('🔥 服务器错误:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// ==================== 服务器启动 ====================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`🛠️ 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 认证接口: http://localhost:${PORT}/api/auth/login`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('🛑 收到 SIGTERM 信号，准备关闭服务器...');
  server.close(() => {
    console.log('🛑 服务器已关闭');
    process.exit(0);
  });
});

// 导出app用于测试
module.exports = app;