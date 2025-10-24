package com.example.api.service.impl;

import com.example.api.model.SchoolBalanceEvaluation;
import com.example.api.repository.SchoolBalanceEvaluationRepository;
import com.example.api.service.SchoolBalanceEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SchoolBalanceEvaluationServiceImpl implements SchoolBalanceEvaluationService {

    @Autowired
    private SchoolBalanceEvaluationRepository repository;

    @Override
    public List<SchoolBalanceEvaluation> getAllSchools() {
        return repository.findAll();
    }

    @Override
    public List<SchoolBalanceEvaluation> getSchoolsByDistrict(String district) {
        if (district == null || district.trim().isEmpty() || district.equals("all")) {
            return getAllSchools();
        }
        return repository.findByDistrict(district);
    }

    @Override
    public List<String> getAllDistricts() {
        return repository.findAllDistricts();
    }

    @Override
    public SchoolBalanceEvaluation getSchoolByName(String schoolName) {
        Optional<SchoolBalanceEvaluation> school = repository.findBySchoolName(schoolName);
        return school.orElse(null);
    }

    @Override
    public List<SchoolBalanceEvaluation> getSchoolsByScoreRange(double minScore, double maxScore) {
        return repository.findByBalanceScoreBetween(minScore, maxScore);
    }

    @Override
    public List<SchoolBalanceEvaluation> getTop10Schools() {
        return repository.findTop10ByOrderByBalanceScoreDesc();
    }

    @Override
    public List<SchoolBalanceEvaluation> getBottom10Schools() {
        return repository.findTop10ByOrderByBalanceScoreAsc();
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalSchools", repository.findTotalSchoolCount());
        stats.put("averageScore", repository.findAverageBalanceScore());
        stats.put("maxScore", repository.findMaxBalanceScore());
        stats.put("minScore", repository.findMinBalanceScore());
        
        return stats;
    }

    @Override
    public Map<String, Long> countSchoolsByDistrict() {
        List<Object[]> results = repository.countSchoolsByDistrict();
        Map<String, Long> counts = new HashMap<>();
        
        for (Object[] result : results) {
            String district = (String) result[0];
            Long count = (Long) result[1];
            counts.put(district, count);
        }
        
        return counts;
    }

    @Override
    @Transactional
    public SchoolBalanceEvaluation saveSchool(SchoolBalanceEvaluation school) {
        return repository.save(school);
    }

    @Override
    @Transactional
    public List<SchoolBalanceEvaluation> saveSchools(List<SchoolBalanceEvaluation> schools) {
        return repository.saveAll(schools);
    }

    @Override
    @Transactional
    public void deleteSchool(Integer id) {
        repository.deleteById(id);
    }
}