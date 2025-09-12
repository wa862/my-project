<template>
  <SmartResourceNav/>
  <div class="page-wrapper">
    <div class="breadcrumb">
      当前位置： 首页 > 数据资源 > 数据库 > 公开大数据研究平台 > 企业大数据平台
    </div>

    <div class="layout">
      <SidebarMenu />

      <section class="content">
        <h2>企业大数据平台</h2>

        <div class="section-block">
          <p>
            企业级大数据平台提供专业的数据分析和服务，支持商业决策和创新发展。
            以下是主要平台介绍：
          </p>
          <div class="regional-links">
            <a
              v-for="platform in platforms"
              :key="platform.id"
              :href="platform.url"
              target="_blank"
            >
              <img :src="getImageUrl(platform.image_url, platform.name)" :alt="platform.name" />
              {{ platform.name }}
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
import SmartResourceNav from '@/components/SmartResourceNav.vue'


interface Platform {
  id: number
  name: string
  description: string
  url: string
  image_url: string
  category?: string
  is_verified?: boolean
}

const platforms = ref<Platform[]>([])

// 图片处理
const getImageUrl = (imageUrl: string, platformName: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  return platformName.includes('知网') ? cnkiEconomicLogo : enterpriseLogo
}

const fetchPlatforms = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/enterprise-platforms`)

    if (!response.ok) throw new Error('获取平台数据失败')

    const result = await response.json()

    if (result.success) {
      platforms.value = result.data
    } else {
      platforms.value = getFallbackPlatforms()
    }
  } catch (error) {
    console.error('获取平台数据出错:', error)
    platforms.value = getFallbackPlatforms()
  }
}

// 静态回退数据
const getFallbackPlatforms = (): Platform[] => {
  return [
    {
      id: 1,
      name: '知网中国经济社会发展研究平台',
      description: 'CNKI提供的经济社会发展研究数据服务',
      url: 'https://example.com/cnki-economic',
      image_url: 'https://i.postimg.cc/cnki-economic-logo.png',
      category: 'research',
      is_verified: true
    },
    {
      id: 2,
      name: '企业大数据分析平台',
      description: '专业的企业级数据分析解决方案',
      url: 'https://example.com/enterprise-analytics',
      image_url: 'https://i.postimg.cc/enterprise-analytics-logo.png',
      category: 'analytics',
      is_verified: true
    }
  ]
}

onMounted(() => {
  fetchPlatforms()
})
</script>

<style scoped>
/* 保持原有样式完全不变 */
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
}
.section-block {
  margin-bottom: 40px;
}
.section-block p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 20px;
}
.regional-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.regional-links a {
  width: 280px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
  text-decoration: none;
  color: #003366;
  font-size: 14px;
}
.regional-links img {
  width: 100%;
  max-height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}
</style>
