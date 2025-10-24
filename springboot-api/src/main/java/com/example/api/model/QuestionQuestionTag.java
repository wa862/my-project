package com.example.api.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "question_question_tags", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"question_id", "question_tag_id"})
})
public class QuestionQuestionTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_tag_id", nullable = false)
    private QuestionTag questionTag;
    
    // Getter and Setter methods
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Question getQuestion() {
        return question;
    }
    
    public void setQuestion(Question question) {
        this.question = question;
    }
    
    public QuestionTag getQuestionTag() {
        return questionTag;
    }
    
    public void setQuestionTag(QuestionTag questionTag) {
        this.questionTag = questionTag;
    }
}