<template>
  <div class="practice-header">
    <div class="title">实践应用</div>
    <div class="tab-buttons">
      <el-button
        v-for="item in tabs"
        :key="item.key"
        :type="activeTab === item.key ? 'primary' : 'default'"
        plain
        @click="handleClick(item)"
      >
        {{ item.label }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { key: 'teaching', label: '教学资源', route: '/education-resource' },
  { key: 'research', label: '科研支持', route: '/dashboard2' },
  { key: 'thinktank', label: '智库研究', route: '/data-service/extension1' },
]

const activeTab = ref('')

// 根据当前路由初始化 activeTab
const updateActiveTab = () => {
  const matched = tabs.find(tab => tab.route === route.path)
  if (matched) activeTab.value = matched.key
}

onMounted(updateActiveTab)
watch(() => route.path, updateActiveTab)

const handleClick = (item: { key: string; route: string }) => {
  if (route.path !== item.route) {
    router.push(item.route)
  }
}
</script>

<style scoped>
.practice-header {
  background: linear-gradient(to right, #0b60c5, #127eea);
  padding: 50px 0 40px;
  text-align: center;
  color: white;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
  margin-top: 70px;
}

.title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 18px;
}

.el-button {
  border-radius: 20px;
  font-size: 16px;
  padding: 8px 28px;
}
</style>
