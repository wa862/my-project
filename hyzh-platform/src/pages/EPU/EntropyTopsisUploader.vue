<template>
  <div class="calculation-container">
    <header class="header">
      <h1>京津冀乡村基础教育均衡性评价计算平台</h1>
      <p>基于熵权-TOPSIS法的综合评价模型</p>
    </header>

    <!-- 数据输入方式选择 -->
    <div class="input-method-selector">
      <button
        @click="currentInputMethod = 'manual'"
        :class="{ active: currentInputMethod === 'manual' }"
        class="method-btn"
      >
        手动输入数据
      </button>
      <button
        @click="currentInputMethod = 'excel'"
        :class="{ active: currentInputMethod === 'excel' }"
        class="method-btn"
      >
        上传Excel文件
      </button>
    </div>

    <!-- 手动输入数据区域 -->
    <div v-if="currentInputMethod === 'manual'" class="manual-input-section">
      <div class="section-header">
        <h2>学校数据输入</h2>
        <button @click="addSchool" class="add-btn">+ 添加学校</button>
      </div>

      <div class="schools-input-container">
        <div v-for="(school, index) in inputSchools" :key="index" class="school-input-card">
          <div class="school-header">
            <h3>学校 {{ index + 1 }}</h3>
            <button @click="removeSchool(index)" class="remove-btn" v-if="inputSchools.length > 1">删除</button>
          </div>

          <div class="input-grid">
            <div class="input-group">
              <label>区域:</label>
              <input v-model="school.district" placeholder="如：长安区">
            </div>
            <div class="input-group">
              <label>学校名称:</label>
              <input v-model="school.schoolName" placeholder="如：石家庄市第十二中学">
            </div>
            <div class="input-group">
              <label>在校生数:</label>
              <input v-model.number="school.studentCount" type="number" placeholder="如：2400">
            </div>
            <div class="input-group">
              <label>专任教师数:</label>
              <input v-model.number="school.fullTimeTeacherCount" type="number" placeholder="如：160">
            </div>
            <div class="input-group">
              <label>班级数:</label>
              <input v-model.number="school.classCount" type="number" placeholder="如：30">
            </div>
            <div class="input-group">
              <label>占地面积(㎡):</label>
              <input v-model.number="school.landArea" type="number" placeholder="如：50000">
            </div>
            <div class="input-group">
              <label>建筑面积(㎡):</label>
              <input v-model.number="school.buildingArea" type="number" placeholder="如：45070">
            </div>
            <div class="input-group">
              <label>高级教师数:</label>
              <input v-model.number="school.seniorTeacherCount" type="number" placeholder="如：46">
            </div>
            <div class="input-group">
              <label>特级教师数:</label>
              <input v-model.number="school.specialGradeTeacherCount" type="number" placeholder="如：2">
            </div>
            <div class="input-group">
              <label>培训费(万元):</label>
              <input v-model.number="school.trainingFee" type="number" placeholder="如：331.04">
            </div>
            <div class="input-group">
              <label>教学耗材费(万元):</label>
              <input v-model.number="school.teachingMaterialFee" type="number" placeholder="如：6508.09">
            </div>
            <div class="input-group">
              <label>校园服务面积(㎡):</label>
              <input v-model.number="school.campusServiceArea" type="number" placeholder="如：20000">
            </div>
            <div class="input-group">
              <label>物业服务师生人数:</label>
              <input v-model.number="school.propertyServicePeople" type="number" placeholder="如：2500">
            </div>
            <div class="input-group">
              <label>物业满意度(%):</label>
              <input v-model.number="school.propertySatisfaction" type="number" placeholder="如：95">
            </div>
            <div class="input-group">
              <label>毕业生人数(高中):</label>
              <input v-model.number="school.graduateCount" type="number" placeholder="如：500">
            </div>
            <div class="input-group">
              <label>升学/建档人数(高中):</label>
              <input v-model.number="school.collegeEntranceCount" type="number" placeholder="如：450">
            </div>
            <div class="input-group">
              <label>艺体参赛学生人数(年):</label>
              <input v-model.number="school.artsSportsParticipantCount" type="number" placeholder="如：300">
            </div>
            <div class="input-group">
              <label>艺体获奖学生人数(年):</label>
              <input v-model.number="school.artsSportsAwardCount" type="number" placeholder="如：50">
            </div>
            <div class="input-group">
              <label>公用经费合计(万元):</label>
              <input v-model.number="school.publicFundingTotal" type="number" placeholder="如：112.76">
            </div>
            <div class="input-group">
              <label>受助学生人数(年):</label>
              <input v-model.number="school.supportedStudentCount" type="number" placeholder="如：100">
            </div>
            <div class="input-group">
              <label>免学费学生人数(高中,年):</label>
              <input v-model.number="school.freeTuitionStudentCount" type="number" placeholder="如：50">
            </div>
            <div class="input-group">
              <label>住校生人数:</label>
              <input v-model.number="school.boarderCount" type="number" placeholder="如：800">
            </div>
            <div class="input-group">
              <label>助学金学生人数(高中,年):</label>
              <input v-model.number="school.financialAidStudentCount" type="number" placeholder="如：80">
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="calculateBalanceScores" class="calculate-btn">计算均衡性分数</button>
        <button @click="resetInput" class="reset-btn">重置数据</button>
      </div>
    </div>

    <!-- Excel上传区域 -->
    <div v-if="currentInputMethod === 'excel'" class="excel-upload-section">
      <div class="upload-area" @drop="handleDrop" @dragover="handleDragOver">
        <div class="upload-content">
          <div class="upload-icon">📊</div>
          <h3>上传Excel文件</h3>
          <p>支持 .xlsx, .xls 格式文件</p>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept=".xlsx,.xls"
            style="display: none"
          >
          <button @click="$refs.fileInput.click()" class="upload-btn">选择文件</button>
          <p v-if="uploadedFileName" class="file-name">已选择: {{ uploadedFileName }}</p>
        </div>
      </div>

      <div class="excel-preview" v-if="excelData.length > 0">
        <h3>数据预览</h3>
        <div class="preview-table-container">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="header in excelHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in excelData.slice(0, 5)" :key="index">
                <td v-for="header in excelHeaders" :key="header">{{ row[header] || '' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="excelData.length > 5" class="preview-note">... 仅显示前5行，共{{ excelData.length }}行数据</p>
        </div>
        <button @click="calculateFromExcel" class="calculate-btn">计算均衡性分数</button>
      </div>
    </div>

    <!-- 计算结果展示 -->
    <div v-if="calculationResults.length > 0" class="results-section">
      <h2>计算结果</h2>

      <!-- 权重展示 -->
      <div class="weights-display">
        <h3>指标权重</h3>
        <div class="weights-grid">
          <div v-for="(weight, index) in indicatorWeights" :key="index" class="weight-item">
            <span class="weight-name">{{ weight.name }}</span>
            <span class="weight-value">{{ (weight.value * 100).toFixed(2) }}%</span>
          </div>
        </div>
      </div>

      <!-- 结果表格 -->
      <div class="results-table-container">
        <table class="results-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>区域</th>
              <th>学校名称</th>
              <th>在校生数</th>
              <th>专任教师数</th>
              <th>均衡性分数</th>
              <th>评价等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in sortedResults" :key="result.id">
              <td>{{ index + 1 }}</td>
              <td>{{ result.district }}</td>
              <td>{{ result.schoolName }}</td>
              <td>{{ result.studentCount }}</td>
              <td>{{ result.fullTimeTeacherCount }}</td>
              <td :class="getScoreClass(result.balanceScore || 0)">
                {{ (result.balanceScore || 0).toFixed(1) }}
              </td>
              <td :class="getScoreClass(result.balanceScore || 0)">
                {{ getScoreLevel(result.balanceScore || 0) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 结果图表 -->
      <div class="results-charts">
        <div ref="scoreChartRef" class="chart-container" style="height: 400px;"></div>
      </div>

      <div class="export-actions">
        <button @click="exportResults" class="export-btn">导出结果</button>
        <button @click="resetCalculation" class="reset-btn">重新计算</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import * as echarts from "echarts";

// 学校数据类型定义
interface SchoolData {
  id: number;
  district: string;
  schoolName: string;
  studentCount: number;
  fullTimeTeacherCount: number;
  classCount: number;
  landArea: number;
  buildingArea: number;
  seniorTeacherCount: number;
  specialGradeTeacherCount: number;
  trainingFee: number;
  teachingMaterialFee: number;
  campusServiceArea: number;
  propertyServicePeople: number;
  propertySatisfaction: number;
  graduateCount: number;
  collegeEntranceCount: number;
  artsSportsParticipantCount: number;
  artsSportsAwardCount: number;
  publicFundingTotal: number;
  supportedStudentCount: number;
  freeTuitionStudentCount: number;
  boarderCount: number;
  financialAidStudentCount: number;
  balanceScore?: number;
}

// 指标权重类型
interface IndicatorWeight {
  name: string;
  value: number;
}

// Excel数据行类型
interface ExcelDataRow {
  [key: string]: string | number;
}

// 响应式数据
const currentInputMethod = ref<'manual' | 'excel'>('manual');
const inputSchools = ref<SchoolData[]>([createEmptySchool()]);
const calculationResults = ref<SchoolData[]>([]);
const indicatorWeights = ref<IndicatorWeight[]>([]);
const excelData = ref<ExcelDataRow[]>([]);
const excelHeaders = ref<string[]>([]);
const uploadedFileName = ref('');
const scoreChartRef = ref<HTMLDivElement | null>(null);

// 创建空学校数据
function createEmptySchool(): SchoolData {
  return {
    id: Date.now(),
    district: '',
    schoolName: '',
    studentCount: 0,
    fullTimeTeacherCount: 0,
    classCount: 0,
    landArea: 0,
    buildingArea: 0,
    seniorTeacherCount: 0,
    specialGradeTeacherCount: 0,
    trainingFee: 0,
    teachingMaterialFee: 0,
    campusServiceArea: 0,
    propertyServicePeople: 0,
    propertySatisfaction: 0,
    graduateCount: 0,
    collegeEntranceCount: 0,
    artsSportsParticipantCount: 0,
    artsSportsAwardCount: 0,
    publicFundingTotal: 0,
    supportedStudentCount: 0,
    freeTuitionStudentCount: 0,
    boarderCount: 0,
    financialAidStudentCount: 0
  };
}

// 添加学校
function addSchool() {
  inputSchools.value.push(createEmptySchool());
}

// 删除学校
function removeSchool(index: number) {
  inputSchools.value.splice(index, 1);
}

// 重置输入数据
function resetInput() {
  inputSchools.value = [createEmptySchool()];
}

// 重置计算
function resetCalculation() {
  calculationResults.value = [];
  indicatorWeights.value = [];
}

// 处理文件拖放
function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files[0]) {
    handleExcelFile(files[0]);
  }
}

// 处理文件上传
function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    handleExcelFile(target.files[0]);
  }
}

