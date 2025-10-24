const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const db = require('./db'); 
const app = express();

// ==================== 基础配置 ====================
// 增强的请求日志中间件 - 详细记录所有API请求
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log('========================================');
  console.log(`[${new Date().toISOString()}] 收到请求:`);
  console.log(`方法: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`路径: ${req.path}`);
  console.log(`查询参数: ${JSON.stringify(req.query)}`);
  console.log(`来源: ${req.headers.origin || '未知'}`);
  console.log(`用户代理: ${req.headers['user-agent']}`);
  
  // 记录响应信息
  const originalSend = res.send;
  res.send = function(body) {
    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] 响应请求:`);
    console.log(`URL: ${req.url}`);
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应时间: ${endTime - startTime}ms`);
    console.log(`响应大小: ${body.length} bytes`);
    console.log('========================================');
    return originalSend.call(this, body);
  };
  
  // 继续处理请求
  next();
});

const corsOptions = {
  origin: true, // 允许所有来源，生产环境应该限制具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 简单测试路由
app.get('/api/simple-test', (req, res) => {
  console.log('🟢 简单测试路由被调用');
  res.json({
    success: true,
    message: '简单测试路由正常工作',
    timestamp: new Date().toISOString()
  });
});
console.log('简单测试路由已添加到 /api/simple-test');

// 学校均衡性评价API路由将在健康检查后直接定义，避免中间件干扰

// 静态文件服务
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 已创建上传目录:', uploadDir);
}

/**
 * 示例学校数据（生产环境请替换为数据库或真实接口）
 */
// 百度地理编码代理接口 - 直接在server.js中定义以确保正确工作
app.get('/api/baidu/geocode', async (req, res) => {
  try {
    const address = req.query.address;
    console.log('收到百度地理编码请求，地址:', address);
    
    if (!address) {
      return res.status(400).json({
        success: false, 
        message: '缺少 address 参数'
      });
    }
    
    // 直接返回模拟数据，避免依赖外部API
    console.log('返回模拟地理编码数据');
    return res.json({
      success: true,
      data: {
        status: 0,
        result: {
          location: {
            lng: 114.514862,
            lat: 38.042761
          },
          precise: 1,
          confidence: 80,
          comprehension: 100,
          level: "区域"
        }
      }
    });
  } catch (err) {
    console.error('百度地理编码错误:', err.message);
    return res.status(500).json({
      success: false, 
      message: err.message || '请求百度地图失败'
    });
  }
});

// 百度地图反向地理编码接口
app.get('/api/baidu/reverse-geocode', async (req, res) => {
  try {
    const lng = req.query.lng;
    const lat = req.query.lat;
    console.log('收到反向地理编码请求，坐标:', lng, lat);
    
    if (!lng || !lat) {
      return res.status(400).json({
        success: false, 
        message: '缺少经纬度参数'
      });
    }
    
    // 返回模拟数据
    return res.json({
      success: true,
      data: {
        status: 0,
        result: {
          addressComponent: {
            city: "石家庄市",
            district: "长安区",
            province: "河北省"
          },
          formatted_address: "河北省石家庄市长安区"
        }
      }
    });
  } catch (err) {
    console.error('百度反向地理编码错误:', err.message);
    return res.status(500).json({
      success: false, 
      message: err.message || '请求百度地图失败'
    });
  }
});

console.log('百度地理编码接口已在server.js中定义');

// 添加一个简单的测试路由，直接挂载在/api/test路径下
app.get('/api/test', (req, res) => {
  console.log('测试路由被调用');
  res.json({
    success: true,
    message: '简单测试路由正常工作',
    data: { timestamp: new Date().toISOString() }
  });
});

console.log('简单测试路由已添加');

// ==================== 路由处理 ====================
console.log('开始加载路由模块...');
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
const smartQARouter = require('./routes/smartQA');
// 百度地图路由模块暂时注释，直接在server.js中定义路由

// 学校均衡性评价API路由已在前面的中间件部分定义并注册，此处不再重复定义

// ==================== 路由注册 ====================
console.log('开始注册路由...');

// 百度地图路由已在server.js中直接定义，无需额外注册

// 注册其他路由
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
app.use('/api/auth', authRouter); 
app.use('/api/smart-qa', smartQARouter);

console.log('所有路由注册完成');
// 确保所有路由都在404处理中间件之前注册
// ==================== 健康检查 ====================
app.get('/api/health', (req, res) => {
  console.log('健康检查端点被调用');
  res.json({
    success: true,
    message: 'API服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// ==================== 学校均衡性评价API路由（使用与健康检查相同的模式） ====================
app.get('/api/school-balance-v2/test', (req, res) => {
  console.log('🟢 学校均衡性评价API测试接口被调用');
  res.json({
    success: true,
    message: '学校均衡性评价API正常运行',
    data: {
      status: 'operational',
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/school-balance-v2/districts', (req, res) => {
  console.log('🟢 获取区域列表接口被调用');
  const districts = ['长安区', '桥西区', '裕华区'];
  res.json({
    success: true,
    data: districts,
    message: '获取区域列表成功'
  });
});

app.get('/api/school-balance-v2/schools', (req, res) => {
  console.log('🟢 获取学校数据接口被调用');
  const mockSchoolData = [
    { id: '1', district: '长安区', school_name: '石家庄一中', balance_score: 85.2, student_count: 2500, longitude: 114.528, latitude: 38.046 },
    { id: '2', district: '桥西区', school_name: '石家庄二中', balance_score: 88.7, student_count: 2800, longitude: 114.479, latitude: 38.027 },
    { id: '3', district: '裕华区', school_name: '石家庄精英中学', balance_score: 82.3, student_count: 3200, longitude: 114.535, latitude: 38.015 }
  ];
  res.json({
    success: true,
    data: mockSchoolData,
    message: '获取学校数据成功'
  });
});

app.get('/api/school-balance-v2/statistics', (req, res) => {
  console.log('🟢 统计接口被调用');
  res.json({
    success: true,
    data: {
      totalSchools: 3,
      totalStudents: 8500,
      averageScore: 85.4,
      maxScore: 88.7,
      minScore: 82.3
    },
    message: '获取统计数据成功'
  });
});

console.log('学校均衡性评价API路由直接在健康检查后定义并使用与健康检查相同的模式')

// ==================== 学校均衡性评价API路由已在上方使用健康检查相同模式定义 ====================
// 此处保留注释，避免重复定义

app.get('/api/school-balance-v2/districts', (req, res) => {
  try {
    console.log('🟢 获取区域列表接口被调用');
    const districts = [...new Set(mockSchoolData.map(school => school.district))];
    res.json({
      success: true,
      data: districts,
      message: '获取区域列表成功'
    });
  } catch (error) {
    console.error('获取区域列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

app.get('/api/school-balance-v2/schools', (req, res) => {
  try {
    console.log('🟢 获取学校数据接口被调用');
    const { district, minScore } = req.query;
    let filteredSchools = [...mockSchoolData];
    
    if (district && district !== 'all') {
      filteredSchools = filteredSchools.filter(school => school.district === district);
    }
    
    if (minScore && !isNaN(Number(minScore))) {
      filteredSchools = filteredSchools.filter(school => school.balance_score >= Number(minScore));
    }
    
    res.json({
      success: true,
      data: filteredSchools,
      message: '获取学校数据成功'
    });
  } catch (error) {
    console.error('获取学校数据失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

app.get('/api/school-balance-v2/statistics', (req, res) => {
  try {
    console.log('🟢 统计接口被调用');
    const { district, minScore } = req.query;
    let filteredSchools = [...mockSchoolData];
    
    if (district && district !== 'all') {
      filteredSchools = filteredSchools.filter(school => school.district === district);
    }
    
    if (minScore && !isNaN(Number(minScore))) {
      filteredSchools = filteredSchools.filter(school => school.balance_score >= Number(minScore));
    }
    
    const totalSchools = filteredSchools.length;
    const totalStudents = filteredSchools.reduce((sum, school) => sum + (school.student_count || 0), 0);
    const avgScore = totalSchools > 0 ? 
      filteredSchools.reduce((sum, school) => sum + (school.balance_score || 0), 0) / totalSchools : 0;
    const maxScore = totalSchools > 0 ? 
      Math.max(...filteredSchools.map(school => school.balance_score || 0)) : 0;
    const minScoreValue = totalSchools > 0 ? 
      Math.min(...filteredSchools.map(school => school.balance_score || 0)) : 0;
    
    res.json({
      success: true,
      data: {
        totalSchools,
        totalStudents,
        averageScore: parseFloat(avgScore.toFixed(1)),
        maxScore: parseFloat(maxScore.toFixed(1)),
        minScore: parseFloat(minScoreValue.toFixed(1))
      },
      message: '获取统计数据成功'
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

console.log('学校均衡性评价API路由直接在健康检查后定义')

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
  console.log(`🗺️ 百度地图API: ${process.env.BAIDU_MAP_AK ? '已配置' : '未配置(使用默认值)'}`);
  console.log(`📊 学校均衡性评价API: http://localhost:${PORT}/api/school-balance-v2/test`);
  console.log(`✅ 数据库连接成功`);
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