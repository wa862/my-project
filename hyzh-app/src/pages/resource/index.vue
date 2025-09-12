<template>
  <view class="resource-page">
    <!-- 顶部导航栏 -->
    <view class="nav-tabs">
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'database' }"
        @click="switchTab('database')"
      >
        数据库
      </view>
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'policy' }"
        @click="switchTab('policy')"
      >
        政策库
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 数据库内容 -->
    <view v-if="activeTab === 'database' && !loading" class="content">
      <view class="search-box">
        <uni-search-bar 
          placeholder="搜索数据库资源" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        ></uni-search-bar>
      </view>

      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="switchCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </view>

      <view class="database-list">
        <view 
          v-for="item in filteredDatabases" 
          :key="item.id"
          class="database-item"
          @click="openDatabase(item)"
        >
          <image class="database-icon" :src="item.image_url || '/static/database/default.png'"></image>
          <view class="database-info">
            <text class="database-name">{{ item.title || item.name }}</text>
            <text class="database-desc">{{ item.description }}</text>
          </view>
          <uni-icons type="forward" size="20" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 分页控件 -->
      <view class="pagination" v-if="databasePagination.totalPages > 1">
        <view 
          class="pagination-btn" 
          :class="{ disabled: databasePagination.page === 1 }"
          @click="loadPrevPage('database')"
        >
          上一页
        </view>
        <view class="pagination-info">
          第 {{ databasePagination.page }} 页 / 共 {{ databasePagination.totalPages }} 页
        </view>
        <view 
          class="pagination-btn" 
          :class="{ disabled: databasePagination.page === databasePagination.totalPages }"
          @click="loadNextPage('database')"
        >
          下一页
        </view>
      </view>
    </view>

    <!-- 政策库内容 -->
    <view v-if="activeTab === 'policy' && !loading" class="content">
      <view class="policy-filter">
        <picker 
          mode="selector" 
          :range="policyTypes" 
          range-key="label"
          @change="onPolicyTypeChange"
        >
          <view class="filter-item">
            <text>{{ policyTypes[policyTypeIndex].label }}</text>
            <uni-icons type="arrowdown" size="16"></uni-icons>
          </view>
        </picker>
        
        <picker 
          mode="date" 
          fields="year" 
          @change="onYearChange"
        >
          <view class="filter-item">
            <text>{{ selectedYear }}年</text>
            <uni-icons type="arrowdown" size="16"></uni-icons>
          </view>
        </picker>
      </view>

      <view class="policy-list">
        <view 
          v-for="policy in filteredPolicies" 
          :key="policy.id"
          class="policy-item"
          @click="openPolicy(policy)"
        >
          <view class="policy-header">
            <text class="policy-title">{{ policy.title }}</text>
            <text class="policy-date">{{ policy.publish_date }}</text>
          </view>
          <text class="policy-desc">{{ policy.description }}</text>
          <view class="policy-tags">
            <text 
              v-for="tag in policy.tags" 
              :key="tag"
              class="policy-tag"
            >
              {{ tag }}
            </text>
          </view>
        </view>
      </view>

      <!-- 分页控件 -->
      <view class="pagination" v-if="policyPagination.totalPages > 1">
        <view 
          class="pagination-btn" 
          :class="{ disabled: policyPagination.page === 1 }"
          @click="loadPrevPage('policy')"
        >
          上一页
        </view>
        <view class="pagination-info">
          第 {{ policyPagination.page }} 页 / 共 {{ policyPagination.totalPages }} 页
        </view>
        <view 
          class="pagination-btn" 
          :class="{ disabled: policyPagination.page === policyPagination.totalPages }"
          @click="loadNextPage('policy')"
        >
          下一页
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

// 添加API基础URL
const API_BASE_URL = 'http://localhost:3000'

interface DatabaseItem {
  id: number
  title: string
  name: string
  description: string
  image_url: string
  url: string
  category_id: number
  category_type: string
}

interface PolicyItem {
  id: number
  title: string
  publish_date: string
  description: string
  type: number
  tags: string[]
  content: string
}

const activeTab = ref('database')
const activeCategory = ref(0)
const searchKeyword = ref('')
const policyTypeIndex = ref(0)
const selectedYear = ref(new Date().getFullYear().toString())
const loading = ref(false)

// 分页信息
const databasePagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1
})

const policyPagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1
})

// 分类数据
const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '国家数据库', category_type: 'national' },
  { id: 2, name: '地区数据库', category_type: 'regional' },
])

// 政策类型
const policyTypes = ref([
  { label: '全部类型', value: 0 },
  { label: '教育政策', value: 1 },
  { label: '财政政策', value: 2 },
  { label: '人才政策', value: 3 },
  { label: '科技政策', value: 4 },
  { label: '数据政策', value: 5 }
])

// 数据库数据
const databases = ref<DatabaseItem[]>([])

// 政策数据
const policies = ref<PolicyItem[]>([])

// 切换标签页
const switchTab = async (tab: string) => {
  activeTab.value = tab
  if (tab === 'database') {
    await loadDatabases()
  } else {
    await loadPolicies()
  }
}

// 切换分类
const switchCategory = async (categoryId: number) => {
  activeCategory.value = categoryId
  databasePagination.value.page = 1
  await loadDatabases()
}

