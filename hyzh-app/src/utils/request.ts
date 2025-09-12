import type { ApiResponse } from '@/types'

const baseUrl = 'http://localhost:3000'

// 类型保护函数
function isObjectWithMessage(data: any): data is { message: string } {
  return data && 
         typeof data === 'object' && 
         !(data instanceof ArrayBuffer) &&
         'message' in data
}

// 检查是否是 ApiResponse 类型
function isApiResponse(data: any): data is ApiResponse {
  return data && typeof data === 'object' && 'success' in data
}

export const request = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    // 确保URL正确拼接，处理查询参数
    let fullUrl = baseUrl + url
    
    // 如果是GET请求且有数据，将数据转换为查询参数
    if (method === 'GET' && data) {
      const params = new URLSearchParams()
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, data[key])
        }
      }
      const queryString = params.toString()
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
      }
    }
    
    uni.request({
      url: fullUrl,
      method,
      data: method !== 'GET' ? data : undefined,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        // 处理响应数据
        const responseData = res.data
        
        // 检查是否是 ApiResponse 格式
        if (isApiResponse(responseData)) {
          if (responseData.success) {
            resolve(responseData.data as T)
          } else {
            reject(new Error(responseData.message || '请求失败'))
          }
        } else {
          // 如果不是 ApiResponse 格式，直接返回整个响应
          resolve(responseData as T)
        }
      },
      fail: (err) => {
        // 处理错误
        if (isObjectWithMessage(err)) {
          reject(new Error(err.message))
        } else {
          reject(new Error('网络请求失败'))
        }
      }
    })
  })
}

// 封装常用的请求方法
export const get = <T>(url: string, data?: any) => request<T>(url, 'GET', data)
export const post = <T>(url: string, data?: any) => request<T>(url, 'POST', data)
export const put = <T>(url: string, data?: any) => request<T>(url, 'PUT', data)
export const del = <T>(url: string, data?: any) => request<T>(url, 'DELETE', data)