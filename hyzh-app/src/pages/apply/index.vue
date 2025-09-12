<template>
  <view class="practice-page">
    <!-- 顶部导航栏 -->
    <view class="nav-tabs">
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'teaching' }"
        @click="switchTab('teaching')"
      >
        教学资源
      </view>
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'research' }"
        @click="switchTab('research')"
      >
        科研支持
      </view>
      <view 
        class="nav-tab"
        :class="{ active: activeTab === 'thinktank' }"
        @click="switchTab('thinktank')"
      >
        智库研究
      </view>
    </view>

    <!-- 教学资源内容 -->
    <view v-if="activeTab === 'teaching'" class="content">
      <!-- 分类标签 -->
      <view class="nav-tabs">
        <view 
          class="nav-tab"
          :class="{ active: activeCategory === 'primary' }"
          @click="switchCategory('primary')"
        >
          小学课程
        </view>
        <view 
          class="nav-tab"
          :class="{ active: activeCategory === 'junior' }"
          @click="switchCategory('junior')"
        >
          初中课程
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="eduLoading" class="loading-container">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-else-if="eduError" class="error-container">
        <text>加载失败: {{ eduError }}</text>
      </view>
      <view v-else class="resource-list">
        <view 
          v-for="item in filteredResources" 
          :key="item.id"
          class="resource-item"
          @click="goTo(item.link)"
        >
          <image class="resource-icon" :src="getEduImageUrl(item.image_url, item.title)"></image>
          <view class="resource-info">
            <text class="resource-name">{{ item.title }}</text>
            <text class="resource-desc">{{ item.description }}</text>
          </view>
          <uni-icons type="forward" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 科研支持内容 -->
    <view v-if="activeTab === 'research'" class="content">
      <view v-if="resLoading" class="loading-container">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-else-if="resError" class="error-container">
        <text>加载失败: {{ resError }}</text>
      </view>
      <view v-else class="research-list">
        <view 
          v-for="item in researchPlatforms" 
          :key="item.id"
          class="research-item"
          @click="goTo(item.link)"
        >
          <image class="research-icon" :src="getResImageUrl(item.image_url, item.title)"></image>
          <view class="research-info">
            <text class="research-name">{{ item.title }}</text>
            <text class="research-desc">{{ item.description }}</text>
          </view>
          <uni-icons type="forward" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 智库研究内容 -->
    <view v-if="activeTab === 'thinktank'" class="content">
      <view v-if="tkLoading" class="loading-container">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-else-if="tkError" class="error-container">
        <text>加载失败: {{ tkError }}</text>
      </view>
      <view v-else class="thinktank-list">
        <view 
          v-for="item in thinktanks" 
          :key="item.id"
          class="thinktank-item"
          @click="goTo(item.link)"
        >
          <image class="thinktank-icon" :src="getTkImageUrl(item.image_url, item.title)"></image>
          <view class="thinktank-info">
            <text class="thinktank-name">{{ item.title }}</text>
            <text class="thinktank-desc">{{ item.description }}</text>
          </view>
          <uni-icons type="forward" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

