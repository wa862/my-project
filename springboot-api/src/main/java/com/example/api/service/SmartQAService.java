package com.example.api.service;

import com.example.api.model.*;
import com.example.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartQAService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;
    
    @Autowired
    private QuestionTagRepository questionTagRepository;
    
    @Autowired
    private QuestionLikeRepository questionLikeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private QuestionQuestionTagRepository questionQuestionTagRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${zhipu.ai.key}")
    private String zhipuAiKey;
    
    @Value("${zhipu.ai.url}")
    private String zhipuAiUrl;
    
    // 获取所有问题分类
    public List<QuestionCategory> getAllCategories() {
        return (List<QuestionCategory>) questionCategoryRepository.findAllByOrderByNameAsc();
    }
    
    // 获取所有标签
    public List<String> getAllTags() {
        try {
            return ((List<QuestionTag>) questionTagRepository.findAllByOrderByNameAsc())
                    .stream()
                    .map(QuestionTag::getName)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // 返回默认标签
            return Arrays.asList("乡村教师", "教育公平", "数字化转型", "师资力量", "留守儿童", "教学质量", "教育资源");
        }
    }
    
    // 获取问题列表（带分页和筛选）
    public Page<Question> getQuestions(String search, String categories, String status, int page, int limit, Long userId) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Iterable<String> categoryList = null;
        
        if (categories != null && !categories.equals("all")) {
            categoryList = Arrays.asList(categories.split(","));
        }
        
        if (status != null && status.equals("all")) {
            status = null;
        }
        
        return questionRepository.findBySearchCriteria(search, categoryList, status, pageable);
    }
    
    // 创建新问题
    @Transactional
    public Question createQuestion(String title, String content, String category, String questionerName, Long userId) {
        Question question = new Question();
        question.setTitle(title);
        question.setContent(content);
        question.setCategoryValue(category);
        question.setQuestionerName(questionerName);
        question.setUserId(userId);
        
        return questionRepository.save(question);
    }
    
    // 点赞/取消点赞问题
    @Transactional
    public Map<String, Object> likeQuestion(Long questionId, Long userId) {
        Map<String, Object> result = new HashMap<>();
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        
        if (!optionalQuestion.isPresent()) {
            throw new RuntimeException("问题不存在");
        }
        
        Question question = optionalQuestion.get();
        Optional<QuestionLike> existingLike = questionLikeRepository.findByQuestionIdAndUserId(questionId, userId);
        
        if (existingLike.isPresent()) {
            // 取消点赞
            questionLikeRepository.delete(existingLike.get());
            question.setLikes(Math.max(0, question.getLikes() - 1));
            result.put("liked", false);
            result.put("message", "取消点赞成功");
        } else {
            // 添加点赞
            QuestionLike questionLike = new QuestionLike();
            questionLike.setQuestion(question);
            questionLike.setUserId(userId);
            questionLikeRepository.save(questionLike);
            question.setLikes(question.getLikes() + 1);
            result.put("liked", true);
            result.put("message", "点赞成功");
        }
        
        questionRepository.save(question);
        result.put("likes", question.getLikes());
        
        return result;
    }
    
    // 获取AI回答
    @Transactional
    public String getAIAnswer(Long questionId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        
        if (!optionalQuestion.isPresent()) {
            throw new RuntimeException("问题不存在");
        }
        
        Question question = optionalQuestion.get();
        
        // 设置问题为处理中状态
        question.setIsProcessing(true);
        questionRepository.save(question);
        
        try {
            // 调用智谱AI API
            // 注意：这里简化了实现，实际应使用RestTemplate发送POST请求到智谱AI API
            // 并处理API响应
            String aiAnswer = callZhipuAIAPI(question.getTitle(), question.getContent());
            
            // 保存AI回答
            Answer answer = new Answer();
            answer.setQuestion(question);
            answer.setContent(aiAnswer);
            answer.setIsAiGenerated(true);
            answerRepository.save(answer);
            
            // 更新问题状态
            question.setStatus("answered");
            question.setIsProcessing(false);
            questionRepository.save(question);
            
            return aiAnswer;
        } catch (Exception e) {
            // 重置处理状态
            question.setIsProcessing(false);
            questionRepository.save(question);
            throw new RuntimeException("获取AI回答失败，请稍后重试", e);
        }
    }
    
    // 调用智谱AI API（简化实现）
    private String callZhipuAIAPI(String title, String content) {
        // 注意：这里是简化实现，实际应根据智谱AI API的具体要求构造请求
        // 并处理响应
        // 由于是演示，这里返回一个示例回答
        return "这是AI为您提供的关于\"" + title + "\"的回答：" + content;
    }
    
    // 添加评论
    @Transactional
    public Comment addComment(Long questionId, String content, String commenterName, Long userId) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("问题不存在"));
        
        Comment comment = new Comment();
        comment.setQuestion(question);
        comment.setContent(content);
        comment.setCommenterName(commenterName);
        comment.setUserId(userId);
        
        Comment savedComment = commentRepository.save(comment);
        
        // 更新问题的评论数
        int commentCount = commentRepository.countByQuestionId(questionId);
        question.setComments(commentCount);
        questionRepository.save(question);
        
        return savedComment;
    }
    
    // 获取问题的所有评论
    public List<Comment> getCommentsByQuestionId(Long questionId) {
        return commentRepository.findByQuestionIdOrderByCreatedAtDesc(questionId);
    }
    
    // 删除评论
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        
        Long questionId = comment.getQuestion().getId();
        commentRepository.delete(comment);
        
        // 更新问题的评论数
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question != null) {
            int commentCount = commentRepository.countByQuestionId(questionId);
            question.setComments(commentCount);
            questionRepository.save(question);
        }
    }
    
    // 添加标签到问题
    @Transactional
    public void addTagToQuestion(Long questionId, Long tagId) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("问题不存在"));
        
        QuestionTag tag = questionTagRepository.findById(tagId)
            .orElseThrow(() -> new RuntimeException("标签不存在"));
        
        QuestionQuestionTag association = new QuestionQuestionTag();
        association.setQuestion(question);
        association.setQuestionTag(tag);
        
        questionQuestionTagRepository.save(association);
    }
    
    // 获取问题的所有标签
    public List<QuestionTag> getTagsByQuestionId(Long questionId) {
        List<QuestionQuestionTag> associations = questionQuestionTagRepository.findByQuestionId(questionId);
        return associations.stream()
            .map(QuestionQuestionTag::getQuestionTag)
            .collect(Collectors.toList());
    }
    
    // 获取所有标签
    public List<QuestionTag> getAllQuestionTags() {
        return questionTagRepository.findAllByOrderByNameAsc();
    }
    
    // 获取问题详情
    public Question getQuestionDetail(Long questionId, Long userId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        
        if (!optionalQuestion.isPresent()) {
            throw new RuntimeException("问题不存在");
        }
        
        return optionalQuestion.get();
    }
}