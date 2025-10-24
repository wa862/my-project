const express = require('express');
const router = express.Router();
const pool = require('../db');  // 使用连接池

console.log('School Balance Router initialized');

// 测试端点 - 验证路由是否正常工作
router.get('/test', (req, res) => {
  console.log('测试端点被调用');
  res.json({
    success: true,
    message: '学校均衡性评价API测试成功',
    data: { timestamp: new Date().toISOString() }
  });
});

// 获取所有学校数据（包含地理坐标）
router.get('/schools', async (req, res) => {
  console.log('获取所有学校均衡性评价数据请求开始');
  console.log('请求参数:', req.query);
  try {
    console.log('获取所有学校均衡性评价数据');
    
    const [schools] = await pool.query(`
      SELECT 
        id, 
        district, 
        school_name,
        student_count,
        full_time_teacher_count,
        class_count,
        floor_area,
        building_area,
        senior_teacher_count,
        special_grade_teacher_count,
        training_fee,
        teaching_material_fee,
        campus_service_area,
        property_service_people_count,
        property_satisfaction,
        high_school_graduates,
        high_school_enrollment_count,
        art_sports_participant_count,
        art_sports_award_count,
        public_funding_total,
        aided_student_count,
        high_school_tuition_free_count,
        boarding_student_count,
        high_school_grant_student_count,
        balance_score,
        longitude,
        latitude
      FROM school_balance_evaluation_1docx
      ORDER BY district, school_name
    `);
    
    // 如果数据库中没有地理坐标，为学校添加默认坐标（石家庄中心区域附近）
    const schoolsWithCoords = schools.map(school => {
      // 如果没有经纬度数据，添加默认值
      if (!school.longitude || !school.latitude) {
        const baseLng = 114.514862;
        const baseLat = 38.042761;
        // 为每所学校生成略有不同的坐标，避免完全重叠
        const randomOffset = (Math.random() - 0.5) * 0.1;
        return {
          ...school,
          longitude: baseLng + randomOffset,
          latitude: baseLat + randomOffset
        };
      }
      return school;
    });
    
    console.log(`找到 ${schoolsWithCoords.length} 条学校数据`);
    
    res.json({
      success: true,
      data: schoolsWithCoords
    });
  } catch (err) {
    console.error('获取学校数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取学校数据失败',
      error: err.message
    });
  }
});

// 根据区域获取学校数据（包含地理坐标）
router.get('/schools/by-district', async (req, res) => {
  try {
    const district = req.query.district;
    console.log(`根据区域获取学校数据: ${district}`);
    
    let query = `
      SELECT 
        id, 
        district, 
        school_name,
        student_count,
        balance_score,
        longitude,
        latitude
      FROM school_balance_evaluation_1docx
    `;
    
    const params = [];
    
    if (district && district !== 'all') {
      query += ' WHERE district = ?';
      params.push(district);
    }
    
    query += ' ORDER BY balance_score DESC';
    
    const [schools] = await pool.query(query, params);
    
    // 添加默认地理坐标
    const schoolsWithCoords = schools.map(school => {
      if (!school.longitude || !school.latitude) {
        const baseLng = 114.514862;
        const baseLat = 38.042761;
        const randomOffset = (Math.random() - 0.5) * 0.1;
        return {
          ...school,
          longitude: baseLng + randomOffset,
          latitude: baseLat + randomOffset
        };
      }
      return school;
    });
    
    console.log(`找到 ${schoolsWithCoords.length} 条学校数据`);
    
    res.json({
      success: true,
      data: schoolsWithCoords
    });
  } catch (err) {
    console.error('获取学校数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取学校数据失败',
      error: err.message
    });
  }
});

