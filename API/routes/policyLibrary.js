const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取政策库数据（分页+搜索+地区过滤）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const { search, region } = req.query;

    let query = 'SELECT * FROM policy_library';
    let countQuery = 'SELECT COUNT(*) as total FROM policy_library';
    const params = [];

    // 构建查询条件
    const conditions = [];
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (region) {
      conditions.push('region = ?');
      params.push(region);
    }
    
    if (conditions.length) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY publish_date DESC LIMIT ?, ?';
    params.push(offset, pageSize);

    const [data] = await pool.query(query, params);
    const [[total]] = await pool.query(countQuery, params.slice(0, -2));

    res.json({
      success: true,
      data: data,
      pagination: {
        page,
        pageSize,
        total: total.total,
        totalPages: Math.ceil(total.total / pageSize)
      }
    });
  } catch (err) {
    console.error('获取政策库数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建政策
router.post('/', async (req, res) => {
  try {
    const { title, description, url, image_url, region, publish_date } = req.body;

    if (!title || !description || !url || !region || !publish_date) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    const [result] = await pool.query(
      `INSERT INTO policy_library 
      (title, description, url, image_url, region, publish_date) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, url, image_url, region, publish_date]
    );

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "政策创建成功"
    });
  } catch (err) {
    console.error("创建政策失败:", err);
    res.status(500).json({ 
      success: false,
      message: "创建政策失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 更新政策
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, url, image_url, region, publish_date } = req.body;

    // 转换日期格式为YYYY-MM-DD
    if (publish_date) {
      publish_date = new Date(publish_date).toISOString().split('T')[0];
    }

    // 检查政策是否存在
    const [existing] = await pool.query('SELECT id FROM policy_library WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "政策未找到" });
    }

    await pool.query(
      `UPDATE policy_library SET 
      title = ?, description = ?, url = ?, image_url = ?, 
      region = ?, publish_date = ?
      WHERE id = ?`,
      [title, description, url, image_url, region, publish_date, id]
    );

    // 获取更新后的数据
    const [updatedData] = await pool.query(
      'SELECT * FROM policy_library WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedData[0],
      message: "政策更新成功"
    });
  } catch (err) {
    console.error("更新政策失败:", err);
    res.status(500).json({ 
      success: false,
      message: "更新政策失败",
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        sql: err.sql,
        stack: err.stack
      } : undefined
    });
  }
});

// 删除政策
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查政策是否存在
    const [existing] = await pool.query('SELECT * FROM policy_library WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "政策未找到" });
    }

    await pool.query('DELETE FROM policy_library WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "政策删除成功"
    });
  } catch (err) {
    console.error("删除政策失败:", err);
    res.status(500).json({ 
      success: false,
      message: "删除政策失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;