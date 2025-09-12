<template>
  <div class="edu-resource-management">
    <h2 class="page-title">
      <el-icon><notebook /></el-icon>
      教育资源管理
    </h2>

    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><plus /></el-icon>
        新增资源
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="请输入资源标题或描述"
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

      <el-select
        v-model="categoryFilter"
        placeholder="按分类筛选"
        style="width: 180px; margin-left: 15px;"
        clearable
        @change="handleSearch"
      >
        <el-option label="小学资源" value="primary" />
        <el-option label="初中资源" value="junior" />
      </el-select>
    </div>

    <el-table
      :data="resourceList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="资源标题" width="200" show-overflow-tooltip />
      <el-table-column prop="description" label="资源描述" width="300" show-overflow-tooltip />
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
      <el-table-column prop="link" label="链接" width="200">
        <template #default="{ row }">
          <el-link :href="row.link" target="_blank" type="primary">
            {{ truncateUrl(row.link) }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="120">
        <template #default="{ row }">
          <el-tag :type="row.category === 'primary' ? 'success' : 'warning'">
            {{ row.category === 'primary' ? '小学' : '初中' }}
          </el-tag>
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
        ref="resourceForm"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="资源标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源标题" />
        </el-form-item>
        <el-form-item label="资源描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入资源描述"
          />
        </el-form-item>
        <el-form-item label="资源链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入资源URL" />
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
        <el-form-item label="资源分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择资源分类">
            <el-option label="小学资源" value="primary" />
            <el-option label="初中资源" value="junior" />
          </el-select>
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
import { Plus, Search, Notebook } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

interface EduResource {
  id: number
  title: string
  image_url: string
  link: string
  category: 'primary' | 'junior'
  description: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/edu-resources',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const searchKeyword = ref('')
const categoryFilter = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增资源')
const resourceForm = ref()

const form = reactive({
  id: 0,
  title: '',
  description: '',
  link: '',
  image_url: '',
  category: 'primary' as 'primary' | 'junior'
})

const rules = {
  title: [{ required: true, message: '请输入资源标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入资源描述', trigger: 'blur' }],
  link: [
    { required: true, message: '请输入资源链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  image_url: [
    { type: 'url', message: '请输入有效的图片URL', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择资源分类', trigger: 'change' }]
}

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const resourceList = ref<EduResource[]>([])

// const formatDate = (dateString: string) => {
//   if (!dateString) return ''
//   const date = new Date(dateString)
//   return date.toLocaleDateString('zh-CN')
// }

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
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/images/${imageUrl}`
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('', {
      params: {
        page: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value,
        category: categoryFilter.value
      }
    })

    if (response.data.success) {
      resourceList.value = response.data.data
      pagination.total = response.data.pagination?.total || response.data.data.length
    } else {
      throw new Error(response.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('API请求失败:', error)
    ElMessage.error(error.response?.data?.message || error.message || '获取资源数据失败')
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
  dialogTitle.value = '新增资源'
  Object.assign(form, {
    id: 0,
    title: '',
    description: '',
    link: '',
    image_url: '',
    category: 'primary'
  })
  dialogVisible.value = true
}

const handleEdit = (row: EduResource) => {
  dialogTitle.value = '编辑资源'
  Object.assign(form, {
    ...row
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await resourceForm.value.validate()
    loading.value = true

    if (form.id === 0) {
      // 新增
      const response = await api.post('/', form)
      ElMessage.success(response.data.message || '资源创建成功')
    } else {
      // 编辑
      const response = await api.put(`/${form.id}`, form)
      ElMessage.success(response.data.message || '资源更新成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    if (error.name !== 'ValidationError') {
      console.error('保存资源失败:', error)
      ElMessage.error(error.response?.data?.message || '保存资源失败')
    }
  } finally {
    loading.value = false
  }
}

const handleDelete = async (row: EduResource) => {
  try {
    await ElMessageBox.confirm(`确定删除资源 "${row.title}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await api.delete(`/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除资源失败:', error)
      ElMessage.error(error.response?.data?.message || '删除资源失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.edu-resource-management {
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
    flex-wrap: wrap;
    gap: 15px;
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
