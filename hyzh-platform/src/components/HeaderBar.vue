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
      <!-- <DataServiceLayout />
      <PracticeNav /> -->
      <PraticalApplication/>
      <DataServiceLayout/>
      <RouterLink to="/smart-qa">智能问答</RouterLink>
      <RouterLink to="/about">关于我们</RouterLink>
      <!-- 登录状态显示 -->
      <div v-if="isLoggedIn" class="user-profile">
        <div class="avatar-container" @click="toggleDropdown">
          <img
            :src="userAvatar"
            alt="用户头像"
            class="user-avatar"
          />
          <el-icon size="14" class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <!-- 下拉菜单 -->
        <div v-if="showDropdown" class="dropdown-menu">
          <RouterLink to="/dashboard" @click="closeDropdown">主页</RouterLink>
          <RouterLink to="/admin" @click="closeDropdown">管理</RouterLink>
          <div class="divider"></div>
          <div class="logout" @click="handleLogout">退出登录</div>
        </div>
      </div>
      <!-- 未登录状态显示 -->
      <RouterLink v-else to="/login">登录</RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DataResult from './DataResult.vue'
import DataServiceLayout from './DataServiceLayout.vue'
import PraticalApplication from './PracticalApplication.vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const showDropdown = ref(false)
const userInfo = ref<unknown>(null)

// 检查登录状态
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('authToken') && !!userInfo.value
})

// 用户头像
const userAvatar = computed(() => {
  // 如果有用户头像则使用用户头像，否则使用默认头像
  return (userInfo.value as any)?.avatar || 'https://via.placeholder.com/36'
})

// 加载用户信息
const loadUserInfo = () => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    try {
      userInfo.value = JSON.parse(savedUserInfo)
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
}

// 切换下拉菜单显示
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  showDropdown.value = false
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userInfo')
  userInfo.value = null
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 监听点击事件，点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const profileElement = document.querySelector('.user-profile')
  if (profileElement && !profileElement.contains(event.target as Node)) {
    closeDropdown()
  }
}

// 组件挂载时加载用户信息并添加点击事件监听
onMounted(() => {
  loadUserInfo()
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
  padding: 15px 5%;
  background-color: #2d9bdf !important;
  background-image: none !important;
  z-index: 1000;
  height: 70px;
  box-shadow: none;
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
  color: white;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 30px;
  margin-right: 30px;
  align-items: center;
  background-color: transparent !important;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-size: 17px;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* .nav-links a:hover {
  color: #e3f2fd;
  transform: translateY(-2px);
} */

.nav-links a.router-link-active {
  color: #e3f2fd;
  font-weight: bold;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #e3f2fd;
  border-radius: 2px;
}

/* 用户头像和下拉菜单样式 */
.user-profile {
  position: relative;
  cursor: pointer;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.avatar-container:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-icon {
  color: white;
  transition: transform 0.3s ease;
}

.user-profile:hover .dropdown-icon {
  color: #e3f2fd;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 120px;
  z-index: 2000;
}

.dropdown-menu a,
.dropdown-menu .logout {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  font-size: 15px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.dropdown-menu a:hover,
.dropdown-menu .logout:hover {
  background-color: #f5f5f5;
  color: #1e88e5;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}
</style>
