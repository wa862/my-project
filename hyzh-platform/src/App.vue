<template>
  <div class="app-container">
    <main class="main-content">
      <HeaderBar class="header" />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
</script>

<style scoped>
.main-content {
  margin-top: 70px; /* 与导航栏高度一致，确保内容不被遮挡 */
  width: 100%;
  min-height: calc(100vh - 70px); /* 确保内容区域至少填满剩余视口高度 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    margin-top: 70px;
    padding: 15px;
  }
}
</style>
