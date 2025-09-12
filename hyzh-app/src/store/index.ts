import { ref } from 'vue'
import type { UserInfo, LoginParams } from '@/types'
import { api } from '../utils/request'

// 用户状态
export const userInfo = ref<UserInfo | null>(null)

// 初始化时读取本地存储
const initUser = () => {
  const storedUser = uni.getStorageSync('userInfo')
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser)
  }
}

// 登录方法
export const login = async (params: LoginParams) => {
  const data = await api.post<UserInfo>('/auth/login', params)
  userInfo.value = data
  // 存储到本地
  uni.setStorageSync('userInfo', JSON.stringify(data))
  uni.setStorageSync('token', data.token || '')
  return data
}

// 退出登录
export const logout = () => {
  userInfo.value = null
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('token')
}

// 初始化
initUser()

export default {
  userInfo,
  login,
  logout
}