const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取用户总数
router.get('/count', async (req, res) => {
  try {
    const [results] = await db.query('SELECT COUNT(*) as count FROM users');
    res.json({
      success: true,
      data: {
        count: results[0].count
      }
    });
  } catch (err) {
    console.error('获取用户总数失败:', err);
    res.status(500).json({
      success: false,
      message: '获取用户总数失败'
    });
  }
});

// 获取最新注册的用户
router.get('/latest', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT unit, contact, phone, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    console.error('获取最新用户失败:', err);
    res.status(500).json({
      success: false,
      message: '获取最新用户失败'
    });
  }
});

module.exports = router;