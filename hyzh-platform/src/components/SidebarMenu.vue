<template>
  <aside class="sidebar">
    <ul class="menu">
      <!-- 第一类菜单 -->
      <li>
        <div class="menu-title" @click="toggle('db')">
          公开数据库
          <span class="toggle-icon">{{ open.db ? '－' : '＋' }}</span>
        </div>
        <ul v-show="open.db" class="submenu">
          <li :class="{ active: isActive('/national-regional-db') }" @click="navigate('/national-regional-db')">
            - 国家/地区数据库
          </li>
          <li :class="{ active: isActive('/db/university') }" @click="navigate('/db/university')">
            - 国内高校/研究机构数据库
          </li>
        </ul>
      </li>

      <!-- 第二类菜单 -->
      <li>
        <div class="menu-title" @click="toggle('platform')">
          公开大数据研究平台
          <span class="toggle-icon">{{ open.platform ? '－' : '＋' }}</span>
        </div>
        <ul v-show="open.platform" class="submenu">
          <li
            :class="{ active: isActive('/platform/national') }"
            @click="navigate('/platform/national')"
          >
            - 国家大数据平台
          </li>
          <li
            :class="{ active: isActive('/platform/company') }"
            @click="navigate('/platform/company')"
          >
            - 企业大数据平台
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()
const route = useRoute()

const open = reactive({ db: true, platform: true })

function toggle(key: 'db' | 'platform') {
  open[key] = !open[key]
}

function navigate(path: string) {
  router.push(path)
}

function isActive(path: string) {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #ffffff;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.sidebar h3 {
  font-size: 18px;
  color: #0a2e5d;
  margin-bottom: 20px;
}

.menu-title {
  font-weight: bold;
  color: #164caa;
  cursor: pointer;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-icon {
  font-size: 18px;
  color: #164caa;
}

.submenu {
  padding-left: 15px;
  margin-bottom: 10px;
}

.submenu li {
  padding: 5px 0;
  cursor: pointer;
  color: #333;
}

.submenu li:hover {
  color: #1a73e8;
  text-decoration: underline;
}

.submenu .active {
  color: #1a73e8;
  font-weight: bold;
}
</style>
