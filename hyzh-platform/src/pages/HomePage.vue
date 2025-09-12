<template>
  <CarouselBanner />
  <div class="home-container">
    <!-- 新闻动态部分 -->
    <section class="news-section">
      <div class="section-header">
        <div class="title">新闻动态</div>
        <div class="arrow-buttons">
          <el-button icon="el-icon-arrow-left" circle @click="prevNews" :disabled="currentIndex === 0" />
          <el-button icon="el-icon-arrow-right" circle @click="nextNews" :disabled="currentIndex === allNews.length - pageSize" />
        </div>
      </div>

      <div class="news-container" v-if="currentNews.length > 0">
        <div
          class="news-card"
          :key="currentNews[index].id"
          v-for="(item, index) in currentNews"
          :class="{ active: selectedIndex === index }"
          @click="handleCardClick(index, item.link)"
        >
          <div class="news-image-wrapper">
            <img :src="item.image_url" class="news-image" />
          </div>

          <!-- 选中时显示底部高亮标题 -->
          <div class="news-overlay-bottom" v-if="selectedIndex === index">
            <div class="news-date">{{ formatDate(item.published_date) }}</div>
            <div class="news-title">{{ item.title }}</div>
          </div>

          <!-- 未选中时显示普通信息 -->
          <div class="news-detail" v-else>
            <p class="news-date">{{ formatDate(item.published_date) }}</p>
            <h4 class="news-title">{{ item.title }}</h4>
            <p class="news-summary">{{ item.summary }}</p>
          </div>
        </div>
      </div>
      <div v-else>加载中...</div>  <!-- 如果没有数据，则显示加载中 -->
    </section>

    <!-- 成果展示部分 -->
    <section class="results-section">
      <div class="section-header">
        <h2>RESULTS DISPLAY</h2>
        <h3>成果展示</h3>
      </div>

      <div class="results-list" ref="resultsList">
        <div class="result-item" v-for="(result, index) in displayedResults" :key="index">
          <h4 class="result-title">{{ result.title }}</h4>
          <p class="result-description">{{ result.description }}</p>
        </div>
        <div class="loading-more" v-if="loading">加载更多内容...</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import CarouselBanner from '@/components/CarouselBanner.vue'
import axios from 'axios'

interface NewsItem {
  id: number
  title: string
  summary: string
  published_date: string
  image_url: string
  link: string
}

const allNews = ref<NewsItem[]>([])
const currentIndex = ref(0)  // 当前展示的新闻卡片的起始索引
const pageSize = 4  // 每页展示新闻的数量
const selectedIndex = ref(0)  // 当前选中的新闻卡片索引

// 当前页显示的新闻
const currentNews = computed(() => {
  return allNews.value.slice(currentIndex.value, currentIndex.value + pageSize)
})

const handleCardClick = (index: number, link: string) => {
  selectedIndex.value = index
  if (link) {
    window.open(link, '_blank')
  }
}

const formatDate = (date: string) => new Date(date).toISOString().split('T')[0]

const fetchNews = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/news', {
      params: { page: 1, pageSize: 100 },
    })
    if (res.data.success) {
      allNews.value = res.data.data.list
    } else {
      console.error('新闻数据加载失败', res.data.message)
    }
  } catch (err) {
    console.error('请求新闻数据失败:', err)
  }
}

// 点击左侧按钮，跳转到前一个新闻并更新显示顺序
const prevNews = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--  // 移动到前一个新闻
  }
}

// 点击右侧按钮，跳转到下一个新闻并更新显示顺序
const nextNews = () => {
  if (currentIndex.value < allNews.value.length - pageSize) {
    currentIndex.value++  // 移动到下一个新闻
  }
}

onMounted(fetchNews)

// 成果展示数据
const allResults = ref([
  { title: '文科数字化成果', description: '校级公共数据平台：新型基础设施' },
  { title: '语音学实验室', description: '构建中华民族语言文字共同体' },
  { title: '大数据人文社科研究基地', description: '促进学科交叉，重构研究范式' },
  { title: '法律人工智能实验室', description: 'AI赋能与AI治理' },
  { title: '现代数字家', description: '支持农业农村发展，服务民生' },
  { title: '智慧案例研究中心', description: '案例赋能调研实践创新' },
  { title: '全球风险政治实验室', description: '服务人才培养与前沿研究' },
  { title: '博古睿研究中心', description: '助力全球治理对话平台建设' },
])

const displayedResults = ref([...allResults.value.slice(0, 8)])
const loading = ref(false)
const resultsList = ref<HTMLDivElement | null>(null)

const handleScroll = () => {
  if (resultsList.value) {
    const { scrollTop, scrollHeight, clientHeight } = resultsList.value
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading.value) {
      loadMoreResults()
    }
  }
}

const loadMoreResults = () => {
  loading.value = true
  setTimeout(() => {
    const currentLength = displayedResults.value.length
    const nextResults = allResults.value.slice(currentLength, currentLength + 4)
    displayedResults.value.push(...nextResults)
    loading.value = false
  }, 800)
}

onMounted(() => {
  if (resultsList.value) {
    resultsList.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (resultsList.value) {
    resultsList.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 新闻动态部分 */
.news-section {
  margin-top: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #003366;
}

.arrow-buttons .el-button {
  border: 1px solid #a3c9f8;
  background: #f5faff;
  color: #409eff;
}

.news-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.news-card {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.news-card.active {
  transform: scale(1.06);
}

.news-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-overlay-bottom {
  width: 100%;
  background: linear-gradient(to top, #0044bb, #ffffff00);
  padding: 12px 16px;
  box-sizing: border-box;
  color: #fff;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.news-card.active {
  transform: scale(1.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.news-overlay-bottom .news-date {
  font-size: 13px;
  margin-bottom: 4px;
}

.news-overlay-bottom .news-title {
  font-size: 15px;
  font-weight: bold;
}

.news-detail {
  padding: 14px;
}

.news-date {
  color: #888;
  font-size: 13px;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  margin: 6px 0;
}

.news-summary {
  font-size: 14px;
  color: #555;
}

/* 成果展示部分 */
.results-section {
  margin-top: 80px;
}

.results-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.result-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.result-title {
  color: #1a73e8;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
}

.result-description {
  color: #555;
  line-height: 1.6;
  font-size: 14px;
}

.loading-more {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>
