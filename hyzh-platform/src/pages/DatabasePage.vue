<template>
  <SmartResourceNav/>
  <div class="database-page">
    <h1 class="page-title">数据库</h1>

    <div class="layout">
      <!-- 使用组件 -->
      <SidebarMenu />

      <section class="content">
        <div class="card" >
          <div class="card-text">
            <h3>公开数据库</h3>
            <p>
              汇集国家数据库、国际数据库及国内高校/研究机构数据库三大类数据资源，涵盖年度数据、普查数据、政府各部门数据、各大国际组织相关领域数据，以及国内各高校、研究机构调查项目数据。
            </p>
          </div>
        </div>

        <div class="card">
          <div class="card-text">
            <h3>公开大数据研究平台</h3>
            <p>
              集中汇总国内、国际公开大数据研究平台，包括国家级大数据平台、国内各高校/研究机构大数据平台、国际主要组织和机构大数据平台以及企业开放大数据平台。
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/SidebarMenu.vue'
import { useRouter } from 'vue-router'
import SmartResourceNav from '@/components/SmartResourceNav.vue'
const router = useRouter()
function navigate(path: string) {
  router.push(path)
}
</script>

<style scoped>
.database-page {
  font-family: 'Microsoft YaHei', sans-serif;
  background: #f5f7fb;
  min-height: 100vh;
  padding-top: 0px;
}
.page-title {
  font-size: 26px;
  font-weight: bold;
  color: #164caa;
  padding: 30px 0 10px;
  margin: 0 auto;
  text-align: center;
  background-color: #ffffff;
}
.layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
}
.content {
  flex: 1;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.card {
  display: flex;
  background: #eef5fc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
.card-text {
  flex: 1;
  padding: 20px;
}
.card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #003366;
}
.card p {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}
.card img {
  width: 300px;
  height: auto;
  object-fit: cover;
}
</style>
