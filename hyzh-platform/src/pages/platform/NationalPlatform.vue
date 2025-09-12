<template>
  <SmartResourceNav/>
  <div class="page-wrapper">
    <div class="breadcrumb">
      当前位置： 首页 > 数智资源 > 数据库 > 公开大数据研究平台 > 国家大数据平台
    </div>

    <div class="layout">
      <SidebarMenu />

      <section class="content">
        <h2>国家大数据平台</h2>

        <div class="section-block">
          <p>
            国家级大数据平台通过数据整合、开放共享和智能服务，推动科研领域的发展。
            以下是主要平台介绍：
          </p>
          <div class="regional-links">
            <!-- 动态渲染平台链接 -->
            <a
              v-for="platform in platforms"
              :key="platform.id"
              :href="platform.url"
              target="_blank"
            >
              <img :src="getImageUrl(platform.image_url, platform.name)" :alt="platform.name" />
              <h3>{{ platform.name }}</h3>
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
}

const platforms = ref<Platform[]>([])

const getImageUrl = (imageUrl: string, platformName: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  // Return default images based on platform name if needed
  return platformName.includes('数据局')
    ? '/src/assets/国家数据局.png'
    : '/src/assets/国家公共数据资源登记平台.png'
}

const fetchPlatforms = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/national-platforms`)

    if (!response.ok) throw new Error('获取平台数据失败')

    const result = await response.json()

    if (result.success && result.data && result.data.length > 0) {
      platforms.value = result.data
    } else {
      platforms.value = getFallbackPlatforms()
    }
  } catch (error) {
    console.error('获取平台数据出错:', error)
    platforms.value = getFallbackPlatforms()
  }
}

// Static fallback data remains the same
const getFallbackPlatforms = () => {
  return [
    {
      id: 1,
      name: '国家数据局',
      description: '负责协调推进数据基础制度建设，统筹数据资源整合共享和开发利用',
      url: 'https://www.nda.gov.cn/sjj/index_pc.html',
      image_url: ''
    },
    {
      id: 2,
      name: '国家公共数据资源登记平台',
      description: '提供公共数据资源登记服务，促进数据要素流通',
      url: 'https://sjdj.nda.gov.cn/',
      image_url: ''
    }
  ]
}

onMounted(() => {
  fetchPlatforms()
})
</script>

<style scoped>
/* 保持与调查数据库完全相同的样式 */
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
.platform-desc {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: left;
}
</style>
