<template>
  <div class="platform-management">
    <h2 class="page-title">
      <el-icon><briefcase /></el-icon>
      企业平台管理
    </h2>

    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><plus /></el-icon>
        新增平台
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="请输入平台名称或描述"
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
        placeholder="按类别筛选"
        style="width: 180px; margin-left: 15px;"
        clearable
        @change="handleSearch"
      >
        <el-option label="研究平台" value="research" />
        <el-option label="分析平台" value="analytics" />
        <el-option label="商业平台" value="business" />
      </el-select>

      <el-select
        v-model="verifiedFilter"
        placeholder="认证状态"
        style="width: 120px; margin-left: 15px;"
        clearable
        @change="handleSearch"
      >
        <el-option label="已认证" :value="true" />
        <el-option label="未认证" :value="false" />
      </el-select>
    </div>

    <el-table
      :data="platformList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="平台名称" width="180" />
      <el-table-column prop="description" label="描述" width="300" show-overflow-tooltip />
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
      <el-table-column prop="category" label="类别" width="120">
        <template #default="{ row }">
          <el-tag :type="getCategoryTagType(row.category)">
            {{ getCategoryName(row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_verified" label="认证状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.is_verified ? 'success' : 'info'">
            {{ row.is_verified ? '已认证' : '未认证' }}
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
        ref="platformForm"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="平台名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="平台描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入平台描述"
          />
        </el-form-item>
        <el-form-item label="平台链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入平台URL" />
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
        <el-form-item label="平台类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择平台类别">
            <el-option label="研究平台" value="research" />
            <el-option label="分析平台" value="analytics" />
            <el-option label="商业平台" value="business" />
          </el-select>
        </el-form-item>
        <el-form-item label="认证状态">
          <el-switch
            v-model="form.is_verified"
            active-text="已认证"
            inactive-text="未认证"
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
import { Plus, Search, Briefcase,  } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

interface Platform {
  id: number
  title: string
  description: string
  url: string
  image_url: string
  category: string
  is_verified: boolean
  created_at?: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/enterprise-platforms',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const searchKeyword = ref('')
const categoryFilter = ref('')
const verifiedFilter = ref<boolean | null>(null)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增平台')
const platformForm = ref()

const form = reactive({
  id: 0,
  title: '',
  description: '',
  url: '',
  image_url: '',
  category: 'research',
  is_verified: true
})

const rules = {
  title: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入平台描述', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入平台链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  image_url: [
    { type: 'url', message: '请输入有效的图片URL', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择平台类别', trigger: 'change' }]
}

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const platformList = ref<Platform[]>([])

const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    research: '研究平台',
    analytics: '分析平台',
    business: '商业平台'
  }
  return map[category] || category
}

const getCategoryTagType = (category: string) => {
  const map: Record<string, string> = {
    research: 'success',
    analytics: 'warning',
    business: 'danger'
  }
  return map[category] || ''
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
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
const currentDate = formatDate(new Date().toISOString())
console.log(currentDate)

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
        category: categoryFilter.value,
        is_verified: verifiedFilter.value
      }
    })

    if (response.data.success) {
      platformList.value = response.data.data
      pagination.total = response.data.pagination?.total || response.data.data.length
    } else {
      throw new Error(response.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('API请求失败:', error)
    ElMessage.error(error.response?.data?.message || error.message || '获取平台数据失败')
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
  dialogTitle.value = '新增平台'
  Object.assign(form, {
    id: 0,
    title: '',
    description: '',
    url: '',
    image_url: '',
    category: 'research',
    is_verified: true
  })
  dialogVisible.value = true
}

const handleEdit = (row: Platform) => {
  dialogTitle.value = '编辑平台'
  Object.assign(form, {
    ...row
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await platformForm.value.validate();
    loading.value = true;

    // 构建符合表结构的请求数据（移除is_verified）
    const payload = {
      title: form.title,
      description: form.description,
      url: form.url,
      image_url: form.image_url,
      category: form.category
    };

    if (form.id === 0) {
      // 新增逻辑
      const response = await api.post('/', payload);
      ElMessage.success(response.data.message || '平台创建成功');
    } else {
      // 编辑逻辑
      const response = await api.put(`/${form.id}`, payload);
      ElMessage.success(response.data.message || '平台更新成功');
    }

    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    if (error.name !== 'ValidationError') {
      console.error('保存平台失败:', error);
      ElMessage.error(error.response?.data?.message || '保存平台失败');
    }
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (row: Platform) => {
  try {
    await ElMessageBox.confirm(`确定删除平台 "${row.title}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await api.delete(`/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除平台失败:', error)
      ElMessage.error(error.response?.data?.message || '删除平台失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.platform-management {
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
