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
/* 响应式调整 */
/* @media (max-width: 768px) {
  .main-content {
    margin-top: 56px;
    padding: 15px;
  }
} */
</style>