// 处理Excel文件（模拟处理）
function handleExcelFile(file: File) {
  uploadedFileName.value = file.name;
  // 模拟Excel数据
  excelData.value = [
    {
      '区域': '长安区',
      '学校名称': '石家庄市第十二中学',
      '在校生数': 2400,
      '专任教师数': 160,
      '班级数': 48,
      '占地面积(平方米)': 50000,
      '建筑面积(平方米)': 45070,
      '高级教师数': 46,
      '特级教师数': 2,
      '培训费(万元)': 331.04,
      '教学耗材费(万元)': 6508.09,
      '校园服务面积(平方米)': 20000,
      '物业服务师生人数': 2560,
      '物业满意度(%)': 95,
      '毕业生人数(高中)': 500,
      '升学/建档人数(高中)': 450,
      '艺体参赛学生人数(年)': 300,
      '艺体获奖学生人数(年)': 50,
      '公用经费合计(万元)': 112.76,
      '受助学生人数(年)': 100,
      '免学费学生人数(高中,年)': 50,
      '住校生人数': 800,
      '助学金学生人数(高中,年)': 80
    }
  ];

  if (excelData.value.length > 0) {
    excelHeaders.value = Object.keys(excelData.value[0]);
  } else {
    excelHeaders.value = [];
  }
}