// 根据分数范围获取学校数据（包含地理坐标）
router.get('/schools/by-score-range', async (req, res) => {
  try {
    const minScore = parseFloat(req.query.minScore) || 0;
    const maxScore = parseFloat(req.query.maxScore) || 100;
    console.log(`根据分数范围获取学校数据: ${minScore} - ${maxScore}`);
    
    const [schools] = await pool.query(`
      SELECT 
        id, 
        district, 
        school_name,
        student_count,
        balance_score,
        longitude,
        latitude
      FROM school_balance_evaluation_1docx
      WHERE balance_score BETWEEN ? AND ?
      ORDER BY balance_score DESC
    `, [minScore, maxScore]);
    
    // 添加默认地理坐标
    const schoolsWithCoords = schools.map(school => {
      if (!school.longitude || !school.latitude) {
        const baseLng = 114.514862;
        const baseLat = 38.042761;
        const randomOffset = (Math.random() - 0.5) * 0.1;
        return {
          ...school,
          longitude: baseLng + randomOffset,
          latitude: baseLat + randomOffset
        };
      }
      return school;
    });
    
    console.log(`找到 ${schoolsWithCoords.length} 条学校数据`);
    
    res.json({
      success: true,
      data: schoolsWithCoords
    });
  } catch (err) {
    console.error('获取学校数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取学校数据失败',
      error: err.message
    });
  }
});

// 获取所有区域
router.get('/districts', async (req, res) => {
  try {
    console.log('获取所有区域');
    
    const [districts] = await pool.query(
      'SELECT DISTINCT district FROM school_balance_evaluation_1docx ORDER BY district'
    );
    
    const districtList = districts.map(item => item.district);
    
    console.log(`找到 ${districtList.length} 个区域`);
    
    res.json({
      success: true,
      data: districtList
    });
  } catch (err) {
    console.error('获取区域失败:', err);
    res.status(500).json({
      success: false,
      message: '获取区域失败',
      error: err.message
    });
  }
});

// 获取统计信息
router.get('/statistics', async (req, res) => {
  try {
    console.log('获取学校均衡性评价统计信息');
    
    // 获取总学校数
    const [[totalSchoolsRow]] = await pool.query(
      'SELECT COUNT(*) as total FROM school_balance_evaluation_1docx'
    );
    
    // 获取平均分数
    const [[avgScoreRow]] = await pool.query(
      'SELECT AVG(balance_score) as average FROM school_balance_evaluation_1docx'
    );
    
    // 获取最高分数
    const [[maxScoreRow]] = await pool.query(
      'SELECT MAX(balance_score) as max FROM school_balance_evaluation_1docx'
    );
    
    // 获取最低分数
    const [[minScoreRow]] = await pool.query(
      'SELECT MIN(balance_score) as min FROM school_balance_evaluation_1docx'
    );
    
    // 安全地处理可能为null或undefined的值
    const safeParseFloat = (value) => {
      console.log('🔵 处理值:', value, '类型:', typeof value);
      if (value === null || value === undefined) return 0;
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };
    
    console.log('🔵 数据库查询结果:');
    console.log('  totalSchoolsRow:', totalSchoolsRow);
    console.log('  avgScoreRow:', avgScoreRow);
    console.log('  maxScoreRow:', maxScoreRow);
    console.log('  minScoreRow:', minScoreRow);
    
    const totalSchools = totalSchoolsRow?.total || 0;
    const avgScore = safeParseFloat(avgScoreRow?.average || 0);
    const maxScore = safeParseFloat(maxScoreRow?.max || 0);
    const minScore = safeParseFloat(minScoreRow?.min || 0);
    
    console.log('🔵 处理后的值:');
    console.log('  avgScore:', avgScore, '类型:', typeof avgScore);
    console.log('  maxScore:', maxScore, '类型:', typeof maxScore);
    console.log('  minScore:', minScore, '类型:', typeof minScore);
    
    const statistics = {
      totalSchools: Number(totalSchools) || 0,
      averageScore: parseFloat(avgScore.toFixed(1)),
      maxScore: parseFloat(maxScore.toFixed(1)),
      minScore: parseFloat(minScore.toFixed(1))
    };
    
    console.log('统计信息:', statistics);
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (err) {
    console.error('获取统计信息失败:', err);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: err.message
    });
  }
});

