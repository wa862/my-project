<template>
  <SmartResourceNav/>
  <div class="page-wrapper">
    <div class="breadcrumb">当前位置： 首页 > 数智资源 > 数据库 > 公开数据库 > 国内高校/研究机构数据库</div>

    <div class="layout">
      <SidebarMenu />

      <section class="content">
        <h2>调查数据库</h2>

        <div class="section-block">
          <p class="intro">
            国内各高校和研究机构开展的多项大型调查项目数据，大多以独立数据平台的方式存储和共享。许多全国知名的调查项目数据如中国综合社会调查（CGSS）、中国健康与养老追踪调查（CHARLS）、中国家庭金融调查（CHFS）、中国教育追踪调查（CEPS）等社会科学领域调查项目均建有独立的数据平台。
          </p>

          <div class="survey-grid">
            <div
              v-for="item in uniqueSurveyData"
              :key="item.id"
              class="survey-item"
            >
              <a :href="item.url" target="_blank">
                <img
                  :src="getImageUrl(item.image_url)"
                  :alt="item.title"
                  @error="handleImageError($event, item)"
                />
                <h3>{{ item.title }}</h3>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
import SmartResourceNav from '@/components/SmartResourceNav.vue'

interface SurveyItem {
  id: number
  title: string
  description: string
  url: string
  image_url: string
}

const surveyData = ref<SurveyItem[]>([])

// 计算属性：确保数据唯一性（优先保留有完整URL的图片）
const uniqueSurveyData = computed(() => {
  const seen = new Map()
  surveyData.value.forEach(item => {
    const normalizedTitle = item.title.replace(/[（）()\s]/g, '').toLowerCase()
    const existing = seen.get(normalizedTitle)

    // 如果不存在或者当前项有完整URL图片，则更新
    if (!existing || (item.image_url?.startsWith('http') && !existing.image_url?.startsWith('http'))) {
      seen.set(normalizedTitle, item)
    }
  })
  return Array.from(seen.values())
})

// 图片URL处理（优先使用完整URL）
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '/src/assets/default-survey.png'

  // 已经是完整URL直接使用
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  // 本地路径处理（确保以/images/开头）
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${normalizedPath}`
}

// 图片错误处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  // 如果当前不是默认图片，则回退
  if (!img.src.includes('default-survey')) {
    img.src = '/src/assets/default-survey.png'
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/surveys`)

    if (!response.ok) throw new Error(`请求失败: ${response.status}`)

    const result = await response.json()

    if (result.success) {
      surveyData.value = result.data
    }
  } catch (error) {
    console.error('获取数据出错:', error)
    // 使用静态数据作为回退（全部使用完整URL）
    surveyData.value = [
      {
        id: 1,
        title: '中国健康与养老追踪调查（CHARLS）',
        description: '北京大学开展的全国性调查',
        url: 'https://charls.pku.edu.cn/',
        image_url: 'https://i.postimg.cc/Y0yYK0zD/image.png'
      },
      {
        id: 2,
        title: '中国综合社会调查（CGSS）',
        description: '中国人民大学开展的综合社会调查',
        url: 'https://cgss.ruc.edu.cn/',
        image_url: 'https://i.postimg.cc/504CXLPk/CGSS.png'
      },
      {
        id: 3,
        title: '中国家庭金融调查（CHFS）',
        description: '西南财经大学开展的家庭金融调查',
        url: 'https://chfs.swufe.edu.cn/',
        image_url: 'https://i.postimg.cc/3JTdNgdj/CHFS.png'
      },
      {
        id: 4,
        title: '中国教育追踪调查（CEPS）',
        description: '中国人民大学开展的教育追踪',
        url: 'https://ceps.ruc.edu.cn/',
        image_url: 'https://i.postimg.cc/WzrFK8tz/CEPS.png'
      }
    ]
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 保持原有样式不变 */
.page-wrapper {
  background: #f5f7fb;
  min-height: 100vh;
  padding-top: 100px;
}
.breadcrumb {
  text-align: right;
  padding: 16px 30px;
  font-size: 14px;
  color: #666;
}
.layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 30px 60px;
}
.content {
  flex: 1;
  padding-left: 40px;
}
.content h2 {
  font-size: 22px;
  color: #164caa;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}
.section-block {
  margin-bottom: 40px;
}
.section-block p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 25px;
}
.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.survey-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.survey-item:hover {
  transform: translateY(-5px);
}
.survey-item a {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: #333;
}
.survey-item img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
}
.survey-item h3 {
  font-size: 16px;
  text-align: center;
  margin: 0;
  color: #164caa;
}
</style>
