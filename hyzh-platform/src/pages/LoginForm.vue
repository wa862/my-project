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
                @input="handlePhoneInput"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <div class="code-input-container">
                <el-input
                  v-model="codeForm.code"
                  placeholder="验证码"
                  size="large"
                  style="flex: 1"
                />
                <el-button
                  @click="handleSendCode"
                  :disabled="countdown > 0"
                  size="large"
                  style="margin-left: 10px"
                >
                  {{ countdown > 0 ? countdown + '秒后重试' : '发送验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-button
              type="primary"
              @click="handleCodeLogin"
              size="large"
              style="width: 100%; margin-top: 10px"
              :loading="loading"
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { login, sendCode, loginWithCode } from '../services/user'

const router = useRouter()
const activeTab = ref<'account' | 'code'>('account')
const loading = ref(false)
const accountFormRef = ref<FormInstance>()
const codeFormRef = ref<FormInstance>()

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
    { min: 8, message: '密码长度至少8位', trigger: 'blur' }
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
    { len: 6, message: '验证码必须为6位', trigger: 'blur' }
  ]
}

const countdown = ref(0)
let timer: number

// 处理手机号输入
const handlePhoneInput = () => {
  accountForm.phone = accountForm.phone.replace(/\D/g, '')
  codeForm.phone = codeForm.phone.replace(/\D/g, '')
}

// 账号密码登录
const handleLogin = async () => {
  if (!accountFormRef.value) return

  try {
    // 验证表单
    await accountFormRef.value.validate()
    loading.value = true

    // 执行登录，使用手机号作为username
    const response = await login({
      username: accountForm.phone,
      password: accountForm.password
    })

    if (response.data.success) {
      ElMessage.success('登录成功')
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
      router.push('/dashboard')
    } else {
      ElMessage.error(response.data.message || '登录失败')
    }
  } catch (error: unknown) {
    console.error('登录出错:', error)
    if (error.response) {
      // 根据响应状态判断具体错误类型
      switch (error.response.status) {
        case 404:
          ElMessage.warning('该手机号未注册，请先注册')
          break
        case 401:
          ElMessage.error('密码错误')
          break
        default:
          ElMessage.error(error.response.data?.message || '登录失败')
      }
    } else {
      ElMessage.error('网络错误，请检查连接')
    }
  } finally {
    loading.value = false
  }
}

// 发送验证码
const handleSendCode = async () => {
  if (!codeFormRef.value) return

  try {
    // 验证手机号字段
    await codeFormRef.value.validateField('phone')

    // 发送验证码
    const response = await sendCode(codeForm.phone)

    if (response.data.success) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(response.data.message || '验证码发送失败')
    }
  } catch (error: unknown) {
    console.error('发送验证码出错:', error)
    if (error.response && error.response.status === 404) {
      ElMessage.warning('该手机号未注册，请先注册')
    } else {
      ElMessage.error(error.response?.data?.message || '验证码发送失败')
    }
  }
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!codeFormRef.value) return

  try {
    // 验证整个表单
    await codeFormRef.value.validate()
    loading.value = true

    const response = await loginWithCode({
      phone: codeForm.phone,
      code: codeForm.code
    })

    if (response.data.success) {
      ElMessage.success('登录成功')
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
      router.push('/dashboard')
    } else {
      ElMessage.error(response.data.message || '登录失败')
    }
  } catch (error: unknown) {
    console.error('验证码登录出错:', error)
    if (error.response) {
      if (error.response.status === 404) {
        ElMessage.warning('该手机号未注册，请先注册')
      } else if (error.response.status === 400) {
        ElMessage.error('验证码错误或已过期')
      } else {
        ElMessage.error(error.response.data?.message || '验证码登录失败')
      }
    } else {
      ElMessage.error('网络错误，请检查连接')
    }
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
/* 保持原有的样式不变 */
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
  align-items: center;
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
