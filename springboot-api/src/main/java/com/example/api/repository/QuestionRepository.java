package com.example.api.repository;

import com.example.api.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query("SELECT q FROM Question q LEFT JOIN q.answer a " +
           "LEFT JOIN QuestionCategory c ON q.categoryValue = c.value " +
           "WHERE (q.title LIKE %:search% OR q.content LIKE %:search%) " +
           "AND (:categories IS NULL OR q.categoryValue IN :categories) " +
           "AND (:status IS NULL OR q.status = :status) " +
           "ORDER BY q.createdAt DESC")
    Page<Question> findBySearchCriteria(@Param("search") String search, 
                                       @Param("categories") Iterable<String> categories, 
                                       @Param("status") String status, 
                                       Pageable pageable);
    
    @Query("SELECT COUNT(*) FROM QuestionLike WHERE question.id = :questionId AND userId = :userId")
    int countLikesByQuestionIdAndUserId(@Param("questionId") Long questionId, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(*) FROM QuestionLike WHERE question.id = :questionId")
    int countLikesByQuestionId(@Param("questionId") Long questionId);
}