<template>
  <view class="news-page">
    <!-- 新闻网格 -->
    <view class="news-grid">
      <view
        class="news-card"
        v-for="item in newsList"
        :key="item.id"
        @tap="goToLink(item.link)"
      >
        <image
          class="news-image"
          :src="item.image_url || defaultImage"
          mode="aspectFill"
        />
        <view class="news-info">
          <text class="news-date">{{ formatDate(item.published_date) }}</text>
          <text class="news-title">{{ item.title }}</text>
          <text class="news-summary">{{ item.summary || '暂无内容摘要' }}</text>
        </view>
      </view>
    </view>

    <!-- 加载提示 -->
    <view class="loading-wrapper">
      <text v-if="loading" class="loading-text">加载中...</text>
      <text v-if="noMore" class="loading-text">已加载全部内容</text>
      <text v-if="error" class="error-text">{{ error }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newsList: [],
      page: 1,
      pageSize: 6,
      loading: false,
      noMore: false,
      error: '',
      defaultImage: '/static/default-news.jpg' // 默认图片路径
    }
  },
  onLoad() {
    this.loadNews()
  },
  onReachBottom() {
    if (!this.noMore) {
      this.loadNews()
    }
  },
  onPullDownRefresh() {
    this.loadNews(true).then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async loadNews(isRefresh = false) {
      if (this.loading) return
      this.loading = true
      this.error = ''

      try {
        const currentPage = isRefresh ? 1 : this.page

        const res = await uni.request({
          url: 'http://localhost:3000/api/news',
          method: 'GET',
          data: {
            page: currentPage,
            pageSize: this.pageSize
          }
        })

        if (res.statusCode !== 200) {
          throw new Error('请求失败')
        }

        const responseData = res.data
        if (responseData.success) {
          const newData = responseData.data.list || []

          if (isRefresh) {
            this.newsList = newData
            this.page = 2
          } else {
            this.newsList = [...this.newsList, ...newData]
            this.page++
          }

          if (newData.length < this.pageSize) {
            this.noMore = true
          }
        } else {
          throw new Error(responseData.message || '加载失败')
        }
      } catch (e) {
        console.error('加载新闻失败:', e)
        this.error = '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      try {
        const date = new Date(dateStr)
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`
      } catch {
        return dateStr
      }
    },
    goToLink(link) {
      if (link && link.startsWith('http')) {
        uni.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(link)}`
        })
      } else if (link) {
        uni.navigateTo({ url: link })
      }
    }
  }
}
</script>

<style>
.news-page {
  width: 90%;
  margin: 20rpx auto;
}

/* 新闻网格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320rpx, 1fr));
  gap: 24rpx;
  margin-top: 40rpx;
}

.news-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.news-card:active {
  transform: scale(0.98);
}

.news-image {
  width: 100%;
  height: 200rpx;
  object-fit: cover;
}

.news-info {
  padding: 20rpx;
}

.news-date {
  color: #1e88e5;
  font-size: 24rpx;
  margin-bottom: 8rpx;
  display: block;
}

.news-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-summary {
  color: #666;
  font-size: 26rpx;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 加载提示 */
.loading-wrapper {
  margin: 40rpx 0;
  text-align: center;
}

.loading-text {
  color: #666;
  font-size: 26rpx;
}

.error-text {
  color: #f56c6c;
  font-size: 26rpx;
}
</style>
