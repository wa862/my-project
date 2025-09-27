const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

// 添加CORS中间件
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// JWT密钥（实际项目中应该从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// 生成JWT token的函数
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
router.post('/password', async (req, res) => {
  console.log('收到登录请求:', { phone: req.body.phone });
  
  const { phone, password } = req.body;

  // 表单验证
  if (!phone || !password) {
    return res.status(400).json({ 
      code: 400, 
      message: '手机号和密码均为必填项',
      success: false
    });
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      code: 400, 
      message: '请输入有效的11位手机号',
      success: false
    });
  }

  try {
    // 检查用户是否存在
    const [results] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    console.log('查询结果:', results.length);

    if (results.length === 0) {
      return res.status(404).json({ 
        code: 404, 
        message: '该手机号未注册，请先注册',
        success: false
      });
    }

    const user = results[0];
    console.log('找到用户:', user.phone);

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        code: 401, 
        message: '密码错误',
        success: false
      });
    }

    // 登录成功，生成JWT token
    const token = generateToken(user);
    console.log('生成的token:', token);

    res.status(200).json({
      code: 200,
      message: '登录成功',
      success: true,
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
      code: 500, 
      message: '服务器内部错误',
      success: false,
      error: err.message
    });
  }
});

// 发送验证码接口
router.post('/send-code', async (req, res) => {
  console.log('收到发送验证码请求:', { phone: req.body.phone });
  
  const { phone } = req.body;

  // 表单验证
  if (!phone) {
    return res.status(400).json({ 
      code: 400, 
      message: '手机号为必填项',
      success: false
    });
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      code: 400, 
      message: '请输入有效的11位手机号',
      success: false
    });
  }

  try {
    // 检查用户是否存在
    const [results] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (results.length === 0) {
      return res.status(404).json({ 
        code: 404, 
        message: '该手机号未注册，请先注册',
        success: false
      });
    }

    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 这里应该有发送验证码的逻辑，如调用短信API
    console.log(`验证码 ${code} 已发送至手机号 ${phone}`);
    
    // 将验证码存储到数据库（设置5分钟过期）
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期
    await db.query(
      'INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = ?, expires_at = ?',
      [phone, code, expiresAt, code, expiresAt]
    );

    res.status(200).json({ 
      code: 200, 
      message: '验证码已发送',
      success: true
    });

  } catch (err) {
    console.error('发送验证码失败:', err);
    res.status(500).json({ 
      code: 500, 
      message: '服务器内部错误',
      success: false,
      error: err.message
    });
  }
});

// 验证码登录接口
router.post('/code', async (req, res) => {
  console.log('收到验证码登录请求:', { phone: req.body.phone, code: req.body.code });
  
  const { phone, code } = req.body;

  // 表单验证
  if (!phone || !code) {
    return res.status(400).json({ 
      code: 400, 
      message: '手机号和验证码均为必填项',
      success: false
    });
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      code: 400, 
      message: '请输入有效的11位手机号',
      success: false
    });
  }

  try {
    // 检查用户是否存在
    const [userResults] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (userResults.length === 0) {
      return res.status(404).json({ 
        code: 404, 
        message: '该手机号未注册，请先注册',
        success: false
      });
    }

    // 验证验证码
    const [codeResults] = await db.query(
      'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND expires_at > NOW()',
      [phone, code]
    );

    if (codeResults.length === 0) {
      return res.status(400).json({ 
        code: 400, 
        message: '验证码错误或已过期',
        success: false
      });
    }

    const user = userResults[0];
    
    // 登录成功，生成JWT token
    const token = generateToken(user);

    // 删除已使用的验证码
    await db.query('DELETE FROM verification_codes WHERE phone = ?', [phone]);

    res.status(200).json({
      code: 200,
      message: '登录成功',
      success: true,
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
    console.error('验证码登录失败:', err);
    res.status(500).json({ 
      code: 500, 
      message: '服务器内部错误',
      success: false,
      error: err.message
    });
  }
});

// 健康检查接口
router.get('/health', (req, res) => {
  res.status(200).json({ 
    code: 200, 
    message: '认证服务正常运行',
    success: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;