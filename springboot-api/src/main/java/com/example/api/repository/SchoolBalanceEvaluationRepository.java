package com.example.api.repository;

import com.example.api.model.SchoolBalanceEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolBalanceEvaluationRepository extends JpaRepository<SchoolBalanceEvaluation, Integer> {
    
    // 根据区域查询学校数据
    List<SchoolBalanceEvaluation> findByDistrict(String district);
    
    // 查询所有区域
    @Query("SELECT DISTINCT s.district FROM SchoolBalanceEvaluation s ORDER BY s.district")
    List<String> findAllDistricts();
    
    // 根据学校名称查询
    Optional<SchoolBalanceEvaluation> findBySchoolName(String schoolName);
    
    // 根据均衡分数范围查询
    List<SchoolBalanceEvaluation> findByBalanceScoreBetween(Double minScore, Double maxScore);
    
    // 查询均衡分数最高的学校
    @Query("SELECT s FROM SchoolBalanceEvaluation s ORDER BY s.balanceScore DESC LIMIT 10")
    List<SchoolBalanceEvaluation> findTop10ByOrderByBalanceScoreDesc();
    
    // 查询均衡分数最低的学校
    @Query("SELECT s FROM SchoolBalanceEvaluation s ORDER BY s.balanceScore ASC LIMIT 10")
    List<SchoolBalanceEvaluation> findTop10ByOrderByBalanceScoreAsc();
    
    // 统计信息查询 - 平均分数
    @Query("SELECT AVG(s.balanceScore) FROM SchoolBalanceEvaluation s")
    Double findAverageBalanceScore();
    
    // 统计信息查询 - 最高分数
    @Query("SELECT MAX(s.balanceScore) FROM SchoolBalanceEvaluation s")
    Double findMaxBalanceScore();
    
    // 统计信息查询 - 最低分数
    @Query("SELECT MIN(s.balanceScore) FROM SchoolBalanceEvaluation s")
    Double findMinBalanceScore();
    
    // 统计信息查询 - 学校总数
    @Query("SELECT COUNT(s) FROM SchoolBalanceEvaluation s")
    Long findTotalSchoolCount();
    
    // 按区域分组统计学校数量
    @Query("SELECT s.district, COUNT(s) FROM SchoolBalanceEvaluation s GROUP BY s.district ORDER BY s.district")
    List<Object[]> countSchoolsByDistrict();
}