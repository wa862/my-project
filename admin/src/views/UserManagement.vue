<template>
  <div class="user-management">
    <h2 class="page-title">用户管理</h2>

    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><plus /></el-icon>
        新增用户
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="请输入用户名或邮箱"
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
      :data="userList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="avatar" label="头像" width="80">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : ''">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
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
      width="500px"
    >
      <el-form
        ref="userForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像URL" />
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
import axios from 'axios'

interface User {
  id: number
  avatar: string
  name: string
  email: string
  role: string
  createTime: string
  status: number
}

const defaultAvatar = 'https://randomuser.me/api/portraits/lego/1.jpg'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const searchKeyword = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const userForm = ref()

const form = reactive({
  id: 0,
  name: '',
  email: '',
  role: 'user',
  avatar: defaultAvatar,
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const userList = ref<User[]>([])

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

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.get('', {
      params: {
        page: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value
      }
    });

    if (response.data.success) {
      userList.value = response.data.data;
      pagination.total = response.data.pagination.total;
    } else {
      throw new Error(response.data.message || '获取数据失败');
    }
  } catch (error) {
    console.error('API请求失败:', error);
    ElMessage.error(error.response?.data?.message || error.message || '获取用户数据失败');

    // 调试信息
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', error.response.data);
    }
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  fetchData();
}

const handleSizeChange = (val: number) => {
  pagination.size = val;
  fetchData();
}

const handleCurrentChange = (val: number) => {
  pagination.current = val;
  fetchData();
}

const handleAdd = () => {
  dialogTitle.value = '新增用户';
  Object.assign(form, {
    id: 0,
    name: '',
    email: '',
    role: 'user',
    avatar: defaultAvatar,
    status: 1
  });
  dialogVisible.value = true;
}

const handleEdit = (row: User) => {
  dialogTitle.value = '编辑用户';
  Object.assign(form, {
    ...row,
    status: Number(row.status)
  });
  dialogVisible.value = true;
}

const handleSubmit = async () => {
  try {
    await userForm.value.validate();
    loading.value = true;

    if (form.id === 0) {
      const response = await api.post('/', {
        name: form.name,
        email: form.email,
        role: form.role,
        avatar: form.avatar
      });
      ElMessage.success(response.data.message || '用户创建成功');
    } else {
      const response = await api.put(`/${form.id}`, {
        name: form.name,
        email: form.email,
        role: form.role,
        avatar: form.avatar,
        status: form.status
      });
      ElMessage.success(response.data.message || '用户更新成功');
    }

    dialogVisible.value = false;
    fetchData();
  } catch (error: unknown) {
    if (error.name !== 'ValidationError') {
      console.error('保存用户失败:', error);
      ElMessage.error(error.response?.data?.message || '保存用户失败');
    }
  } finally {
    loading.value = false;
  }
};

const handleStatusChange = async (row: User) => {
  const originalStatus = row.status;

  try {
    // 乐观更新
    row.status = row.status === 1 ? 0 : 1;

    // 发送请求 - 确保路径正确
    const response = await api.patch(`/${row.id}/status`, {
      status: row.status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 检查响应是否成功
    if (!response.data.success) {
      throw new Error(response.data.message || '状态更新失败');
    }

    ElMessage.success(response.data.message);

  } catch (error: unknown) {
    // 出错时恢复状态
    row.status = originalStatus;

    // 详细错误处理
    if (error.response) {
      // 请求已发出，服务器响应状态码非2xx
      console.error('错误响应:', error.response.data);
      ElMessage.error(error.response.data?.message || '状态更新失败');
    } else if (error.request) {
      // 请求已发出但没有响应
      console.error('无响应:', error.request);
      ElMessage.error('网络错误，请检查连接或API是否可用');
    } else {
      // 请求未发出
      console.error('请求错误:', error.message);
      ElMessage.error('请求配置错误: ' + error.message);
    }

    // 调试信息
    console.group('状态更新错误详情');
    console.log('请求配置:', error.config);
    console.log('请求数据:', { id: row.id, status: row.status });
    console.groupEnd();
  }
};

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(`确定删除用户 "${row.name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await api.delete(`/${row.id}`);
    ElMessage.success('删除成功');
    fetchData();
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error);
      ElMessage.error(error.response?.data?.message || '删除用户失败');
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
/* 保持原有样式不变 */
</style>

<style scoped lang="scss">
.user-management {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
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
}
</style>
