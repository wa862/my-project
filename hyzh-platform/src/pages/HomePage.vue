<template>
  <div>
    <CarouselBanner />
    <div class="home-container">
      <!-- 新闻动态部分 -->
      <section class="news-section">
        <div class="section-header">
          <div class="title">新闻动态</div>
          <div class="arrow-buttons">
            <el-button icon="el-icon-arrow-left" circle @click="prevNews" :disabled="currentIndex === 0" />
            <el-button icon="el-icon-arrow-right" circle @click="nextNews" :disabled="currentIndex >= allNews.length - pageSize" />
          </div>
        </div>

        <div class="news-container" v-if="currentNews.length > 0">
          <div
            class="news-card"
            v-for="(item, index) in currentNews"
            :key="item.id"
            :class="{ active: selectedIndex === currentIndex + index }"
            @click="handleCardClick(currentIndex + index, item.link)"
          >
            <div class="news-image-wrapper">
              <img :src="item.image_url" class="news-image" @error="handleImageError" />
            </div>

            <!-- 选中时显示底部高亮标题 -->
            <div class="news-overlay-bottom" v-if="selectedIndex === currentIndex + index">
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
        <div v-else class="loading-text">加载中...</div>
      </section>

        <!-- 左侧：成果展示 -->
        <div class="results-container">
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
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
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

// 新闻相关
const allNews = ref<NewsItem[]>([])
const currentIndex = ref(0)
const pageSize = 4
const selectedIndex = ref(0)

// 使用参考信息中提供的图片URL
const defaultImageUrl = 'https://sfile.chatglm.cn/chatglm4/89323d8d-937a-4272-bd87-a876af63196e.png'

// 模拟新闻数据（如果API不可用）
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: '京津冀数智评估平台正式上线',
    summary: '平台致力于推动区域数字化转型和智能化发展',
    published_date: '2024-01-15',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/1'
  },
  {
    id: 2,
    title: '数字经济发展论坛成功举办',
    summary: '专家学者共话数字经济未来发展趋势',
    published_date: '2024-01-10',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/2'
  },
  {
    id: 3,
    title: '人工智能技术应用研讨会',
    summary: '探讨AI技术在各个领域的创新应用',
    published_date: '2024-01-05',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/3'
  },
  {
    id: 4,
    title: '数字化转型白皮书发布',
    summary: '详细解读企业数字化转型路径',
    published_date: '2024-01-01',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/4'
  },
  {
    id: 5,
    title: '智慧城市建设新进展',
    summary: '多个城市推进智慧城市建设项目',
    published_date: '2023-12-28',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/5'
  },
  {
    id: 6,
    title: '数据安全法规更新',
    summary: '最新数据安全保护政策解读',
    published_date: '2023-12-25',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/6'
  },
  {
    id: 7,
    title: '云计算技术发展趋势',
    summary: '云计算领域最新技术动态分析',
    published_date: '2023-12-20',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/7'
  },
  {
    id: 8,
    title: '区块链应用案例分享',
    summary: '区块链技术在实体经济中的应用',
    published_date: '2023-12-15',
    image_url: defaultImageUrl,
    link: 'https://example.com/news/8'
  }
]

const currentNews = computed(() => {
  return allNews.value.slice(currentIndex.value, currentIndex.value + pageSize)
})

const handleCardClick = (index: number, link: string) => {
  selectedIndex.value = index
  if (link && link !== '#') {
    window.open(link, '_blank')
  }
}

const formatDate = (date: string) => {
  try {
    return new Date(date).toISOString().split('T')[0]
  } catch {
    return date
  }
}

// 处理图片加载错误
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = defaultImageUrl
}

const fetchNews = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/news', {
      params: { page: 1, pageSize: 100 },
      timeout: 5000
    })
    if (res.data.success) {
      // 确保API返回的图片URL有效，如果无效则使用默认图片
      allNews.value = res.data.data.list.map((item: NewsItem) => ({
        ...item,
        image_url: item.image_url || defaultImageUrl
      }))
    } else {
      console.error('新闻数据加载失败', res.data.message)
      // 使用模拟数据作为备选
      allNews.value = mockNews
    }
  } catch (err) {
    console.error('请求新闻数据失败，使用模拟数据:', err)
    // 使用模拟数据作为备选
    allNews.value = mockNews
  }
}

