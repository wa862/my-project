<template>
  <view class="about-page">
    <!-- 顶部蓝色波浪背景 -->
    <view class="banner" :style="{ background: pageData.bannerBgColor || 'linear-gradient(to right, #0b60c5, #127eea)' }">
      <text class="title">{{ pageData.bannerTitle || '关于我们' }}</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text>加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <text>{{ error }}</text>
      <button @click="loadPageData" class="retry-btn">重试</button>
    </view>

    <!-- 内容主体 -->
    <view v-else class="content-wrapper">
      <block v-for="(section, index) in pageData.sections" :key="index">
        <view class="section-title">{{ section.title }}</view>

        <view v-if="section.type === 'text'">
          <text>{{ section.content }}</text>
        </view>

        <view v-if="section.type === 'list'">
          <view v-for="(item, itemIndex) in section.items" :key="itemIndex" class="list-item">
            <text class="list-dot">•</text>
            <text>{{ item }}</text>
          </view>
        </view>
      </block>

      <view class="footer-text" :style="{ color: pageData.footerColor || '#888' }">
        {{ pageData.footerText || '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。' }}
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

export default {
  setup() {
    const pageData = ref({
      bannerTitle: '关于我们',
      bannerBgColor: 'linear-gradient(to right, #0b60c5, #127eea)',
      breadcrumb: '当前位置： 首页 > 关于我们',
      sections: [],
      footerText: '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。',
      footerColor: '#888'
    })
    
    const loading = ref(true)
    const error = ref(null)

    const loadPageData = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('开始请求关于我们页面数据...')
        
        // 直接使用请求函数，不传递额外的配置对象
        const response = await request('/api/about-page')
        
        console.log('接收到响应:', response)
        
        // 更新页面数据
        pageData.value = {
          ...pageData.value,
          ...response,
          sections: response.sections || []
        }
      } catch (err) {
        console.error('加载页面数据失败:', err)
        error.value = err.message || '加载数据失败，请检查网络连接'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadPageData()
    })

    return {
      pageData,
      loading,
      error,
      loadPageData
    }
  }
}
</script>

<style>
.about-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f9fafd;
  min-height: 100vh;
}

.banner {
  background: linear-gradient(to right, #0b60c5, #127eea);
  color: white;
  padding: 60rpx 0 40rpx;
  text-align: center;
  position: relative;
  border-bottom-left-radius: 80rpx;
  border-bottom-right-radius: 80rpx;
}

.banner .title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.content-wrapper {
  width: 90%;
  margin: 0 auto;
  padding: 40rpx 30rpx;
  color: #333;
  line-height: 1.8;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #0a3b75;
  margin: 30rpx 0 15rpx;
}

.list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
}

.list-dot {
  margin-right: 10rpx;
}

.footer-text {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #888;
  text-align: right;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  color: #888;
}

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  color: #ff4d4f;
}

.retry-btn {
  margin-top: 20rpx;
  background-color: #0b60c5;
  color: white;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
}
</style>