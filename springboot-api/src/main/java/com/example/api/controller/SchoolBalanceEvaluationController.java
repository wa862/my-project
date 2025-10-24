package com.example.api.controller;

import com.example.api.model.SchoolBalanceEvaluation;
import com.example.api.service.SchoolBalanceEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/school-balance")
@CrossOrigin(origins = "*") // 允许跨域请求，生产环境中应该配置具体的域名
public class SchoolBalanceEvaluationController {

    @Autowired
    private SchoolBalanceEvaluationService service;

    // 获取所有学校数据
    @GetMapping("/schools")
    public ResponseEntity<List<SchoolBalanceEvaluation>> getAllSchools() {
        List<SchoolBalanceEvaluation> schools = service.getAllSchools();
        return new ResponseEntity<>(schools, HttpStatus.OK);
    }

    // 根据区域获取学校数据
    @GetMapping("/schools/by-district")
    public ResponseEntity<List<SchoolBalanceEvaluation>> getSchoolsByDistrict(
            @RequestParam(required = false, defaultValue = "all") String district) {
        List<SchoolBalanceEvaluation> schools = service.getSchoolsByDistrict(district);
        return new ResponseEntity<>(schools, HttpStatus.OK);
    }

    // 根据分数范围获取学校数据
    @GetMapping("/schools/by-score-range")
    public ResponseEntity<List<SchoolBalanceEvaluation>> getSchoolsByScoreRange(
            @RequestParam(defaultValue = "0") double minScore,
            @RequestParam(defaultValue = "100") double maxScore) {
        List<SchoolBalanceEvaluation> schools = service.getSchoolsByScoreRange(minScore, maxScore);
        return new ResponseEntity<>(schools, HttpStatus.OK);
    }

    // 获取所有区域
    @GetMapping("/districts")
    public ResponseEntity<List<String>> getAllDistricts() {
        List<String> districts = service.getAllDistricts();
        return new ResponseEntity<>(districts, HttpStatus.OK);
    }

    // 获取统计信息
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = service.getStatistics();
        return new ResponseEntity<>(statistics, HttpStatus.OK);
    }

    // 获取区域学校数量统计
    @GetMapping("/statistics/by-district")
    public ResponseEntity<Map<String, Long>> getSchoolCountByDistrict() {
        Map<String, Long> counts = service.countSchoolsByDistrict();
        return new ResponseEntity<>(counts, HttpStatus.OK);
    }

    // 获取排名前10的学校
    @GetMapping("/schools/top10")
    public ResponseEntity<List<SchoolBalanceEvaluation>> getTop10Schools() {
        List<SchoolBalanceEvaluation> schools = service.getTop10Schools();
        return new ResponseEntity<>(schools, HttpStatus.OK);
    }

    // 获取排名后10的学校
    @GetMapping("/schools/bottom10")
    public ResponseEntity<List<SchoolBalanceEvaluation>> getBottom10Schools() {
        List<SchoolBalanceEvaluation> schools = service.getBottom10Schools();
        return new ResponseEntity<>(schools, HttpStatus.OK);
    }

    // 根据学校名称获取学校详情
    @GetMapping("/schools/by-name")
    public ResponseEntity<SchoolBalanceEvaluation> getSchoolByName(
            @RequestParam String name) {
        SchoolBalanceEvaluation school = service.getSchoolByName(name);
        if (school != null) {
            return new ResponseEntity<>(school, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 创建新的学校评价数据
    @PostMapping("/schools")
    public ResponseEntity<SchoolBalanceEvaluation> createSchool(
            @RequestBody SchoolBalanceEvaluation school) {
        SchoolBalanceEvaluation savedSchool = service.saveSchool(school);
        return new ResponseEntity<>(savedSchool, HttpStatus.CREATED);
    }

    // 批量创建学校评价数据
    @PostMapping("/schools/batch")
    public ResponseEntity<List<SchoolBalanceEvaluation>> createSchoolsBatch(
            @RequestBody List<SchoolBalanceEvaluation> schools) {
        List<SchoolBalanceEvaluation> savedSchools = service.saveSchools(schools);
        return new ResponseEntity<>(savedSchools, HttpStatus.CREATED);
    }

    // 删除学校评价数据
    @DeleteMapping("/schools/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable Integer id) {
        service.deleteSchool(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}