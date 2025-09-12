import axios from 'axios'

const http = axios.create({
  baseURL: 'https://api.huanyuzhihui.com',
  timeout: 5000,
})

// 请求拦截器可添加 token
http.interceptors.request.use((config) => {
  // config.headers.Authorization = 'Bearer ' + token
  return config
})

export default http
export const login = (data: { username: string; password: string }) => {
  return http.post('/auth/login', data)
}

export const sendCode = (phone: string) => {
  return http.post('/auth/send-code', { phone })
}

export const loginWithCode = (data: { phone: string; code: string }) => {
  return http.post('/auth/login-code', data)
}
