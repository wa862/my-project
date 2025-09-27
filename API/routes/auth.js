const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

// CORS中间件
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// 生成JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      unit: user.unit
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 账号密码登录接口
router.post('/login', async (req, res) => {
  console.log('收到登录请求:', req.body);
  
  const { phone, password } = req.body;

  // 表单验证
  if (!phone || !password) {
    return res.status(400).json({ 
      success: false,
      code: 400, 
      message: '手机号和密码均为必填项'
    });
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false,
      code: 400, 
      message: '请输入有效的11位手机号'
    });
  }

  try {
    // 检查用户是否存在
    const [results] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    console.log('查询结果:', results.length);

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        code: 404, 
        message: '该手机号未注册，请先注册'
      });
    }

    const user = results[0];
    console.log('找到用户:', user.phone);

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        code: 401, 
        message: '密码错误'
      });
    }

    // 登录成功，生成JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          unit: user.unit,
          contact: user.contact,
          phone: user.phone,
          province: user.province,
          city: user.city,
          district: user.district
        }
      }
    });

  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ 
      success: false,
      code: 500, 
      message: '服务器内部错误',
      error: err.message
    });
  }
});

// 健康检查接口
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    code: 200, 
    message: '认证服务正常运行',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;