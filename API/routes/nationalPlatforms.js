const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取国家平台数据（分页+搜索+分类过滤）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let query = 'SELECT * FROM national_platforms';
    let countQuery = 'SELECT COUNT(*) as total FROM national_platforms';
    const params = [];

    // 构建查询条件
    const conditions = [];
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push('is_official = ?');
      params.push(category === 'official' ? 1 : 0);
    }
    
    if (conditions.length) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY id ASC LIMIT ?, ?';
    params.push(offset, pageSize);

    const [data] = await pool.query(query, params);
    const [[total]] = await pool.query(countQuery, params.slice(0, -2));

    // 处理图片URL
    const processedData = data.map(item => ({
      ...item,
      image_url: item.image_url.startsWith('http') 
        ? item.image_url 
        : `${process.env.BASE_URL || 'http://localhost:3000'}/api/images/${item.image_url}`
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
    console.error('获取国家平台数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建国家平台
router.post('/', async (req, res) => {
  try {
    const { name, description, url, image_url, is_official } = req.body;

    if (!name || !description || !url) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    const [result] = await pool.query(
      'INSERT INTO national_platforms (name, description, url, image_url, is_official) VALUES (?, ?, ?, ?, ?)',
      [name, description, url, image_url, is_official]
    );

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "平台创建成功"
    });
  } catch (err) {
    console.error("创建平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "创建平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 更新国家平台
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, url, image_url, is_official } = req.body;

    // 检查平台是否存在
    const [existing] = await pool.query('SELECT * FROM national_platforms WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "平台未找到" });
    }

    await pool.query(
      'UPDATE national_platforms SET name = ?, description = ?, url = ?, image_url = ?, is_official = ? WHERE id = ?',
      [name, description, url, image_url, is_official, id]
    );

    res.json({
      success: true,
      message: "平台更新成功"
    });
  } catch (err) {
    console.error("更新平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "更新平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 删除国家平台
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查平台是否存在
    const [existing] = await pool.query('SELECT * FROM national_platforms WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "平台未找到" });
    }

    await pool.query('DELETE FROM national_platforms WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "平台删除成功"
    });
  } catch (err) {
    console.error("删除平台失败:", err);
    res.status(500).json({ 
      success: false,
      message: "删除平台失败",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;