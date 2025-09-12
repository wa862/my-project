const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取调查数据（分页+搜索）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const search = req.query.search || '';

    let query = 'SELECT * FROM surveys';
    let countQuery = 'SELECT COUNT(*) as total FROM surveys';
    const params = [];

    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ?, ?';
    params.push(offset, pageSize);

    const [data] = await db.query(query, params);
    const [[total]] = await db.query(countQuery, params.slice(0, -2));

    // 处理图片URL
    const processedData = data.map(item => ({
      ...item,
      image_url: item.image_url.startsWith('http') 
        ? item.image_url 
        : `${process.env.BASE_URL || 'http://localhost:3000'}/images/${item.image_url}`
    }));

    res.json({
      success: true,
      data: processedData,
      pagination: {
        page,
        pageSize,
        total: total.total,
        totalPages: Math.ceil(total.total / pageSize)
      }
    });
  } catch (err) {
    console.error('获取调查数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取调查数据失败'
    });
  }
});

// 创建调查
router.post('/', async (req, res) => {
  try {
    const { title, description, url, image_url } = req.body;

    if (!title || !description || !url) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    const [result] = await db.query(
      'INSERT INTO surveys (title, description, url, image_url) VALUES (?, ?, ?, ?)',
      [title, description, url, image_url]
    );

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "调查创建成功"
    });
  } catch (err) {
    console.error("创建调查失败:", err);
    res.status(500).json({ 
      success: false,
      message: "创建调查失败"
    });
  }
});

// 更新调查
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, image_url } = req.body;

    // 检查调查是否存在
    const [existing] = await db.query('SELECT * FROM surveys WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "调查未找到" });
    }

    await db.query(
      'UPDATE surveys SET title = ?, description = ?, url = ?, image_url = ? WHERE id = ?',
      [title, description, url, image_url, id]
    );

    res.json({
      success: true,
      message: "调查更新成功"
    });
  } catch (err) {
    console.error("更新调查失败:", err);
    res.status(500).json({ 
      success: false,
      message: "更新调查失败"
    });
  }
});

// 删除调查
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查调查是否存在
    const [existing] = await db.query('SELECT * FROM surveys WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "调查未找到" });
    }

    await db.query('DELETE FROM surveys WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "调查删除成功"
    });
  } catch (err) {
    console.error("删除调查失败:", err);
    res.status(500).json({ 
      success: false,
      message: "删除调查失败"
    });
  }
});

module.exports = router;