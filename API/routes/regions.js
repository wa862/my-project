const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有省份（去重）
router.get('/provinces', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT DISTINCT province 
      FROM regions 
      ORDER BY province
    `);
    
    res.json({
      code: 200,
      data: results.map(item => item.province),
      message: '获取省份数据成功'
    });
  } catch (err) {
    console.error('获取省份列表失败:', err);
    res.status(500).json({
      code: 500,
      message: '获取省份数据失败',
      error: err.message
    });
  }
});

// 获取某省份下的城市
router.get('/:province/cities', async (req, res) => {
  const province = decodeURIComponent(req.params.province);
  
  try {
    const [results] = await db.query(`
      SELECT DISTINCT city 
      FROM regions 
      WHERE province = ? 
      ORDER BY city
    `, [province]);

    if (!results || results.length === 0) {
      return res.status(200).json({
        code: 200,
        data: [],
        message: '该省份下无城市数据'
      });
    }
    
    res.json({
      code: 200,
      data: results.map(item => item.city),
      message: '获取城市数据成功'
    });
  } catch (err) {
    console.error(`获取 ${province} 城市列表失败:`, err);
    res.status(500).json({
      code: 500,
      message: '获取城市数据失败',
      error: err.message
    });
  }
});

// 获取某城市下的区县
router.get('/:province/:city/districts', async (req, res) => {
  const { province, city } = req.params;
  
  try {
    const [results] = await db.query(`
      SELECT district 
      FROM regions 
      WHERE province = ? AND city = ?
      ORDER BY district
    `, [decodeURIComponent(province), decodeURIComponent(city)]);

    if (results.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '未找到该城市或该城市下无区县数据'
      });
    }
    
    res.json({
      code: 200,
      data: results.map(item => item.district),
      message: '获取区县数据成功'
    });
  } catch (err) {
    console.error(`获取 ${province}-${city} 区县列表失败:`, err);
    res.status(500).json({
      code: 500,
      message: '获取区县数据失败',
      error: err.message
    });
  }
});

module.exports = router;