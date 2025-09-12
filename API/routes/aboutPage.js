const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取关于我们页面数据
router.get('/', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM about_page LIMIT 1');
    
    if (result.length === 0) {
      return res.status(200).json({
        bannerTitle: "关于我们",
        bannerBgColor: "linear-gradient(to right, #0b60c5, #127eea)",
        breadcrumb: "当前位置： 首页 > 关于我们",
        sections: [],
        footerText: "",
        footerColor: "#888"
      });
    }
    
    // 修正：检查sections字段类型，避免重复解析
    const pageData = result[0];
    if (typeof pageData.sections === 'string') {
      pageData.sections = JSON.parse(pageData.sections);
    } else if (!pageData.sections) {
      pageData.sections = [];
    }
    
    res.json(pageData);
  } catch (error) {
    console.error('获取数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新关于我们页面数据
router.put('/', async (req, res) => {
  const { bannerTitle, bannerBgColor, breadcrumb, sections, footerText, footerColor } = req.body;
  
  if (!bannerTitle || !sections || !Array.isArray(sections)) {
    return res.status(400).json({ message: '缺少必要字段' });
  }
  
  try {
    // 确保sections总是以JSON字符串存储
    const sectionsJson = typeof sections === 'string' ? sections : JSON.stringify(sections);
    
    await db.query(
      `INSERT INTO about_page (id, banner_title, banner_bg_color, breadcrumb, sections, footer_text, footer_color) 
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       banner_title = VALUES(banner_title),
       banner_bg_color = VALUES(banner_bg_color),
       breadcrumb = VALUES(breadcrumb),
       sections = VALUES(sections),
       footer_text = VALUES(footer_text),
       footer_color = VALUES(footer_color)`,
      [bannerTitle, bannerBgColor, breadcrumb, sectionsJson, footerText, footerColor]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;