// 从Excel计算
function calculateFromExcel() {
  const schools: SchoolData[] = excelData.value.map((row, index) => ({
    id: index + 1,
    district: String(row['区域'] || ''),
    schoolName: String(row['学校名称'] || ''),
    studentCount: Number(row['在校生数']) || 0,
    fullTimeTeacherCount: Number(row['专任教师数']) || 0,
    classCount: Number(row['班级数']) || 0,
    landArea: Number(row['占地面积(平方米)']) || 0,
    buildingArea: Number(row['建筑面积(平方米)']) || 0,
    seniorTeacherCount: Number(row['高级教师数']) || 0,
    specialGradeTeacherCount: Number(row['特级教师数']) || 0,
    trainingFee: Number(row['培训费(万元)']) || 0,
    teachingMaterialFee: Number(row['教学耗材费(万元)']) || 0,
    campusServiceArea: Number(row['校园服务面积(平方米)']) || 0,
    propertyServicePeople: Number(row['物业服务师生人数']) || 0,
    propertySatisfaction: Number(row['物业满意度(%)']) || 0,
    graduateCount: Number(row['毕业生人数(高中)']) || 0,
    collegeEntranceCount: Number(row['升学/建档人数(高中)']) || 0,
    artsSportsParticipantCount: Number(row['艺体参赛学生人数(年)']) || 0,
    artsSportsAwardCount: Number(row['艺体获奖学生人数(年)']) || 0,
    publicFundingTotal: Number(row['公用经费合计(万元)']) || 0,
    supportedStudentCount: Number(row['受助学生人数(年)']) || 0,
    freeTuitionStudentCount: Number(row['免学费学生人数(高中,年)']) || 0,
    boarderCount: Number(row['住校生人数']) || 0,
    financialAidStudentCount: Number(row['助学金学生人数(高中,年)']) || 0
  }));

  performCalculation(schools);
}

