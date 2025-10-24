package com.example.api.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String content;
    
    @Column(name = "category_value")
    private String categoryValue;
    
    @Column(name = "questioner_name")
    private String questionerName;
    
    @Column(name = "user_id")
    private Long userId;
    
    private Integer likes = 0;
    
    private Integer comments = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "is_processing")
    private Boolean isProcessing = false;
    
    private String status = "pending"; // pending, answered
    
    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Answer answer;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> commentList;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionLike> likeList;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionQuestionTag> questionTagAssociations;
    
    // Getter and Setter methods
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getCategoryValue() {
        return categoryValue;
    }
    
    public void setCategoryValue(String categoryValue) {
        this.categoryValue = categoryValue;
    }
    
    public String getQuestionerName() {
        return questionerName;
    }
    
    public void setQuestionerName(String questionerName) {
        this.questionerName = questionerName;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Integer getLikes() {
        return likes;
    }
    
    public void setLikes(Integer likes) {
        this.likes = likes;
    }
    
    public Integer getComments() {
        return comments;
    }
    
    public void setComments(Integer comments) {
        this.comments = comments;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsProcessing() {
        return isProcessing;
    }
    
    public void setIsProcessing(Boolean isProcessing) {
        this.isProcessing = isProcessing;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Answer getAnswer() {
        return answer;
    }
    
    public void setAnswer(Answer answer) {
        this.answer = answer;
    }
    
    public List<Comment> getCommentList() {
        return commentList;
    }
    
    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }
    
    public List<QuestionLike> getLikeList() {
        return likeList;
    }
    
    public void setLikeList(List<QuestionLike> likeList) {
        this.likeList = likeList;
    }
    
    public List<QuestionQuestionTag> getQuestionTagAssociations() {
        return questionTagAssociations;
    }
    
    public void setQuestionTagAssociations(List<QuestionQuestionTag> questionTagAssociations) {
        this.questionTagAssociations = questionTagAssociations;
    }
}