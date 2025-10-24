package com.example.api.repository;

import com.example.api.model.QuestionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionTagRepository extends JpaRepository<QuestionTag, Long> {
    
    // 按名称升序获取所有标签
    List<QuestionTag> findAllByOrderByNameAsc();
}