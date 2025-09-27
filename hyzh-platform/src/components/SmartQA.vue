<template>
  <div class="qa-container">
    <div class="qa-header">
      <h2>INTELLIGENT Q&A</h2>
      <h3>智能问答</h3>
    </div>

    <div class="qa-content">
      <!-- 问题列表 -->
      <div class="questions-list">
        <div class="filter-bar">
          <el-select v-model="selectedType" placeholder="全部" class="filter-select">
            <el-option label="全部" value="all" />
            <el-option label="教务问题" value="education" />
            <el-option label="系统问题" value="system" />
            <el-option label="数据问题" value="data" />
          </el-select>

          <el-input
            v-model="searchKeyword"
            placeholder="搜索咨询信息"
            class="search-input"
            prefix-icon="el-icon-search"
          />
        </div>

        <!-- 问题卡片 -->
        <div class="question-card" v-for="(question, index) in filteredQuestions" :key="index">
          <div class="question-header">
            <h4 class="question-title">{{ question.title }}</h4>
            <span class="question-type">{{ question.type }}</span>
          </div>

          <div class="question-content">
            <p class="question-text">{{ question.question }}</p>
          </div>

          <div class="answer-section" v-if="question.answer">
            <div class="answer-label">回复内容:</div>
            <p class="answer-text">{{ question.answer }}</p>
          </div>

          <div class="question-footer">
            <div class="question-info">
              <span class="questioner">{{ question.questioner }}</span>
              <span class="question-time">{{ formatDate(question.time) }}</span>
            </div>
            <div class="answer-info" v-if="question.answer">
              <span class="answerer">回复人：{{ question.answerer }}</span>
              <span class="answer-time">{{ question.answerTime }}</span>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="loading-more" v-if="loading">加载更多内容...</div>
      </div>

      <!-- 添加问题按钮 -->
      <div class="add-question-btn" @click="showAddQuestionModal = true">
        <el-icon size="20"><Plus /></el-icon>
      </div>
    </div>

    <!-- 添加问题弹窗 -->
    <el-dialog
      v-model="showAddQuestionModal"
      title="提出问题"
      width="500px"
    >
      <el-form :model="newQuestion" :rules="questionRules" ref="questionFormRef">
        <el-form-item label="问题类型" prop="type">
          <el-select v-model="newQuestion.type" placeholder="请选择问题类型">
            <el-option label="教务问题" value="教务问题" />
            <el-option label="系统问题" value="系统问题" />
            <el-option label="数据问题" value="数据问题" />
          </el-select>
        </el-form-item>

        <el-form-item label="问题标题" prop="title">
          <el-input v-model="newQuestion.title" placeholder="请输入问题标题" />
        </el-form-item>

        <el-form-item label="问题内容" prop="question">
          <el-input
            v-model="newQuestion.question"
            type="textarea"
            placeholder="请详细描述您的问题"
            rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddQuestionModal = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitQuestion">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 问题数据类型
interface Question {
  id: number
  title: string
  question: string
  type: string
  questioner: string
  time: string
  answer?: string
  answerer?: string
  answerTime?: string
}

