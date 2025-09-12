<template>
  <div class="dashboard-container">
    <h2 class="page-title">数据概览</h2>

    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #409eff;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">用户总数</div>
              <div class="stat-value">{{ userCount }}</div>
              <div v-if="userCountError" class="stat-error">{{ userCountError }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #67c23a;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">新闻总数</div>
              <div class="stat-value">{{ newsCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #e6a23c;">
              <el-icon><School /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">学校总数</div>
              <div class="stat-value">{{ schoolCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #f56c6c;">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">访问量</div>
              <div class="stat-value">{{ visitCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mb-20">
      <template #header>
        <span>访问趋势</span>
      </template>
      <div id="visit-chart" style="height: 300px;"></div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新用户</span>
          </template>
          <el-table :data="latestUsers" style="width: 100%" v-loading="userLoading">
            <el-table-column prop="contact" label="联系人" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column label="注册时间">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
          <div v-if="userError" class="error-message">
            <el-alert :title="userError" type="error" show-icon />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新新闻</span>
          </template>
          <el-table :data="latestNews" style="width: 100%" v-loading="newsLoading">
            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column prop="summary" label="摘要" />
            <el-table-column label="发布时间" width="150">
              <template #default="{ row }">
                {{ formatDate(row.published_date) }}
              </template>
            </el-table-column>
          </el-table>
          <div v-if="newsError" class="error-message">
            <el-alert :title="newsError" type="error" show-icon />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { User, Document, School, View } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 统计数据
const userCount = ref(0)
const newsCount = ref(0)
const schoolCount = ref(89)
const visitCount = ref(12345)

// 错误状态
const userCountError = ref('')
const userError = ref('')
const newsError = ref('')

// 最新用户数据
const latestUsers = ref([])
const userLoading = ref(false)

// 最新新闻数据
const latestNews = ref([])
const newsLoading = ref(false)

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // 确保后端的 API 地址正确
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取用户总数（确保显示为1）
const fetchUserCount = async () => {
  try {
    userCountError.value = ''
    const response = await api.get('/user-stats/count')
    console.log('用户总数响应:', response.data)
    if (response.data?.success) {
      userCount.value = response.data.data?.count ?? 0
      if (userCount.value !== 1) {
        console.warn(`警告: 用户总数应为1，实际获取到${userCount.value}`)
      }
    }
  } catch (error) {
    console.error('获取用户总数失败:', error.response || error.message)
    userCountError.value = '获取用户总数失败'
    userCount.value = 0
  }
}

// 获取最新5条用户数据
const fetchLatestUsers = async () => {
  try {
    userLoading.value = true
    userError.value = ''
    const response = await api.get('/user-stats/latest')
    console.log('最新用户响应:', response.data)
    if (response.data?.success) {
      latestUsers.value = Array.isArray(response.data.data)
        ? response.data.data.slice(0, 5)
        : []
    }
  } catch (error) {
    console.error('获取最新用户失败:', error.response || error.message)
    userError.value = `获取最新用户失败: ${error.message || '未知错误'}`
    latestUsers.value = []
  } finally {
    userLoading.value = false
  }
}

// 获取最新5条新闻数据
const fetchNewsData = async () => {
  try {
    newsLoading.value = true
    newsError.value = ''
    const response = await api.get('/news', {
      params: {
        page: 1,
        pageSize: 5,
        sort: 'published_date:desc'
      }
    })
    console.log('最新新闻响应:', response.data)
    if (response.data?.success) {
      latestNews.value = response.data.data?.list?.slice(0, 5) || []
      newsCount.value = response.data.data?.pagination?.total || 0
    }
  } catch (error) {
    console.error('获取新闻数据失败:', error.response || error.message)
    newsError.value = `获取新闻数据失败: ${error.message || '未知错误'}`
    latestNews.value = []
    newsCount.value = 0
  } finally {
    newsLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

// 初始化图表
const initChart = () => {
  const chart = echarts.init(document.getElementById('visit-chart'))
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }]
  })
}

onMounted(() => {
  initChart()

  // 并行获取所有数据
  Promise.all([
    fetchUserCount(),
    fetchLatestUsers(),
    fetchNewsData()
  ]).catch(error => {
    console.error('初始化数据加载失败:', error)
    ElMessage.error('数据加载失败，请刷新重试')
  })

  // 每5分钟自动刷新数据
  const timer = setInterval(() => {
    fetchUserCount()
    fetchLatestUsers()
    fetchNewsData()
  }, 5 * 60 * 1000)

  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    position: relative;

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 15px;

      .el-icon {
        font-size: 24px;
      }
    }

    .stat-content {
      .stat-title {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
      }

      .stat-value {
        font-size: 22px;
        font-weight: bold;
      }

      .stat-error {
        font-size: 12px;
        color: #f56c6c;
        margin-top: 5px;
      }
    }
  }

  .error-message {
    margin-top: 10px;
  }
}
</style>