// 计算均衡性分数
function calculateBalanceScores() {
  const validSchools = inputSchools.value.filter(school =>
    school.district && school.schoolName && school.studentCount > 0
  );

  if (validSchools.length === 0) {
    alert('请至少输入一个完整的学校数据');
    return;
  }

  performCalculation(validSchools);
}

// 执行计算（熵权-TOPSIS法）
function performCalculation(schools: SchoolData[]) {
  const m = schools.length;

  // 定义完整的指标体系
  const indicators = [
    // 师资力量指标
    { name: '生师比', type: 'cost' as const, getValue: (s: SchoolData) => s.studentCount / (s.fullTimeTeacherCount || 1) },
    { name: '高级教师比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.seniorTeacherCount / (s.fullTimeTeacherCount || 1) },
    { name: '特级教师比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.specialGradeTeacherCount / (s.fullTimeTeacherCount || 1) },

    // 办学条件指标
    { name: '生均占地面积', type: 'benefit' as const, getValue: (s: SchoolData) => s.landArea / (s.studentCount || 1) },
    { name: '生均建筑面积', type: 'benefit' as const, getValue: (s: SchoolData) => s.buildingArea / (s.studentCount || 1) },
    { name: '生均校园服务面积', type: 'benefit' as const, getValue: (s: SchoolData) => s.campusServiceArea / (s.studentCount || 1) },
    { name: '班均学生数', type: 'cost' as const, getValue: (s: SchoolData) => s.studentCount / (s.classCount || 1) },

    // 经费投入指标
    { name: '生均培训费', type: 'benefit' as const, getValue: (s: SchoolData) => s.trainingFee / (s.studentCount || 1) },
    { name: '生均教学耗材费', type: 'benefit' as const, getValue: (s: SchoolData) => s.teachingMaterialFee / (s.studentCount || 1) },
    { name: '生均公用经费', type: 'benefit' as const, getValue: (s: SchoolData) => s.publicFundingTotal / (s.studentCount || 1) },

    // 服务质量指标
    { name: '物业满意度', type: 'benefit' as const, getValue: (s: SchoolData) => s.propertySatisfaction },
    { name: '生均物业服务人数', type: 'benefit' as const, getValue: (s: SchoolData) => s.propertyServicePeople / (s.studentCount || 1) },

    // 教育成果指标
    { name: '高中升学率', type: 'benefit' as const, getValue: (s: SchoolData) => s.collegeEntranceCount / (s.graduateCount || 1) },
    { name: '艺体参与率', type: 'benefit' as const, getValue: (s: SchoolData) => s.artsSportsParticipantCount / (s.studentCount || 1) },
    { name: '艺体获奖率', type: 'benefit' as const, getValue: (s: SchoolData) => s.artsSportsAwardCount / (s.artsSportsParticipantCount || 1) },

    // 学生资助指标
    { name: '学生受助比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.supportedStudentCount / (s.studentCount || 1) },
    { name: '免学费比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.freeTuitionStudentCount / (s.studentCount || 1) },
    { name: '助学金比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.financialAidStudentCount / (s.studentCount || 1) },
    { name: '住校生比例', type: 'benefit' as const, getValue: (s: SchoolData) => s.boarderCount / (s.studentCount || 1) }
  ];

  const n = indicators.length;

  // 1. 建立原始矩阵
  const originalMatrix: number[][] = [];
  schools.forEach(school => {
    const row: number[] = [];
    indicators.forEach(indicator => {
      row.push(indicator.getValue(school));
    });
    originalMatrix.push(row);
  });

  // 2. 标准化矩阵
  const normalizedMatrix: number[][] = [];
  for (let i = 0; i < m; i++) {
    normalizedMatrix.push([]);
    for (let j = 0; j < n; j++) {
      const value = originalMatrix[i][j];
      if (indicators[j].type === 'benefit') {
        const max = Math.max(...originalMatrix.map(row => row[j]));
        normalizedMatrix[i][j] = value / max;
      } else {
        const min = Math.min(...originalMatrix.map(row => row[j]));
        normalizedMatrix[i][j] = min / value;
      }
    }
  }

  // 3. 计算熵值
  const entropy: number[] = [];
  for (let j = 0; j < n; j++) {
    const p: number[] = [];
    const columnSum = normalizedMatrix.reduce((sum, row) => sum + row[j], 0);
    for (let i = 0; i < m; i++) {
      p.push(normalizedMatrix[i][j] / columnSum);
    }

    let e = 0;
    for (let i = 0; i < m; i++) {
      if (p[i] > 0) {
        e += p[i] * Math.log(p[i]);
      }
    }
    e = -e / Math.log(m);
    entropy.push(e);
  }

  // 4. 计算权重
  const totalEntropyDiff = entropy.reduce((sum, e) => sum + (1 - e), 0);
  const weights = entropy.map(e => (1 - e) / totalEntropyDiff);

  // 保存权重信息
  indicatorWeights.value = indicators.map((indicator, index) => ({
    name: indicator.name,
    value: weights[index]
  }));

  // 5. TOPSIS法计算得分
  const weightedMatrix: number[][] = [];
  for (let i = 0; i < m; i++) {
    weightedMatrix.push([]);
    for (let j = 0; j < n; j++) {
      weightedMatrix[i][j] = normalizedMatrix[i][j] * weights[j];
    }
  }

  // 计算正理想解和负理想解
  const positiveIdeal: number[] = [];
  const negativeIdeal: number[] = [];
  for (let j = 0; j < n; j++) {
    const column = weightedMatrix.map(row => row[j]);
    positiveIdeal.push(Math.max(...column));
    negativeIdeal.push(Math.min(...column));
  }

  // 计算每个对象到正负理想解的距离
  const distancesToPositive: number[] = [];
  const distancesToNegative: number[] = [];
  for (let i = 0; i < m; i++) {
    let distPos = 0;
    let distNeg = 0;
    for (let j = 0; j < n; j++) {
      distPos += Math.pow(weightedMatrix[i][j] - positiveIdeal[j], 2);
      distNeg += Math.pow(weightedMatrix[i][j] - negativeIdeal[j], 2);
    }
    distancesToPositive.push(Math.sqrt(distPos));
    distancesToNegative.push(Math.sqrt(distNeg));
  }

  // 计算相对贴近度（均衡性分数）
  const results = schools.map((school, index) => {
    const score = distancesToNegative[index] / (distancesToPositive[index] + distancesToNegative[index]);
    return {
      ...school,
      balanceScore: score * 100
    };
  });

  calculationResults.value = results;

  nextTick(() => {
    renderScoreChart();
  });
}

// 渲染分数图表
function renderScoreChart() {
  if (!scoreChartRef.value) return;

  const chart = echarts.init(scoreChartRef.value);
  const sortedData = [...sortedResults.value].slice(0, 20);

  chart.setOption({
    title: {
      text: '学校均衡性分数排名',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>分数: ${data.value.toFixed(1)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(s => s.schoolName),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '分数',
      min: 0,
      max: 100
    },
    series: [{
      name: '均衡性分数',
      type: 'bar',
      data: sortedData.map(s => ({
        value: s.balanceScore,
        itemStyle: {
          color: getScoreColor(s.balanceScore || 0)
        }
      })),
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }]
  });
}

// 获取分数颜色
function getScoreColor(score: number): string {
  if (score >= 80) return '#67c23a';
  if (score >= 60) return '#e6a23c';
  return '#f56c6c';
}

// 获取分数等级
function getScoreLevel(score: number): string {
  if (score >= 80) return '优秀';
  if (score >= 70) return '良好';
  if (score >= 60) return '中等';
  return '待改进';
}

// 获取分数CSS类
function getScoreClass(score: number): string {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  return 'score-poor';
}

// 导出结果
function exportResults() {
  alert('导出功能待实现');
}

// 计算属性：排序后的结果
const sortedResults = computed(() => {
  return [...calculationResults.value].sort((a, b) =>
    (b.balanceScore || 0) - (a.balanceScore || 0)
  );
});
</script>

<style scoped>
/* 样式保持不变，与之前相同 */
.calculation-container {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.input-method-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.method-btn {
  padding: 12px 24px;
  border: 2px solid #409EFF;
  background: white;
  color: #409EFF;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-btn.active {
  background: #409EFF;
  color: white;
}

.manual-input-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-btn, .calculate-btn, .export-btn {
  background: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn {
  background: #909399;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.remove-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.schools-input-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.school-input-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 20px;
}

.school-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #606266;
}

.input-group input {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.excel-upload-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-content {
  color: #909399;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-btn {
  background: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.file-name {
  margin-top: 10px;
  color: #67c23a;
}

.excel-preview {
  margin-top: 20px;
}

.preview-table-container {
  overflow-x: auto;
  margin: 15px 0;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  border: 1px solid #e4e7ed;
  padding: 8px 12px;
  text-align: left;
}

.preview-table th {
  background: #f5f7fa;
  font-weight: bold;
}

.preview-note {
  text-align: center;
  color: #909399;
  margin-top: 10px;
}

.results-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.weights-display {
  margin-bottom: 30px;
}

.weights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.weight-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.weight-name {
  color: #606266;
}

.weight-value {
  font-weight: bold;
  color: #409EFF;
}

.results-table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  border: 1px solid #e4e7ed;
  padding: 12px;
  text-align: center;
}

.results-table th {
  background: #f5f7fa;
  font-weight: bold;
}

.results-table tr:hover {
  background: #f5f7fa;
}

.score-excellent {
  color: #67c23a;
  font-weight: bold;
}

.score-good {
  color: #e6a23c;
  font-weight: bold;
}

.score-poor {
  color: #f56c6c;
  font-weight: bold;
}

.results-charts {
  margin: 30px 0;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.export-actions {
  text-align: center;
  margin-top: 20px;
}
</style>
