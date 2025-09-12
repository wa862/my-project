<template>
  <view class="register-page">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">京津冀乡村基础教育</text>
    </view>

    <view class="register-card">
      <text class="register-title">注册成功，即可免费试用</text>

      <!-- 注册表单 -->
      <form @submit="onSubmit">
        <!-- 单位全称 -->
        <view class="form-item">
          <text class="label">单位全称</text>
          <input
            v-model="form.unit"
            placeholder="请输入单位全称"
            maxlength="50"
          />
        </view>

        <!-- 联系人 -->
        <view class="form-item">
          <text class="label">联系人</text>
          <input
            v-model="form.contact"
            placeholder="请输入您的姓名"
            maxlength="10"
          />
        </view>

        <!-- 手机号 -->
        <view class="form-item">
          <text class="label">联系电话</text>
          <input
            v-model="form.phone"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>

        <!-- 地区选择 -->
        <view class="form-item">
          <text class="label">所在地</text>
          <picker mode="selector" :range="provinces" @change="onProvinceChange">
            <view class="picker">{{ form.province || '选择省' }}</view>
          </picker>
          <picker
            mode="selector"
            :range="cities"
            @change="onCityChange"
            :disabled="!form.province"
          >
            <view class="picker">{{ form.city || '选择市' }}</view>
          </picker>
          <picker
            mode="selector"
            :range="districts"
            @change="onDistrictChange"
            :disabled="!form.city"
          >
            <view class="picker">{{ form.district || '选择区/县' }}</view>
          </picker>
        </view>

        <!-- 密码 -->
        <view class="form-item">
          <text class="label">密码</text>
          <input
            v-model="form.password"
            password
            placeholder="请输入密码"
          />
        </view>

        <!-- 确认密码 -->
        <view class="form-item">
          <text class="label">确认密码</text>
          <input
            v-model="form.confirmPassword"
            password
            placeholder="请确认密码"
          />
        </view>

        <!-- 提交按钮 -->
        <button form-type="submit" class="register-button" :loading="submitting">
          注册
        </button>

        <!-- 底部去登录 -->
        <view class="footer">
          <text>已注册？</text>
          <text class="login-link" @click="goLogin">快速登录</text>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      submitting: false,
      provinces: [],
      cities: [],
      districts: [],
      form: {
        unit: '',
        contact: '',
        phone: '',
        password: '',
        confirmPassword: '',
        province: '',
        city: '',
        district: ''
      }
    }
  },
  onLoad() {
    this.loadProvinces()
  },
  methods: {
    async loadProvinces() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/api/regions/provinces',
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.provinces = res.data.data
        } else {
          uni.showToast({ title: '获取省份失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
      }
    },
    async loadCities(province) {
      const res = await uni.request({
        url: `http://localhost:3000/api/regions/${encodeURIComponent(province)}/cities`,
        method: 'GET'
      })
      if (res.data.code === 200) {
        this.cities = res.data.data
      }
    },
    async loadDistricts(province, city) {
      const res = await uni.request({
        url: `http://localhost:3000/api/regions/${encodeURIComponent(province)}/${encodeURIComponent(city)}/districts`,
        method: 'GET'
      })
      if (res.data.code === 200) {
        this.districts = res.data.data
      }
    },
    onProvinceChange(e) {
      this.form.province = this.provinces[e.detail.value]
      this.form.city = ''
      this.form.district = ''
      this.cities = []
      this.districts = []
      this.loadCities(this.form.province)
    },
    onCityChange(e) {
      this.form.city = this.cities[e.detail.value]
      this.form.district = ''
      this.districts = []
      this.loadDistricts(this.form.province, this.form.city)
    },
    onDistrictChange(e) {
      this.form.district = this.districts[e.detail.value]
    },
    async onSubmit() {
      if (!this.form.unit || !this.form.contact || !this.form.phone) {
        return uni.showToast({ title: '请填写完整信息', icon: 'none' })
      }
      if (this.form.password.length < 8) {
        return uni.showToast({ title: '密码至少8位', icon: 'none' })
      }
      if (this.form.password !== this.form.confirmPassword) {
        return uni.showToast({ title: '两次密码不一致', icon: 'none' })
      }
      if (!this.form.province || !this.form.city || !this.form.district) {
        return uni.showToast({ title: '请选择地区', icon: 'none' })
      }

      this.submitting = true
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/api/register',
          method: 'POST',
          data: this.form
        })
        if (res.data.code === 200) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          uni.navigateTo({ url: '/pages/login/index' })
        } else {
          uni.showToast({ title: res.data.message || '注册失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
      } finally {
        this.submitting = false
      }
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/login/index' })
    }
  }
}
</script>

<style>
.register-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}
.header {
  background-color: #1e88e5;
  padding: 20rpx;
  text-align: center;
  color: #fff;
  font-size: 36rpx;
}
.register-card {
  margin: 40rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.register-title {
  text-align: center;
  font-size: 32rpx;
  color: #1e88e5;
  margin-bottom: 40rpx;
}
.form-item {
  margin-bottom: 30rpx;
}
.label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  display: block;
}
input {
  border: 1rpx solid #ccc;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 28rpx;
  width: 100%;
}
.picker {
  border: 1rpx solid #ccc;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 28rpx;
  margin-top: 10rpx;
}
.register-button {
  background-color: #1e88e5;
  color: #fff;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}
.footer {
  margin-top: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
.login-link {
  color: #1e88e5;
  margin-left: 10rpx;
}
</style>
