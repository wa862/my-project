package com.example.api.service;

import com.example.api.model.SchoolBalanceEvaluation;
import java.util.List;
import java.util.Map;

public interface SchoolBalanceEvaluationService {
    
    // 获取所有学校数据
    List<SchoolBalanceEvaluation> getAllSchools();
    
    // 根据区域获取学校数据
    List<SchoolBalanceEvaluation> getSchoolsByDistrict(String district);
    
    // 获取所有区域
    List<String> getAllDistricts();
    
    // 根据学校名称获取学校详情
    SchoolBalanceEvaluation getSchoolByName(String schoolName);
    
    // 根据分数范围获取学校
    List<SchoolBalanceEvaluation> getSchoolsByScoreRange(double minScore, double maxScore);
    
    // 获取排名前10的学校
    List<SchoolBalanceEvaluation> getTop10Schools();
    
    // 获取排名后10的学校
    List<SchoolBalanceEvaluation> getBottom10Schools();
    
    // 获取统计信息
    Map<String, Object> getStatistics();
    
    // 按区域统计学校数量
    Map<String, Long> countSchoolsByDistrict();
    
    // 保存学校数据
    SchoolBalanceEvaluation saveSchool(SchoolBalanceEvaluation school);
    
    // 批量保存学校数据
    List<SchoolBalanceEvaluation> saveSchools(List<SchoolBalanceEvaluation> schools);
    
    // 删除学校数据
    void deleteSchool(Integer id);
}