<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="login-header">
        <h2 class="login-title">京津冀数智评估平台 后台管理系统</h2>
        <div class="login-subtitle">管理员登录</div>
      </div>

      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        class="admin-login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入管理员账号"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>

        <!-- <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              placeholder="验证码"
              size="large"
              style="flex: 1"
              prefix-icon="Key"
            />
            <img
              :src="captchaImage"
              class="captcha-image"
              @click="refreshCaptcha"
              alt="验证码"
            />
          </div>
        </el-form-item> -->

        <el-button
          type="primary"
          @click="handleLogin"
          size="large"
          :loading="loading"
          style="width: 100%; margin-top: 10px"
        >
          登录
        </el-button>
      </el-form>

      <div class="login-footer">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <el-link type="primary" @click="showForgetDialog">忘记密码?</el-link>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog v-model="forgetDialogVisible" title="找回密码" width="30%">
      <span>请联系系统管理员重置密码</span>
      <template #footer>
        <el-button @click="forgetDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)
const forgetDialogVisible = ref(false)
const captchaImage = ref('')

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

// 验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在4到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '长度在8到20个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码必须为4位', trigger: 'blur' }
  ]
}

// 初始化验证码
const refreshCaptcha = () => {
  captchaImage.value = `http://localhost:3000/api/captcha?t=${Date.now()}`
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    const response = await axios.post('http://localhost:3000/api/admin/login', {
      ...loginForm,
      remember: rememberMe.value
    })

    if (response.data.success) {
      ElMessage.success('登录成功')
      localStorage.setItem('adminToken', response.data.token)
      localStorage.setItem('adminInfo', JSON.stringify(response.data.admin))
      router.push('/admin/dashboard')
    } else {
      ElMessage.error(response.data.message || '登录失败')
      refreshCaptcha()
    }
  } catch (error:unknown) {
    console.error('登录出错:', error)
    if (error.response?.status === 401) {
      ElMessage.error('账号或密码错误')
    } else {
      ElMessage.error(error.response?.data?.message || '登录失败')
    }
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

// 显示忘记密码对话框
const showForgetDialog = () => {
  forgetDialogVisible.value = true
}

onMounted(() => {
  refreshCaptcha()

  // 检查是否有记住的账号
  const rememberedUsername = localStorage.getItem('rememberedAdmin')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }
})
</script>

<style scoped lang="scss">
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('@/assets/images/admin-bg.jpg') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.admin-login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
}

.admin-login-form {
  margin-top: 20px;

  :deep(.el-input__wrapper) {
    padding-left: 40px;
  }

  :deep(.el-input__prefix) {
    left: 12px;
  }
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;

  .captcha-image {
    width: 100px;
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
}
</style>
