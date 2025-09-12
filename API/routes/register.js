const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db'); // Use the centralized db connection

// 注册接口
router.post('/', async (req, res) => {
  const { unit, contact, phone, password, province, city, district } = req.body;

  // 表单验证
  if (!unit || !contact || !phone || !password || !province || !city || !district) {
    return res.status(400).json({ code: 400, message: '所有字段均为必填项' });
  }

  // 密码验证（至少 8 位）
  if (password.length < 8) {
    return res.status(400).json({ code: 400, message: '密码至少 8 个字符' });
  }

  try {
    // 检查是否已存在该手机号
    const [results] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (results.length > 0) {
      return res.status(400).json({ code: 400, message: '该手机号已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 将新用户数据插入数据库
    const query = `
      INSERT INTO users 
        (unit, contact, phone, password, province, city, district, created_at) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [
      unit, 
      contact, 
      phone, 
      hashedPassword, 
      province, 
      city, 
      district
    ]);

    res.status(200).json({ code: 200, message: '注册成功' });

  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

module.exports = router;