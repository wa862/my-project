<template>
  <view class="home-container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">京津冀乡村基础教育</view>
      <view class="subtitle">数智资源一站式服务平台</view>
    </view>

    <!-- 顶部轮播图 -->
    <swiper
      class="banner-swiper"
      indicator-dots="true"
      autoplay="true"
      interval="5000"
      duration="500"
    >
      <swiper-item
        v-for="(item, index) in topNews"
        :key="index"
        @click="openNewsDetail(item)"
      >
        <view class="carousel-wrapper">
          <image
            class="carousel-image"
            :src="item.image_url || defaultImage"
            mode="aspectFill"
          />
          <view class="carousel-overlay"></view>
          <view class="carousel-content">
            <text class="carousel-title">{{ item.title }}</text>
            <view class="meta-info">
              <text class="date">{{ formatDate(item.published_date) }}</text>
              <view v-if="item.tag" class="tag">{{ item.tag }}</view>
            </view>
            <text class="summary">{{ item.summary || '暂无内容摘要' }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 功能入口（删除新闻动态，只留三个） -->
    <view class="function-grid">
      <view class="function-item" @click="navigateTo('/pages/resource/index')">
        <image class="function-icon" src="/static/icons/database.png" />
        <text class="function-text">数智资源</text>
      </view>
      <view class="function-item" @click="navigateTo('/pages/results/index')">
        <image class="function-icon" src="/static/icons/result.png" />
        <text class="function-text">数智成果</text>
      </view>
      <view class="function-item" @click="navigateTo('/pages/apply/index')">
        <image class="function-icon" src="/static/icons/apply.png" />
        <text class="function-text">实践应用</text>
      </view>
    </view>

    <!-- 新闻动态部分 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">新闻动态</text>
        <text class="section-more" @click="navigateTo('/pages/news/index')">查看更多 ></text>
      </view>

      <view class="news-grid">
        <view
          class="news-item"
          v-for="item in displayedNews"
          :key="item.id"
          @click="openNewsDetail(item)"
        >
          <image class="news-image" :src="item.image_url || defaultImage" mode="aspectFill" />
          <view class="news-content">
            <text class="news-title">{{ item.title }}</text>
            <text class="news-date">{{ formatDate(item.published_date) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 成果展示部分 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title-en">RESULTS DISPLAY</text>
        <text class="section-title-cn">成果展示</text>
      </view>

      <view class="results-list">
        <view
          class="result-item"
          v-for="(result, index) in displayedResults"
          :key="index"
          @click="navigateToResult(result)"
        >
          <text class="result-title">{{ result.title }}</text>
          <text class="result-description">{{ result.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      topNews: [],          // 轮播图数据（新闻前 3 条）
      newsList: [],         // 新闻列表
      defaultImage: '/static/default-news.jpg',
      allResults: [
        { id: 1, title: '文科数字化成果', description: '校级公共数据平台：新型基础设施' },
        { id: 2, title: '语音学实验室', description: '构建中华民族语言文字共同体' },
        { id: 3, title: '大数据人文社科研究基地', description: '促进学科交叉，重构研究范式' },
        { id: 4, title: '法律人工智能实验室', description: 'AI赋能与AI治理' },
      ],
      displayedResults: []
    }
  },
  computed: {
    displayedNews() {
      return this.newsList.slice(0, 4)  // 首页显示 4 条新闻
    }
  },
  onLoad() {
    this.loadHomeData()
    this.displayedResults = this.allResults.slice(0, 8)
  },
  onPullDownRefresh() {
    this.loadHomeData().finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async loadHomeData() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/api/news?page=1&pageSize=10',
          method: 'GET'
        })

        if (res.data?.success) {
          const list = res.data.data.list
          this.topNews = list.slice(0, 3)   // 前 3 条做轮播图
          this.newsList = list              // 全部新闻存起来
        }
      } catch (error) {
        console.error('加载首页数据失败:', error)
      }
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    openNewsDetail(item) {
      const url = item.link || `/pages/news/detail?id=${item.id}`
      uni.navigateTo({ url })
    },
    navigateToResult(result) {
      uni.navigateTo({ url: `/pages/results/detail?id=${result.id}` })
    },
    formatDate(dateString) {
      try {
        return new Date(dateString).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '-')
      } catch {
        return dateString
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 30rpx 0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1e88e5;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
}

/* 轮播图 */
.banner-swiper {
  height: 420rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin: 20rpx 0;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 420rpx;
}

.carousel-image {
  width: 100%;
  height: 100%;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  color: white;
}

.carousel-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 15rpx;
}

.date {
  font-size: 22rpx;
  opacity: 0.9;
}

.tag {
  font-size: 22rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.summary {
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: bold;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
}

/* 功能入口 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin: 30rpx 0;
  padding: 0 10rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.function-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 15rpx;
}

.function-text {
  font-size: 22rpx;
  color: #333;
}

/* 卡片式布局 */
.section-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #003366;
}

.section-title-en {
  font-size: 24rpx;
  font-weight: bold;
  color: #1a73e8;
  margin-right: 15rpx;
}

.section-title-cn {
  font-size: 30rpx;
  font-weight: bold;
  color: #003366;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

/* 新闻网格 - 2x2布局 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.news-item {
  background: #f9f9f9;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 100%;
  height: 200rpx;
}

.news-content {
  padding: 20rpx;
}

.news-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  font-size: 22rpx;
  color: #999;
}

/* 成果展示 */
.results-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300rpx, 1fr));
  gap: 25rpx;
}

.result-item {
  background: #f9f9f9;
  padding: 30rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-3rpx);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
}

.result-title {
  color: #1a73e8;
  font-size: 26rpx;
  font-weight: 500;
  margin-bottom: 15rpx;
}

.result-description {
  color: #555;
  line-height: 1.6;
  font-size: 22rpx;
}
</style>
