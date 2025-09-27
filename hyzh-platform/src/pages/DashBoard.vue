<template>
  <div class="dashboard">
    <div class="chart-row">
      <div ref="barChart1" class="chart"></div>
      <div ref="barChart2" class="chart"></div>
      <div ref="lineChart" class="chart"></div>
    </div>
    <div class="map" ref="mapChart"></div>
    <div class="chart-row">
      <div ref="pie1" class="chart"></div>
      <div ref="pie2" class="chart"></div>
      <div ref="pie3" class="chart"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

// chart refs
const barChart1 = ref<HTMLDivElement | null>(null)
const barChart2 = ref<HTMLDivElement | null>(null)
const lineChart = ref<HTMLDivElement | null>(null)
const pie1 = ref<HTMLDivElement | null>(null)
const pie2 = ref<HTMLDivElement | null>(null)
const pie3 = ref<HTMLDivElement | null>(null)
const mapChart = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // 图表 1：教育投入类型
  echarts.init(barChart1.value!).setOption({
    title: { text: '教育投入类型', textStyle: { color: '#fff' } },
    xAxis: {
      type: 'category',
      data: ['硬件', '师资', '培训', '政策'],
    },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [{ data: [400, 600, 300, 500], type: 'bar', color: '#00c0ff' }],
  })

  // 图表 2：地区投入
  echarts.init(barChart2.value!).setOption({
    title: { text: '地区教育资源分布', textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['北京', '天津', '河北'], axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [{ data: [1200, 800, 500], type: 'bar', color: '#3cba92' }],
  })

  // 折线图
  echarts.init(lineChart.value!).setOption({
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

  // 饼图：年龄
  echarts.init(pie1.value!).setOption({
    title: { text: '年龄分布', left: 'center', textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: 35, name: '20-29岁' },
          { value: 25, name: '30-39岁' },
          { value: 20, name: '40-49岁' },
          { value: 10, name: '50岁以上' },
        ],
      },
    ],
  })

  // 饼图：职业
  echarts.init(pie2.value!).setOption({
    title: { text: '职业分布', left: 'center', textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: 40, name: '教师' },
          { value: 30, name: '公务员' },
          { value: 30, name: 'IT' },
        ],
      },
    ],
  })

  // 饼图：兴趣
  echarts.init(pie3.value!).setOption({
    title: { text: '兴趣分布', left: 'center', textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: 30, name: '教育' },
          { value: 20, name: '旅游' },
          { value: 50, name: '科技' },
        ],
      },
    ],
  })

  // 地图图表（基础示例，需引入 china geoJSON）
  const myMap = echarts.init(mapChart.value!)
  fetch('https://geo.datav.aliyun.com/areas/bound/100000_full.json')
    .then((res) => res.json())
    .then((chinaJson) => {
      echarts.registerMap('china', chinaJson)
      myMap.setOption({
        title: { text: '京津冀教育分布图', left: 'center', textStyle: { color: 'white' } },
        geo: {
          map: 'china',
          roam: true,
          label: { show: false },
          itemStyle: { areaColor: '#005577', borderColor: 'white' },
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [
              { name: '北京', value: [116.4, 39.9, 100] },
              { name: '天津', value: [117.2, 39.1, 80] },
              { name: '石家庄', value: [114.5, 38.0, 60] },
            ],
            symbolSize: (val: number[]) => val[2] / 2,
            itemStyle: { color: 'white' },
          },
        ],
      })
    })
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #001f3f;
}
.chart-row {
  display: flex;
  justify-content: space-around;
  height: 300px;
}
.chart {
  flex: 1;
  margin: 10px;
  background: #002b5c;
  border-radius: 8px;
}
.map {
  flex: 1;
  height: 400px;
  margin: 10px;
}
</style>
