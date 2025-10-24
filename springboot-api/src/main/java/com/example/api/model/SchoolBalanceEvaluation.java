package com.example.api.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "school_balance_evaluation_1docx")
public class SchoolBalanceEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "district", nullable = false, length = 20)
    private String district;
    
    @Column(name = "school_name", nullable = false, length = 50)
    private String schoolName;
    
    @Column(name = "student_count")
    private Integer studentCount;
    
    @Column(name = "full_time_teacher_count")
    private Integer fullTimeTeacherCount;
    
    @Column(name = "class_count")
    private Integer classCount;
    
    @Column(name = "floor_area", precision = 12, scale = 2)
    private BigDecimal floorArea;
    
    @Column(name = "building_area", precision = 12, scale = 2)
    private BigDecimal buildingArea;
    
    @Column(name = "senior_teacher_count")
    private Integer seniorTeacherCount;
    
    @Column(name = "special_grade_teacher_count")
    private Integer specialGradeTeacherCount;
    
    @Column(name = "training_fee", precision = 10, scale = 2)
    private BigDecimal trainingFee;
    
    @Column(name = "teaching_material_fee", precision = 10, scale = 2)
    private BigDecimal teachingMaterialFee;
    
    @Column(name = "campus_service_area", precision = 12, scale = 2)
    private BigDecimal campusServiceArea;
    
    @Column(name = "property_service_people_count")
    private Integer propertyServicePeopleCount;
    
    @Column(name = "property_satisfaction", precision = 5, scale = 2)
    private BigDecimal propertySatisfaction;
    
    @Column(name = "high_school_graduates")
    private Integer highSchoolGraduates;
    
    @Column(name = "high_school_enrollment_count")
    private Integer highSchoolEnrollmentCount;
    
    @Column(name = "art_sports_participant_count")
    private Integer artSportsParticipantCount;
    
    @Column(name = "art_sports_award_count")
    private Integer artSportsAwardCount;
    
    @Column(name = "public_funding_total", precision = 10, scale = 2)
    private BigDecimal publicFundingTotal;
    
    @Column(name = "aided_student_count")
    private Integer aidedStudentCount;
    
    @Column(name = "high_school_tuition_free_count")
    private Integer highSchoolTuitionFreeCount;
    
    @Column(name = "boarding_student_count")
    private Integer boardingStudentCount;
    
    @Column(name = "high_school_grant_student_count")
    private Integer highSchoolGrantStudentCount;
    
    @Column(name = "balance_score", nullable = false, precision = 5, scale = 1)
    private BigDecimal balanceScore;
    
    // 增加经度和纬度字段，用于地图可视化
    private Double longitude;
    private Double latitude;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getDistrict() {
        return district;
    }
    
    public void setDistrict(String district) {
        this.district = district;
    }
    
    public String getSchoolName() {
        return schoolName;
    }
    
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
    
    public Integer getStudentCount() {
        return studentCount;
    }
    
    public void setStudentCount(Integer studentCount) {
        this.studentCount = studentCount;
    }
    
    public Integer getFullTimeTeacherCount() {
        return fullTimeTeacherCount;
    }
    
    public void setFullTimeTeacherCount(Integer fullTimeTeacherCount) {
        this.fullTimeTeacherCount = fullTimeTeacherCount;
    }
    
    public Integer getClassCount() {
        return classCount;
    }
    
    public void setClassCount(Integer classCount) {
        this.classCount = classCount;
    }
    
    public BigDecimal getFloorArea() {
        return floorArea;
    }
    
    public void setFloorArea(BigDecimal floorArea) {
        this.floorArea = floorArea;
    }
    
    public BigDecimal getBuildingArea() {
        return buildingArea;
    }
    
    public void setBuildingArea(BigDecimal buildingArea) {
        this.buildingArea = buildingArea;
    }
    
    public Integer getSeniorTeacherCount() {
        return seniorTeacherCount;
    }
    
    public void setSeniorTeacherCount(Integer seniorTeacherCount) {
        this.seniorTeacherCount = seniorTeacherCount;
    }
    
    public Integer getSpecialGradeTeacherCount() {
        return specialGradeTeacherCount;
    }
    
    public void setSpecialGradeTeacherCount(Integer specialGradeTeacherCount) {
        this.specialGradeTeacherCount = specialGradeTeacherCount;
    }
    
    public BigDecimal getTrainingFee() {
        return trainingFee;
    }
    
    public void setTrainingFee(BigDecimal trainingFee) {
        this.trainingFee = trainingFee;
    }
    
    public BigDecimal getTeachingMaterialFee() {
        return teachingMaterialFee;
    }
    
    public void setTeachingMaterialFee(BigDecimal teachingMaterialFee) {
        this.teachingMaterialFee = teachingMaterialFee;
    }
    
    public BigDecimal getCampusServiceArea() {
        return campusServiceArea;
    }
    
    public void setCampusServiceArea(BigDecimal campusServiceArea) {
        this.campusServiceArea = campusServiceArea;
    }
    
    public Integer getPropertyServicePeopleCount() {
        return propertyServicePeopleCount;
    }
    
    public void setPropertyServicePeopleCount(Integer propertyServicePeopleCount) {
        this.propertyServicePeopleCount = propertyServicePeopleCount;
    }
    
    public BigDecimal getPropertySatisfaction() {
        return propertySatisfaction;
    }
    
    public void setPropertySatisfaction(BigDecimal propertySatisfaction) {
        this.propertySatisfaction = propertySatisfaction;
    }
    
    public Integer getHighSchoolGraduates() {
        return highSchoolGraduates;
    }
    
    public void setHighSchoolGraduates(Integer highSchoolGraduates) {
        this.highSchoolGraduates = highSchoolGraduates;
    }
    
    public Integer getHighSchoolEnrollmentCount() {
        return highSchoolEnrollmentCount;
    }
    
    public void setHighSchoolEnrollmentCount(Integer highSchoolEnrollmentCount) {
        this.highSchoolEnrollmentCount = highSchoolEnrollmentCount;
    }
    
    public Integer getArtSportsParticipantCount() {
        return artSportsParticipantCount;
    }
    
    public void setArtSportsParticipantCount(Integer artSportsParticipantCount) {
        this.artSportsParticipantCount = artSportsParticipantCount;
    }
    
    public Integer getArtSportsAwardCount() {
        return artSportsAwardCount;
    }
    
    public void setArtSportsAwardCount(Integer artSportsAwardCount) {
        this.artSportsAwardCount = artSportsAwardCount;
    }
    
    public BigDecimal getPublicFundingTotal() {
        return publicFundingTotal;
    }
    
    public void setPublicFundingTotal(BigDecimal publicFundingTotal) {
        this.publicFundingTotal = publicFundingTotal;
    }
    
    public Integer getAidedStudentCount() {
        return aidedStudentCount;
    }
    
    public void setAidedStudentCount(Integer aidedStudentCount) {
        this.aidedStudentCount = aidedStudentCount;
    }
    
    public Integer getHighSchoolTuitionFreeCount() {
        return highSchoolTuitionFreeCount;
    }
    
    public void setHighSchoolTuitionFreeCount(Integer highSchoolTuitionFreeCount) {
        this.highSchoolTuitionFreeCount = highSchoolTuitionFreeCount;
    }
    
    public Integer getBoardingStudentCount() {
        return boardingStudentCount;
    }
    
    public void setBoardingStudentCount(Integer boardingStudentCount) {
        this.boardingStudentCount = boardingStudentCount;
    }
    
    public Integer getHighSchoolGrantStudentCount() {
        return highSchoolGrantStudentCount;
    }
    
    public void setHighSchoolGrantStudentCount(Integer highSchoolGrantStudentCount) {
        this.highSchoolGrantStudentCount = highSchoolGrantStudentCount;
    }
    
    public BigDecimal getBalanceScore() {
        return balanceScore;
    }
    
    public void setBalanceScore(BigDecimal balanceScore) {
        this.balanceScore = balanceScore;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
}