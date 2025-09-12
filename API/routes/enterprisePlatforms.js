const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取企业平台数据（分页+搜索+过滤）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;
    const { search, category, is_verified } = req.query;

    let query = 'SELECT * FROM enterprise_platforms';
    let countQuery = 'SELECT COUNT(*) as total FROM enterprise_platforms';
    const params = [];

    // 构建查询条件
    const conditions = [];
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (is_verified !== undefined) {
      conditions.push('is_verified = ?');
      params.push(is_verified === 'true');
    }
    
    if (conditions.length) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ?, ?';
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
    console.error('获取企业平台数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建企业平台
router.post('/', async (req, res) => {
  try {
    const { title, description, url, image_url, category, is_verified } = req.body;

    if (!title || !description || !url || !category) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    const [result] = await pool.query(
      `INSERT INTO enterprise_platforms 
      (title, description, url, image_url, category, is_verified) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, url, image_url, category, is_verified || false]
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

// 更新企业平台
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, image_url, category } = req.body;

    // 检查平台是否存在
    const [existing] = await pool.query(
      'SELECT id FROM enterprise_platforms WHERE id = ?', 
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "平台未找到",
        error: `ID ${id} 对应的平台不存在`
      });
    }

    // 只更新存在的字段（移除is_verified）
    const [result] = await pool.query(
      `UPDATE enterprise_platforms 
       SET title = ?, description = ?, url = ?, image_url = ?, category = ?
       WHERE id = ?`,
      [title, description, url, image_url, category, id]
    );

    // 检查是否成功更新
    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "更新失败，可能是ID不存在"
      });
    }

    // 获取更新后的数据
    const [updatedData] = await pool.query(
      'SELECT * FROM enterprise_platforms WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedData[0],
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

// 删除企业平台
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查平台是否存在
    const [existing] = await pool.query('SELECT * FROM enterprise_platforms WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "平台未找到" });
    }

    await pool.query('DELETE FROM enterprise_platforms WHERE id = ?', [id]);

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