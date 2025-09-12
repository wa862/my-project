<template>
  <div class="news-category-section">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane
        v-for="(category, key) in newsByCategory"
        :label="category.name"
        :name="key"
        :key="key"
      >
        <div class="category-news-list">
          <div v-for="(item, idx) in category.items" :key="idx" class="category-news-item">
            <a :href="item.link" target="_blank">{{ item.title }}</a>
            <span class="date">{{ item.date }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CategoryItem {
  title: string
  date: string
  link: string
}

interface CategoryMap {
  [key: string]: {
    name: string
    items: CategoryItem[]
  }
}

const activeTab = ref('zonghe')

const newsByCategory: CategoryMap = {
  zonghe: {
    name: '综合',
    items: [
      {
        title: '2025年基础教育大会将在天津召开',
        date: '2025-05-12',
        link: 'https://example.com/zonghe1',
      },
      {
        title: '京津冀共建教育一体化标准评估体系',
        date: '2025-04-30',
        link: 'https://example.com/zonghe2',
      },
    ],
  },
  xueqian: {
    name: '学前',
    items: [
      {
        title: '山东省启动“幼有优育”三年行动计划',
        date: '2025-05-06',
        link: 'https://example.com/xueqian1',
      },
      {
        title: '河北新增100所普惠性幼儿园',
        date: '2025-04-10',
        link: 'https://example.com/xueqian2',
      },
    ],
  },
  jijiao: {
    name: '基教',
    items: [
      {
        title: '京津冀三地共建基础教育资源共享平台',
        date: '2025-03-28',
        link: 'https://example.com/jijiao1',
      },
      {
        title: '北京优质中小学继续“组团式”支教张家口',
        date: '2025-04-05',
        link: 'https://example.com/jijiao2',
      },
    ],
  },
  gaojiao: {
    name: '高教',
    items: [
      {
        title: '南开大学雄安校区预计年底封顶',
        date: '2025-05-01',
        link: 'https://example.com/gaojiao1',
      },
      {
        title: '北京高校助力雄安人才培养计划启动',
        date: '2025-04-08',
        link: 'https://example.com/gaojiao2',
      },
    ],
  },
  zhijiao: {
    name: '职教',
    items: [
      {
        title: '天津将新增20所高水平中职学校',
        date: '2025-04-22',
        link: 'https://example.com/zhijiao1',
      },
      {
        title: '河北职教“1+X”证书制度改革深入推进',
        date: '2025-03-30',
        link: 'https://example.com/zhijiao2',
      },
    ],
  },
  minzu: {
    name: '民族',
    items: [
      {
        title: '张家口民族中学与北京实验中学结对共建',
        date: '2025-04-26',
        link: 'https://example.com/minzu1',
      },
    ],
  },
  guoji: {
    name: '国际',
    items: [
      {
        title: '清华牵头京津冀高校共建国际教育创新联盟',
        date: '2025-05-03',
        link: 'https://example.com/guoji1',
      },
    ],
  },
  jiajiao: {
    name: '家教',
    items: [
      {
        title: '“家校社协同”家庭教育项目在河北试点',
        date: '2025-05-10',
        link: 'https://example.com/jiajiao1',
      },
      {
        title: '教育部发布《家庭教育指导纲要（试行）》',
        date: '2025-02-18',
        link: 'https://example.com/jiajiao2',
      },
    ],
  },
}
</script>

<style scoped>
.news-category-section {
  width: 60vw;
  margin: 60px auto 40px;
  padding: 0 10px;
  box-sizing: border-box;
  background: #fafafa;
}

.category-news-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 10px;
}

.category-news-item {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 6px;
}

.category-news-item a {
  color: #1a0dab;
  text-decoration: none;
}

.category-news-item a:hover {
  text-decoration: underline;
}

.date {
  color: #999;
  font-size: 13px;
  white-space: nowrap;
}
:deep(.el-tabs__item) {
  padding: 0 40px; /* 增加标签项左右内边距 */
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  transition: all 0.3s;
}
</style>
