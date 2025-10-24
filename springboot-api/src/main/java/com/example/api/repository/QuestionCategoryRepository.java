package com.example.api.repository;

import com.example.api.model.QuestionCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory, Long> {
    
    // 按名称排序获取所有分类
    Iterable<QuestionCategory> findAllByOrderByNameAsc();
}