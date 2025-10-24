package com.example.api.repository;

import com.example.api.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // 根据问题ID获取所有评论
    List<Comment> findByQuestionIdOrderByCreatedAtDesc(Long questionId);
    
    // 计算问题的评论数
    int countByQuestionId(Long questionId);
}