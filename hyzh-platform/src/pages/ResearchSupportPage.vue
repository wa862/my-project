<template>
  <PracticeNav />
  <div class="practice-page">
    <h2 class="section-title">科研支持平台</h2>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else class="grid">
      <div
        v-for="item in platforms"
        :key="item.id"
        class="card"
        @click="goTo(item.link)"
      >
        <img :src="getImageUrl(item.image_url, item.title)" :alt="item.title" />
        <div class="label">{{ item.title }}</div>
        <div v-if="item.description" class="desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PracticeNav from '@/components/PracticeNav.vue'

interface Platform {
  id: number
  title: string
  image_url: string
  link: string
  description?: string
}

const platforms = ref<Platform[]>([])
const loading = ref(true)
const error = ref('')

const getImageUrl = (imageUrl: string, title: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  // 根据标题返回默认图片
  return title.includes('知网')
    ? '/src/assets/知网.png'
    : title.includes('万方')
    ? '/src/assets/万方数据.png'
    : '/src/assets/维普论文资源平台.png'
}

const fetchPlatforms = async () => {
  try {
    loading.value = true
    error.value = ''

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/research-platforms`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      platforms.value = result.data
    } else {
      throw new Error('数据格式不正确')
    }
  } catch (err) {
    console.error('获取科研平台数据出错:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    platforms.value = getFallbackPlatforms()
  } finally {
    loading.value = false
  }
}

const goTo = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// 静态回退数据
const getFallbackPlatforms = (): Platform[] => {
  return [
    {
      id: 1,
      title: '中国知网科研平台',
      image_url: '',
      link: 'https://www.cnki.net/',
      description: '中国最大的学术资源平台'
    },
    {
      id: 2,
      title: '万方数据科研支持',
      image_url: '',
      link: 'https://www.wanfangdata.com.cn/',
      description: '综合性学术资源服务平台'
    },
    {
      id: 3,
      title: '维普论文资源平台',
      image_url: '',
      link: 'https://www.cqvip.com/',
      description: '中文期刊论文资源平台'
    }
  ]
}

onMounted(() => {
  fetchPlatforms()
})
</script>

<style scoped>
.practice-page {
  padding: 40px 80px;
  background-color: #f9f9f9;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #0a55c2;
  margin-bottom: 30px;
  text-align: center;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #d32f2f;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.card {
  width: 260px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 100%;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
}

.label {
  font-size: 15px;
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
}

.desc {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}
</style>
