<template>
  <view class="home-container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">北京大学开放研究数据平台</view>
      <view class="subtitle">数智资源一站式服务平台</view>
    </view>

    <!-- 三个功能按钮 -->
    <view class="function-grid">
      <!-- 数智资源 -->
      <view class="function-card" @click="navigateTo('/pages/resource/index')">
        <image class="function-icon" src=""></image>
        <view class="function-title">数智资源</view>
        <view class="function-desc">数据库/政策库</view>
      </view>

      <!-- 数智成果 -->
      <view class="function-card" @click="navigateTo('/pages/results/index')">
        <image class="function-icon" src=""></image>
        <view class="function-title">数智成果</view>
        <view class="function-desc">可视化平台/评估系统</view>
      </view>

      <!-- 实践应用 -->
      <view class="function-card" @click="navigateTo('/pages/apply/index')">
        <image class="function-icon" src=""></image>
        <view class="function-title">实践应用</view>
        <view class="function-desc">教学/科研/智库</view>
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
// 导航到指定页面
const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fb;
  padding: 40rpx;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 80rpx;
  margin-top: 60rpx;
}

.title {
  font-size: 42rpx;
  font-weight: bold;
  color: #164caa;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

/* 功能网格样式 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
  width: 100%;
  margin-bottom: 80rpx;
}

.function-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.function-card:active {
  transform: translateY(-10rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.function-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.function-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #003366;
  margin-bottom: 8rpx;
}

.function-desc {
  font-size: 24rpx;
  color: #666;
}

/* 底部样式 */
.footer {
  margin-top: auto;
  text-align: center;
  padding: 40rpx 0;
}

.copyright {
  font-size: 24rpx;
  color: #999;
}
</style>