<template>
  <div class="news-management">
    <h2 class="page-title">新闻管理</h2>

    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><plus /></el-icon>
        新增新闻
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="请输入新闻标题"
        style="width: 300px; margin-left: 15px;"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <el-table
      :data="newsList"
      border
      style="width: 100%"
      v-loading="loading"
      empty-text="暂无数据"
    >
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="summary" label="摘要" min-width="250" />
      <el-table-column label="封面" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.image_url"
            :src="row.image_url"
            style="width: 80px; height: 60px"
            fit="cover"
            :preview-src-list="[row.image_url]"
          />
          <span v-else>无封面</span>
        </template>
      </el-table-column>
      <el-table-column prop="published_date" label="发布时间" width="180">
        <template #default="{ row }">
          {{ formatDisplayDate(row.published_date) }}
        </template>
      </el-table-column>
      <el-table-column label="链接" min-width="200">
        <template #default="{ row }">
          <el-link v-if="row.link" :href="row.link" target="_blank">查看详情</el-link>
          <span v-else>无链接</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
    >
      <el-form
        ref="newsForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="新闻摘要" prop="summary">
          <el-input
            v-model="form.summary"
            placeholder="请输入新闻摘要"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="新闻链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入新闻链接" />
        </el-form-item>
        <el-form-item label="新闻封面">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="form.image_url" :src="form.image_url" class="cover-image" />
            <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布时间" prop="published_date">
          <el-date-picker
            v-model="form.published_date"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios, { AxiosError, AxiosResponse } from 'axios'
import type { UploadProps, UploadFile} from 'element-plus'

// 1. 严格类型化的API配置
interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

interface News {
  id?: number
  title: string
  summary: string
  image_url: string
  link: string
  published_date: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface NewsListResponse {
  list: News[]
  pagination: Pagination
}

interface ImageUploadResponse {
  url: string
}

// 2. 严格类型化的API客户端
const api = axios.create({
  baseURL: 'http://localhost:3000', // 确保正确指向后端接口
  timeout: 15000,
  withCredentials: true,  // 确保请求中包含凭证
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});


// 3. 请求拦截器（完全类型化）
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV && !config.url?.startsWith('/api')) {
    config.url = '/api' + (config.url ? `${config.url}` : '')
  }
  return config
}, (error: unknown) => {
  return Promise.reject(error)
})

// 4. 响应拦截器（完全类型化）
api.interceptors.response.use((response: AxiosResponse<ApiResponse>) => {
  if (typeof response.data === 'string' && response.data.startsWith('<!DOCTYPE html>')) {
    throw new Error('Invalid API response: HTML content received')
  }
  return response
}, (error: AxiosError<ApiResponse>) => {
  if (error.code === 'ERR_NETWORK') {
    error.message = 'Network connection failed'
  } else if (error.response?.status === 502) {
    error.message = 'Bad Gateway'
  }
  return Promise.reject(error)
})

// 5. 组件状态（严格类型化）
const searchKeyword = ref<string>('')
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('新增新闻')
const newsForm = ref()

const form = reactive<News>({
  title: '',
  summary: '',
  image_url: '',
  link: '',
  published_date: ''
})

const rules = {
  title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入新闻摘要', trigger: 'blur' }],
  link: [
    { required: true, message: '请输入新闻链接', trigger: 'blur' },
    {
      type: 'url',
      message: '请输入有效的URL地址',
      trigger: ['blur', 'change'],
      validator: (_: unknown, value: string) => {
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      }
    }
  ],
  published_date: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
}

const pagination = reactive<{
  current: number
  size: number
  total: number
}>( {
  current: 1,
  size: 10,
  total: 0
})

const newsList = ref<News[]>([])

// 6. 核心方法（完全类型化）
const fetchData = async (): Promise<void> => {
  try {
    loading.value = true
    const response = await api.get<ApiResponse<NewsListResponse>>('/news', {
      params: {
        page: pagination.current,
        pageSize: pagination.size,
        title: searchKeyword.value
      }
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'API request failed')
    }

    if (!Array.isArray(response.data.data?.list)) {
      throw new Error('Invalid data format: missing list')
    }

    newsList.value = response.data.data.list
    pagination.total = response.data.data.pagination.total

  } catch (error: unknown) {
    handleApiError(error, '获取新闻列表失败')
    newsList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 7. 错误处理（严格类型化）
const handleApiError = (error: unknown, defaultMessage: string): void => {
  let errorMessage = defaultMessage

  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage = `Server Error: ${error.response.status} - ${error.response.data?.message || 'No details'}`
    } else if (error.request) {
      errorMessage = 'Network Error: No response received'
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  console.error(`${defaultMessage}:`, error)
  ElMessage.error(errorMessage)
}

// 8. 日期格式化（严格类型化）
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date).replace(/\//g, '-')
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

// 9. 分页和搜索（严格类型化）
const handleSizeChange = (val: number): void => {
  pagination.size = val
  pagination.current = 1
  fetchData()
}

const handleCurrentChange = (val: number): void => {
  pagination.current = val
  fetchData()
}

const handleSearch = (): void => {
  pagination.current = 1
  fetchData()
}

// 10. CRUD操作（严格类型化）
const handleAdd = (): void => {
  dialogTitle.value = '新增新闻'
  Object.assign(form, {
    id: undefined,
    title: '',
    summary: '',
    image_url: '',
    link: '',
    published_date: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: News): void => {
  dialogTitle.value = '编辑新闻'
  Object.assign(form, {
    ...row
  })
  dialogVisible.value = true
}

const handleSubmit = async (): Promise<void> => {
  try {
    await newsForm.value?.validate()

    const isEdit = !!form.id
    const method = isEdit ? 'put' : 'post'
    const url = isEdit ? `/news/${form.id}` : '/news'

    const response = await api[method]<ApiResponse<News>>(url, form)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Operation failed')
    }

    ElMessage.success(isEdit ? '新闻更新成功' : '新闻添加成功')
    dialogVisible.value = false
    fetchData()

  } catch (error: unknown) {
    handleApiError(error, '保存失败')
  }
}

const handleDelete = async (row: News): Promise<void> => {
  try {
    await ElMessageBox.confirm(`确定删除新闻 "${row.title}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await api.delete<ApiResponse>(`/news/${row.id}`)

    if (!response.data.success) {
      throw new Error(response.data.message || '删除失败')
    }

    ElMessage.success('删除成功')
    fetchData()

  } catch (error: unknown) {
    if (!axios.isAxiosError(error) || error.message !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 11. 图片上传（严格类型化）
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile: UploadFile): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const isImage = validTypes.includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('仅支持 JPG/PNG/WEBP 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleImageSuccess = (
  response: unknown,
): void => {
  if (isImageUploadResponse(response)) {
    form.image_url = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败: 无效的响应格式')
  }
}

// 12. 类型守卫
const isImageUploadResponse = (obj: unknown): obj is ApiResponse<ImageUploadResponse> => {
  return typeof obj === 'object' &&
         obj !== null &&
         'data' in obj &&
         typeof (obj as { data: unknown }).data === 'object' &&
         (obj as { data: { url?: unknown } }).data?.url !== undefined
}

// 13. 初始化
onMounted(() => {
  fetchData().catch((error: unknown) => {
    handleApiError(error, '初始化加载失败')
  })
})
</script>


<style scoped lang="scss">
.news-management {
  padding: 20px;

  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    font-weight: 500;
  }

  .toolbar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;

    &:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
