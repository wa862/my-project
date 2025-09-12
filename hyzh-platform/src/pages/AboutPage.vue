<template>
  <div class="about-page">
    <!-- 顶部蓝色波浪背景 -->
    <div class="banner" :style="{ background: pageData.bannerBgColor || 'linear-gradient(to right, #0b60c5, #127eea)' }">
      <h1>{{ pageData.bannerTitle || '关于我们' }}</h1>
      <div class="breadcrumb">{{ pageData.breadcrumb || '当前位置： 首页 > 关于我们' }}</div>
    </div>

    <!-- 内容主体 -->
    <div class="content-wrapper">
      <div v-for="(section, index) in pageData.sections" :key="index">
        <div class="section-title">{{ section.title }}</div>

        <p v-if="section.type === 'text'">
          {{ section.content }}
        </p>

        <ul v-if="section.type === 'list'">
          <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="footer-text" :style="{ color: pageData.footerColor || '#888' }">
        {{ pageData.footerText || '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。' }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AboutPage',
  setup() {
    const pageData = ref({
      bannerTitle: '关于我们',
      bannerBgColor: 'linear-gradient(to right, #0b60c5, #127eea)',
      breadcrumb: '当前位置： 首页 > 关于我们',
      sections: [],
      footerText: '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。',
      footerColor: '#888'
    });

    const loadPageData = async () => {
      try {
        // 修改请求路径，添加完整的API基础URL
        const response = await axios.get('http://localhost:3000/api/about-page', {
          timeout: 5000 // 添加超时设置
        });

        // 合并默认数据和响应数据
        pageData.value = {
          ...pageData.value,
          ...response.data,
          sections: response.data.sections || []
        };
      } catch (error) {
        console.error('加载页面数据失败，使用默认数据:', error);
      }
    };

    onMounted(() => {
      loadPageData();
    });

    return {
      pageData
    };
  }
};
</script>

<style scoped>
.about-page {
  font-family: 'Microsoft YaHei', sans-serif;
  background: #f9fafd;
  min-height: 100vh;
}

.banner {
  background: linear-gradient(to right, #0b60c5, #127eea);
  color: white;
  padding: 60px 0 40px;
  text-align: center;
  position: relative;
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 80px;
}

.banner h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.breadcrumb {
  font-size: 14px;
  color: #e0e0e0;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 30px;
  color: #333;
  line-height: 1.8;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #0a3b75;
  margin: 30px 0 15px;
}

ul {
  padding-left: 20px;
  line-height: 1.8;
}

ul li {
  margin-bottom: 10px;
}

.footer-text {
  margin-top: 40px;
  font-size: 14px;
  color: #888;
  text-align: right;
}
</style>
