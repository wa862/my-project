import request from '../utils/request'

// 定义登录请求参数类型
interface LoginParams {
  phone: string;
  password: string;
}

// 账号密码登录
export const login = (data: LoginParams) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 发送验证码（暂时保留，但当前版本不需要）
export const sendCode = (phone: string) => {
  return request({
    url: '/api/auth/send-code',
    method: 'post',
    data: { phone }
  })
}

// 验证码登录（暂时保留，但当前版本不需要）
export const loginWithCode = (data: { phone: string; code: string }) => {
  return request({
    url: '/api/auth/code',
    method: 'post',
    data
  })
}
