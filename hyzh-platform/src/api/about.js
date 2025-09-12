const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent'); // 假设有对应的模型

// 获取关于我们页面内容 (用户端使用)
router.get('/about-content', async (req, res) => {
  try {
    const content = await AboutContent.findOne();
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取关于我们内容失败'
    });
  }
});

// 获取编辑内容 (管理端使用)
router.get('/admin/about-content', async (req, res) => {
  try {
    const content = await AboutContent.findOne();
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取编辑内容失败'
    });
  }
});

// 更新关于我们内容
router.put('/admin/about-content', async (req, res) => {
  try {
    const { bannerTitle, background, sections } = req.body;

    const updatedContent = await AboutContent.findOneAndUpdate(
      {},
      { bannerTitle, background, sections },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: updatedContent,
      message: '内容更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新内容失败'
    });
  }
});

module.exports = router;
