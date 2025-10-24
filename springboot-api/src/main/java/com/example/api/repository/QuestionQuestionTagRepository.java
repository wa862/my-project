package com.example.api.repository;

import com.example.api.model.QuestionQuestionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionQuestionTagRepository extends JpaRepository<QuestionQuestionTag, Long> {
    
    // 根据问题ID获取所有标签关联
    List<QuestionQuestionTag> findByQuestionId(Long questionId);
    
    // 根据标签ID获取所有问题关联
    List<QuestionQuestionTag> findByQuestionTagId(Long questionTagId);
    
    // 删除问题的所有标签关联
    void deleteByQuestionId(Long questionId);
}