// 模拟问题数据
const questions = ref<Question[]>([
  {
    id: 1,
    title: '期末成绩',
    question: '上学期的成绩出了问题，暑假的时候联系了任课老师不给解决，怎么办？',
    type: '教务问题',
    questioner: '郝心瑜',
    time: '2025-09-24 20:27',
    answer: '每学期开学第一周可以对上学学期的成绩提出复核申请，相关领导审核通过后学院会安排老师进行成绩复核，复核申请需要填写申请表并提交相关证明材料。',
    answerer: '刘兴华 201340301',
    answerTime: '2025-09-25 16:10'
  },
  {
    id: 2,
    title: '成绩复核',
    question: '发现上学期的成绩有问题，我们专业最少有三个人出现了同样的问题，今天才得知有一个同学复核成功了，现在可以复核吗',
    type: '教务问题',
    questioner: '郝心瑜',
    time: '2025-09-24 20:22',
    answer: '每学期开学第一周可以对上学学期的成绩提出复核申请，相关领导审核通过后学院会安排老师进行成绩复核，复核申请需要填写申请表并提交相关证明材料。',
    answerer: '刘兴华 201340301',
    answerTime: '2025-09-25 16:10'
  },
  {
    id: 3,
    title: '转专业',
    question: '汉语言文学是否可以转入会计学？第一学期末通知开数学仅第二学期选修是否有影响',
    type: '教务问题',
    questioner: '张同学',
    time: '2025-09-23 15:45'
  },
  {
    id: 4,
    title: '数据库无法访问',
    question: '京津冀乡村基础教育数据库最近无法正常访问，总是提示连接超时，请问是什么原因？',
    type: '系统问题',
    questioner: '李老师',
    time: '2025-09-22 09:18'
  },
  {
    id: 5,
    title: '数据导出格式',
    question: '请问平台支持将数据导出为哪些格式？是否支持Excel和CSV格式？',
    type: '数据问题',
    questioner: '王研究员',
    time: '2025-09-21 14:30'
  }
])

// 状态管理
const selectedType = ref('all')
const searchKeyword = ref('')
const loading = ref(false)
const showAddQuestionModal = ref(false)
const questionFormRef = ref<FormInstance>()

// 新问题表单数据
const newQuestion = ref({
  title: '',
  question: '',
  type: ''
})

// 表单验证规则
const questionRules = {
  title: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 5, message: '标题至少5个字符', trigger: 'blur' }
  ],
  question: [
    { required: true, message: '请输入问题内容', trigger: 'blur' },
    { min: 10, message: '问题描述至少10个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择问题类型', trigger: 'change' }
  ]
}

// 根据筛选条件过滤问题
const filteredQuestions = computed(() => {
  let filtered = [...questions.value]

  // 按类型筛选
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(q => q.type === selectedType.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(q =>
      q.title.toLowerCase().includes(keyword) ||
      q.question.toLowerCase().includes(keyword) ||
      (q.answer && q.answer.toLowerCase().includes(keyword))
    )
  }

  return filtered
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 提交新问题
const handleSubmitQuestion = async () => {
  if (!questionFormRef.value) return

  try {
    await questionFormRef.value.validate()

    // 添加新问题到列表
    const newQ: Question = {
      id: questions.value.length + 1,
      title: newQuestion.value.title,
      question: newQuestion.value.question,
      type: newQuestion.value.type,
      questioner: '当前用户', // 实际项目中应从登录信息获取
      time: new Date().toLocaleString('zh-CN')
    }

    questions.value.unshift(newQ)

    // 重置表单
    newQuestion.value = {
      title: '',
      question: '',
      type: ''
    }

    // 关闭弹窗
    showAddQuestionModal.value = false

    ElMessage.success('问题提交成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 显式导出组件以解决默认导出问题
defineExpose({})
</script>

<style scoped>
.qa-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qa-header {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 20px;
  text-align: center;
}

.qa-header h2 {
  color: #00796b;
  font-size: 18px;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.qa-header h3 {
  color: #004d40;
  font-size: 22px;
  margin: 0;
  font-weight: 600;
}

.qa-content {
  position: relative;
  padding: 20px;
  height: 550px;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.filter-select {
  width: 120px;
}

.search-input {
  flex: 1;
}

.questions-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.question-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a237e;
  margin: 0;
  flex: 1;
  margin-right: 10px;
}

.question-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.question-content {
  margin-bottom: 10px;
}

.question-text {
  color: #333;
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
}

.answer-section {
  background: #e8f5e9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.answer-label {
  color: #2e7d32;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 6px;
}

.answer-text {
  color: #333;
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.question-info,
.answer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-question-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #1976d2;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
  z-index: 10;
}

.add-question-btn:hover {
  background: #1565c0;
  transform: scale(1.1);
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #888;
}

/* 自定义滚动条样式 */
.questions-list::-webkit-scrollbar {
  width: 8px;
}

.questions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.questions-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.questions-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
