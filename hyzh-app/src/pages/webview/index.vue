<template>
  <view class="results-page">
    <!-- 顶部导航栏 -->
    <view class="nav-tabs">
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'visualization' }"
        @click="switchTab('visualization')"
      >
        可视化平台
      </view>
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'evaluation' }"
        @click="switchTab('evaluation')"
      >
        评估可视化
      </view>
    </view>

    <!-- 可视化平台内容 -->
    <view v-if="activeTab === 'visualization'" class="content">
      <view class="chart-section">
        <view class="section-header">
          <text class="section-title">教育资源分布</text>
          <picker 
            mode="selector" 
            :range="regionOptions" 
            @change="onRegionChange"
          >
            <view class="region-picker">
              <text>{{ selectedRegion }}</text>
              <uni-icons type="arrowdown" size="16"></uni-icons>
            </view>
          </picker>
        </view>
        
        <view class="chart-container">
          <canvas 
            canvas-id="resourceChart" 
            id="resourceChart" 
            class="chart"
          ></canvas>
        </view>
      </view>

      <view class="data-cards">
        <view class="data-card">
          <text class="data-value">{{ stats.schoolCount }}</text>
          <text class="data-label">学校数量</text>
        </view>
        <view class="data-card">
          <text class="data-value">{{ stats.teacherCount }}</text>
          <text class="data-label">教师数量</text>
        </view>
        <view class="data-card">
          <text class="data-value">{{ stats.studentCount }}</text>
          <text class="data-label">学生数量</text>
        </view>
      </view>
    </view>

    <!-- 评估可视化内容 -->
    <view v-if="activeTab === 'evaluation'" class="content">
      <view class="evaluation-filter">
        <view class="filter-group">
          <text class="filter-label">评估类型:</text>
          <view class="filter-options">
            <view 
              v-for="type in evaluationTypes" 
              :key="type.value"
              class="filter-option"
              :class="{ active: selectedEvaluationType === type.value }"
              @click="selectEvaluationType(type.value)"
            >
              {{ type.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-group">
          <text class="filter-label">时间范围:</text>
          <view class="time-range">
            <picker 
              mode="date" 
              fields="year" 
              :value="startYear"
              @change="onStartYearChange"
            >
              <view class="time-picker">{{ startYear }}</view>
            </picker>
            <text>至</text>
            <picker 
              mode="date" 
              fields="year" 
              :value="endYear"
              @change="onEndYearChange"
            >
              <view class="time-picker">{{ endYear }}</view>
            </picker>
          </view>
        </view>
      </view>

      <view class="evaluation-charts">
        <view class="chart-item">
          <text class="chart-title">评估趋势分析</text>
          <canvas 
            canvas-id="trendChart" 
            id="trendChart" 
            class="chart"
          ></canvas>
        </view>
        
        <view class="chart-item">
          <text class="chart-title">区域对比</text>
          <canvas 
            canvas-id="compareChart" 
            id="compareChart" 
            class="chart"
          ></canvas>
        </view>
      </view>

      <view class="evaluation-list">
        <view 
          v-for="item in evaluationData" 
          :key="item.id"
          class="evaluation-item"
        >
          <view class="evaluation-header">
            <text class="evaluation-name">{{ item.name }}</text>
            <text class="evaluation-score">{{ item.score }}</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: item.score + '%' }"
            ></view>
          </view>
          <text class="evaluation-desc">{{ item.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { onReady } from '@dcloudio/uni-app'

interface EvaluationItem {
  id: number
  name: string
  score: number
  description: string
}

const activeTab = ref('visualization')
const selectedRegion = ref('京津冀')
const regionOptions = ['京津冀', '北京市', '天津市', '河北省']
const startYear = ref('2020')
const endYear = ref('2024')
const selectedEvaluationType = ref(1)

const evaluationTypes = [
  { label: '学校评估', value: 1 },
  { label: '教师评估', value: 2 },
  { label: '学生评估', value: 3 }
]

const stats = ref({
  schoolCount: '2,456',
  teacherCount: '18,932',
  studentCount: '156,789'
})

const evaluationData = ref<EvaluationItem[]>([
  {
    id: 1,
    name: '教学质量',
    score: 85,
    description: '教学质量和效果评估'
  },
  {
    id: 2,
    name: '资源配置',
    score: 72,
    description: '教育资源配置情况'
  }
])

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 区域选择
const onRegionChange = (e: any) => {
  selectedRegion.value = regionOptions[e.detail.value]
  loadChartData()
}

// 选择评估类型
const selectEvaluationType = (type: number) => {
  selectedEvaluationType.value = type
  loadEvaluationData()
}

// 开始年份改变
const onStartYearChange = (e: any) => {
  startYear.value = e.detail.value.split('-')[0]
  loadEvaluationData()
}

// 结束年份改变
const onEndYearChange = (e: any) => {
  endYear.value = e.detail.value.split('-')[0]
  loadEvaluationData()
}

// 加载图表数据
const loadChartData = async () => {
  try {
    const res = await uni.request({
      url: '/api/results/chart-data',
      data: { region: selectedRegion.value }
    })
    
    if (res[1].data?.success) {
      // 这里应该使用图表库来渲染数据
      console.log('图表数据加载成功:', res[1].data.data)
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

// 加载评估数据
const loadEvaluationData = async () => {
  try {
    const res = await uni.request({
      url: '/api/results/evaluation-data',
      data: {
        type: selectedEvaluationType.value,
        startYear: startYear.value,
        endYear: endYear.value
      }
    })
    
    if (res[1].data?.success) {
      evaluationData.value = res[1].data.data
    }
  } catch (error) {
    console.error('加载评估数据失败:', error)
  }
}

// 页面就绪
onReady(() => {
  loadChartData()
  loadEvaluationData()
})
</script>

<style scoped>
.results-page {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.nav-tabs {
  display: flex;
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 30rpx;
  font-size: 30rpx;
  color: #666;
  position: relative;
}

.nav-tab.active {
  color: #007AFF;
  font-weight: bold;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #007AFF;
  border-radius: 2rpx;
}

.content {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.region-picker {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
}

.chart-container {
  height: 400rpx;
  margin-bottom: 30rpx;
}

.chart {
  width: 100%;
  height: 100%;
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  color: white;
}

.data-value {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.data-label {
  font-size: 24rpx;
  opacity: 0.9;
}

.evaluation-filter {
  margin-bottom: 30rpx;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
  min-width: 120rpx;
}

.filter-options {
  display: flex;
  gap: 16rpx;
}

.filter-option {
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-option.active {
  background: #007AFF;
  color: #ffffff;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.time-picker {
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
}

.evaluation-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30rpx;
  margin-bottom: 30rpx;
}

.chart-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx;
}

.chart-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  text-align: center;
}

.evaluation-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.evaluation-item {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.evaluation-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.evaluation-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #007AFF;
}

.progress-bar {
  width: 100%;
  height: 16rpx;
  background: #e9ecef;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #00C6FF);
  border-radius: 8rpx;
  transition: width 0.3s ease;
}

.evaluation-desc {
  font-size: 24rpx;
  color: #666;
}
</style>