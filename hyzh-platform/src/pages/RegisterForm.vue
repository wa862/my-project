<template>
  <div class="register-page">
    <div class="header">
      <h1>京津冀乡村基础教育</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/news">新闻动态</router-link>
        <router-link to="/data">数据资源</router-link>
        <router-link to="/results">数据成果</router-link>
        <router-link to="/practice">实践应用</router-link>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/login">登录</router-link>
      </nav>
    </div>

    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">注册成功，即可免费试用</h2>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent="onSubmit"
        >
          <el-form-item label="单位全称" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位全称" size="large" />
          </el-form-item>

          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" placeholder="请输入您的姓名" size="large" />
          </el-form-item>

          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              maxlength="11"
              @input="handlePhoneInput"
            />
          </el-form-item>

          <!-- 地区选择 -->
          <el-form-item label="所在地" required>
            <div class="region-selectors">
              <!-- 省份选择器 -->
              <el-select
                v-model="form.province"
                placeholder="选择省"
                size="large"
                @change="onProvinceChange"
                :loading="provinceLoading"
                :disabled="provinceLoading"
                clearable
                class="region-selector"
              >
                <el-option
                  v-for="p in provinces"
                  :key="p"
                  :label="p"
                  :value="p"
                />
              </el-select>

              <!-- 城市选择器 -->
              <el-select
                v-model="form.city"
                placeholder="选择市"
                size="large"
                @change="onCityChange"
                :disabled="!form.province || cityLoading"
                :loading="cityLoading"
                clearable
                class="region-selector"
              >
                <el-option
                  v-for="c in cities"
                  :key="c"
                  :label="c"
                  :value="c"
                />
              </el-select>

              <!-- 区县选择器 -->
              <el-select
                v-model="form.district"
                placeholder="选择区/县"
                size="large"
                :disabled="!form.city || districtLoading"
                :loading="districtLoading"
                clearable
                class="region-selector"
              >
                <el-option
                  v-for="d in districts"
                  :key="d"
                  :label="d"
                  :value="d"
                />
              </el-select>
            </div>
            <p v-if="regionError" class="error-text">{{ regionError }}</p>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              size="large"
              show-password
            />
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              type="password"
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="register-button"
            @click="onSubmit"
            :loading="submitting"
          >
            注册
          </el-button>

          <div class="footer">
            <span>已注册？</span>
            <router-link to="/login" class="login-link">快速登录</router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

interface RegisterForm {
  unit: string
  contact: string
  phone: string
  password: string
  confirmPassword: string
  province: string
  city: string
  district: string
}

const router = useRouter()
const form = ref<RegisterForm>({
  unit: '',
  contact: '',
  phone: '',
  password: '',
  confirmPassword: '',
  province: '',
  city: '',
  district: ''
})
const formRef = ref<FormInstance | null>(null)

const rules: FormRules = {
  unit: [
    { required: true, message: '请输入单位全称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的手机号',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码至少8个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const submitting = ref(false)
const provinceLoading = ref(false)
const cityLoading = ref(false)
const districtLoading = ref(false)
const regionError = ref('')

const provinces = ref<string[]>([])
const cities = ref<string[]>([])
const districts = ref<string[]>([])

const loadProvinces = async () => {
  try {
    provinceLoading.value = true
    regionError.value = ''
    const response = await axios.get('http://localhost:3000/api/regions/provinces')
    if (response.data.code === 200) {
      provinces.value = response.data.data
    } else {
      regionError.value = '获取省份数据失败'
      ElMessage.error('获取省份数据失败')
    }
  } catch (error) {
    console.error('获取省份数据失败:', error)
    regionError.value = '获取省份数据失败'
    ElMessage.error('获取省份数据失败，请检查网络连接')
  } finally {
    provinceLoading.value = false
  }
}

const loadCities = async (province: string) => {
  try {
    cityLoading.value = true
    regionError.value = ''
    form.value.city = ''
    form.value.district = ''
    districts.value = []

    const response = await axios.get(
      `http://localhost:3000/api/regions/${encodeURIComponent(province)}/cities`
    )

    if (response.data.code === 200) {
      cities.value = response.data.data
    } else {
      regionError.value = '获取城市数据失败'
      ElMessage.warning(response.data.message || '获取城市数据失败')
    }
  } catch (error) {
    console.error('获取城市数据失败:', error)
    regionError.value = '获取城市数据失败'
    ElMessage.error('获取城市数据失败，请稍后重试')
  } finally {
    cityLoading.value = false
  }
}

const loadDistricts = async (province: string, city: string) => {
  try {
    districtLoading.value = true
    regionError.value = ''
    form.value.district = ''

    const response = await axios.get(
      `http://localhost:3000/api/regions/${encodeURIComponent(province)}/${encodeURIComponent(city)}/districts`
    )

    if (response.data.code === 200) {
      districts.value = response.data.data
    } else {
      regionError.value = '获取区县数据失败'
      ElMessage.warning(response.data.message || '获取区县数据失败')
    }
  } catch (error) {
    console.error('获取区县数据失败:', error)
    regionError.value = '获取区县数据失败'
    ElMessage.error('获取区县数据失败，请稍后重试')
  } finally {
    districtLoading.value = false
  }
}

const onProvinceChange = (value: string) => {
  form.value.city = ''
  form.value.district = ''
  cities.value = []
  districts.value = []
  if (value) {
    loadCities(value)
  }
}

const onCityChange = (value: string) => {
  form.value.district = ''
  districts.value = []
  if (value && form.value.province) {
    loadDistricts(form.value.province, value)
  }
}

const handlePhoneInput = () => {
  form.value.phone = form.value.phone.replace(/[^\d]/g, '')
}

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch  {
    ElMessage.warning('请完善表单信息')
    return
  }

  if (!form.value.province || !form.value.city || !form.value.district) {
    ElMessage.warning('请选择完整的地区信息')
    return
  }

  submitting.value = true
  try {
    const { data } = await axios.post('http://localhost:3000/api/register', {
      unit: form.value.unit,
      contact: form.value.contact,
      phone: form.value.phone,
      password: form.value.password,
      province: form.value.province,
      city: form.value.city,
      district: form.value.district
    })

    if (data.code === 200) {
      ElMessage.success('注册成功')
      formRef.value?.resetFields()
      router.push('/login')
    } else {
      ElMessage.error(data.message || '注册失败')
    }
  } catch (error: unknown) {
    console.error('注册失败:', error)
    const errorMessage = error.response?.data?.message || error.message || '注册失败'
    ElMessage.error(errorMessage)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProvinces()
})
</script>

<style scoped>
.register-page {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background-color: #1e88e5;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header nav {
  display: flex;
  gap: 1.5rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.3s;
}

.header nav a:hover {
  opacity: 0.8;
}

.register-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}

.register-card {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #1e88e5;
  font-size: 1.5rem;
  font-weight: 600;
}

.region-selectors {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.region-selectors .el-select {
  flex: 1;
}

.register-button {
  width: 100%;
  margin-top: 1.5rem;
  height: 3rem;
  font-size: 1rem;
}

.footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.login-link {
  color: #1e88e5;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: opacity 0.3s;
}

.login-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.el-form-item {
  margin-bottom: 1.5rem;
}

.error-text {
  color: #f56c6c;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.region-selector {
  flex: 1;
  min-width: 120px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .header nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .register-card {
    padding: 1.5rem;
  }

  .region-selectors {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
