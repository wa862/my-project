const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取科研平台列表（分页+搜索）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const { search } = req.query;

    let query = 'SELECT * FROM research_platforms';
    let countQuery = 'SELECT COUNT(*) as total FROM research_platforms';
    const params = [];

    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
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
    console.error('获取科研平台失败:', err);
    res.status(500).json({
      success: false,
      message: '获取数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建科研平台
router.post('/', async (req, res) => {
  try {
    const { title, image_url, link, description } = req.body;

    if (!title || !link) {
      return res.status(400).json({ success: false, message: "标题和链接为必填项" });
    }

    const [result] = await pool.query(
      `INSERT INTO research_platforms 
      (title, image_url, link, description) 
      VALUES (?, ?, ?, ?)`,
      [title, image_url, link, description]
    );

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "科研平台创建成功"
    });
  } catch (err) {
    console.error("创建科研平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "创建科研平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 更新科研平台
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link, description } = req.body;

    // 检查平台是否存在
    const [existing] = await pool.query('SELECT id FROM research_platforms WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "科研平台未找到" });
    }

    await pool.query(
      `UPDATE research_platforms SET 
      title = ?, image_url = ?, link = ?, description = ?
      WHERE id = ?`,
      [title, image_url, link, description, id]
    );

    res.json({
      success: true,
      message: "科研平台更新成功"
    });
  } catch (err) {
    console.error("更新科研平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "更新科研平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 删除科研平台
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查平台是否存在
    const [existing] = await pool.query('SELECT * FROM research_platforms WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "科研平台未找到" });
    }

    await pool.query('DELETE FROM research_platforms WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "科研平台删除成功"
    });
  } catch (err) {
    console.error("删除科研平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "删除科研平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;