const prevNews = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedIndex.value = currentIndex.value
  }
}

const nextNews = () => {
  if (currentIndex.value < allNews.value.length - pageSize) {
    currentIndex.value++
    selectedIndex.value = currentIndex.value
  }
}

// 成果展示相关
const allResults = ref([
  { title: '文科数字化成果', description: '校级公共数据平台：新型基础设施' },
  { title: '语音学实验室', description: '构建中华民族语言文字共同体' },
  { title: '大数据人文社科研究基地', description: '促进学科交叉，重构研究范式' },
  { title: '法律人工智能实验室', description: 'AI赋能与AI治理' },
  { title: '现代数字家', description: '支持农业农村发展，服务民生' },
  { title: '智慧案例研究中心', description: '案例赋能调研实践创新' },
  { title: '全球风险政治实验室', description: '服务人才培养与前沿研究' },
  { title: '博古睿研究中心', description: '助力全球治理对话平台建设' },
  { title: '数字文化遗产保护', description: '利用数字技术保护传统文化遗产' },
  { title: '智慧医疗实验室', description: '推动医疗健康领域数字化转型' },
  { title: '环境大数据分析', description: '支持生态环境保护决策' },
  { title: '教育技术研究中心', description: '探索教育信息化创新路径' }
])

const displayedResults = ref([...allResults.value.slice(0, 4)])
const loading = ref(false)
const resultsList = ref<HTMLDivElement | null>(null)
const currentPage = ref(1)
const itemsPerPage = 4

const handleScroll = () => {
  if (resultsList.value && !loading.value) {
    const { scrollTop, scrollHeight, clientHeight } = resultsList.value
    // 滚动到底部时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreResults()
    }
  }
}

const loadMoreResults = async () => {
  if (loading.value) return

  loading.value = true
  await nextTick() // 等待DOM更新

  setTimeout(() => {
    const nextPage = currentPage.value + 1
    const startIndex = (nextPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    if (startIndex < allResults.value.length) {
      const nextResults = allResults.value.slice(startIndex, endIndex)
      displayedResults.value.push(...nextResults)
      currentPage.value = nextPage
    }

    loading.value = false
  }, 800)
}

onMounted(() => {
  fetchNews()

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

.arrow-buttons .el-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.news-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  min-height: 300px;
}

.news-card {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 320px;
  display: flex;
  flex-direction: column;
}

.news-card.active {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.news-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.05);
}

.news-overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 68, 187, 0.9), transparent);
  padding: 16px;
  color: #fff;
  backdrop-filter: blur(2px);
}

.news-overlay-bottom .news-date {
  font-size: 12px;
  margin-bottom: 6px;
  opacity: 0.9;
}

.news-overlay-bottom .news-title {
  font-size: 14px;
  font-weight: bold;
  line-height: 1.3;
}

.news-detail {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-date {
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
}

.news-title {
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 10px 0;
  line-height: 1.3;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.loading-text {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 16px;
}

/* 成果展示和智能问答部分 */
.results-qa-section {
  margin-top: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.results-container {
  background: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: fit-content;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.results-container .section-header {
  margin-bottom: 20px;
}

.results-container .section-header h2 {
  color: #003366;
  font-size: 18px;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.results-container .section-header h3 {
  color: #666;
  font-size: 22px;
  margin: 0;
  font-weight: bold;
}

.results-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
}

.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.result-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid #1a73e8;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f0f7ff;
}

.result-title {
  color: #1a73e8;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.result-description {
  color: #555;
  line-height: 1.5;
  font-size: 14px;
  margin: 0;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 14px;
}

.qa-container {
  min-height: 400px;
  height: 100%;
}

@media (max-width: 768px) {
  .news-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .results-qa-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .results-list {
    grid-template-columns: 1fr;
  }
}
</style>
