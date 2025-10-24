package com.example.api.controller;

import com.example.api.model.Comment;
import com.example.api.model.Question;
import com.example.api.model.QuestionCategory;
import com.example.api.model.QuestionTag;
import com.example.api.service.SmartQAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/smart-qa")
public class SmartQAController {
    
    @Autowired
    private SmartQAService smartQAService;
    
    // 获取所有问题分类
    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        try {
            List<QuestionCategory> categories = smartQAService.getAllCategories();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", categories);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取分类失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取所有标签
    @GetMapping("/tags")
    public ResponseEntity<Map<String, Object>> getTags() {
        try {
            List<String> tags = smartQAService.getAllTags();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tags);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取标签失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取问题列表（带分页和筛选）
    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getQuestions(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "all") String categories,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "20") int limit,
            @RequestParam(required = false, defaultValue = "0") Long userId) {
        try {
            Page<Question> questionsPage = smartQAService.getQuestions(search, categories, status, page, limit, userId);
            
            // 格式化问题数据
            List<Map<String, Object>> formattedQuestions = questionsPage.getContent().stream().map(q -> {
                Map<String, Object> questionMap = new HashMap<>();
                questionMap.put("id", q.getId());
                questionMap.put("title", q.getTitle());
                questionMap.put("question", q.getContent());
                questionMap.put("type", q.getCategoryValue());
                questionMap.put("questioner", q.getQuestionerName());
                questionMap.put("time", q.getCreatedAt().toString());
                questionMap.put("likes", q.getLikes());
                questionMap.put("comments", q.getComments());
                // 这里简化处理，实际应该在Service层获取点赞状态
                questionMap.put("liked", false);
                questionMap.put("answer", q.getAnswer() != null ? q.getAnswer().getContent() : null);
                questionMap.put("isProcessing", q.getIsProcessing());
                questionMap.put("status", q.getStatus());
                return questionMap;
            }).collect(java.util.stream.Collectors.toList());
            
            Map<String, Object> data = new HashMap<>();
            data.put("questions", formattedQuestions);
            data.put("total", questionsPage.getTotalElements());
            data.put("page", page);
            data.put("limit", limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取问题列表失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 创建新问题
    @PostMapping("/questions")
    public ResponseEntity<Map<String, Object>> createQuestion(
            @RequestBody Map<String, Object> requestBody,
            @RequestParam(required = false, defaultValue = "0") Long userId,
            @RequestParam(required = false, defaultValue = "匿名用户") String username) {
        try {
            String title = (String) requestBody.get("title");
            String content = (String) requestBody.get("content");
            String category = (String) requestBody.get("category");
            
            if (title == null || content == null || category == null || 
                title.isEmpty() || content.isEmpty() || category.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "请填写完整的问题信息");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Question question = smartQAService.createQuestion(title, content, category, username, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "问题提交成功");
            Map<String, Object> data = new HashMap<>();
            data.put("id", question.getId());
            response.put("data", data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "创建问题失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 点赞/取消点赞问题
    @PostMapping("/questions/{id}/like")
    public ResponseEntity<Map<String, Object>> likeQuestion(
            @PathVariable("id") Long questionId,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        try {
            Map<String, Object> result = smartQAService.likeQuestion(questionId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.putAll(result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "点赞操作失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 添加评论
    @PostMapping("/questions/{id}/comments")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable("id") Long questionId,
            @RequestBody Map<String, String> requestBody,
            @RequestParam(required = false, defaultValue = "0") Long userId,
            @RequestParam(required = false, defaultValue = "匿名用户") String username) {
        try {
            String content = requestBody.get("content");
            
            if (content == null || content.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "评论内容不能为空");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Comment comment = smartQAService.addComment(questionId, content, username, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "评论添加成功");
            Map<String, Object> data = new HashMap<>();
            data.put("id", comment.getId());
            data.put("content", comment.getContent());
            data.put("created_at", comment.getCreatedAt());
            response.put("data", data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取问题的评论列表
    @GetMapping("/questions/{id}/comments")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable("id") Long questionId) {
        try {
            List<Comment> comments = smartQAService.getCommentsByQuestionId(questionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", comments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取评论失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 删除评论
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, Object>> deleteComment(@PathVariable("id") Long commentId) {
        try {
            smartQAService.deleteComment(commentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "评论删除成功");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取所有标签名称
    @GetMapping("/tag-names")
    public ResponseEntity<Map<String, Object>> getTagNames() {
        try {
            List<String> tags = smartQAService.getAllTags();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tags);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取标签名称失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取问题的标签列表
    @GetMapping("/questions/{id}/tags")
    public ResponseEntity<Map<String, Object>> getQuestionTags(@PathVariable("id") Long questionId) {
        try {
            List<QuestionTag> tags = smartQAService.getTagsByQuestionId(questionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tags);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取问题标签失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取AI回答
    @PostMapping("/questions/{id}/ai-answer")
    public ResponseEntity<Map<String, Object>> getAIAnswer(@PathVariable("id") Long questionId) {
        try {
            String aiAnswer = smartQAService.getAIAnswer(questionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "AI回答生成成功");
            Map<String, Object> data = new HashMap<>();
            data.put("answer", aiAnswer);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 获取问题详情
    @GetMapping("/questions/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionDetail(
            @PathVariable("id") Long questionId,
            @RequestParam(required = false, defaultValue = "0") Long userId) {
        try {
            Question question = smartQAService.getQuestionDetail(questionId, userId);
            
            // 格式化问题数据
            Map<String, Object> formattedQuestion = new HashMap<>();
            formattedQuestion.put("id", question.getId());
            formattedQuestion.put("title", question.getTitle());
            formattedQuestion.put("question", question.getContent());
            formattedQuestion.put("type", question.getCategoryValue());
            formattedQuestion.put("questioner", question.getQuestionerName());
            formattedQuestion.put("time", question.getCreatedAt().toString());
            formattedQuestion.put("likes", question.getLikes());
            formattedQuestion.put("comments", question.getComments());
            // 这里简化处理，实际应该在Service层获取点赞状态
            formattedQuestion.put("liked", false);
            formattedQuestion.put("answer", question.getAnswer() != null ? question.getAnswer().getContent() : null);
            formattedQuestion.put("isProcessing", question.getIsProcessing());
            formattedQuestion.put("status", question.getStatus());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", formattedQuestion);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取问题详情失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}