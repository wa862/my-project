<template>
  <SmartResourceNav/>
  <div class="page-wrapper">
    <div class="breadcrumb">当前位置： 首页 > 数智资源 > 数据库 > 公开数据库 > 国家/地区数据库</div>

    <div class="layout">
      <SidebarMenu />

      <section class="content">
        <h2>国家/地区数据库</h2>

        <!-- 国家数据库部分 -->
        <div class="section-block">
          <h3>国家数据库</h3>
          <p>
            国家数据库提供共享交换的年度数据以及地区、各部门数据，同时提供多种文件格式、制表、绘图、表格样板、可视化报表、数据地图生成等多种功能。
            其中具有特色的功能为：<br />
            · 数据整合与标准分析<br />
            · 海量数据一键下载<br />
            · 精细资源一键分享
          </p>
          <div class="regional-links">
            <!-- 动态渲染国家数据库链接 -->
            <a
              v-for="item in nationalData"
              :key="item.id"
              :href="item.url"
              target="_blank"
            >
              <img :src="item.image_url" :alt="item.title" />
              {{ item.title }}
            </a>
          </div>
        </div>

        <!-- 地区数据库部分 -->
        <div class="section-block">
          <h3>地区数据库</h3>
          <div class="regional-links">
            <!-- 动态渲染地区数据库链接 -->
            <a
              v-for="item in regionalData"
              :key="item.id"
              :href="item.url"
              target="_blank"
            >
              <img :src="item.image_url" :alt="item.title" />
              {{ item.title }}
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

interface ResourceItem {
  id: number
  title: string
  description: string
  url: string
  image_url: string
  category_type: 'national' | 'regional'
}

const nationalData = ref<ResourceItem[]>([])
const regionalData = ref<ResourceItem[]>([])

const fetchData = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/resources`)

    if (!response.ok) {
      throw new Error('数据获取失败')
    }

    const result = await response.json()

    if (result.success) {
      // 根据category_type分类数据
      nationalData.value = result.data.list.filter(
        (item: ResourceItem) => item.category_type === 'national'
      )
      regionalData.value = result.data.list.filter(
        (item: ResourceItem) => item.category_type === 'regional'
      )
    }
  } catch (error) {
    console.error('获取数据出错:', error)
    // 保持原有静态内容作为回退
    nationalData.value = [
      {
        id: 1,
        title: '年度数据',
        description: '国家统计局年度数据',
        url: 'https://data.stats.gov.cn/easyquery.htm?cn=C01',
        image_url: '/src/assets/年度数据.png',
        category_type: 'national'
      },
      {
        id: 2,
        title: '各部门数据',
        description: '国家各部门统计数据',
        url: 'https://data.stats.gov.cn/staticreq.htm',
        image_url: '/src/assets/各部门数据.png',
        category_type: 'national'
      }
    ]

    regionalData.value = [
      {
        id: 3,
        title: '北京市公共数据开放平台',
        description: '北京市政务数据资源',
        url: 'https://data.beijing.gov.cn',
        image_url: '/src/assets/北京公共数据开放平台.png',
        category_type: 'regional'
      },
      {
        id: 4,
        title: '天津市公共数据开放平台',
        description: '天津市政务数据资源',
        url: 'https://data.tj.gov.cn',
        image_url: '/src/assets/天津数据局.png',
        category_type: 'regional'
      },
      {
        id: 5,
        title: '河北省公共数据开放平台',
        description: '河北省政务数据资源',
        url: 'https://szj.hebei.gov.cn/',
        image_url: '/src/assets/河北省公共数据开放平台.png',
        category_type: 'regional'
      }
    ]
  }
}

onMounted(() => {
  fetchData()
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
.section-block h3 {
  color: #003366;
  margin-bottom: 10px;
}
.section-block p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 15px;
}
.images img {
  width: 250px;
  margin-right: 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
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
