package com.example.api.repository;

import com.example.api.model.QuestionLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionLikeRepository extends JpaRepository<QuestionLike, Long> {
    
    // 检查用户是否已经点赞某个问题
    Optional<QuestionLike> findByQuestionIdAndUserId(Long questionId, Long userId);
    
    // 计算问题的点赞数
    int countByQuestionId(Long questionId);
}