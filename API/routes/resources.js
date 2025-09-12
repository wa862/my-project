const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有资源（分页+搜索+分类过滤）
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      search = '', 
      category_type = '' 
    } = req.query;
    
    const offset = (Math.max(1, parseInt(page)) - 1) * Math.min(parseInt(pageSize), 50);
    const limit = Math.min(parseInt(pageSize), 50);
    
    let query = 'SELECT * FROM resources';
    let countQuery = 'SELECT COUNT(*) as total FROM resources';
    const params = [];
    
    // 构建查询条件
    const conditions = [];
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category_type) {
      conditions.push('category_type = ?');
      params.push(category_type);
    }
    
    if (conditions.length) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?, ?';
    params.push(offset, limit);
    
    // 执行查询
    const [resources] = await db.query(query, params);
    const [[total]] = await db.query(countQuery, params.slice(0, -2));
    
    res.json({
      success: true,
      data: {
        list: resources,
        pagination: {
          page: parseInt(page),
          pageSize: limit,
          total: total.total,
          totalPages: Math.ceil(total.total / limit)
        }
      }
    });
  } catch (err) {
    console.error('获取资源列表失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取资源列表失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建资源
router.post('/', async (req, res) => {
  try {
    const { title, description, url, image_url, category_type, is_featured, category_id } = req.body;
    
    // 数据校验
    if (!title || !description || !url || !category_type || !category_id) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    
    const [result] = await db.query(
      `INSERT INTO resources 
      (title, description, url, image_url, category_type, is_featured, category_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, url, image_url, category_type, is_featured || false, category_id]
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

// 更新资源
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, image_url, category_type, is_featured, category_id } = req.body;
    
    // 检查资源是否存在
    const [existing] = await db.query('SELECT * FROM resources WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "资源未找到" });
    }
    
    await db.query(
      `UPDATE resources SET 
      title = ?, description = ?, url = ?, image_url = ?, 
      category_type = ?, is_featured = ?, category_id = ?
      WHERE id = ?`,
      [title, description, url, image_url, category_type, is_featured, category_id, id]
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

// 删除资源
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查资源是否存在
    const [existing] = await db.query('SELECT * FROM resources WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "资源未找到" });
    }
    
    await db.query('DELETE FROM resources WHERE id = ?', [id]);
    
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

// 获取资源详情
router.get('/:id', async (req, res) => {
  try {
    const [resource] = await db.query(
      'SELECT * FROM resources WHERE id = ?', 
      [req.params.id]
    );
    
    if (!resource.length) {
      return res.status(404).json({ 
        success: false,
        message: '资源未找到' 
      });
    }
    
    res.json({ 
      success: true,
      data: resource[0] 
    });
  } catch (err) {
    console.error('获取资源详情失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取资源详情失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 获取特色资源
router.get('/featured', async (req, res) => {
  try {
    const [featured] = await db.query(
      'SELECT * FROM resources WHERE is_featured = 1 ORDER BY created_at DESC LIMIT 5'
    );
    
    res.json({ 
      success: true,
      data: featured 
    });
  } catch (err) {
    console.error('获取特色资源失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取特色资源失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;