package com.example.api.repository;

import com.example.api.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    // 根据问题ID查找回答
    Answer findByQuestionId(Long questionId);
}