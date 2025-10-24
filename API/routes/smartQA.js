const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有问题分类
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM question_categories ORDER BY name');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类失败'
    });
  }
});

// 获取问题列表
router.get('/questions', async (req, res) => {
  try {
    const {
      search,
      categories,
      status,
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT 
        q.*,
        a.content as answer_content,
        a.is_ai_generated,
        c.name as category_name,
        (SELECT COUNT(*) FROM question_likes WHERE question_id = q.id) as likes_count,
        (SELECT COUNT(*) FROM question_likes WHERE question_id = q.id AND user_id = ?) as is_liked_by_user
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      LEFT JOIN question_categories c ON q.category_value = c.value
      WHERE 1=1
    `;
    
    const params = [req.user?.id || 0];

    // 搜索条件
    if (search) {
      query += ' AND (q.title LIKE ? OR q.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // 分类过滤
    if (categories && categories !== 'all') {
      const categoryList = categories.split(',');
      query += ' AND q.category_value IN (?)';
      params.push(categoryList);
    }

    // 状态过滤
    if (status && status !== 'all') {
      if (status === 'answered') {
        query += ' AND q.status = "answered"';
      } else if (status === 'unanswered') {
        query += ' AND q.status = "pending"';
      }
    }

    // 排序和分页
    query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(parseInt(limit), offset);

    const [questions] = await db.query(query, params);

    // 转换数据格式匹配前端
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      title: q.title,
      question: q.content,
      type: q.category_value,
      questioner: q.questioner_name,
      time: q.created_at.toLocaleString('zh-CN'),
      likes: q.likes_count || q.likes,
      comments: q.comments,
      liked: !!q.is_liked_by_user,
      answer: q.answer_content,
      isProcessing: q.is_processing,
      status: q.status
    }));

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM questions q WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (q.title LIKE ? OR q.content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (categories && categories !== 'all') {
      const categoryList = categories.split(',');
      countQuery += ' AND q.category_value IN (?)';
      countParams.push(categoryList);
    }
    
    if (status && status !== 'all') {
      if (status === 'answered') {
        countQuery += ' AND q.status = "answered"';
      } else if (status === 'unanswered') {
        countQuery += ' AND q.status = "pending"';
      }
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: {
        questions: formattedQuestions,
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取问题列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取问题列表失败'
    });
  }
});

// 创建新问题
router.post('/questions', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: '请填写完整的问题信息'
      });
    }

    const [result] = await db.query(
      'INSERT INTO questions (title, content, category_value, questioner_name, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, category, req.user?.username || '匿名用户', req.user?.id || null]
    );

    res.json({
      success: true,
      message: '问题提交成功',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('创建问题失败:', error);
    res.status(500).json({
      success: false,
      message: '创建问题失败'
    });
  }
});

// 点赞/取消点赞问题
router.post('/questions/:id/like', async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id || 1; // 临时处理，实际应该从认证中间件获取

    // 检查是否已经点赞
    const [existingLikes] = await db.query(
      'SELECT * FROM question_likes WHERE question_id = ? AND user_id = ?',
      [questionId, userId]
    );

    if (existingLikes.length > 0) {
      // 取消点赞
      await db.query(
        'DELETE FROM question_likes WHERE question_id = ? AND user_id = ?',
        [questionId, userId]
      );
      await db.query(
        'UPDATE questions SET likes = GREATEST(0, likes - 1) WHERE id = ?',
        [questionId]
      );
      
      res.json({
        success: true,
        message: '取消点赞成功',
        liked: false
      });
    } else {
      // 添加点赞
      await db.query(
        'INSERT INTO question_likes (question_id, user_id) VALUES (?, ?)',
        [questionId, userId]
      );
      await db.query(
        'UPDATE questions SET likes = likes + 1 WHERE id = ?',
        [questionId]
      );
      
      res.json({
        success: true,
        message: '点赞成功',
        liked: true
      });
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    res.status(500).json({
      success: false,
      message: '点赞操作失败'
    });
  }
});

// 获取AI回答
router.post('/questions/:id/ai-answer', async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // 获取问题信息
    const [questions] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: '问题不存在'
      });
    }

    const question = questions[0];

    // 设置问题为处理中状态
    await db.query(
      'UPDATE questions SET is_processing = TRUE WHERE id = ?',
      [questionId]
    );

    // 调用智谱AI API
    const apiKey = process.env.ZHIPU_AI_KEY || '030afcb2f1a94e17bb3e2938459bf695.swY4d61X9Q9HeXA9';

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: '你是一个乡村基础教育专家，需要回答用户关于乡村教育的各种问题。请用简洁明了的语言回答问题，提供实用的建议和解决方案。回答要专业、实用、具体。'
          },
          {
            role: 'user',
            content: `问题标题：${question.title}。问题描述：${question.content}。请针对这个问题提供专业、实用的解答。`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`AI API调用失败: ${response.status}`);
    }

    const data = await response.json();
    const aiAnswer = data.choices?.[0]?.message?.content || '抱歉，未能生成回答';

    // 保存AI回答
    await db.query(
      'INSERT INTO answers (question_id, content, is_ai_generated) VALUES (?, ?, ?)',
      [questionId, aiAnswer, true]
    );

    // 更新问题状态
    await db.query(
      'UPDATE questions SET status = "answered", is_processing = FALSE WHERE id = ?',
      [questionId]
    );

    res.json({
      success: true,
      message: 'AI回答生成成功',
      data: {
        answer: aiAnswer
      }
    });

  } catch (error) {
    console.error('获取AI回答失败:', error);
    
    // 重置处理状态
    await db.query(
      'UPDATE questions SET is_processing = FALSE WHERE id = ?',
      [req.params.id]
    );

    res.status(500).json({
      success: false,
      message: '获取AI回答失败，请稍后重试'
    });
  }
});

// 获取热门标签
router.get('/tags', async (req, res) => {
  try {
    // 从标签表获取标签
    const [tags] = await db.query('SELECT name FROM question_tags ORDER BY name');
    
    res.json({
      success: true,
      data: tags.map(tag => tag.name)
    });
  } catch (error) {
    console.error('获取标签失败:', error);
    // 返回默认标签
    res.json({
      success: true,
      data: ['乡村教师', '教育公平', '数字化转型', '师资力量', '留守儿童', '教学质量', '教育资源']
    });
  }
});

// 获取问题详情
router.get('/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    
    const [questions] = await db.query(`
      SELECT 
        q.*,
        a.content as answer_content,
        a.is_ai_generated,
        c.name as category_name,
        (SELECT COUNT(*) FROM question_likes WHERE question_id = q.id) as likes_count,
        (SELECT COUNT(*) FROM question_likes WHERE question_id = q.id AND user_id = ?) as is_liked_by_user
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      LEFT JOIN question_categories c ON q.category_value = c.value
      WHERE q.id = ?
    `, [req.user?.id || 0, questionId]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: '问题不存在'
      });
    }

    const question = questions[0];
    const formattedQuestion = {
      id: question.id,
      title: question.title,
      question: question.content,
      type: question.category_value,
      questioner: question.questioner_name,
      time: question.created_at.toLocaleString('zh-CN'),
      likes: question.likes_count || question.likes,
      comments: question.comments,
      liked: !!question.is_liked_by_user,
      answer: question.answer_content,
      isProcessing: question.is_processing,
      status: question.status
    };

    res.json({
      success: true,
      data: formattedQuestion
    });
  } catch (error) {
    console.error('获取问题详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取问题详情失败'
    });
  }
});

module.exports = router;