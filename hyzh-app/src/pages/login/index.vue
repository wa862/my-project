<template>
  <view class="login-container">
    <view class="login-card">
      <view class="login-title">京津冀数智评估平台 管理登录</view>

      <!-- 选项卡 -->
      <view class="tab-bar">
        <view 
          class="tab-item" 
          :class="{active: activeTab==='account'}" 
          @click="activeTab='account'">账号密码登录</view>
        <view 
          class="tab-item" 
          :class="{active: activeTab==='code'}" 
          @click="activeTab='code'">验证码登录</view>
      </view>

      <!-- 账号密码登录 -->
      <view v-if="activeTab==='account'" class="login-form">
        <view class="form-item">
          <text class="label">手机号</text>
          <input 
            type="number" 
            maxlength="11"
            v-model="accountForm.phone" 
            placeholder="请输入手机号"
            class="input"
          />
        </view>
        <view class="form-item">
          <text class="label">密码</text>
          <input 
            type="password" 
            v-model="accountForm.password" 
            placeholder="请输入密码"
            class="input"
          />
        </view>
        <button 
          class="btn primary-btn" 
          :loading="loading" 
          @click="handleLogin">登录</button>
      </view>

      <!-- 验证码登录 -->
      <view v-else class="login-form">
        <view class="form-item">
          <text class="label">手机号</text>
          <input 
            type="number" 
            maxlength="11"
            v-model="codeForm.phone" 
            placeholder="请输入手机号"
            class="input"
          />
        </view>
        <view class="form-item code-row">
          <input 
            type="number" 
            maxlength="6"
            v-model="codeForm.code" 
            placeholder="请输入验证码"
            class="input"
          />
          <button 
            class="btn code-btn" 
            :disabled="countdown>0" 
            @click="handleSendCode">
            {{ countdown>0 ? countdown + '秒后重试' : '发送验证码' }}
          </button>
        </view>
        <button 
          class="btn primary-btn" 
          :loading="loading" 
          @click="handleCodeLogin">登录</button>
      </view>

      <!-- 注册 -->
      <view class="footer">
        <text class="link" @click="goRegister">没有账号？点击注册</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'account',
      loading: false,
      countdown: 0,
      timer: null,
      accountForm: {
        phone: '',
        password: ''
      },
      codeForm: {
        phone: '',
        code: ''
      }
    }
  },
  methods: {
    // 账号密码登录
    handleLogin() {
      if (!/^1[3-9]\d{9}$/.test(this.accountForm.phone)) {
        return uni.showToast({ title: '请输入有效手机号', icon: 'none' })
      }
      if (this.accountForm.password.length < 8) {
        return uni.showToast({ title: '密码至少8位', icon: 'none' })
      }
      this.loading = true
      setTimeout(() => {
        uni.showToast({ title: '登录成功', icon: 'success' })
        uni.setStorageSync('authToken', 'mock-token')
        uni.setStorageSync('userInfo', { phone: this.accountForm.phone })
        uni.switchTab({ url: '/pages/home/index' })
        this.loading = false
      }, 800)
    },

    // 验证码登录
    handleCodeLogin() {
      if (!/^1[3-9]\d{9}$/.test(this.codeForm.phone)) {
        return uni.showToast({ title: '请输入有效手机号', icon: 'none' })
      }
      if (this.codeForm.code.length !== 6) {
        return uni.showToast({ title: '请输入6位验证码', icon: 'none' })
      }
      this.loading = true
      setTimeout(() => {
        uni.showToast({ title: '登录成功', icon: 'success' })
        uni.setStorageSync('authToken', 'mock-token')
        uni.setStorageSync('userInfo', { phone: this.codeForm.phone })
        uni.switchTab({ url: '/pages/home/index' })
        this.loading = false
      }, 800)
    },

    // 发送验证码（模拟）
    handleSendCode() {
      if (!/^1[3-9]\d{9}$/.test(this.codeForm.phone)) {
        return uni.showToast({ title: '请输入有效手机号', icon: 'none' })
      }
      uni.showToast({ title: '验证码已发送(模拟)', icon: 'success' })
      this.startCountdown()
    },

    // 倒计时
    startCountdown() {
      this.countdown = 60
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) clearInterval(this.timer)
      }, 1000)
    },

    // 跳转注册
    goRegister() {
      uni.navigateTo({ url: '/pages/register/index' })
    }
  },
  onUnload() {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%);
  padding: 40rpx;
}
.login-card {
  width: 100%;
  max-width: 650rpx;
  background: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 10rpx 25rpx rgba(0,0,0,0.1);
}
.login-title {
  text-align: center;
  margin-bottom: 40rpx;
  color: #00796b;
  font-size: 36rpx;
  font-weight: bold;
}
.tab-bar {
  display: flex;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #eee;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}
.tab-item.active {
  color: #00796b;
  font-weight: bold;
  border-bottom: 4rpx solid #00796b;
}
.form-item {
  margin-bottom: 20rpx;
}
.label {
  display: block;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #333;
}
.input {
  width: 100%;
  border: 2rpx solid #ccc;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}
.code-row {
  display: flex;
  align-items: center;
}
.code-btn {
  margin-left: 20rpx;
  flex-shrink: 0;
  background: #007AFF;
  color: #fff;
  border-radius: 8rpx;
}
.btn {
  width: 60%;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
}
.primary-btn {
  background: linear-gradient(135deg, #007AFF 0%, #0056cc 100%);
  color: #fff;
}
.footer {
  text-align: center;
  margin-top: 30rpx;
}
.link {
  font-size: 28rpx;
  color: #007AFF;
}
</style>
