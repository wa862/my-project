<template>
  <div class="sidebar">
    <div class="sidebar-title">精品课程</div>
    <ul class="sidebar-menu">
      <li
        v-for="item in items"
        :key="item.key"
        :class="{ active: item.key === active }"
        @click="select(item.key)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['select'])
const active = ref('primary')

const items = [
  { key: 'primary', label: '小学课程' },
  { key: 'junior', label: '初中课程' },
]

const select = (key: string) => {
  active.value = key
  emit('select', key)
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #0145a0;
  padding: 12px 24px;
  border-radius: 40px 0 0 40px;
  margin-bottom: 20px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  font-size: 15px;
  border-bottom: 1px solid #eee;
}

.sidebar-menu li.active {
  font-weight: bold;
  color: #0a55c2;
}
</style>
