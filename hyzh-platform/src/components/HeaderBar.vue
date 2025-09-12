<template>
  <div class="navbar">
    <div class="logo-container">
      <img class="logo" src="../assets/logo.jpg" />
      <div class="platform-name">京津冀乡村基础教育</div>
    </div>

    <nav class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/news">新闻动态</RouterLink>
      <DataResult />
      <DataServiceDropdown />
      <PracticalApplication />
      <RouterLink to="/about">关于我们</RouterLink>
      <RouterLink to="/login">登录</RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DataServiceDropdown from './DataServiceLayout.vue'
import PracticalApplication from './PracticalApplication.vue'
import DataResult from './DataResult.vue'
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
  background-color: #f0f8ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto; /* Push logo and title to the left */
  padding-left: 20px;
}

.logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.platform-name {
  font-size: 20px;
  font-weight: bold;
  color: #1e5f8c;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 30px;
  margin-right: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-size: 17px;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-links a:hover {
  color: #1e88e5;
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  color: #1e88e5;
  font-weight: bold;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #1e88e5;
  border-radius: 2px;
}
</style>
