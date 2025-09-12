const express = require('express');
const router = express.Router();
const db = require('../db'); // 统一使用db.js中的连接

// 获取用户列表
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 10, search = '' } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    // 查询用户数据
    let query = `
      SELECT id, avatar, name, email, role, 
      DATE_FORMAT(createTime, '%Y-%m-%d %H:%i:%s') as createTime, 
      status
      FROM users_force
    `;
    let params = [];
    
    if (search) {
      query += ` WHERE name LIKE ? OR email LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY id DESC LIMIT ?, ?`;
    params.push(offset, parseInt(pageSize));

    // 使用db.js中的连接
    const [rows] = await db.query(query, params);

    // 查询总数
    let countQuery = `SELECT COUNT(*) AS total FROM users_force`;
    if (search) {
      countQuery += ` WHERE name LIKE ? OR email LIKE ?`;
    }
    const [[{ total }]] = await db.query(countQuery, search ? [`%${search}%`, `%${search}%`] : []);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        current: parseInt(page),
        size: parseInt(pageSize),
      }
    });
  } catch (err) {
    console.error('查询用户出错:', err);
    res.status(500).json({ 
      success: false, 
      message: '获取用户列表失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  const { name, email, role, avatar = 'https://randomuser.me/api/portraits/lego/1.jpg' } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ 
      success: false, 
      message: '姓名、邮箱和角色为必填项' 
    });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users_force WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '该邮箱已被注册' 
      });
    }

    const [result] = await db.query(`
      INSERT INTO users_force (name, email, role, avatar, status)
      VALUES (?, ?, ?, ?, 1)
    `, [name, email, role, avatar]);

    const [newUser] = await db.query('SELECT * FROM users_force WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: '用户创建成功', 
      data: newUser[0] 
    });
  } catch (err) {
    console.error('创建用户失败:', err);
    res.status(500).json({ 
      success: false, 
      message: '创建用户失败',
      error: err.message
    });
  }
});

// 更新用户
router.patch('/:id/status', async (req, res) => {
  // 允许跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PATCH');
  
  const { id } = req.params;
  const { status } = req.body;

  console.log(`收到状态更新请求 ID: ${id}, 状态: ${status}`); // 添加日志

  try {
    // 参数验证
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: '无效的用户ID' 
      });
    }

    if (status !== 0 && status !== 1) {
      return res.status(400).json({ 
        success: false, 
        message: '状态值必须是0或1' 
      });
    }

    // 检查用户是否存在
    const [user] = await db.query(
      'SELECT id FROM users_force WHERE id = ?', 
      [id]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '用户不存在' 
      });
    }

    // 执行更新
    await db.query(
      'UPDATE users_force SET status = ? WHERE id = ?',
      [status, id]
    );

    console.log(`状态更新成功 ID: ${id}, 新状态: ${status}`); // 添加日志

    res.json({
      success: true,
      message: `用户状态已${status === 1 ? '启用' : '禁用'}`,
      data: { id, status }
    });

  } catch (err) {
    console.error('状态更新错误:', err);
    res.status(500).json({ 
      success: false, 
      message: '状态更新失败',
      error: err.message
    });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: '无效的用户ID' });
  }

  try {
    const [user] = await db.query('SELECT id FROM users_force WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    await db.query('DELETE FROM users_force WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: '用户删除成功' 
    });
  } catch (err) {
    console.error('删除用户失败:', err);
    res.status(500).json({ 
      success: false, 
      message: '删除用户失败',
      error: err.message
    });
  }
});

// 更新用户状态
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: '无效的用户ID' });
  }

  if (status !== 0 && status !== 1) {
    return res.status(400).json({ 
      success: false, 
      message: '状态值无效，必须是0或1' 
    });
  }

  try {
    const [user] = await db.query('SELECT id FROM users_force WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    await db.query('UPDATE users_force SET status = ? WHERE id = ?', [status, id]);

    res.json({ 
      success: true, 
      message: `用户状态已${status === 1 ? '启用' : '禁用'}`,
      data: { id, status }
    });
  } catch (err) {
    console.error('更新状态失败:', err);
    res.status(500).json({ 
      success: false, 
      message: '更新状态失败',
      error: err.message
    });
  }
});

module.exports = router;