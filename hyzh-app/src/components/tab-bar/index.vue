<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in list" 
      :key="index" 
      class="tab-item"
      :class="{ active: current === index }"
      @click="switchTab(index, item.pagePath)"
    >
      <image 
        :src="current === index ? item.selectedIconPath : item.iconPath" 
        class="tab-icon"
      />
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [
        {
          pagePath: "/pages/index/index",
          iconPath: "/static/images/tab-home.png",
          selectedIconPath: "/static/images/tab-home-active.png",
          text: "首页"
        },
        {
          pagePath: "/pages/application/index",
          iconPath: "/static/images/tab-app.png",
          selectedIconPath: "/static/images/tab-app-active.png",
          text: "应用"
        },
        {
          pagePath: "/pages/about/index",
          iconPath: "/static/images/tab-about.png",
          selectedIconPath: "/static/images/tab-about-active.png",
          text: "关于"
        },
        {
          pagePath: "/pages/me/index",
          iconPath: "/static/images/tab-me.png",
          selectedIconPath: "/static/images/tab-me-active.png",
          text: "我的"
        }
      ]
    }
  },
  methods: {
    switchTab(index, path) {
      if (this.current === index) return
      uni.switchTab({
        url: path
      })
    }
  }
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: 20rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #1e88e5;
}
</style>