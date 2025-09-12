<template>
  <div class="about-admin">
    <h1>关于我们页面管理</h1>

    <el-form :model="formData" label-width="120px">
      <!-- 顶部横幅设置 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">顶部横幅设置</div>
        </template>
        <el-form-item label="标题">
          <el-input v-model="formData.bannerTitle" />
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="formData.bannerBgColor" show-alpha />
        </el-form-item>
        <el-form-item label="面包屑导航">
          <el-input v-model="formData.breadcrumb" />
        </el-form-item>
      </el-card>

      <!-- 内容部分管理 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">内容管理</div>
        </template>
        <div v-for="(section, index) in formData.sections" :key="index" class="content-section">
          <el-form-item label="章节标题">
            <el-input v-model="section.title" />
          </el-form-item>
          <el-form-item label="内容类型">
            <el-radio-group v-model="section.type">
              <el-radio label="text">文本</el-radio>
              <el-radio label="list">列表</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="section.type === 'text'" label="内容文本">
            <el-input type="textarea" :rows="4" v-model="section.content" />
          </el-form-item>

          <el-form-item v-if="section.type === 'list'" label="列表项">
            <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="list-item">
              <el-input v-model="section.items[itemIndex]" style="width: 80%; margin-right: 10px;" />
              <el-button type="danger" icon="el-icon-delete" circle @click="removeListItem(index, itemIndex)" />
            </div>
            <el-button type="primary" plain @click="addListItem(index)">添加列表项</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" @click="removeSection(index)">删除该章节</el-button>
          </el-form-item>
          <el-divider />
        </div>

        <el-button type="primary" @click="addNewSection">添加新章节</el-button>
      </el-card>

      <!-- 页脚设置 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">页脚设置</div>
        </template>
        <el-form-item label="页脚文本">
          <el-input v-model="formData.footerText" />
        </el-form-item>
        <el-form-item label="文本颜色">
          <el-color-picker v-model="formData.footerColor" show-alpha />
        </el-form-item>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="saveChanges">保存更改</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="previewPage">预览页面</el-button>
      </div>
    </el-form>

    <!-- 预览对话框 -->
    <el-dialog title="页面预览" v-model="previewVisible" width="80%">
      <AboutPagePreview :page-data="formData" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import AboutPagePreview from './AboutPagePreview.vue';

interface PageSection {
  title: string;
  type: 'text' | 'list';
  content?: string;
  items?: string[];
}

interface PageData {
  bannerTitle: string;
  bannerBgColor: string;
  breadcrumb: string;
  sections: PageSection[];
  footerText: string;
  footerColor: string;
}

export default defineComponent({
  name: 'AboutPageAdmin',
  components: { AboutPagePreview },
  setup() {
    const defaultData: PageData = {
      bannerTitle: '关于我们',
      bannerBgColor: 'linear-gradient(to right, #0b60c5, #127eea)',
      breadcrumb: '当前位置： 首页 > 关于我们',
      sections: [
        {
          title: '平台建设背景',
          type: 'text',
          content: '随着数字技术快速发展，基础教育正在步入智能时代...'
        }
      ],
      footerText: '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。',
      footerColor: '#888'
    };

    const formData = ref<PageData>({ ...defaultData });
    const previewVisible = ref(false);

    // 加载页面数据
    const loadPageData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/about-page/');
        const data = response.data;

        // 确保sections是数组
        if (!Array.isArray(data.sections)) {
          data.sections = [];
        }

        // 确保每个section有items数组（如果是list类型）
        data.sections.forEach(section => {
          if (section.type === 'list' && !Array.isArray(section.items)) {
            section.items = [];
          }
        });

        formData.value = { ...defaultData, ...data };
      } catch (error) {
        ElMessage.error('加载页面数据失败，使用默认数据');
        console.error(error);
        formData.value = { ...defaultData };
      }
    };

    // 保存更改
    const saveChanges = async () => {
      try {
        // 确保数据格式正确
        const dataToSave = {
          ...formData.value,
          sections: formData.value.sections.map(section => ({
            ...section,
            items: section.type === 'list' ? section.items || [] : undefined
          }))
        };

        await axios.put('http://localhost:3000/api/about-page/', dataToSave);
        ElMessage.success('保存成功');
      } catch (error) {
        ElMessage.error('保存失败');
        console.error(error);
      }
    };

    // 添加新章节
    const addNewSection = () => {
      formData.value.sections.push({
        title: '新章节标题',
        type: 'text',
        content: '请输入章节内容...',
        items: []
      });
    };

    // 删除章节
    const removeSection = (index: number) => {
      formData.value.sections.splice(index, 1);
    };

    // 添加列表项
    const addListItem = (sectionIndex: number) => {
      if (!formData.value.sections[sectionIndex].items) {
        formData.value.sections[sectionIndex].items = [];
      }
      formData.value.sections[sectionIndex].items?.push('新列表项内容');
    };

    // 删除列表项
    const removeListItem = (sectionIndex: number, itemIndex: number) => {
      formData.value.sections[sectionIndex].items?.splice(itemIndex, 1);
    };

    // 重置表单
    const resetForm = () => {
      loadPageData();
    };

    // 预览页面
    const previewPage = () => {
      previewVisible.value = true;
    };

    onMounted(() => {
      loadPageData();
    });

    return {
      formData,
      previewVisible,
      saveChanges,
      addNewSection,
      removeSection,
      addListItem,
      removeListItem,
      resetForm,
      previewPage
    };
  }
});
</script>

<style scoped>
.about-admin {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.content-section {
  margin-bottom: 20px;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}
</style>
