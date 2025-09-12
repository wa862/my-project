<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <span>管理系统</span>
      </div>
      <el-menu
        router
        :default-active="$route.path"
        background-color="#001529"
        text-color="#b7bdc3"
        active-text-color="#fff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><pie-chart /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><user /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <el-icon><document /></el-icon>
          <span>新闻管理</span>
        </el-menu-item>

        <!-- 数据库管理 -->
        <el-sub-menu index="database">
          <template #title>
            <el-icon><data-board /></el-icon>
            <span>数据库管理</span>
          </template>
          <!-- 公开数据库管理 -->
          <el-sub-menu index="public-database">
            <template #title>
              <el-icon><folder-opened /></el-icon>
              <span>公开数据库管理</span>
            </template>
            <el-menu-item index="/resource">
              <el-icon><globe /></el-icon>
              <span>国家/地区数据库</span>
            </el-menu-item>
            <el-menu-item index="/survey">
              <el-icon><office-building /></el-icon>
              <span>国内高校/研究机构数据库</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 公开大数据研究平台管理 -->
          <el-sub-menu index="research-platforms">
            <template #title>
              <el-icon><monitor /></el-icon>
              <span>公开大数据研究平台</span>
            </template>
            <el-menu-item index="/national-platform">
              <el-icon><flag /></el-icon>
              <span>国家平台</span>
            </el-menu-item>
            <el-menu-item index="/enterprise-platform">
              <el-icon><briefcase /></el-icon>
              <span>企业平台</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/policy-library">
            <el-icon><collection /></el-icon>
            <span>政策库</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 实践应用 -->
        <el-sub-menu index="practice">
          <template #title>
            <el-icon><reading /></el-icon>
            <span>实践应用</span>
          </template>
          <el-menu-item index="/edu-resource">
            <el-icon><notebook /></el-icon>
            <span>教育资源</span>
          </el-menu-item>
          <el-menu-item index="/research-platform">
            <el-icon><data-line /></el-icon>
            <span>科研平台</span>
          </el-menu-item>
          <el-menu-item index="/thinktank">
            <el-icon><school /></el-icon>
            <span>教育智库</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/about">
          <el-icon><setting /></el-icon>
          <span>关于我们</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="top-nav">
        <div class="right-menu">
          <el-button type="text" @click="goToLogin">
            <el-icon><user /></el-icon>
            <span>登录</span>
          </el-button>
        </div>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PieChart,
  User,
  Document,
  DataBoard,
  Reading,
  Notebook,
  DataLine,
  Briefcase,
  Collection,
  School,
  FolderOpened,
  Monitor,
  Flag,
  Setting,
  OfficeBuilding
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .sidebar {
    width: 220px;
    height: 100%;
    background-color: #001529;
    transition: width 0.3s;
    overflow-y: auto;

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
    }

    .el-menu {
      border-right: none;

      /* 子菜单缩进样式 */
      .el-menu-item {
        padding-left: 50px !important;
      }

      .el-sub-menu .el-menu-item {
        padding-left: 70px !important;
      }
    }
  }

  .main-container {
    flex: 1;
    overflow: auto;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;

    .top-nav {
      height: 60px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;

      .right-menu {
        .el-button {
          display: flex;
          align-items: center;
          font-size: 20px;
          span {
            margin-left: 5px;
          }
        }
      }
    }

    > :last-child {
      flex: 1;
      padding: 20px;
    }
  }
}
</style>