// 公共 Tab
const activeTab = ref<'teaching' | 'research' | 'thinktank'>('teaching')
const switchTab = (tab: 'teaching' | 'research' | 'thinktank') => {
  activeTab.value = tab
}
const goTo = (url: string) => {
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}`
  })
}

/* ================= 教学资源 ================= */
interface EduResource {
  id: number
  title: string
  image_url: string
  link: string
  category: 'primary' | 'junior'
  description: string
}
const resources = ref<EduResource[]>([])
const eduLoading = ref(true)
const eduError = ref('')
const activeCategory = ref<'primary' | 'junior'>('primary')

const switchCategory = (cat: 'primary' | 'junior') => {
  activeCategory.value = cat
}
const filteredResources = computed(() =>
  resources.value.filter((r) => r.category === activeCategory.value)
)
const getEduImageUrl = (url: string, title: string) =>
  url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) :
  title.includes('小学') ? '/static/edu-resource/primary.png' : '/static/edu-resource/junior.png'

const fetchResources = async () => {
  try {
    eduLoading.value = true
    eduError.value = ''
    const res = await uni.request({ url: `${API_BASE_URL}/api/edu-resources`, method: 'GET' })
    const resData = res[1]?.data || res.data
    if (resData?.success && resData.data) resources.value = resData.data
    else throw new Error('数据格式不正确')
  } catch (err) {
    eduError.value = err instanceof Error ? err.message : '获取数据失败'
    resources.value = getFallbackResources()
  } finally {
    eduLoading.value = false
  }
}
const getFallbackResources = (): EduResource[] => [/* 这里放静态回退数据 */]

/* ================= 科研支持 ================= */
interface Platform {
  id: number
  title: string
  image_url: string
  link: string
  description?: string
}
const researchPlatforms = ref<Platform[]>([])
const resLoading = ref(true)
const resError = ref('')
const getResImageUrl = (url: string, title: string) =>
  url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) :
  title.includes('知网') ? '/static/research/cnki.png' :
  title.includes('万方') ? '/static/research/wanfang.png' : '/static/research/weipu.png'

const fetchPlatforms = async () => {
  try {
    resLoading.value = true
    resError.value = ''
    const res = await uni.request({ url: `${API_BASE_URL}/api/research-platforms`, method: 'GET' })
    const resData = res[1]?.data || res.data
    if (resData?.success && resData.data) researchPlatforms.value = resData.data
    else throw new Error('数据格式不正确')
  } catch (err) {
    resError.value = err instanceof Error ? err.message : '获取数据失败'
    researchPlatforms.value = getFallbackPlatforms()
  } finally {
    resLoading.value = false
  }
}
const getFallbackPlatforms = (): Platform[] => [/* 静态回退科研支持数据 */]

/* ================= 智库研究 ================= */
interface Thinktank {
  id: number
  title: string
  image_url: string
  link: string
  description?: string
}
const thinktanks = ref<Thinktank[]>([])
const tkLoading = ref(true)
const tkError = ref('')
const getTkImageUrl = (url: string, title: string) =>
  url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) :
  title.includes('21世纪') ? '/static/thinktank/21cnjy.png' :
  title.includes('国家教育') ? '/static/thinktank/national.png' :
  title.includes('清华') ? '/static/thinktank/tsinghua.png' : '/static/thinktank/bnu.png'

const fetchThinktanks = async () => {
  try {
    tkLoading.value = true
    tkError.value = ''
    const res = await uni.request({ url: `${API_BASE_URL}/api/education-thinktanks`, method: 'GET' })
    const resData = res[1]?.data || res.data
    if (resData?.success && resData.data) thinktanks.value = resData.data
    else throw new Error('数据格式不正确')
  } catch (err) {
    tkError.value = err instanceof Error ? err.message : '获取数据失败'
    thinktanks.value = getFallbackThinktanks()
  } finally {
    tkLoading.value = false
  }
}
const getFallbackThinktanks = (): Thinktank[] => [/* 静态回退智库研究数据 */]

onMounted(() => {
  fetchResources()
  fetchPlatforms()
  fetchThinktanks()
})
</script>

<style scoped>
.practice-page {
  padding: 20rpx;
  background-color: #f5f7fb;
  min-height: 100vh;
}
.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}
.error-container {
  color: #d32f2f;
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
/* 列表通用 */
.resource-list, .research-list, .thinktank-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.resource-item, .research-item, .thinktank-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}
.resource-icon, .research-icon, .thinktank-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  border-radius: 16rpx;
}
.resource-info, .research-info, .thinktank-info {
  flex: 1;
}
.resource-name, .research-name, .thinktank-name {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}
.resource-desc, .research-desc, .thinktank-desc {
  font-size: 24rpx;
  color: #666;
}
</style>
