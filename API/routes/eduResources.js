const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取教育资源列表（分页+搜索+分类过滤）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const { search, category } = req.query;

    let query = 'SELECT * FROM edu_resources';
    let countQuery = 'SELECT COUNT(*) as total FROM edu_resources';
    const params = [];

    // 构建查询条件
    const conditions = [];
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category && ['primary', 'junior'].includes(category)) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (conditions.length) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY id DESC LIMIT ?, ?';
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
    console.error('获取教育资源失败:', err);
    res.status(500).json({
      success: false,
      message: '获取数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建教育资源
router.post('/', async (req, res) => {
  try {
    const { title, image_url, link, category, description } = req.body;

    if (!title || !link || !category || !description) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    const [result] = await pool.query(
      `INSERT INTO edu_resources 
      (title, image_url, link, category, description) 
      VALUES (?, ?, ?, ?, ?)`,
      [title, image_url, link, category, description]
    );

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "资源创建成功"
    });
  } catch (err) {
    console.error("创建资源失败:", err);
    res.status(500).json({ 
      success: false,
      message: "创建资源失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 更新教育资源
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link, category, description } = req.body;

    // 检查资源是否存在
    const [existing] = await pool.query('SELECT id FROM edu_resources WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "资源未找到" });
    }

    await pool.query(
      `UPDATE edu_resources SET 
      title = ?, image_url = ?, link = ?, 
      category = ?, description = ?
      WHERE id = ?`,
      [title, image_url, link, category, description, id]
    );

    res.json({
      success: true,
      message: "资源更新成功"
    });
  } catch (err) {
    console.error("更新资源失败:", err);
    res.status(500).json({ 
      success: false,
      message: "更新资源失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 删除教育资源
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查资源是否存在
    const [existing] = await pool.query('SELECT * FROM edu_resources WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "资源未找到" });
    }

    await pool.query('DELETE FROM edu_resources WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "资源删除成功"
    });
  } catch (err) {
    console.error("删除资源失败:", err);
    res.status(500).json({ 
      success: false,
      message: "删除资源失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;