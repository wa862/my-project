<template>
  <div class="smart-header">
    <div class="smart-title">数智资源</div>
    <div class="button-group">
      <el-button
        v-for="item in tabs"
        :key="item.key"
        :type="activeTab === item.key ? 'primary' : 'default'"
        plain
        @click="handleTabClick(item)"
      >
        {{ item.label }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { key: 'database', label: '数据库', route: '/database' },
  { key: 'policy', label: '政策库', route: '/policy-library' },
]

const activeTab = ref('')

// 根据当前路由初始化或更新高亮 tab
const updateActiveTab = () => {
  const match = tabs.find(t => t.route === route.path)
  if (match) {
    activeTab.value = match.key
  }
}

onMounted(updateActiveTab)
watch(() => route.path, updateActiveTab)

const handleTabClick = (item: { key: string; route: string }) => {
  if (route.path !== item.route) {
    router.push(item.route)
  }
}
</script>

<style scoped>
.smart-header {
  background: linear-gradient(to right, #0a58ca, #157efb);
  padding: 40px 0 30px;
  text-align: center;
  color: white;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  position: relative;
  margin-top: 70px;
}

.smart-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.el-button {
  border-radius: 20px;
  font-size: 16px;
  padding: 6px 24px;
  transition: all 0.3s;
}
</style>
