<template>
  <div class="smart-qa-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1>智能问答</h1>
      <p>获取关于乡村基础教育的专业解答</p>
    </div>

    <!-- API配置区域 -->
    <div class="api-config-section" v-if="!hasApiKey">
      <el-card class="api-config-card">
        <template #header>
          <div class="card-header">
            <span>智谱AI API配置</span>
          </div>
        </template>
        <div class="api-config-content">
          <p class="config-tips">
            请先配置智谱AI的API Key以使用智能问答功能。您可以从
            <a href="https://bigmodel.cn/usercenter/apikeys" target="_blank">智谱AI官网</a>
            获取API Key。
          </p>
          <el-form ref="apiFormRef" :model="apiConfig" :rules="apiRules" inline>
            <el-form-item label="API Key" prop="apiKey" class="api-key-input">
              <el-input
                v-model="apiConfig.apiKey"
                placeholder="请输入您的智谱AI API Key"
                show-password
                maxlength="100"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveApiKey">保存配置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 问答内容区域 -->
    <div class="qa-container">
      <!-- 左侧筛选栏 -->
      <div class="filter-sidebar">
        <div class="filter-section">
          <h3>问题分类</h3>
          <div class="filter-options">
            <label class="filter-option" v-for="category in categories" :key="category.value">
              <input type="checkbox" :value="category.value" v-model="selectedCategories" />
              <span>{{ category.label }}</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h3>热门标签</h3>
          <div class="tags">
            <span class="tag" v-for="tag in tags" :key="tag" @click="toggleTag(tag)">
              {{ tag }}
              <span v-if="selectedTags.includes(tag)" class="selected-tag">✓</span>
            </span>
          </div>
        </div>

        <div class="filter-section">
          <h3>问题状态</h3>
          <div class="filter-options">
            <label class="filter-option">
              <input type="radio" name="status" value="all" v-model="selectedStatus" />
              <span>全部</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status" value="answered" v-model="selectedStatus" />
              <span>已回答</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status" value="unanswered" v-model="selectedStatus" />
              <span>待回答</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 右侧问答列表 -->
      <div class="questions-container">
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索问题..."
            class="search-input"
            prefix-icon="Search"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 问题列表 -->
        <div class="questions-list">
          <div v-if="filteredQuestions.length === 0" class="no-questions">
            <p>暂无匹配的问题</p>
          </div>
          <div
            v-else
            v-for="question in filteredQuestions"
            :key="question.id"
            class="question-card"
          >
            <div class="question-header">
              <h3 class="question-title">{{ question.title }}</h3>
              <span class="question-type">{{ question.type }}</span>
            </div>
            <div class="question-content">
              <p class="question-text">{{ question.question }}</p>
            </div>
            <div v-if="question.isProcessing" class="processing-section">
              <el-row type="flex" justify="center" align="middle" style="height: 100px;">
                <el-col :span="24" style="text-align: center;">
                  <el-icon style="margin-right: 8px;">
                    <Loading />
                  </el-icon>
                  <span>AI正在生成回答，请稍候...</span>
                </el-col>
              </el-row>
            </div>
            <div v-else-if="question.answer" class="answer-section">
              <div class="answer-label">智能回答：</div>
              <p class="answer-text">{{ question.answer }}</p>
            </div>
            <div v-else class="unanswered-section">
              <p class="unanswered-text">等待智能回答...</p>
              <div class="get-answer-btn-wrapper" v-if="hasApiKey">
                <el-button type="primary" size="small" @click="getAIAnswer(question)">
                  获取AI回答
                </el-button>
              </div>
            </div>
            <div class="question-footer">
              <div class="question-info">
                <span class="questioner">提问者：{{ question.questioner }}</span>
                <span class="time">时间：{{ question.time }}</span>
              </div>
              <div class="question-actions">
                <button class="action-btn like-btn" @click="handleLike(question.id)">
                    <el-icon v-if="question.liked"><StarFilled /></el-icon>
                    <el-icon v-else><Star /></el-icon>
                    {{ question.likes }}
                  </button>
                <button class="action-btn comment-btn">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ question.comments }}
                </button>
                <button class="action-btn share-btn">
                  <el-icon><Share /></el-icon>
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加问题按钮 -->
        <button class="add-question-btn" @click="showAddQuestionModal = true">
          <el-icon><Plus /></el-icon>
        </button>
      </div>
    </div>

    <!-- 添加问题弹窗 -->
    <el-dialog
      v-model="showAddQuestionModal"
      title="添加新问题"
      width="600px"
      :before-close="handleCloseAddQuestion"
    >
      <el-form
        ref="questionFormRef"
        :model="newQuestion"
        :rules="questionRules"
        label-width="80px"
      >
        <el-form-item label="问题标题" prop="title">
          <el-input
            v-model="newQuestion.title"
            placeholder="请输入问题标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="问题分类" prop="type">
          <el-select v-model="newQuestion.type" placeholder="请选择问题分类">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="question">
          <el-input
            v-model="newQuestion.question"
            type="textarea"
            rows="4"
            placeholder="请详细描述您的问题"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseAddQuestion">取消</el-button>
          <el-button type="primary" @click="handleSubmitQuestion">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElDialog } from 'element-plus'
