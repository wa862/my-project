<template>
  <div class="knowledge-graph-container">
    <!-- 头部 -->
    <div class="header">
      <h1>京津冀乡村基础教育均衡性评价知识图谱</h1>
      <p>基于熵权-TOPSIS法的综合评价模型可视化分析</p>
    </div>

    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-group">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="control-btn"
          :class="{ active: currentFilter === filter.value }"
          @click="handleFilterChange(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>

      <input
        v-model="searchKeyword"
        type="text"
        class="search-box"
        placeholder="搜索节点..."
        @input="handleSearch"
      >

      <div class="legend">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="legend-item"
        >
          <div class="legend-color" :style="{ background: item.color }"></div>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 图谱区域 -->
      <div class="graph-container">
        <div ref="chartRef" class="chart"></div>
      </div>

      <!-- 信息面板 -->
      <div class="info-panel">
        <!-- 节点信息 -->
        <div class="node-info">
          <h3>节点信息</h3>
          <div class="info-item">
            <span class="info-label">名称:</span>
            <span>{{ currentNode.name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">类型:</span>
            <span>{{ getCategoryName(currentNode.category) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">权重:</span>
            <span>{{ currentNode.value ? currentNode.value + ' 分' : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联节点:</span>
            <span>{{ currentNode.connections || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">描述:</span>
            <span>{{ currentNode.description || '-' }}</span>
          </div>
        </div>

        <!-- 指标权重 -->
        <div class="metrics-panel">
          <h3>指标权重分布</h3>
          <div
            v-for="metric in metrics"
            :key="metric.name"
            class="metric-item"
          >
            <div class="metric-header">
              <span>{{ metric.name }}</span>
              <span>{{ metric.percentage }}%</span>
            </div>
            <div class="metric-bar">
              <div
                class="metric-fill"
                :style="{
                  width: metric.percentage + '%',
                  background: metric.color
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <p>京津冀乡村基础教育均衡性评价知识图谱系统 | 基于熵权-TOPSIS综合评价模型</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

// 类型定义
interface GraphNode {
  id: string
  name: string
  category: number
  value: number
  description?: string
  connections?: number
}

interface GraphLink {
  source: string
  target: string
  value: number
}

interface FilterOption {
  label: string
  value: string
}

interface LegendItem {
  label: string
  color: string
}

interface Metric {
  name: string
  percentage: number
  color: string
}

// 响应式数据
const chartRef = ref<HTMLDivElement>()
const currentFilter = ref<string>('all')
const searchKeyword = ref<string>('')
const currentNode = ref<Partial<GraphNode>>({})
let chart: echarts.ECharts

// 常量数据
const filters: FilterOption[] = [
  { label: '全部维度', value: 'all' },
  { label: '输入指标', value: 'input' },
  { label: '处理过程', value: 'process' },
  { label: '输出结果', value: 'output' }
]

const legendItems: LegendItem[] = [
  { label: '输入数据', color: '#e74c3c' },
  { label: '计算方法', color: '#3498db' },
  { label: '评价结果', color: '#2ecc71' },
  { label: '指标体系', color: '#f39c12' }
]

const metrics: Metric[] = [
  { name: '师资力量指标', percentage: 35, color: '#3498db' },
  { name: '办学条件指标', percentage: 25, color: '#2ecc71' },
  { name: '经费投入指标', percentage: 20, color: '#e74c3c' },
  { name: '教育成果指标', percentage: 15, color: '#f39c12' },
  { name: '服务质量指标', percentage: 5, color: '#9b59b6' }
]

const nodeDescriptions: Record<string, string> = {
  '学校基础数据': '包含京津冀地区乡村学校的基本信息，是评价的基础数据源',
  '在校生数': '反映学校规模的重要指标，影响生均资源分配',
  '专任教师数': '衡量学校师资力量的核心指标',
  '熵权法': '基于信息熵的客观赋权方法，确定各指标权重',
  'TOPSIS法': '逼近理想解排序法，计算学校与理想状态的接近程度',
  '均衡性分数': '综合评价结果，反映学校教育资源均衡程度',
  '学校排名': '基于均衡性分数的学校排序结果',
  '师资力量指标': '包括生师比、高级教师比例等子指标',
  '办学条件指标': '涵盖生均建筑面积、校园设施等条件指标',
  '经费投入指标': '包含培训费、教学耗材费、公用经费等投入指标',
  '教育成果指标': '衡量学校教学质量和学生发展成果',
  '服务质量指标': '评估学校后勤服务和学生满意度'
}

// 知识图谱数据
const graphData = {
  nodes: [
    // 输入数据 - 红色
    { id: 'input-school-data', name: '学校基础数据', category: 0, value: 100 },
    { id: 'input-student-count', name: '在校生数', category: 0, value: 90 },
    { id: 'input-teacher-count', name: '专任教师数', category: 0, value: 85 },
    { id: 'input-building-area', name: '建筑面积', category: 0, value: 80 },
    { id: 'input-senior-teachers', name: '高级教师数', category: 0, value: 75 },
    { id: 'input-training-fee', name: '培训费', category: 0, value: 70 },
    { id: 'input-material-fee', name: '教学耗材费', category: 0, value: 65 },
    { id: 'input-public-funding', name: '公用经费', category: 0, value: 60 },

    // 计算方法 - 蓝色
    { id: 'method-entropy-weight', name: '熵权法', category: 1, value: 95 },
    { id: 'method-topsis', name: 'TOPSIS法', category: 1, value: 90 },
    { id: 'method-matrix-normalization', name: '矩阵标准化', category: 1, value: 80 },
    { id: 'method-weight-calculation', name: '权重计算', category: 1, value: 85 },
    { id: 'method-ideal-solution', name: '理想解计算', category: 1, value: 75 },
    { id: 'method-distance-calculation', name: '距离计算', category: 1, value: 70 },

    // 评价结果 - 绿色
    { id: 'output-balance-score', name: '均衡性分数', category: 2, value: 100 },
    { id: 'output-school-ranking', name: '学校排名', category: 2, value: 95 },
    { id: 'output-evaluation-level', name: '评价等级', category: 2, value: 90 },
    { id: 'output-weight-distribution', name: '权重分布', category: 2, value: 85 },
    { id: 'output-regional-comparison', name: '区域对比', category: 2, value: 80 },

    // 指标体系 - 橙色
    { id: 'index-teacher-resources', name: '师资力量指标', category: 3, value: 90 },
    { id: 'index-school-conditions', name: '办学条件指标', category: 3, value: 85 },
    { id: 'index-funding-input', name: '经费投入指标', category: 3, value: 80 },
    { id: 'index-education-outcomes', name: '教育成果指标', category: 3, value: 75 },
    { id: 'index-service-quality', name: '服务质量指标', category: 3, value: 70 },
    { id: 'index-student-support', name: '学生资助指标', category: 3, value: 65 }
  ] as GraphNode[],
  links: [
    // 输入数据与指标体系的关联
    { source: 'input-student-count', target: 'index-teacher-resources', value: 1 },
    { source: 'input-teacher-count', target: 'index-teacher-resources', value: 1 },
    { source: 'input-senior-teachers', target: 'index-teacher-resources', value: 1 },
    { source: 'input-building-area', target: 'index-school-conditions', value: 1 },
    { source: 'input-training-fee', target: 'index-funding-input', value: 1 },
    { source: 'input-material-fee', target: 'index-funding-input', value: 1 },
    { source: 'input-public-funding', target: 'index-funding-input', value: 1 },

    // 指标体系与计算方法的关联
    { source: 'index-teacher-resources', target: 'method-matrix-normalization', value: 1 },
    { source: 'index-school-conditions', target: 'method-matrix-normalization', value: 1 },
    { source: 'index-funding-input', target: 'method-matrix-normalization', value: 1 },
    { source: 'index-education-outcomes', target: 'method-matrix-normalization', value: 1 },
    { source: 'index-service-quality', target: 'method-matrix-normalization', value: 1 },
    { source: 'index-student-support', target: 'method-matrix-normalization', value: 1 },

    // 计算方法之间的关系
    { source: 'method-matrix-normalization', target: 'method-entropy-weight', value: 1 },
    { source: 'method-entropy-weight', target: 'method-weight-calculation', value: 1 },
    { source: 'method-weight-calculation', target: 'method-topsis', value: 1 },
    { source: 'method-topsis', target: 'method-ideal-solution', value: 1 },
    { source: 'method-ideal-solution', target: 'method-distance-calculation', value: 1 },

    // 计算方法与输出结果的关联
    { source: 'method-distance-calculation', target: 'output-balance-score', value: 1 },
    { source: 'output-balance-score', target: 'output-school-ranking', value: 1 },
    { source: 'output-balance-score', target: 'output-evaluation-level', value: 1 },
    { source: 'method-weight-calculation', target: 'output-weight-distribution', value: 1 },
    { source: 'output-school-ranking', target: 'output-regional-comparison', value: 1 },

    // 核心关联
    { source: 'input-school-data', target: 'method-entropy-weight', value: 1 },
    { source: 'method-topsis', target: 'output-balance-score', value: 1 }
  ] as GraphLink[]
}

// 计算属性
const filteredData = computed(() => {
  let filteredNodes = [...graphData.nodes]
  let filteredLinks = [...graphData.links]

  // 根据筛选条件过滤节点
  if (currentFilter.value !== 'all') {
    const categoryMap: Record<string, number> = {
      'input': 0,
      'process': 1,
      'output': 2
    }
    const targetCategory = categoryMap[currentFilter.value]

    filteredNodes = graphData.nodes.filter(node => node.category === targetCategory)
    filteredLinks = graphData.links.filter(link => {
      const sourceNode = graphData.nodes.find(n => n.id === link.source)
      const targetNode = graphData.nodes.find(n => n.id === link.target)
      return filteredNodes.includes(sourceNode!) && filteredNodes.includes(targetNode!)
    })
  }

  // 根据搜索关键词过滤
  if (searchKeyword.value) {
    filteredNodes = filteredNodes.filter(node =>
      node.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
    filteredLinks = filteredLinks.filter(link => {
      const sourceNode = graphData.nodes.find(n => n.id === link.source)
      const targetNode = graphData.nodes.find(n => n.id === link.target)
      return filteredNodes.includes(sourceNode!) && filteredNodes.includes(targetNode!)
    })
  }

  return { nodes: filteredNodes, links: filteredLinks }
})

// 方法
const getCategoryColor = (category: number): string => {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']
  return colors[category] || '#95a5a6'
}

const getCategoryName = (category?: number): string => {
  const names = ['输入数据', '计算方法', '评价结果', '指标体系']
  return category !== undefined ? names[category] : '-'
}

const handleFilterChange = (filter: string) => {
  currentFilter.value = filter
  updateChart()
}

const handleSearch = () => {
  updateChart()
}

const updateNodeInfo = (nodeData: GraphNode) => {
  const connections = graphData.links.filter(link =>
    link.source === nodeData.id || link.target === nodeData.id
  ).length

  currentNode.value = {
    ...nodeData,
    connections,
    description: nodeDescriptions[nodeData.name] || '基础教育均衡性评价体系的重要组成部分'
  }
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)

  const option = {
    title: {
      text: '基础教育均衡性评价知识图谱',
      subtext: '京津冀乡村学校综合评价体系',
      top: 'top',
      left: 'center',
      textStyle: {
        color: '#2c3e50',
        fontSize: 18
      }
    },
    tooltip: {
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `<div style="text-align: center;">
            <strong>${params.data.name}</strong><br/>
            重要性: ${params.data.value}
          </div>`
        }
        return `${params.data.source} → ${params.data.target}`
      }
    },
    legend: {
      data: ['输入数据', '计算方法', '评价结果', '指标体系'],
      top: 40,
      textStyle: {
        color: '#34495e'
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: [],
      links: [],
      categories: [
        { name: '输入数据', itemStyle: { color: '#e74c3c' } },
        { name: '计算方法', itemStyle: { color: '#3498db' } },
        { name: '评价结果', itemStyle: { color: '#2ecc71' } },
        { name: '指标体系', itemStyle: { color: '#f39c12' } }
      ],
      roam: true,
      focusNodeAdjacency: true,
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      force: {
        repulsion: 300,
        gravity: 0.1,
        edgeLength: 120
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 3
        }
      }
    }]
  }

  chart.setOption(option)

  // 绑定点击事件
chart.on('click', (params) => {
  if (params.dataType === 'node') {
    updateNodeInfo(params.data as GraphNode)
  }
})

  // 初始化显示第一个节点信息
  if (graphData.nodes.length > 0) {
    updateNodeInfo(graphData.nodes[0])
  }

  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const { nodes, links } = filteredData.value

  const option = {
    series: [{
      data: nodes.map(node => ({
        ...node,
        symbolSize: Math.max(25, node.value / 3),
        itemStyle: {
          color: getCategoryColor(node.category)
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          fontSize: 10,
          color: '#fff',
          fontWeight: 'bold'
        }
      })),
      links: links.map(link => ({
        ...link,
        lineStyle: {
          color: '#95a5a6',
          width: 1.5,
          curveness: 0.2
        }
      }))
    }]
  }

  chart.setOption(option)
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

// 响应窗口大小变化
window.addEventListener('resize', () => {
  if (chart) {
    chart.resize()
  }
})
</script>
<style scoped>
.knowledge-graph-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  font-weight: 400;
}

.header p {
  font-size: 1.1em;
  opacity: 0.9;
}

.controls {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  font-size: 0.9em;
}

.control-btn:hover, .control-btn.active {
  background: #3498db;
  color: white;
}

.search-box {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  flex: 1;
  max-width: 300px;
  font-size: 0.9em;
}

.legend {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.content {
  display: flex;
  height: 700px;
}

.graph-container {
  flex: 1;
  padding: 20px;
}

.chart {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.info-panel {
  width: 400px;
  padding: 25px;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  overflow-y: auto;
}

.node-info {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.node-info h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
  font-size: 1.2em;
}

.info-item {
  margin-bottom: 12px;
  line-height: 1.5;
}

.info-label {
  font-weight: 600;
  color: #34495e;
  display: inline-block;
  width: 80px;
}

.metrics-panel {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.metric-item {
  margin-bottom: 15px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.metric-bar {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #2c3e50;
  color: white;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    height: auto;
  }

  .info-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
}
</style>
