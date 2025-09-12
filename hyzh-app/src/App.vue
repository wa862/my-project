<template>
  <view class="app">
    <router-view />
  </view>
</template>

<script setup lang="ts">
// 全局配置
</script>

<style>
/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
               Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* 修改前：使用标签选择器 */
/* a {
  color: #007AFF;
  text-decoration: none;
} */

/* 修改后：使用class选择器 */
.link-style {
  color: #007AFF;
  text-decoration: none;
}

/* 全局按钮样式 */
.button-style {
  background-color: #007AFF;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style>