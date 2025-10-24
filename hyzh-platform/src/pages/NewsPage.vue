<template>
  <div class="news-page">
    <!-- 顶部轮播图 -->
     <el-carousel
      v-if="topNews.length > 0"
      :interval="5000"
      height="420px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="item in topNews" :key="item.id">
        <div class="carousel-wrapper" @click="goToLink(item.link)">
          <!-- 使用高质量图片加载方案 -->
          <img
            :src="getHighQualityImage(item.image_url)"
            class="carousel-image"
            loading="lazy"
            :alt="item.title"
          />
          <div class="carousel-overlay"></div>
          <div class="carousel-content">
            <h3>{{ item.title }}</h3>
            <div class="meta-info">
              <span class="date">{{ formatDate(item.published_date) }}</span>
              <el-tag v-if="item.tag" type="info" size="small">{{ item.tag }}</el-tag>
            </div>
            <p class="summary">{{ item.summary }}</p>
            <el-button type="primary" size="small" class="view-btn">查看详情</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>


    <!-- 新闻网格 -->
    <div class="news-grid">
      <div
        class="news-card"
        v-for="item in newsList"
        :key="item.id"
        @click="goToLink(item.link)"
      >
        <img :src="item.image_url || defaultImage" class="news-image" />
        <div class="news-info">
          <p class="news-date">{{ formatDate(item.published_date) }}</p>
          <h4 class="news-title">{{ item.title }}</h4>
          <p class="news-summary">{{ item.summary || '暂无内容摘要' }}</p>
        </div>
      </div>
    </div>

    <!-- 加载提示 -->
    <div class="loading-wrapper">
      <p v-if="loading" class="loading-text">
        <el-icon class="is-loading"><Loading /></el-icon> 加载中...
      </p>
      <p v-if="noMore" class="loading-text">已加载全部内容</p>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface NewsItem {
  id: number
  title: string
  summary?: string
  published_date: string
  image_url?: string
  link?: string
}

const newsList = ref<NewsItem[]>([])
const topNews = ref<NewsItem[]>([])
const page = ref(1)
const pageSize = ref(6)
const loading = ref(false)
const noMore = ref(false)
const error = ref('')

const defaultImage = '/default-news.jpg' // 默认图片路径

const loadNews = async () => {
  if (loading.value || noMore.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await axios.get('http://localhost:3000/api/news', {
      params: {
        page: page.value,
        pageSize: pageSize.value
      }
    })

    const { data } = response.data

    if (page.value === 1) {
      // 取前3条作为轮播图内容
      topNews.value = data.list.slice(0, 3)
    }

    if (data.list.length === 0) {
      noMore.value = true
    } else {
      newsList.value = [...newsList.value, ...data.list]
      page.value++

      // 如果返回的数据少于请求的pageSize，说明没有更多数据了
      if (data.list.length < pageSize.value) {
        noMore.value = true
      }
    }
  } catch (err) {
    console.error('加载新闻失败:', err)
    error.value = '加载新闻失败，请稍后重试'
    ElMessage.error('加载新闻失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

const goToLink = (link?: string) => {
  if (link && link.startsWith('http')) {
    window.open(link, '_blank')
  } else if (link) {
    window.location.href = link
  }
}
// 新增高质量图片处理方法
const getHighQualityImage = (url: string | undefined) => {
  if (!url) return defaultImage

  // 如果是网络图片，可以添加质量参数（如果API支持）
  if (url.startsWith('http')) {
    if (url.includes('your-image-host.com')) {
      return `${url}?quality=80&w=1600` // 示例：添加图片质量参数
    }
    return url
  }

  return url || defaultImage
}
// 滚动加载
const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading.value) {
    loadNews()
  }
}

onMounted(() => {
  loadNews()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.news-page {
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 轮播图样式 */
.el-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 420px;
  cursor: pointer;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.carousel-wrapper:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 40px;
  color: rgb(255, 255, 255);
  max-width: 1200px;
  margin: 0 auto;
}

.carousel-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.meta-info .date {
  font-size: 0.9rem;
  opacity: 0.9;
}

.carousel-content .summary {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 80%;
  background: #78b6f4;
}

.view-btn {
  background: #1282c8;
  color: white;
  font-weight: 600;
  border: none;
}

.view-btn:hover {
  background: #0f6aa5;
  color: #0f6aa5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-carousel {
    height: 320px;
  }

  .carousel-wrapper {
    height: 320px;
  }

  .carousel-content {
    padding: 20px;
  }

  .carousel-content h3 {
    font-size: 1.5rem;
  }

  .carousel-content .summary {
    max-width: 100%;
  }
}

/* 新闻网格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.news-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.news-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.news-info {
  padding: 16px;
}

.news-date {
  color: #1e88e5;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.news-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 加载区域 */
.loading-wrapper {
  margin: 40px 0;
  text-align: center;
}

.loading-text {
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.error-text {
  color: #f56c6c;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .carousel-caption h3 {
    font-size: 1.2rem;
  }
}
</style>
