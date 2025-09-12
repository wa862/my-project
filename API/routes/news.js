const express = require('express');
const router = express.Router();
const pool = require('../db');  // 使用连接池

// 获取新闻列表（分页）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;

    console.log(`Fetching news with page: ${page}, pageSize: ${pageSize}`);

    // 查询新闻列表
    const [news] = await pool.query(`
      SELECT id, title, summary, published_date, image_url, link
      FROM news
      WHERE title LIKE ? OR summary LIKE ?
      ORDER BY published_date DESC
      LIMIT ?, ?
    `, [`%${req.query.title || ''}%`, `%${req.query.title || ''}%`, offset, pageSize]);

    // 获取总数
    const [[total]] = await pool.query('SELECT COUNT(*) as total FROM news WHERE title LIKE ? OR summary LIKE ?', [`%${req.query.title || ''}%`, `%${req.query.title || ''}%`]);

    console.log(`Found ${total.total} total news`);

    res.json({
      success: true,
      data: {
        list: news,
        pagination: {
          page,
          pageSize,
          total: total.total,
          totalPages: Math.ceil(total.total / pageSize)
        }
      }
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({
      success: false,
      message: '获取新闻列表失败',
      error: err.message
    });
  }
});

// 获取新闻详情
router.get('/:id', async (req, res) => {
  try {
    const [news] = await pool.query(`
      SELECT id, title, summary, published_date, image_url, link
      FROM news
      WHERE id = ?
    `, [req.params.id]);

    if (news.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到该新闻'
      });
    }

    res.json({
      success: true,
      data: news[0]
    });
  } catch (err) {
    console.error('获取新闻详情失败:', err);
    res.status(500).json({
      success: false,
      message: '获取新闻详情失败',
      error: err.message
    });
  }
});

// 新增新闻
router.post('/', async (req, res) => {
  try {
    const { title, summary, image_url, link, published_date } = req.body;

    // 数据校验
    if (!title || !summary || !link || !published_date) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }

    // 转换日期格式
    const mysqlDate = new Date(published_date).toISOString().slice(0, 19).replace('T', ' ');

    // 插入新闻
    const [result] = await pool.query(`
      INSERT INTO news (title, summary, image_url, link, published_date)
      VALUES (?, ?, ?, ?, ?)
    `, [title, summary, image_url, link, mysqlDate]);

    res.json({
      success: true,
      data: { id: result.insertId },
      message: "新闻添加成功"
    });
  } catch (err) {
    console.error("新增新闻失败:", err);
    res.status(500).json({ success: false, message: "新增新闻失败", error: err.message });
  }
});

// 修改新闻
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, image_url, link, published_date } = req.body;

    // 检查新闻是否存在
    const [existingNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ success: false, message: "新闻不存在" });
    }

    // 转换日期格式
    const mysqlDate = new Date(published_date).toISOString().slice(0, 19).replace('T', ' ');

    // 更新新闻
    await pool.query(`
      UPDATE news 
      SET title = ?, summary = ?, image_url = ?, link = ?, published_date = ?
      WHERE id = ?
    `, [title, summary, image_url, link, mysqlDate, id]);

    res.json({
      success: true,
      message: "新闻更新成功"
    });
  } catch (err) {
    console.error("修改新闻失败:", err);
    res.status(500).json({ success: false, message: "修改新闻失败", error: err.message });
  }
});

// 删除新闻
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查新闻是否存在
    const [existingNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ success: false, message: "新闻不存在" });
    }

    // 删除新闻
    await pool.query('DELETE FROM news WHERE id = ?', [id]);

    res.json({
      success: true,
      message: "新闻删除成功"
    });
  } catch (err) {
    console.error("删除新闻失败:", err);
    res.status(500).json({ success: false, message: "删除新闻失败", error: err.message });
  }
});

module.exports = router;