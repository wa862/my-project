<template>
  <PracticeNav />
  <div class="edu-page">
    <div class="layout">
      <EduResourceSidebar @select="setCategory" />

      <div class="content">
        <h2 class="section-title">{{ currentCategory === 'primary' ? '小学课程' : '初中课程' }}</h2>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">加载失败: {{ error }}</div>
        <div v-else class="grid">
          <div
            v-for="item in filteredResources"
            :key="item.id"
            class="course-card"
            @click="goTo(item.link)"
          >
            <img :src="getImageUrl(item.image_url, item.title)" :alt="item.title" />
            <div class="label">{{ item.title }}</div>
            <div class="desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EduResourceSidebar from '@/components/EduResourceSidebar.vue'
import PracticeNav from '@/components/PracticeNav.vue'

interface EduResource {
  id: number
  title: string
  image_url: string
  link: string
  category: 'primary' | 'junior'
  description: string
}

const currentCategory = ref<'primary' | 'junior'>('primary')
const resources = ref<EduResource[]>([])
const loading = ref(true)
const error = ref('')

const setCategory = (cat: 'primary' | 'junior') => {
  currentCategory.value = cat
}

const getImageUrl = (imageUrl: string, title: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  // 根据标题返回默认图片
  return title.includes('小学')
    ? '/src/assets/default_primary.png'
    : '/src/assets/default_junior.png'
}

const fetchResources = async () => {
  try {
    loading.value = true
    error.value = ''

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/edu-resources`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      resources.value = result.data
    } else {
      throw new Error('数据格式不正确')
    }
  } catch (err) {
    console.error('获取教育资源出错:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    resources.value = getFallbackResources()
  } finally {
    loading.value = false
  }
}

const filteredResources = computed(() =>
  resources.value.filter((r) => r.category === currentCategory.value)
)

const goTo = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// 静态回退数据
const getFallbackResources = (): EduResource[] => {
  return [
    {
      id: 1,
      title: '小学资源网',
      image_url: '',
      link: 'https://www.xj5u.com/',
      category: 'primary',
      description: '优质小学教育资源平台'
    },
    {
      id: 2,
      title: '国家中小学智慧教育平台',
      image_url: '',
      link: 'https://basic.smartedu.cn/',
      category: 'primary',
      description: '教育部官方教育平台'
    },
    {
      id: 3,
      title: '小学学科网',
      image_url: '',
      link: 'https://www.zxxk.com/',
      category: 'primary',
      description: '小学各学科教学资源'
    },
    {
      id: 4,
      title: '学而思网校（初中）',
      image_url: '',
      link: 'https://www.xueersi.com/',
      category: 'junior',
      description: '知名初中在线教育平台'
    },
    {
      id: 5,
      title: '初中教学资源网',
      image_url: '',
      link: 'https://www.21cnjy.com/',
      category: 'junior',
      description: '初中教师资源分享平台'
    },
    {
      id: 6,
      title: '国家中小学智慧教育平台（初中）',
      image_url: '',
      link: 'https://basic.smartedu.cn/',
      category: 'junior',
      description: '教育部官方教育平台'
    }
  ]
}

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.edu-page {
  padding: 50px 80px;
  background: #f9f9f9;
}

.layout {
  display: flex;
  gap: 40px;
}

.content {
  flex: 1;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #0a55c2;
  margin-bottom: 20px;
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
}

.course-card {
  width: 260px;
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.course-card img {
  width: 100%;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
}

.course-card .label {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
}

.course-card .desc {
  font-size: 12px;
  color: #666;
  text-align: left;
}
</style>
