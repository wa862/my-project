<template>
  <SmartResourceNav />
  <div class="page-wrapper">
    <!-- 面包屑 -->
    <div class="breadcrumb">当前位置： 首页 > 数智资源 > 政策库</div>

    <div class="layout">
      <section class="content">
        <h2>京津冀乡村基础教育政策库</h2>
        <p class="intro">
          本政策库汇聚京津冀三地政府和研究机构近年来发布的有关乡村基础教育均衡、教师资源下沉、数字化平台建设等相关政策信息，供教育决策者、研究人员与社会公众参考。
        </p>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">加载失败: {{ error }}</div>
        <div v-else class="regional-links">
          <a
            v-for="policy in policies"
            :key="policy.id"
            :href="policy.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="getImageUrl(policy.image_url, policy.title)" :alt="policy.title" />
            <h3>{{ policy.title }}</h3>
            <p class="publish-date">{{ formatDate(policy.publish_date) }}</p>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SmartResourceNav from '@/components/SmartResourceNav.vue'

interface Policy {
  id: number
  title: string
  description: string
  url: string
  image_url: string
  region: string
  publish_date: string
}

const policies = ref<Policy[]>([])
const loading = ref(true)
const error = ref('')

const getImageUrl = (imageUrl: string, policyTitle: string) => {
  if (imageUrl) {
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
  }
  // 根据政策标题返回默认图片
  return policyTitle.includes('数字化')
    ? '/src/assets/京津冀乡村教育数字化.png'
    : policyTitle.includes('教师')
    ? '/src/assets/乡村教师.png'
    : '/src/assets/雄安教育共享.png'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const fetchPolicies = async () => {
  try {
    loading.value = true
    error.value = ''

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/policy-library`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      policies.value = result.data
    } else {
      throw new Error('数据格式不正确')
    }
  } catch (err) {
    console.error('获取政策数据出错:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    // 使用回退数据
    policies.value = getFallbackPolicies()
  } finally {
    loading.value = false
  }
}

// 静态回退数据
const getFallbackPolicies = () => {
  return [
    {
      id: 1,
      title: '京津冀乡村教育数字化推进方案',
      description: '推进京津冀乡村教育数字化发展的政策方案',
      url: 'https://www.edu.cn/xxh/focus/df/202302/t20230207_2293503.shtml',
      image_url: '',
      region: '京津冀',
      publish_date: '2023-02-07'
    },
    {
      id: 2,
      title: '乡村教师支援机制政策',
      description: '关于乡村教师支援机制的政策文件',
      url: 'https://www.gov.cn/zhengce/zhengceku/2020-09/04/content_5540386.htm',
      image_url: '',
      region: '全国',
      publish_date: '2020-09-04'
    },
    {
      id: 3,
      title: '雄安教育共享政策体系',
      description: '雄安新区教育资源共享政策体系',
      url: 'https://www.xiongan.gov.cn/2022-11/21/c_1211702781.htm',
      image_url: '',
      region: '河北',
      publish_date: '2022-11-21'
    }
  ]
}

onMounted(() => {
  fetchPolicies()
})
</script>

<style scoped>
.page-wrapper {
  background: #f5f7fb;
  min-height: 100vh;
  padding-top: 100px;
  font-family: 'Microsoft YaHei', sans-serif;
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

.intro {
  font-size: 14px;
  color: #444;
  line-height: 1.8;
  margin-bottom: 30px;
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
  text-decoration: none;
  color: #003366;
  transition: transform 0.2s;
}

.regional-links a:hover {
  transform: translateY(-5px);
}

.regional-links img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

.regional-links h3 {
  font-size: 16px;
  margin-bottom: 8px;
  text-align: left;
}

.publish-date {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 8px;
}
</style>
