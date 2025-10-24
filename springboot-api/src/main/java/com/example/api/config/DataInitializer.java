package com.example.api.config;

import com.example.api.model.QuestionCategory;
import com.example.api.model.QuestionTag;
import com.example.api.repository.QuestionCategoryRepository;
import com.example.api.repository.QuestionTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {
    
    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;
    
    @Autowired
    private QuestionTagRepository questionTagRepository;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 初始化问题分类
        if (questionCategoryRepository.count() == 0) {
            List<String> categoryNames = Arrays.asList(
                    "教育政策", "教学方法", "学生管理", "资源获取",
                    "教师培训", "学校管理", "家校沟通", "心理健康",
                    "留守儿童", "乡村振兴"
            );
            
            for (String name : categoryNames) {
                QuestionCategory category = new QuestionCategory();
                category.setName(name);
                questionCategoryRepository.save(category);
            }
            
            System.out.println("初始化问题分类完成");
        }
        
        // 初始化问题标签
        if (questionTagRepository.count() == 0) {
            List<String> tagNames = Arrays.asList(
                    "乡村教师", "教育公平", "数字化转型", "师资力量",
                    "留守儿童", "教学质量", "教育资源", "贫困地区",
                    "在线教育", "职业发展", "心理健康", "乡村振兴",
                    "家长参与", "课程改革", "特殊教育", "校园安全"
            );
            
            for (String name : tagNames) {
                QuestionTag tag = new QuestionTag();
                tag.setName(name);
                questionTagRepository.save(tag);
            }
            
            System.out.println("初始化问题标签完成");
        }
    }
}