// 获取区域学校数量统计
router.get('/statistics/by-district', async (req, res) => {
  try {
    console.log('获取各区域学校数量统计');
    
    const [results] = await pool.query(
      'SELECT district, COUNT(*) as count FROM school_balance_evaluation_1docx GROUP BY district ORDER BY district'
    );
    
    const districtCounts = {};
    results.forEach(item => {
      districtCounts[item.district] = item.count;
    });
    
    console.log('区域学校数量统计:', districtCounts);
    
    res.json({
      success: true,
      data: districtCounts
    });
  } catch (err) {
    console.error('获取区域统计失败:', err);
    res.status(500).json({
      success: false,
      message: '获取区域统计失败',
      error: err.message
    });
  }
});

// 获取排名前10的学校（包含地理坐标）
router.get('/schools/top10', async (req, res) => {
  try {
    console.log('获取排名前10的学校');
    
    const [schools] = await pool.query(`
      SELECT 
        id, 
        district, 
        school_name,
        student_count,
        balance_score,
        longitude,
        latitude
      FROM school_balance_evaluation_1docx
      ORDER BY balance_score DESC
      LIMIT 10
    `);
    
    // 添加默认地理坐标
    const schoolsWithCoords = schools.map(school => {
      if (!school.longitude || !school.latitude) {
        const baseLng = 114.514862;
        const baseLat = 38.042761;
        const randomOffset = (Math.random() - 0.5) * 0.1;
        return {
          ...school,
          longitude: baseLng + randomOffset,
          latitude: baseLat + randomOffset
        };
      }
      return school;
    });
    
    res.json({
      success: true,
      data: schoolsWithCoords
    });
  } catch (err) {
    console.error('获取排名前10的学校失败:', err);
    res.status(500).json({
      success: false,
      message: '获取排名前10的学校失败',
      error: err.message
    });
  }
});

// 获取排名后10的学校（包含地理坐标）
router.get('/schools/bottom10', async (req, res) => {
  try {
    console.log('获取排名后10的学校');
    
    const [schools] = await pool.query(`
      SELECT 
        id, 
        district, 
        school_name,
        student_count,
        balance_score,
        longitude,
        latitude
      FROM school_balance_evaluation_1docx
      ORDER BY balance_score ASC
      LIMIT 10
    `);
    
    // 添加默认地理坐标
    const schoolsWithCoords = schools.map(school => {
      if (!school.longitude || !school.latitude) {
        const baseLng = 114.514862;
        const baseLat = 38.042761;
        const randomOffset = (Math.random() - 0.5) * 0.1;
        return {
          ...school,
          longitude: baseLng + randomOffset,
          latitude: baseLat + randomOffset
        };
      }
      return school;
    });
    
    res.json({
      success: true,
      data: schoolsWithCoords
    });
  } catch (err) {
    console.error('获取排名后10的学校失败:', err);
    res.status(500).json({
      success: false,
      message: '获取排名后10的学校失败',
      error: err.message
    });
  }
});

// 根据学校名称获取学校详情
router.get('/schools/by-name', async (req, res) => {
  try {
    const schoolName = req.query.name;
    if (!schoolName) {
      return res.status(400).json({
        success: false,
        message: '学校名称不能为空'
      });
    }
    
    console.log(`根据学校名称获取详情: ${schoolName}`);
    
    const [schools] = await pool.query(
      'SELECT * FROM school_balance_evaluation_1docx WHERE school_name LIKE ?',
      [`%${schoolName}%`]
    );
    
    if (schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到该学校'
      });
    }
    
    // 确保学校数据包含地理坐标
    const schoolWithCoords = schools[0];
    if (!schoolWithCoords.longitude || !schoolWithCoords.latitude) {
      const baseLng = 114.514862;
      const baseLat = 38.042761;
      const randomOffset = (Math.random() - 0.5) * 0.1;
      schoolWithCoords.longitude = baseLng + randomOffset;
      schoolWithCoords.latitude = baseLat + randomOffset;
    }
    
    res.json({
      success: true,
      data: schoolWithCoords
    });
  } catch (err) {
    console.error('获取学校详情失败:', err);
    res.status(500).json({
      success: false,
      message: '获取学校详情失败',
      error: err.message
    });
  }
});

// 导出路由模块
module.exports = router;