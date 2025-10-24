<template>
  <div class="dashboard">
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="filter-group">
        <label for="district">选择区域：</label>
        <select id="district" v-model="selectedDistrict" @change="updateMap">
          <option value="all">全部区域</option>
          <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="score-min">最低均衡分数：</label>
        <input type="range" id="score-min" v-model.number="minScore" min="0" max="100" step="5" @input="updateMap">
        <span>{{ minScore }}分</span>
      </div>
      
      <button class="refresh-btn" @click="refreshData">刷新数据</button>
    </div>
    
    <div class="chart-row">
      <div ref="barChart1" class="chart"></div>
      <div ref="barChart2" class="chart"></div>
      <div ref="lineChart" class="chart"></div>
    </div>
    
    <!-- 百度地图容器 -->
    <div class="map" ref="mapContainer"></div>
    
    <div class="chart-row">
      <div ref="pie1" class="chart"></div>
      <div ref="pie2" class="chart"></div>
      <div ref="pie3" class="chart"></div>
    </div>
    
    <!-- 统计信息面板 -->
    <div class="stats-panel">
      <div class="stat-item">
        <span class="stat-label">总学校数：</span>
        <span class="stat-value">{{ totalSchools }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">平均均衡分：</span>
        <span class="stat-value">{{ averageScore.toFixed(1) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">最高分：</span>
        <span class="stat-value">{{ maxScore.toFixed(1) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">最低分：</span>
        <span class="stat-value">{{ minScore.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 学校数据接口定义
interface SchoolData {
  id: string
  district: string
  school_name: string
  balance_score: number
  student_count: number
  longitude: number
  latitude: number
}

// API响应接口
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// 图表和地图引用
const barChart1 = ref<HTMLDivElement | null>(null)
const barChart2 = ref<HTMLDivElement | null>(null)
const lineChart = ref<HTMLDivElement | null>(null)
const pie1 = ref<HTMLDivElement | null>(null)
const pie2 = ref<HTMLDivElement | null>(null)
const pie3 = ref<HTMLDivElement | null>(null)
const mapContainer = ref<HTMLDivElement | null>(null)

// 百度地图实例
let map: BMapGL.Map | null = null
let markers: BMapGL.Marker[] = []
let infoWindow: BMapGL.InfoWindow | null = null

// 响应式数据
const selectedDistrict = ref('all')
const minScore = ref(60)
const schoolData = ref<SchoolData[]>([])
const districts = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 计算属性
const filteredSchools = computed(() => {
  return schoolData.value.filter(school => {
    const districtMatch = selectedDistrict.value === 'all' || school.district === selectedDistrict.value
    const scoreMatch = school.balance_score >= minScore.value
    return districtMatch && scoreMatch
  })
})

const totalSchools = computed(() => filteredSchools.value.length)
const averageScore = computed(() => {
  if (filteredSchools.value.length === 0) return 0
  const sum = filteredSchools.value.reduce((acc, school) => acc + school.balance_score, 0)
  return sum / filteredSchools.value.length
})
const maxScore = computed(() => {
  if (filteredSchools.value.length === 0) return 0
  return Math.max(...filteredSchools.value.map(s => s.balance_score))
})

// 示例数据（备用）
const backupData: SchoolData[] = [
  { id: '1', district: '长安区', school_name: '石家庄一中', balance_score: 85.2, student_count: 2500, longitude: 114.528, latitude: 38.046 },
  { id: '2', district: '桥西区', school_name: '石家庄二中', balance_score: 88.7, student_count: 2800, longitude: 114.479, latitude: 38.027 },
  { id: '3', district: '裕华区', school_name: '石家庄精英中学', balance_score: 82.3, student_count: 3200, longitude: 114.535, latitude: 38.015 },
  { id: '4', district: '正定县', school_name: '正定中学', balance_score: 86.4, student_count: 2600, longitude: 114.588, latitude: 38.138 },
  { id: '5', district: '新华区', school_name: '石家庄九中', balance_score: 79.8, student_count: 1800, longitude: 114.462, latitude: 38.061 },
  { id: '6', district: '长安区', school_name: '石家庄十五中', balance_score: 81.5, student_count: 2100, longitude: 114.539, latitude: 38.052 },
  { id: '7', district: '桥西区', school_name: '石家庄六中', balance_score: 78.2, student_count: 1600, longitude: 114.468, latitude: 38.031 },
  { id: '8', district: '裕华区', school_name: '石家庄外国语学校', balance_score: 90.1, student_count: 3500, longitude: 114.518, latitude: 38.002 },
  { id: '9', district: '藁城区', school_name: '藁城一中', balance_score: 77.6, student_count: 2300, longitude: 114.838, latitude: 38.058 },
  { id: '10', district: '栾城区', school_name: '栾城中学', balance_score: 76.9, student_count: 1900, longitude: 114.642, latitude: 37.889 }
]

// API基础URL
const API_BASE_URL = 'http://localhost:3000'

// 初始化百度地图
const initMap = () => {
  if (!mapContainer.value) {
    console.error('地图容器未找到')
    return
  }

  try {
    // 初始化百度地图
    map = new BMapGL.Map(mapContainer.value)
    
    // 设置中心点（石家庄）
    const centerPoint = new BMapGL.Point(114.5149, 38.0428)
    map.centerAndZoom(centerPoint, 12)
    
    // 添加控件
    map.enableScrollWheelZoom(true)
    map.addControl(new BMapGL.NavigationControl())
    map.addControl(new BMapGL.ScaleControl())
    
    // 加载学校标记
    loadSchoolMarkers()
    
    console.log('百度地图初始化成功')
  } catch (err) {
    console.error('百度地图初始化失败:', err)
    error.value = '地图初始化失败，请刷新页面重试'
  }
}

// 加载学校标记
const loadSchoolMarkers = () => {
  if (!map) return
  
  // 清除现有标记
  markers.forEach(marker => map!.removeOverlay(marker))
  markers = []
  
  // 添加新标记
  filteredSchools.value.forEach(school => {
    try {
      // 创建点
      const point = new BMapGL.Point(school.longitude, school.latitude)
      
      // 根据分数设置不同颜色的标记
      let iconColor = getMarkerColor(school.balance_score)
      const icon = new BMapGL.Icon(`http://api.map.baidu.com/img/markers/${iconColor}.png`, 
        new BMapGL.Size(30, 30), {
          anchor: new BMapGL.Size(15, 30),
          imageSize: new BMapGL.Size(30, 30)
        })
      
      // 创建标记
      const marker = new BMapGL.Marker(point, { icon })
      
      // 添加点击事件
      marker.addEventListener('click', () => {
        const content = `
          <div style="padding: 10px;">
            <h4 style="margin: 0 0 10px 0;">${school.school_name}</h4>
            <p><strong>区域：</strong>${school.district}</p>
            <p><strong>均衡分数：</strong>${school.balance_score}分</p>
            <p><strong>学生数量：</strong>${school.student_count}人</p>
          </div>
        `
        
        if (!infoWindow) {
          infoWindow = new BMapGL.InfoWindow(content, {
            width: 200,
            title: school.school_name
          })
        } else {
          infoWindow.setContent(content)
          infoWindow.setTitle(school.school_name)
        }
        
        map!.openInfoWindow(infoWindow, point)
      })
      
      // 添加到地图和标记数组
      map.addOverlay(marker)
      markers.push(marker)
    } catch (err) {
      console.error('添加学校标记失败:', err)
    }
  })
}

// 根据分数获取标记颜色
const getMarkerColor = (score: number): string => {
  if (score >= 85) return 'red'
  if (score >= 75) return 'orange'
  if (score >= 65) return 'blue'
  return 'purple'
}

// 加载学校数据
const loadSchoolData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 尝试从API获取数据
    const [districtsRes, schoolsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/school-balance/districts`),
      fetch(`${API_BASE_URL}/api/school-balance/schools`)
    ])
    
    const districtsData = await districtsRes.json() as ApiResponse<string[]>
    const schoolsData = await schoolsRes.json() as ApiResponse<SchoolData[]>
    
    // 处理响应数据
    if (districtsData.success && districtsData.data) {
      districts.value = districtsData.data
    }
    
    if (schoolsData.success && schoolsData.data) {
      schoolData.value = schoolsData.data
    } else {
      // API失败时使用备用数据
      console.warn('API数据加载失败，使用备用数据')
      useBackupData()
    }
  } catch (err) {
    console.error('加载学校数据失败:', err)
    error.value = '数据加载失败，已使用备用数据'
    useBackupData()
  } finally {
    loading.value = false
    updateCharts()
  }
}

// 使用备用数据
const useBackupData = () => {
  schoolData.value = backupData
  districts.value = Array.from(new Set(backupData.map(d => d.district)))
}

// 更新地图
const updateMap = () => {
  loadSchoolMarkers()
}

// 刷新数据
const refreshData = () => {
  loadSchoolData()
}

// 初始化所有图表
const initCharts = () => {
  initBarChart1()
  initBarChart2()
  initLineChart()
  initPie1()
  initPie2()
  initPie3()
}

// 更新所有图表
const updateCharts = () => {
  updateBarChart1()
  updateBarChart2()
  updateLineChart()
  updatePieCharts()
}

// 初始化并更新柱状图1（教育投入类型）
const initBarChart1 = () => {
  if (!barChart1.value) return
  
  const chart = echarts.init(barChart1.value)
  chart.setOption(getBarChart1Option())
}

const updateBarChart1 = () => {
  if (!barChart1.value) return
  
  const chart = echarts.getInstanceByDom(barChart1.value)
  if (chart) {
    chart.setOption(getBarChart1Option())
  }
}

const getBarChart1Option = () => ({
  title: { text: '教育投入类型', textStyle: { color: '#fff' } },
  xAxis: { type: 'category', data: ['硬件', '师资', '培训', '政策'], axisLabel: { color: '#fff' } },
  yAxis: { type: 'value', axisLabel: { color: '#fff' } },
  series: [{ data: [400, 600, 300, 500], type: 'bar', color: '#00c0ff' }]
})

// 初始化并更新柱状图2（地区投入）
const initBarChart2 = () => {
  if (!barChart2.value) return
  
  const chart = echarts.init(barChart2.value)
  chart.setOption(getBarChart2Option())
}

const updateBarChart2 = () => {
  if (!barChart2.value) return
  
  const chart = echarts.getInstanceByDom(barChart2.value)
  if (chart) {
    chart.setOption(getBarChart2Option())
  }
}

const getBarChart2Option = () => ({
  title: { text: '地区教育资源分布', textStyle: { color: '#fff' } },
  xAxis: { 
    type: 'category', 
    data: districts.value.length > 0 ? districts.value.slice(0, 5) : ['北京', '天津', '河北'], 
    axisLabel: { color: '#fff' }
  },
  yAxis: { type: 'value', axisLabel: { color: '#fff' } },
  series: [{ 
    data: districts.value.length > 0 ? 
      districts.value.slice(0, 5).map(() => Math.floor(Math.random() * 500) + 500) : 
      [1200, 800, 500], 
    type: 'bar', 
    color: '#3cba92' 
  }]
})

// 初始化并更新折线图
const initLineChart = () => {
  if (!lineChart.value) return
  
  const chart = echarts.init(lineChart.value)
  chart.setOption(getLineChartOption())
}

const updateLineChart = () => {
  if (!lineChart.value) return
  
  const chart = echarts.getInstanceByDom(lineChart.value)
  if (chart) {
    chart.setOption(getLineChartOption())
  }
}

const getLineChartOption = () => ({
  title: { text: '平台活跃度（安卓 vs iOS）', textStyle: { color: '#fff' } },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 24 }, (_, i) => `${i + 1}`),
    axisLabel: { color: '#fff' },
  },
  yAxis: { type: 'value', axisLabel: { color: '#fff' } },
  legend: { data: ['安卓', 'iOS'], textStyle: { color: '#fff' } },
  series: [
    {
      name: '安卓',
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
    },
    {
      name: 'iOS',
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
    },
  ],
})

// 初始化饼图1（年龄）
const initPie1 = () => {
  if (!pie1.value) return
  
  const chart = echarts.init(pie1.value)
  chart.setOption(getPie1Option())
}

// 初始化饼图2（职业）
const initPie2 = () => {
  if (!pie2.value) return
  
  const chart = echarts.init(pie2.value)
  chart.setOption(getPie2Option())
}

// 初始化饼图3（兴趣）
const initPie3 = () => {
  if (!pie3.value) return
  
  const chart = echarts.init(pie3.value)
  chart.setOption(getPie3Option())
}

// 更新所有饼图
const updatePieCharts = () => {
  if (pie1.value) {
    const chart = echarts.getInstanceByDom(pie1.value)
    if (chart) chart.setOption(getPie1Option())
  }
  if (pie2.value) {
    const chart = echarts.getInstanceByDom(pie2.value)
    if (chart) chart.setOption(getPie2Option())
  }
  if (pie3.value) {
    const chart = echarts.getInstanceByDom(pie3.value)
    if (chart) chart.setOption(getPie3Option())
  }
}

const getPie1Option = () => ({
  title: { text: '年龄分布', left: 'center', textStyle: { color: '#fff' } },
  series: [{
    type: 'pie',
    radius: '60%',
    data: [
      { value: 35, name: '20-29岁' },
      { value: 25, name: '30-39岁' },
      { value: 20, name: '40-49岁' },
      { value: 10, name: '50岁以上' },
    ],
  }],
})

const getPie2Option = () => ({
  title: { text: '职业分布', left: 'center', textStyle: { color: '#fff' } },
  series: [{
    type: 'pie',
    radius: '60%',
    data: [
      { value: 40, name: '教师' },
      { value: 30, name: '公务员' },
      { value: 30, name: 'IT' },
    ],
  }],
})

const getPie3Option = () => ({
  title: { text: '兴趣分布', left: 'center', textStyle: { color: '#fff' } },
  series: [{
    type: 'pie',
    radius: '60%',
    data: [
      { value: 30, name: '教育' },
      { value: 20, name: '旅游' },
      { value: 50, name: '科技' },
    ],
  }],
})

// 处理窗口大小变化
const handleResize = () => {
  // 调整图表大小
  if (barChart1.value) {
    const chart = echarts.getInstanceByDom(barChart1.value)
    chart?.resize()
  }
  if (barChart2.value) {
    const chart = echarts.getInstanceByDom(barChart2.value)
    chart?.resize()
  }
  if (lineChart.value) {
    const chart = echarts.getInstanceByDom(lineChart.value)
    chart?.resize()
  }
  if (pie1.value) {
    const chart = echarts.getInstanceByDom(pie1.value)
    chart?.resize()
  }
  if (pie2.value) {
    const chart = echarts.getInstanceByDom(pie2.value)
    chart?.resize()
  }
  if (pie3.value) {
    const chart = echarts.getInstanceByDom(pie3.value)
    chart?.resize()
  }
  
  // 调整地图大小
  if (map) {
    map.setViewport(map.getCenter(), map.getZoom())
  }
}

// 生命周期
onMounted(async () => {
  // 加载数据
  await loadSchoolData()
  
  // 初始化地图
  initMap()
  
  // 初始化图表
  initCharts()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理事件监听
  window.removeEventListener('resize', handleResize)
  
  // 销毁地图实例
  if (map) {
    map.clearOverlays()
    map.dispose()
    map = null
  }
  
  // 销毁图表实例
  [barChart1, barChart2, lineChart, pie1, pie2, pie3].forEach(ref => {
    if (ref.value) {
      const chart = echarts.getInstanceByDom(ref.value)
      chart?.dispose()
    }
  })
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #001f3f;
  padding: 20px;
}

.control-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background-color: #002b5c;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.filter-group select,
.filter-group input[type="range"] {
  padding: 8px 12px;
  border: 1px solid #004488;
  border-radius: 4px;
  background-color: #001a33;
  color: white;
}

.refresh-btn {
  padding: 8px 20px;
  background-color: #0078ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background-color: #0056cc;
}

.chart-row {
  display: flex;
  justify-content: space-around;
  height: 300px;
  margin-bottom: 20px;
}

.chart {
  flex: 1;
  margin: 0 10px;
  background: #002b5c;
  border-radius: 8px;
  min-width: 0;
}

.map {
  height: 500px;
  margin-bottom: 20px;
  background: #002b5c;
  border-radius: 8px;
}

.stats-panel {
  display: flex;
  justify-content: space-around;
  background-color: #002b5c;
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #00c0ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }
  
  .chart-row {
    flex-direction: column;
    height: auto;
  }
  
  .chart {
    height: 300px;
    margin: 10px 0;
  }
  
  .map {
    height: 400px;
  }
  
  .stats-panel {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .stat-item {
    min-width: 100px;
  }
}
</style>