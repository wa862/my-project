<template>
  <view class="database-page">
    <!-- 面包屑导航 -->
    <view class="breadcrumb">
      当前位置： 首页 > 数智资源 > 数据库 > 公开数据库 > 国家/地区数据库
    </view>
    
    <!-- 顶部导航栏 -->
    <view class="nav-tabs">
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'national' }"
        @click="switchTab('national')"
      >
        国家/地区数据库
      </view>
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'university' }"
        @click="switchTab('university')"
      >
        高校/研究机构数据库
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 国家/地区数据库内容 -->
    <view v-if="activeTab === 'national' && !loading" class="content">
      <view class="section">
        <view class="section-title">国家数据库</view>
        <view class="section-text">
          国家数据库提供共享交换的年度数据以及地区、各部门数据，同时提供多种文件格式、制表、绘图、表格样板、可视化报表、数据地图生成等多种功能。
        </view>
        <view class="feature-list">
          <view class="feature-item">· 数据整合与标准分析</view>
          <view class="feature-item">· 海量数据一键下载</view>
          <view class="feature-item">· 精细资源一键分享</view>
        </view>
      </view>

      <view class="database-grid">
        <view 
          v-for="(item, index) in nationalDatabases" 
          :key="index" 
          class="database-card"
          @click="openLink(item.url)"
        >
          <image class="database-image" :src="getImageUrl(item.image_url)"></image>
          <view class="database-title">{{ item.title || item.name }}</view>
          <view class="database-desc" v-if="item.description">{{ item.description }}</view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">地区数据库</view>
        <view class="section-text">
          提供各省市地区的公共数据资源，涵盖经济、教育、医疗等多个领域。
        </view>
      </view>

      <view class="database-grid">
        <view 
          v-for="(item, index) in regionalDatabases" 
          :key="index" 
          class="database-card"
          @click="openLink(item.url)"
        >
          <image class="database-image" :src="getImageUrl(item.image_url)"></image>
          <view class="database-title">{{ item.title || item.name }}</view>
          <view class="database-desc" v-if="item.description">{{ item.description }}</view>
        </view>
      </view>
    </view>

    <!-- 高校/研究机构数据库内容 -->
    <view v-if="activeTab === 'university' && !loading" class="content">
      <view class="section">
        <view class="section-title">调查数据库</view>
        <view class="section-text">
          国内各高校和研究机构开展的多项大型调查项目数据，大多以独立数据平台的方式存储和共享。许多全国知名的调查项目数据如中国综合社会调查（CGSS）、中国健康与养老追踪调查（CHARLS）、中国家庭金融调查（CHFS）、中国教育追踪调查（CEPS）等社会科学领域调查项目均建有独立的数据平台。
        </view>
      </view>

      <view class="database-grid">
        <view 
          v-for="(item, index) in surveyDatabases" 
          :key="index" 
          class="database-card"
          @click="openLink(item.url)"
        >
          <image class="database-image" :src="getImageUrl(item.image_url)"></image>
          <view class="database-title">{{ item.title || item.name }}</view>
          <view class="database-desc">{{ item.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// 添加API基础URL
const API_BASE_URL = 'http://localhost:3000'

const activeTab = ref('national')
const loading = ref(true)

// 数据库数据
const nationalDatabases = ref([])
const regionalDatabases = ref([])
const surveyDatabases = ref([])

// 切换标签页
const switchTab = async (tab: string) => {
  activeTab.value = tab
  if (tab === 'national') {
    await loadNationalData()
  } else {
    await loadUniversityData()
  }
}

// 加载国家数据库数据
const loadNationalData = async () => {
  try {
    loading.value = true
    const [nationalRes, regionalRes] = await Promise.all([
      uni.request({
        url: `${API_BASE_URL}/api/resources`,
        data: {
          category_type: 'national',
          pageSize: 20
        }
      }),
      uni.request({
        url: `${API_BASE_URL}/api/resources`,
        data: {
          category_type: 'regional',
          pageSize: 20
        }
      })
    ])
    
    // 适配不同响应格式
    const nationalData = nationalRes[1]?.data || nationalRes.data
    const regionalData = regionalRes[1]?.data || regionalRes.data
    
    if (nationalData?.success) {
      nationalDatabases.value = nationalData.data?.list || nationalData.data || []
    }
    
    if (regionalData?.success) {
      regionalDatabases.value = regionalData.data?.list || regionalData.data || []
    }
  } catch (error) {
    console.error('加载国家数据库数据失败:', error)
    uni.showToast({
      title: '加载数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 加载高校数据库数据
const loadUniversityData = async () => {
  try {
    loading.value = true
    const res = await uni.request({
      url: `${API_BASE_URL}/api/surveys`,
      data: {
        pageSize: 20
      }
    })
    
    // 适配不同响应格式
    const resData = res[1]?.data || res.data
    
    if (resData?.success) {
      surveyDatabases.value = resData.data?.list || resData.data || []
    }
  } catch (error) {
    console.error('加载高校数据库数据失败:', error)
    uni.showToast({
      title: '加载数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 打开链接
const openLink = (url: string) => {
  if (!url) {
    uni.showToast({
      title: '暂无链接',
      icon: 'none'
    })
    return
  }
  
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}`
  })
}

// 初始化加载数据
onMounted(() => {
  loadNationalData()
})
</script>


<style scoped>
/* 原有样式保持不变 */
.database-page {
  padding: 20rpx;
  background-color: #f5f7fb;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

/* 面包屑样式 */
.breadcrumb {
  padding: 20rpx 0;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
}

/* 导航标签样式 */
.nav-tabs {
  display: flex;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 25rpx;
  font-size: 30rpx;
  color: #333;
  position: relative;
}

.nav-tab.active {
  color: #0a58ca;
  font-weight: bold;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background-color: #0a58ca;
  border-radius: 3rpx;
}

/* 内容区域样式 */
.content {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #164caa;
  margin-bottom: 20rpx;
}

.section-text {
  font-size: 28rpx;
  color: #444;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.feature-list {
  padding-left: 30rpx;
}

.feature-item {
  font-size: 26rpx;
  color: #444;
  line-height: 1.6;
}

/* 数据库网格样式 */
.database-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
  margin: 30rpx 0;
}

.database-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.database-image {
  width: 100%;
  height: 180rpx;
  background-color: #f0f7ff;
}

.database-title {
  padding: 20rpx;
  font-size: 28rpx;
  color: #003366;
  text-align: center;
  font-weight: bold;
}

.database-desc {
  padding: 0 20rpx 20rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style>