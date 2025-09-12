<template>
  <view class="login-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">欢迎登录</text>
      <text class="subtitle">LOGIN</text>
    </view>

    <!-- 主要内容 -->
    <view class="main-content">
      <!-- 登录提示 -->
      <text class="login-tip">请输入手机号后登录</text>

      <!-- 登录按钮 -->
      <button 
        class="login-btn" 
        :disabled="!agreed" 
        :class="{ 'disabled': !agreed }"
        @click="handleLogin"
      >
        <text class="btn-text">登录</text>
      </button>

      <!-- 注册按钮 -->
      <button class="register-btn" @click="navigateToRegister">
        <text class="btn-text">注册</text>
      </button>

      <!-- 协议同意 -->
      <view class="agreement-section">
        <label class="agreement-checkbox">
          <checkbox 
            :checked="agreed" 
            @click="agreed = !agreed" 
            style="transform: scale(0.8)"
            color="#007AFF"
          />
          <text class="agreement-text">
            我已阅读并同意
            <text class="agreement-link">《用户协议》</text>
            和
            <text class="agreement-link">《隐私条款》</text>
          </text>
        </label>
      </view>
    </view>

    <!-- 加载弹窗 -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <text class="loading-text">登录中...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreed: false,
      loading: false
    }
  },
  methods: {
    // 点击登录按钮 → 进入登录页面
    handleLogin() {
      if (!this.agreed) {
        uni.showToast({
          title: '请先勾选并同意协议',
          icon: 'none'
        })
        return
      }

      // 跳转到实际登录表单页面
      uni.navigateTo({
        url: '/pages/login/index' 
      })
    },

    // 跳转到注册页面
    navigateToRegister() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    }
  }
}
</script>


<style scoped>
.login-container {
  padding: 80rpx 40rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部标题 */
.header {
  text-align: center;
  margin-bottom: 120rpx;
  margin-top: 60rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 36rpx;
  color: #007AFF;
  font-weight: 500;
  letter-spacing: 4rpx;
}

/* 主要内容 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-tip {
  font-size: 32rpx;
  color: #666666;
  margin-bottom: 80rpx;
  text-align: center;
}

/* 按钮样式 */
.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #007AFF 0%, #0056cc 100%);
  border: none;
  border-radius: 48rpx;
  margin-bottom: 40rpx;
}

.login-btn.disabled {
  background: #cccccc;
}

.register-btn {
  width: 100%;
  height: 96rpx;
  background: transparent;
  border: 2rpx solid #007AFF;
  border-radius: 48rpx;
  margin-bottom: 60rpx;
}

.btn-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

.register-btn .btn-text {
  color: #007AFF;
}

/* 协议同意部分 */
.agreement-section {
  margin-top: auto;
  padding: 20rpx 0;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #666666;
  margin-left: 16rpx;
}

.agreement-link {
  color: #007AFF;
}

/* 加载状态 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  background: #ffffff;
  padding: 60rpx 80rpx;
  border-radius: 24rpx;
  text-align: center;
}

.loading-text {
  display: block;
  font-size: 28rpx;
  color: #333333;
}
</style>
