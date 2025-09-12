<template>
  <div class="survey-management">
    <h2 class="page-title">
      <el-icon><notebook /></el-icon>
      调查数据库管理
    </h2>

    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><plus /></el-icon>
        新增调查
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="请输入调查名称或描述"
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
      :data="surveyList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="调查名称" width="200" />
      <el-table-column prop="description" label="描述" width="300" />
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image
            :src="getImageUrl(row.image_url)"
            :preview-src-list="[getImageUrl(row.image_url)]"
            fit="cover"
            style="width: 80px; height: 60px;"
          >
            <template #error>
              <div class="image-error">
                <el-icon><picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="链接" width="200">
        <template #default="{ row }">
          <el-link :href="row.url" target="_blank" type="primary">
            {{ truncateUrl(row.url) }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="surveyForm"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="调查名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入调查名称" />
        </el-form-item>
        <el-form-item label="调查描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入调查描述"
          />
        </el-form-item>
        <el-form-item label="调查链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入调查URL" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="form.image_url" placeholder="请输入图片URL" />
          <div class="image-preview" v-if="form.image_url">
            <el-image
              :src="getImageUrl(form.image_url)"
              style="max-width: 100%; max-height: 150px;"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
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
import { Plus, Search, Notebook, } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

interface Survey {
  id: number
  title: string
  description: string
  url: string
  image_url: string
  created_at: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/surveys',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const searchKeyword = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增调查')
const surveyForm = ref()

const form = reactive({
  id: 0,
  title: '',
  description: '',
  url: '',
  image_url: ''
})

const rules = {
  title: [{ required: true, message: '请输入调查名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入调查描述', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入调查链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  image_url: [
    { type: 'url', message: '请输入有效的图片URL', trigger: 'blur' }
  ]
}

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const surveyList = ref<Survey[]>([])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

const truncateUrl = (url: string) => {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    return `${urlObj.hostname}${urlObj.pathname.length > 20 ? '...' : urlObj.pathname}`
  } catch {
    return url.length > 30 ? `${url.substring(0, 30)}...` : url
  }
}

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/${imageUrl}`
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('', {
      params: {
        page: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value
      }
    })

    if (response.data.success) {
      surveyList.value = response.data.data
      pagination.total = response.data.pagination?.total || response.data.data.length
    } else {
      throw new Error(response.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('API请求失败:', error)
    ElMessage.error(error.response?.data?.message || error.message || '获取调查数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleSizeChange = (val: number) => {
  pagination.size = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.current = val
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增调查'
  Object.assign(form, {
    id: 0,
    title: '',
    description: '',
    url: '',
    image_url: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Survey) => {
  dialogTitle.value = '编辑调查'
  Object.assign(form, {
    ...row
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await surveyForm.value.validate()
    loading.value = true

    if (form.id === 0) {
      // 新增
      const response = await api.post('/', form)
      ElMessage.success(response.data.message || '调查创建成功')
    } else {
      // 编辑
      const response = await api.put(`/${form.id}`, form)
      ElMessage.success(response.data.message || '调查更新成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    if (error.name !== 'ValidationError') {
      console.error('保存调查失败:', error)
      ElMessage.error(error.response?.data?.message || '保存调查失败')
    }
  } finally {
    loading.value = false
  }
}

const handleDelete = async (row: Survey) => {
  try {
    await ElMessageBox.confirm(`确定删除调查 "${row.title}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await api.delete(`/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除调查失败:', error)
      ElMessage.error(error.response?.data?.message || '删除调查失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.survey-management {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    display: flex;
    align-items: center;

    .el-icon {
      margin-right: 10px;
    }
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

  .image-preview {
    margin-top: 10px;

    .el-image {
      max-width: 100%;
      max-height: 150px;
      border-radius: 4px;
    }
  }

  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    color: #909399;
  }
}
</style>