import {  Star, StarFilled, ChatDotRound, Share, Plus, Loading } from '@element-plus/icons-vue'

// 定义问题接口
interface Question {
  id: number
  title: string
  question: string
  type: string
  questioner: string
  time: string
  likes: number
  comments: number
  liked: boolean
  answer?: string
  isProcessing?: boolean
}

// 定义分类接口
interface Category {
  label: string
  value: string
}

// 问题分类
const categories: Category[] = [
  { label: '教育政策', value: 'education-policy' },
  { label: '教学方法', value: 'teaching-methods' },
  { label: '教师发展', value: 'teacher-development' },
  { label: '学生成长', value: 'student-growth' },
  { label: '资源共享', value: 'resource-sharing' },
  { label: '数字化应用', value: 'digital-application' }
]

// 热门标签
const tags = ['乡村教师', '教育公平', '数字化转型', '师资力量', '留守儿童', '教学质量', '教育资源']

// 模拟问题数据
const questions = ref<Question[]>([
  {
    id: 1,
    title: '乡村教师如何提升教学质量？',
    question: '作为一名乡村教师，面对教学资源匮乏和学生基础薄弱的情况，应该如何有效提升教学质量？',
    type: 'teaching-methods',
    questioner: '乡村教师小李',
    time: '2023-10-15 10:30',
    likes: 25,
    comments: 12,
    liked: false,
    answer: '提升乡村教学质量可以从以下几个方面入手：1. 充分利用数字化教学资源，如国家中小学智慧教育平台提供的优质课程；2. 建立跨地区教师协作网络，共享教学经验；3. 根据学生实际情况设计差异化教学方案；4. 加强与家长的沟通合作，形成教育合力；5. 积极参与教师培训，不断提升自身专业素养。'
  },
  {
    id: 2,
    title: '如何解决乡村留守儿童的教育问题？',
    question: '我校有很多留守儿童，他们在学习和心理方面存在一些问题，应该如何有效解决？',
    type: 'student-growth',
    questioner: '张校长',
    time: '2023-10-10 14:15',
    likes: 38,
    comments: 20,
    liked: true,
    answer: '解决留守儿童教育问题需要多方合作：1. 学校建立留守儿童档案，定期跟踪关注；2. 开展心理辅导课程，帮助学生建立自信；3. 组织丰富的课余活动，减少孤独感；4. 利用信息化手段，促进留守儿童与外出务工父母的沟通；5. 争取社会力量支持，建立关爱基金；6. 教师要给予更多的关爱和关注，成为学生的心灵守护者。'
  },
  {
    id: 3,
    title: '乡村学校如何有效利用数字化教学资源？',
    question: '我校刚刚配备了多媒体教学设备，但教师使用效率不高，如何更好地利用这些资源提升教学效果？',
    type: 'digital-application',
    questioner: '王老师',
    time: '2023-10-05 09:45',
    likes: 18,
    comments: 8,
    liked: false
  },
  {
    id: 4,
    title: '最新的乡村教育支持政策有哪些？',
    question: '最近国家出台了哪些支持乡村教育发展的新政策？对我们乡村学校有什么具体帮助？',
    type: 'education-policy',
    questioner: '李主任',
    time: '2023-09-28 16:20',
    likes: 42,
    comments: 15,
    liked: false,
    answer: '近年来国家出台的乡村教育支持政策主要包括：1. 乡村教师支持计划（2021-2035年），提高乡村教师待遇，改善工作生活条件；2. 数字乡村战略，推动优质教育资源向乡村覆盖；3. 乡村振兴促进法，将教育作为振兴乡村的重要内容；4. 中央财政加大乡村教育的转移支付力度；5. 实施"强师计划"，加强乡村教师队伍建设；6. 推进"互联网+教育"，促进城乡教育资源均衡配置。'
  },
  {
    id: 5,
    title: '乡村学校如何开展家校共育？',
    question: '由于家长文化程度不高，对孩子教育重视不够，我们应该如何有效开展家校共育工作？',
    type: 'student-growth',
    questioner: '赵老师',
    time: '2023-09-20 11:10',
    likes: 22,
    comments: 9,
    liked: false
  }
])

// 响应式数据
const searchKeyword = ref('')
const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])
const selectedStatus = ref('all')
const showAddQuestionModal = ref(false)
const newQuestion = ref({
  title: '',
  question: '',
  type: ''
})
const questionFormRef = ref<InstanceType<typeof ElForm>>()
const hasApiKey = ref(true) // 始终为true，因为API Key已内置
const questionRules = {
  title: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择问题分类', trigger: 'change' }
  ],
  question: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, max: 1000, message: '问题描述长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 过滤后的问题列表
