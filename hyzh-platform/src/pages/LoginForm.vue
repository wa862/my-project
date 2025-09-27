<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">京津冀数智评估平台 管理登录</h2>
      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="账号密码登录" name="account">
          <el-form
            :model="accountForm"
            :rules="accountRules"
            ref="accountFormRef"
            class="login-form"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="accountForm.phone"
                placeholder="请输入手机号"
                size="large"
                maxlength="11"
                @input="handlePhoneInput"
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="accountForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
              />
            </el-form-item>
            <el-button
              type="primary"
              @click="handleLogin"
              size="large"
              style="width: 100%; margin-top: 10px"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="验证码登录" name="code">
          <el-form
            :model="codeForm"
            :rules="codeRules"
            ref="codeFormRef"
            class="login-form"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="codeForm.phone"
                placeholder="请输入手机号"
                size="large"
                maxlength="11"
                @input="handleCodePhoneInput"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <div class="code-input-container">
                <el-input
                  v-model="codeForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  maxlength="6"
                  @input="handleCodeInput"
                />
                <el-button
                  type="primary"
                  size="large"
                  :disabled="codeCountdown > 0 || !isValidPhone"
                  @click="handleSendCode"
                  class="send-code-btn"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-button
              type="primary"
              @click="handleCodeLogin"
              size="large"
              style="width: 100%; margin-top: 10px"
              :loading="codeLoading"
            >
              登录
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="footer">
        <el-link type="primary" @click="router.push('/register')">没有账号？点击注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { login, sendCode, loginWithCode } from '../services/user'

const router = useRouter()
const activeTab = ref<'account' | 'code'>('account')
const loading = ref(false)
const codeLoading = ref(false)
const accountFormRef = ref<FormInstance>()
const codeFormRef = ref<FormInstance>()
const codeCountdown = ref(0)

// 表单数据
const accountForm = reactive({
  phone: '',
  password: ''
})

const codeForm = reactive({
  phone: '',
  code: ''
})

// 验证规则
const accountRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的11位手机号',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const codeRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的11位手机号',
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
}

// 计算属性：检查手机号是否有效
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(codeForm.phone)
})

// 处理手机号输入
const handlePhoneInput = () => {
  accountForm.phone = accountForm.phone.replace(/\D/g, '')
}

const handleCodePhoneInput = () => {
  codeForm.phone = codeForm.phone.replace(/\D/g, '')
}

// 处理验证码输入
const handleCodeInput = () => {
  codeForm.code = codeForm.code.replace(/\D/g, '')
}

// 发送验证码
const handleSendCode = async () => {
  if (!isValidPhone.value) {
    ElMessage.warning('请输入有效的手机号')
    return
  }

  try {
    const response = await sendCode(codeForm.phone)

    if (response.data.success) {
      ElMessage.success('验证码发送成功')
      // 开始倒计时
      codeCountdown.value = 60
      const timer = setInterval(() => {
        codeCountdown.value--
        if (codeCountdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      ElMessage.error(response.data.message || '验证码发送失败')
    }
  } catch (error) {
    console.error('发送验证码出错:', error)
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

// 定义错误类型
interface ApiError {
  code?: string;
  response?: {
    data: {
      code: number;
      message: string;
      success: boolean;
    };
  };
  message: string;
}

// 账号密码登录
const handleLogin = async () => {
  if (!accountFormRef.value) return

  try {
    await accountFormRef.value.validate()
    loading.value = true

    const response = await login({
      phone: accountForm.phone,
      password: accountForm.password
    })

    if (response.data.success) {
      ElMessage.success('登录成功')
      // 存储token和用户信息
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))

      // 跳转到仪表盘
      router.push('/dashboard')
    } else {
      if (response.data.code === 404) {
        ElMessage.warning('该手机号未注册，请先注册')
      } else if (response.data.code === 401) {
        ElMessage.error('密码错误')
      } else {
        ElMessage.error(response.data.message || '登录失败')
      }
    }
  } catch (error: unknown) {
    console.error('登录出错:', error)

    // 类型安全的错误处理
    const apiError = error as ApiError

    if (apiError.response) {
      // 服务器返回的错误
      const { data } = apiError.response
      if (data.code === 404) {
        ElMessage.warning('该手机号未注册，请先注册')
      } else if (data.code === 401) {
        ElMessage.error('密码错误')
      } else {
        ElMessage.error(data.message || '登录失败')
      }
    } else if (apiError.code === 'ERR_NETWORK') {
      ElMessage.error('网络连接失败，请检查服务器状态')
    } else {
      ElMessage.error('登录失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!codeFormRef.value) return

  try {
    await codeFormRef.value.validate()
    codeLoading.value = true

    const response = await loginWithCode({
      phone: codeForm.phone,
      code: codeForm.code
    })

    if (response.data.success) {
      ElMessage.success('登录成功')
      // 存储token和用户信息
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))

      // 跳转到仪表盘
      router.push('/dashboard')
    } else {
      if (response.data.code === 404) {
        ElMessage.warning('该手机号未注册，请先注册')
      } else if (response.data.code === 401) {
        ElMessage.error('验证码错误或已过期')
      } else {
        ElMessage.error(response.data.message || '登录失败')
      }
    }
  } catch (error: unknown) {
    console.error('验证码登录出错:', error)

    // 类型安全的错误处理
    const apiError = error as ApiError

    if (apiError.response) {
      // 服务器返回的错误
      const { data } = apiError.response
      if (data.code === 404) {
        ElMessage.warning('该手机号未注册，请先注册')
      } else if (data.code === 401) {
        ElMessage.error('验证码错误或已过期')
      } else {
        ElMessage.error(data.message || '登录失败')
      }
    } else if (apiError.code === 'ERR_NETWORK') {
      ElMessage.error('网络连接失败，请检查服务器状态')
    } else {
      ElMessage.error('登录失败，请稍后重试')
    }
  } finally {
    codeLoading.value = false
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
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #00796b;
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  margin: 0 auto;
  width: 100%;
}

.code-input-container {
  display: flex;
  gap: 10px;
}

.send-code-btn {
  min-width: 120px;
  white-space: nowrap;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.el-tabs {
  margin-bottom: 20px;
}

.el-tabs__item {
  font-size: 16px;
}

.el-input {
  margin-bottom: 15px;
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
