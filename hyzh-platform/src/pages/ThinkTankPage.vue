<template>
  <PracticeNav />
  <div class="practice-page">
    <h2 class="section-title">教育智库平台</h2>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else class="grid">
      <div
        v-for="item in thinktanks"
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

interface Thinktank {
  id: number
  title: string
  image_url: string
  link: string
  description?: string
}

const thinktanks = ref<Thinktank[]>([])
const loading = ref(true)
const error = ref('')

const getImageUrl = (imageUrl: string, title: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  // 根据标题返回默认图片
  return title.includes('21世纪')
    ? '/src/assets/二十一世纪教育网.png'
    : title.includes('国家教育')
    ? '/src/assets/国家教育发展研究中心.png'
    : title.includes('清华')
    ? '/src/assets/清华大学教育研究院.png'
    : '/src/assets/北京师范大学教育研究院.png'
}

const fetchThinktanks = async () => {
  try {
    loading.value = true
    error.value = ''

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/education-thinktanks`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      thinktanks.value = result.data
    } else {
      throw new Error('数据格式不正确')
    }
  } catch (err) {
    console.error('获取教育智库数据出错:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    thinktanks.value = getFallbackThinktanks()
  } finally {
    loading.value = false
  }
}

const goTo = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// 静态回退数据
const getFallbackThinktanks = (): Thinktank[] => {
  return [
    {
      id: 1,
      title: '21世纪教育研究院',
      image_url: '',
      link: 'https://www.21cnjy.com/',
      description: '民间教育智库机构'
    },
    {
      id: 2,
      title: '国家教育发展研究中心',
      image_url: '',
      link: 'https://www.moe.gov.cn/s78/A10/',
      description: '教育部直属政策研究机构'
    },
    {
      id: 3,
      title: '清华大学教育研究院',
      image_url: '',
      link: 'https://www.ioe.tsinghua.edu.cn/',
      description: '清华大学下属教育研究机构'
    },
    {
      id: 4,
      title: '北京师范大学教育研究院',
      image_url: '',
      link: 'https://fe.bnu.edu.cn/html/index.html',
      description: '北师大下属教育研究机构'
    }
  ]
}

onMounted(() => {
  fetchThinktanks()
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