const filteredQuestions = computed(() => {
  return questions.value.filter(question => {
    // 搜索关键词过滤
    const matchesSearch = searchKeyword.value === '' ||
      question.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      question.question.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      (question.answer && question.answer.toLowerCase().includes(searchKeyword.value.toLowerCase()));

    // 分类过滤
    const matchesCategory = selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(question.type);

    // 状态过滤
    const matchesStatus = selectedStatus.value === 'all' ||
      (selectedStatus.value === 'answered' && question.answer) ||
      (selectedStatus.value === 'unanswered' && !question.answer);

    // 标签过滤 - 这里简化处理，实际项目中应该有标签字段
    const matchesTag = selectedTags.value.length === 0 ||
      selectedTags.value.some(tag =>
        question.title.includes(tag) ||
        question.question.includes(tag) ||
        (question.answer && question.answer.includes(tag))
      );

    return matchesSearch && matchesCategory && matchesStatus && matchesTag;
  });
});

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
  nextTick(() => {
    // 滚动到问题列表顶部
    const questionsList = document.querySelector('.questions-list')
    if (questionsList) {
      questionsList.scrollTop = 0
    }
  })
}

// 点赞处理
const handleLike = (id: number) => {
  const question = questions.value.find(q => q.id === id)
  if (question) {
    if (question.liked) {
      question.likes--
    } else {
      question.likes++
    }
    question.liked = !question.liked
    ElMessage.success(question.liked ? '点赞成功' : '取消点赞')
  }
}

// 关闭添加问题弹窗
const handleCloseAddQuestion = () => {
  showAddQuestionModal.value = false
  // 重置表单
  if (questionFormRef.value) {
    questionFormRef.value.resetFields()
  }
}

// 调用智谱AI API获取答案
const getAIAnswer = async (question: Question) => {
  // 直接使用内置的API Key
  const apiKey = '030afcb2f1a94e17bb3e2938459bf695.swY4d61X9Q9HeXA9'

  // 设置问题为处理中状态
  question.isProcessing = true

  try {
    // 调用智谱AI的API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash', // 使用GLM-4-Flash模型
        messages: [
          {
            role: 'system',
            content: '你是一个乡村基础教育专家，需要回答用户关于乡村教育的各种问题。请用简洁明了的语言回答问题，提供实用的建议和解决方案。'
          },
          {
            role: 'user',
            content: `问题标题：${question.title} 问题描述：${question.question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`)
    }

    const data = await response.json()
    // 设置AI回答
    question.answer = data.choices?.[0]?.message?.content || '抱歉，未能生成回答'
  } catch (error) {
    console.error('获取AI回答失败:', error)
    question.answer = '获取AI回答失败，请稍后再试'
    ElMessage.error('获取AI回答失败')
  } finally {
    question.isProcessing = false
  }
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
      time: new Date().toLocaleString('zh-CN'),
      likes: 0,
      comments: 0,
      liked: false
    }

    questions.value.unshift(newQ)

    // 自动获取AI回答
    await getAIAnswer(newQ)

    // 关闭弹窗
    handleCloseAddQuestion()
    ElMessage.success('问题提交成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 导出组件
defineExpose({})
</script>

<style scoped>
.smart-qa-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.api-config-section {
  max-width: 1400px;
  margin: 0 auto 30px;
}

.api-config-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.api-config-content {
  text-align: center;
}

.config-tips {
  margin-bottom: 20px;
  color: #666;
}

.api-key-input {
  width: 400px;
}

@media (max-width: 768px) {
  .api-key-input {
    width: 100%;
    margin-bottom: 10px;
  }
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #1a237e;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

.qa-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.filter-sidebar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 80px;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e3f2fd;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.filter-option:hover {
  background-color: #f5f5f5;
}

.filter-option input[type="checkbox"],
.filter-option input[type="radio"] {
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #1976d2;
  color: white;
}

.selected-tag {
  margin-left: 5px;
  font-weight: bold;
}

.questions-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  position: relative;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
}

.questions-list {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 10px;
}

.no-questions {
  text-align: center;
  padding: 40px;
  color: #888;
}

.question-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left-color: #1976d2;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.question-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a237e;
  margin: 0;
  flex: 1;
  margin-right: 10px;
}

.question-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.question-content {
  margin-bottom: 15px;
}

.question-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
  font-size: 15px;
}

.answer-section {
  background: #e8f5e9;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.answer-label {
  color: #2e7d32;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
}

.answer-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
  font-size: 15px;
}

.processing-section {
  background: #e3f2fd;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 15px;
  color: #1976d2;
}

.unanswered-section {
  background: #fff3e0;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.get-answer-btn-wrapper {
  margin-top: 10px;
  text-align: center;
}

.unanswered-text {
  color: #e65100;
  margin: 0;
  font-size: 14px;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.question-info {
  display: flex;
  gap: 20px;
}

.question-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f5f5f5;
  color: #1976d2;
}

.add-question-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.add-question-btn:hover {
  background: #1565c0;
  transform: scale(1.1);
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .qa-container {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    position: static;
    margin-bottom: 20px;
  }

  .tags {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .question-header {
    flex-direction: column;
    gap: 10px;
  }

  .question-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .search-section {
    flex-direction: column;
  }
}
</style>
