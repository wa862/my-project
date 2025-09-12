<template>
  <div class="about-page">
    <!-- 顶部蓝色波浪背景 -->
    <div class="banner" :style="{ background: pageData.bannerBgColor }">
      <h1>{{ pageData.bannerTitle }}</h1>
      <div class="breadcrumb">{{ pageData.breadcrumb }}</div>
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

      <div class="footer-text" :style="{ color: pageData.footerColor }">
        {{ pageData.footerText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PageData } from './AboutPageAdmin.vue';

export default defineComponent({
  name: 'AboutPagePreview',
  props: {
    pageData: {
      type: Object as PropType<PageData>,
      required: true
    }
  }
});
</script>

<style scoped>
/* 保持与原始AboutPage.vue相同的样式 */
.about-page {
  font-family: 'Microsoft YaHei', sans-serif;
  background: #f9fafd;
  min-height: 100vh;
}

.banner {
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
  text-align: right;
}
</style>