// 处理搜索
const handleSearch = async () => {
  if (activeTab.value === 'database') {
    databasePagination.value.page = 1
    await loadDatabases()
  } else {
    policyPagination.value.page = 1
    await loadPolicies()
  }
}

// 政策类型改变
const onPolicyTypeChange = async (e: any) => {
  policyTypeIndex.value = e.detail.value
  policyPagination.value.page = 1
  await loadPolicies()
}

// 年份改变
const onYearChange = async (e: any) => {
  selectedYear.value = e.detail.value.split('-')[0]
  policyPagination.value.page = 1
  await loadPolicies()
}

// 加载上一页
const loadPrevPage = async (type: string) => {
  if (type === 'database') {
    if (databasePagination.value.page > 1) {
      databasePagination.value.page--
      await loadDatabases()
    }
  } else {
    if (policyPagination.value.page > 1) {
      policyPagination.value.page--
      await loadPolicies()
    }
  }
}

// 加载下一页
const loadNextPage = async (type: string) => {
  if (type === 'database') {
    if (databasePagination.value.page < databasePagination.value.totalPages) {
      databasePagination.value.page++
      await loadDatabases()
    }
  } else {
    if (policyPagination.value.page < policyPagination.value.totalPages) {
      policyPagination.value.page++
      await loadPolicies()
    }
  }
}

// 加载数据库数据
const loadDatabases = async () => {
  try {
    loading.value = true
    const params: any = {
      page: databasePagination.value.page,
      pageSize: databasePagination.value.pageSize
    }
    
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    
    if (activeCategory.value !== 0) {
      const category = categories.value.find(c => c.id === activeCategory.value)
      if (category && category.category_type) {
        params.category_type = category.category_type
      }
    }
    
    const res = await uni.request({
      url: `${API_BASE_URL}/api/resources`,
      data: params
    })
    
    // 适配不同响应格式
    const resData = res[1]?.data || res.data
    
    if (resData?.success) {
      databases.value = resData.data?.list || resData.data || []
      databasePagination.value = {
        ...databasePagination.value,
        total: resData.data?.pagination?.total || resData.pagination?.total || 0,
        totalPages: resData.data?.pagination?.totalPages || resData.pagination?.totalPages || 1
      }
    }
  } catch (error) {
    console.error('加载数据库数据失败:', error)
    uni.showToast({
      title: '加载数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 加载政策数据
const loadPolicies = async () => {
  try {
    loading.value = true
    const params: any = {
      page: policyPagination.value.page,
      pageSize: policyPagination.value.pageSize
    }
    
    if (policyTypeIndex.value !== 0) {
      params.type = policyTypes.value[policyTypeIndex.value].value
    }
    
    if (selectedYear.value) {
      params.year = selectedYear.value
    }
    
    const res = await uni.request({
      url: `${API_BASE_URL}/api/policy-library`,
      data: params
    })
    
    // 适配不同响应格式
    const resData = res[1]?.data || res.data
    
    if (resData?.success) {
      policies.value = resData.data?.list || resData.data || []
      policyPagination.value = {
        ...policyPagination.value,
        total: resData.data?.pagination?.total || resData.pagination?.total || 0,
        totalPages: resData.data?.pagination?.totalPages || resData.pagination?.totalPages || 1
      }
    }
  } catch (error) {
    console.error('加载政策数据失败:', error)
    uni.showToast({
      title: '加载数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 过滤后的数据库
const filteredDatabases = computed(() => {
  return databases.value
})

// 过滤后的政策
const filteredPolicies = computed(() => {
  return policies.value
})

// 打开数据库
const openDatabase = (item: DatabaseItem) => {
  if (!item.url) {
    uni.showToast({
      title: '暂无链接',
      icon: 'none'
    })
    return
  }
  
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(item.url)}&title=${item.title || item.name}`
  })
}

// 打开政策
const openPolicy = (policy: PolicyItem) => {
  uni.navigateTo({
    url: `/pages/policy/detail?id=${policy.id}`
  })
}

// 初始化加载数据
onMounted(() => {
  loadDatabases()
})
</script>

<style scoped>
.resource-page {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
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

.search-box {
  margin-bottom: 30rpx;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.category-item {
  padding: 16rpx 32rpx;
  background: #f8f9fa;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
}

.category-item.active {
  background: #007AFF;
  color: #ffffff;
}

.database-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.database-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.database-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  border-radius: 16rpx;
}

.database-info {
  flex: 1;
}

.database-name {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.database-desc {
  font-size: 24rpx;
  color: #666;
}

.policy-filter {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.policy-item {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.policy-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.policy-date {
  font-size: 24rpx;
  color: #999;
}

.policy-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.policy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.policy-tag {
  padding: 8rpx 16rpx;
  background: #e6f3ff;
  border-radius: 6rpx;
  font-size: 22rpx;
  color: #007AFF;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  padding: 20rpx 0;
}

.pagination-btn {
  padding: 16rpx 32rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.pagination-btn.disabled {
  background: #ccc;
  opacity: 0.6;
}

.pagination-info {
  font-size: 26rpx;
  color: #666;
}
</style>