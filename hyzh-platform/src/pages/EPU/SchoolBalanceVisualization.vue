<template>
  <div class="school-visualization-container">
    <header class="header">
      <h1>石家庄地区学校教育均衡性评价可视化平台</h1>
      <p>基于在校生数、师资力量与校园资源的综合分析</p>
    </header>

    <!-- 区域选择 -->
    <div class="control-panel">
      <label for="districtSelect">选择区域：</label>
      <select id="districtSelect" v-model="selectedDistrict" @change="filterSchools">
        <option value="all">全部区域</option>
        <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>

    <!-- 图表容器 -->
    <template v-if="filteredSchools.length > 0">
      <!-- 饼图容器 - 三个饼图水平排列 -->
      <div class="pie-charts-container">
        <div class="pie-chart-item">
          <div ref="studentPieChartRef" class="chart-container" style="height:300px;"></div>
          <h3>在校生数分布</h3>
        </div>
        <div class="pie-chart-item">
          <div ref="teacherPieChartRef" class="chart-container" style="height:300px;"></div>
          <h3>专任教师数分布</h3>
        </div>
        <div class="pie-chart-item">
          <div ref="areaPieChartRef" class="chart-container" style="height:300px;"></div>
          <h3>建筑面积分布</h3>
        </div>
      </div>

      <!-- 中间：折线图 - 显示均衡性分数 -->
      <div ref="lineChartRef" class="chart-container" style="height:350px;margin-top:20px;"></div>

      <!-- 下方：条形图 -->
      <div ref="barChartRef" class="chart-container" style="height:350px;margin-top:20px;"></div>
    </template>

    <!-- 空数据提示 -->
    <div v-else class="empty-state">
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

// 定义学校数据类型 - 根据SQL表结构
interface School {
  id: number;
  district: string;
  schoolName: string;
  studentCount: number;
  fullTimeTeacherCount: number;
  buildingArea: number;
  seniorTeacherCount: number;
  specialGradeTeacherCount: number;
  aidedStudentCount: number;
  balanceScore: number;
}

// 静态数据 - 根据SQL文件中的所有72条记录整理
const allSchools: School[] = [
  // 长安区 (1-12)
  { id: 1, district: '长安区', schoolName: '石家庄市第十二中学', studentCount: 2400, fullTimeTeacherCount: 160, buildingArea: 45070, seniorTeacherCount: 46, specialGradeTeacherCount: 2, aidedStudentCount: 60, balanceScore: 78.2 },
  { id: 2, district: '长安区', schoolName: '石家庄市第十三中学', studentCount: 1052, fullTimeTeacherCount: 167, buildingArea: 38317, seniorTeacherCount: 34, specialGradeTeacherCount: 0, aidedStudentCount: 140, balanceScore: 75.5 },
  { id: 3, district: '长安区', schoolName: '石家庄市第二十一中学', studentCount: 1925, fullTimeTeacherCount: 121, buildingArea: 14700, seniorTeacherCount: 48, specialGradeTeacherCount: 0, aidedStudentCount: 13, balanceScore: 62.8 },
  { id: 4, district: '长安区', schoolName: '石家庄市第二十二中学', studentCount: 4000, fullTimeTeacherCount: 240, buildingArea: 30000, seniorTeacherCount: 46, specialGradeTeacherCount: 2, aidedStudentCount: 192, balanceScore: 73.6 },
  { id: 5, district: '长安区', schoolName: '石家庄市第二十三中学', studentCount: 4000, fullTimeTeacherCount: 455, buildingArea: 11500, seniorTeacherCount: 12, specialGradeTeacherCount: 2, aidedStudentCount: 160, balanceScore: 68.9 },
  { id: 6, district: '长安区', schoolName: '石家庄市第四十五中学', studentCount: 2682, fullTimeTeacherCount: 178, buildingArea: 12000, seniorTeacherCount: 31, specialGradeTeacherCount: 2, aidedStudentCount: 10, balanceScore: 65.3 },
  { id: 7, district: '长安区', schoolName: '石家庄市第五十中学', studentCount: 1200, fullTimeTeacherCount: 89, buildingArea: 11008, seniorTeacherCount: 5, specialGradeTeacherCount: 0, aidedStudentCount: 2, balanceScore: 52.7 },
  { id: 8, district: '长安区', schoolName: '石家庄市第五十三中学', studentCount: 914, fullTimeTeacherCount: 66, buildingArea: 3813, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 10, balanceScore: 48.5 },
  { id: 9, district: '长安区', schoolName: '石家庄市第八十一中学', studentCount: 2700, fullTimeTeacherCount: 357, buildingArea: 22382, seniorTeacherCount: 108, specialGradeTeacherCount: 1, aidedStudentCount: 1, balanceScore: 71.4 },
  { id: 10, district: '长安区', schoolName: '石家庄市第八十九中学', studentCount: 600, fullTimeTeacherCount: 55, buildingArea: 6216, seniorTeacherCount: 17, specialGradeTeacherCount: 0, aidedStudentCount: 13, balanceScore: 45.9 },
  { id: 11, district: '长安区', schoolName: '石家庄市北附学校', studentCount: 3235, fullTimeTeacherCount: 159, buildingArea: 57000, seniorTeacherCount: 14, specialGradeTeacherCount: 1, aidedStudentCount: 5, balanceScore: 67.8 },
  { id: 12, district: '长安区', schoolName: '石家庄市第七中学', studentCount: 482, fullTimeTeacherCount: 24, buildingArea: 11702, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 3, balanceScore: 41.2 },

  // 桥西区 (13-20)
  { id: 13, district: '桥西区', schoolName: '石家庄市第二十中学', studentCount: 1600, fullTimeTeacherCount: 163, buildingArea: 19677, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 4, balanceScore: 54.3 },
  { id: 14, district: '桥西区', schoolName: '石家庄市第四十一中学', studentCount: 6000, fullTimeTeacherCount: 172, buildingArea: 1847, seniorTeacherCount: 36, specialGradeTeacherCount: 1, aidedStudentCount: 12, balanceScore: 58.6 },
  { id: 15, district: '桥西区', schoolName: '石家庄市第六中学', studentCount: 4000, fullTimeTeacherCount: 303, buildingArea: 27384, seniorTeacherCount: 55, specialGradeTeacherCount: 6, aidedStudentCount: 10, balanceScore: 82.7 },
  { id: 16, district: '桥西区', schoolName: '石家庄市第十一中学', studentCount: 3000, fullTimeTeacherCount: 252, buildingArea: 34395, seniorTeacherCount: 76, specialGradeTeacherCount: 1, aidedStudentCount: 8, balanceScore: 76.9 },
  { id: 17, district: '桥西区', schoolName: '石家庄市第三中学', studentCount: 476, fullTimeTeacherCount: 67, buildingArea: 26000, seniorTeacherCount: 15, specialGradeTeacherCount: 0, aidedStudentCount: 6, balanceScore: 59.1 },
  { id: 18, district: '桥西区', schoolName: '石家庄市第四中学', studentCount: 600, fullTimeTeacherCount: 206, buildingArea: 26530, seniorTeacherCount: 58, specialGradeTeacherCount: 0, aidedStudentCount: 9, balanceScore: 64.8 },
  { id: 19, district: '桥西区', schoolName: '石家庄市第十中学', studentCount: 3050, fullTimeTeacherCount: 235, buildingArea: 37686, seniorTeacherCount: 66, specialGradeTeacherCount: 0, aidedStudentCount: 11, balanceScore: 73.2 },
  { id: 20, district: '桥西区', schoolName: '石家庄市第十七中学', studentCount: 3500, fullTimeTeacherCount: 260, buildingArea: 35000, seniorTeacherCount: 51, specialGradeTeacherCount: 0, aidedStudentCount: 15, balanceScore: 80.5 },

  // 新华区 (21-25)
  { id: 21, district: '新华区', schoolName: '石家庄市第二十八中学', studentCount: 5081, fullTimeTeacherCount: 379, buildingArea: 24323, seniorTeacherCount: 99, specialGradeTeacherCount: 4, aidedStudentCount: 9, balanceScore: 79.3 },
  { id: 22, district: '新华区', schoolName: '石家庄市第十八中学', studentCount: 3200, fullTimeTeacherCount: 220, buildingArea: 40000, seniorTeacherCount: 65, specialGradeTeacherCount: 3, aidedStudentCount: 6, balanceScore: 77.6 },
  { id: 23, district: '新华区', schoolName: '石家庄市第四十二中学', studentCount: 6000, fullTimeTeacherCount: 280, buildingArea: 33014, seniorTeacherCount: 85, specialGradeTeacherCount: 2, aidedStudentCount: 5, balanceScore: 81.9 },
  { id: 24, district: '新华区', schoolName: '石家庄市第三十八中学', studentCount: 2200, fullTimeTeacherCount: 168, buildingArea: 18000, seniorTeacherCount: 68, specialGradeTeacherCount: 0, aidedStudentCount: 5, balanceScore: 67.4 },
  { id: 25, district: '新华区', schoolName: '石家庄市第三十七中学', studentCount: 820, fullTimeTeacherCount: 89, buildingArea: 10500, seniorTeacherCount: 23, specialGradeTeacherCount: 0, aidedStudentCount: 7, balanceScore: 53.8 },

  // 裕华区 (26-31)
  { id: 26, district: '裕华区', schoolName: '石家庄市第八中学', studentCount: 760, fullTimeTeacherCount: 62, buildingArea: 9720, seniorTeacherCount: 15, specialGradeTeacherCount: 0, aidedStudentCount: 12, balanceScore: 56.4 },
  { id: 27, district: '裕华区', schoolName: '石家庄市第二十五中学', studentCount: 1400, fullTimeTeacherCount: 60, buildingArea: 9620, seniorTeacherCount: 25, specialGradeTeacherCount: 1, aidedStudentCount: 20, balanceScore: 61.7 },
  { id: 28, district: '裕华区', schoolName: '石家庄市第二十七中学', studentCount: 2500, fullTimeTeacherCount: 281, buildingArea: 41954, seniorTeacherCount: 76, specialGradeTeacherCount: 3, aidedStudentCount: 10, balanceScore: 75.8 },
  { id: 29, district: '裕华区', schoolName: '石家庄市第四十中学', studentCount: 3600, fullTimeTeacherCount: 53, buildingArea: 13979.89, seniorTeacherCount: 26, specialGradeTeacherCount: 3, aidedStudentCount: 2, balanceScore: 63.5 },
  { id: 30, district: '裕华区', schoolName: '石家庄外国语学校', studentCount: 5000, fullTimeTeacherCount: 294, buildingArea: 105244, seniorTeacherCount: 9, specialGradeTeacherCount: 4, aidedStudentCount: 1, balanceScore: 78.5 },
  { id: 31, district: '裕华区', schoolName: '石家庄市第四十九中学', studentCount: 1570, fullTimeTeacherCount: 120, buildingArea: 8259, seniorTeacherCount: 162, specialGradeTeacherCount: 39, aidedStudentCount: 37, balanceScore: 83.6 },

  // 新乐市 (32-34)
  { id: 32, district: '新乐市', schoolName: '新乐市第一中学', studentCount: 1536, fullTimeTeacherCount: 60, buildingArea: 85652.66, seniorTeacherCount: 0, specialGradeTeacherCount: 1, aidedStudentCount: 95, balanceScore: 69.2 },
  { id: 33, district: '新乐市', schoolName: '新乐市实验学校', studentCount: 3496, fullTimeTeacherCount: 121, buildingArea: 32063.14, seniorTeacherCount: 77, specialGradeTeacherCount: 3, aidedStudentCount: 498, balanceScore: 72.4 },
  { id: 34, district: '新乐市', schoolName: '新乐市博林中学', studentCount: 2200, fullTimeTeacherCount: 150, buildingArea: 20060, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 285, balanceScore: 57.9 },

  // 平山县 (35-36)
  { id: 35, district: '平山县', schoolName: '平山县外国语中学', studentCount: 3700, fullTimeTeacherCount: 203, buildingArea: 22693, seniorTeacherCount: 19, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 70.1 },
  { id: 36, district: '平山县', schoolName: '河北平山古月中学', studentCount: 1400, fullTimeTeacherCount: 43, buildingArea: 23647.5, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 58.3 },

  // 赵县 (37-41)
  { id: 37, district: '赵县', schoolName: '赵县石塔中学', studentCount: 775, fullTimeTeacherCount: 22, buildingArea: 35150, seniorTeacherCount: 7, specialGradeTeacherCount: 0, aidedStudentCount: 16, balanceScore: 54.7 },
  { id: 38, district: '赵县', schoolName: '赵县第三中学', studentCount: 0, fullTimeTeacherCount: 0, buildingArea: 13592, seniorTeacherCount: 6, specialGradeTeacherCount: 0, aidedStudentCount: 131, balanceScore: 38.5 },
  { id: 39, district: '赵县', schoolName: '赵县赵州镇中学', studentCount: 2381, fullTimeTeacherCount: 144, buildingArea: 45837, seniorTeacherCount: 83, specialGradeTeacherCount: 0, aidedStudentCount: 128, balanceScore: 74.8 },
  { id: 40, district: '赵县', schoolName: '赵县李春学校', studentCount: 160, fullTimeTeacherCount: 12, buildingArea: 19136, seniorTeacherCount: 1, specialGradeTeacherCount: 1, aidedStudentCount: 24, balanceScore: 49.6 },
  { id: 41, district: '赵县', schoolName: '赵县职工子弟学校', studentCount: 4300, fullTimeTeacherCount: 228, buildingArea: 22281, seniorTeacherCount: 47, specialGradeTeacherCount: 20, aidedStudentCount: 14, balanceScore: 76.3 },

  // 晋州县 (42-45)
  { id: 42, district: '晋州县', schoolName: '晋州市第七中学', studentCount: 1300, fullTimeTeacherCount: 0, buildingArea: 20310, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 42.8 },
  { id: 43, district: '晋州县', schoolName: '晋州市第三中学', studentCount: 2500, fullTimeTeacherCount: 120, buildingArea: 11000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 49.3 },
  { id: 44, district: '晋州县', schoolName: '晋州市实验中学', studentCount: 2000, fullTimeTeacherCount: 141, buildingArea: 23000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 53.1 },
  { id: 45, district: '晋州县', schoolName: '晋州市第四中学', studentCount: 1244, fullTimeTeacherCount: 92, buildingArea: 40012, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 47.6 },

  // 栾城区 (46-47)
  { id: 46, district: '栾城区', schoolName: '栾城区第五中学', studentCount: 2100, fullTimeTeacherCount: 150, buildingArea: 26136.86, seniorTeacherCount: 24, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 65.7 },
  { id: 47, district: '栾城区', schoolName: '栾城区第七中学', studentCount: 1715, fullTimeTeacherCount: 304, buildingArea: 800, seniorTeacherCount: 83, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 48.9 },

  // 高邑区 (48-50)
  { id: 48, district: '高邑区', schoolName: '高邑县第三中学', studentCount: 2600, fullTimeTeacherCount: 129, buildingArea: 24600, seniorTeacherCount: 37, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 56.2 },
  { id: 49, district: '高邑区', schoolName: '高邑县第二中学', studentCount: 1300, fullTimeTeacherCount: 121, buildingArea: 0, seniorTeacherCount: 45, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 45.3 },
  { id: 50, district: '高邑区', schoolName: '高邑县第四中学', studentCount: 484, fullTimeTeacherCount: 40, buildingArea: 8519, seniorTeacherCount: 17, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 43.7 },

  // 赞皇区 (51-55)
  { id: 51, district: '赞皇区', schoolName: '赞皇县第一中学', studentCount: 6844, fullTimeTeacherCount: 445, buildingArea: 34968, seniorTeacherCount: 67, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 67.8 },
  { id: 52, district: '赞皇区', schoolName: '赞皇县第二中学', studentCount: 3960, fullTimeTeacherCount: 218, buildingArea: 43000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 59.5 },
  { id: 53, district: '赞皇区', schoolName: '赞皇县第三中学', studentCount: 2306, fullTimeTeacherCount: 170, buildingArea: 36200, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 51.4 },
  { id: 54, district: '赞皇区', schoolName: '赞皇县第四中学', studentCount: 2400, fullTimeTeacherCount: 180, buildingArea: 35000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 54.9 },
  { id: 55, district: '赞皇区', schoolName: '赞皇县南邢郭镇中学', studentCount: 240, fullTimeTeacherCount: 45, buildingArea: 0, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 40.8 },

  // 元氏区 (56)
  { id: 56, district: '元氏区', schoolName: '石家庄市元氏县实验中学', studentCount: 2400, fullTimeTeacherCount: 145, buildingArea: 23000, seniorTeacherCount: 16, specialGradeTeacherCount: 0, aidedStudentCount: 16, balanceScore: 63.9 },

  // 鹿泉区 (57-60)
  { id: 57, district: '鹿泉区', schoolName: '鹿泉区实验初级中学', studentCount: 2300, fullTimeTeacherCount: 118, buildingArea: 7618, seniorTeacherCount: 13, specialGradeTeacherCount: 0, aidedStudentCount: 25, balanceScore: 57.2 },
  { id: 58, district: '鹿泉区', schoolName: '鹿泉区育才中学', studentCount: 1800, fullTimeTeacherCount: 154, buildingArea: 14292, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 16, balanceScore: 62.4 },
  { id: 59, district: '鹿泉区', schoolName: '宜安镇中学', studentCount: 1089, fullTimeTeacherCount: 96, buildingArea: 14000, seniorTeacherCount: 2, specialGradeTeacherCount: 0, aidedStudentCount: 20, balanceScore: 55.6 },
  { id: 60, district: '鹿泉区', schoolName: '上寨乡中学', studentCount: 502, fullTimeTeacherCount: 71, buildingArea: 0, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 10, balanceScore: 42.3 },

  // 藁城区 (61-65)
  { id: 61, district: '藁城区', schoolName: '藁城区实验中学', studentCount: 3146, fullTimeTeacherCount: 213, buildingArea: 159000, seniorTeacherCount: 41, specialGradeTeacherCount: 5, aidedStudentCount: 10, balanceScore: 78.9 },
  { id: 62, district: '藁城区', schoolName: '廉州镇第一中学', studentCount: 1400, fullTimeTeacherCount: 125, buildingArea: 28000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 61.8 },
  { id: 63, district: '藁城区', schoolName: '增村镇中学', studentCount: 2105, fullTimeTeacherCount: 98, buildingArea: 0, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 595, balanceScore: 58.7 },
  { id: 64, district: '藁城区', schoolName: '南董镇中学', studentCount: 1137, fullTimeTeacherCount: 78, buildingArea: 0, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 200, balanceScore: 53.5 },
  { id: 65, district: '藁城区', schoolName: '九门回族乡中学', studentCount: 1500, fullTimeTeacherCount: 75, buildingArea: 0, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 45, balanceScore: 56.9 },

  // 井陉区 (66-67)
  { id: 66, district: '井陉区', schoolName: '小作中学', studentCount: 1000, fullTimeTeacherCount: 100, buildingArea: 20000, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 59.4 },
  { id: 67, district: '井陉区', schoolName: '障城中学', studentCount: 948, fullTimeTeacherCount: 54, buildingArea: 0, seniorTeacherCount: 4, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 47.1 },

  // 深泽区 (68)
  { id: 68, district: '深泽区', schoolName: '深泽镇中学', studentCount: 1788, fullTimeTeacherCount: 190, buildingArea: 4985, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 0, balanceScore: 58.8 },

  // 正定县 (69)
  { id: 69, district: '正定县', schoolName: '正定六中', studentCount: 2891, fullTimeTeacherCount: 164, buildingArea: 4985, seniorTeacherCount: 19, specialGradeTeacherCount: 0, aidedStudentCount: 5, balanceScore: 62.5 },

  // 行唐县 (70-72)
  { id: 70, district: '行唐县', schoolName: '河北省行唐县第一中学', studentCount: 4200, fullTimeTeacherCount: 336, buildingArea: 113400, seniorTeacherCount: 84, specialGradeTeacherCount: 19, aidedStudentCount: 76, balanceScore: 77.3 },
  { id: 71, district: '行唐县', schoolName: '行唐县第五中学', studentCount: 1700, fullTimeTeacherCount: 103, buildingArea: 19000, seniorTeacherCount: 13, specialGradeTeacherCount: 0, aidedStudentCount: 20, balanceScore: 65.8 },
  { id: 72, district: '行唐县', schoolName: '行唐县第三中学', studentCount: 1600, fullTimeTeacherCount: 98, buildingArea: 14813, seniorTeacherCount: 0, specialGradeTeacherCount: 0, aidedStudentCount: 150, balanceScore: 61.3 }
];

// Refs
const studentPieChartRef = ref<HTMLDivElement | null>(null);
const teacherPieChartRef = ref<HTMLDivElement | null>(null);
const areaPieChartRef = ref<HTMLDivElement | null>(null);
const lineChartRef = ref<HTMLDivElement | null>(null);
const barChartRef = ref<HTMLDivElement | null>(null);

const districts = ref<string[]>([]);
const selectedDistrict = ref("all");
const filteredSchools = ref<School[]>([]);

// 初始化数据
const initializeData = () => {
  // 从所有学校数据中提取区域列表
  const districtSet = new Set(allSchools.map(school => school.district));
  districts.value = Array.from(districtSet).sort();

  // 初始化显示所有学校
  filteredSchools.value = allSchools;

  // 渲染图表
  renderCharts();
};

// 根据选择的区域筛选学校
const filterSchools = () => {
  if (selectedDistrict.value === "all") {
    filteredSchools.value = allSchools;
  } else {
    filteredSchools.value = allSchools.filter(school => school.district === selectedDistrict.value);
  }
  renderCharts();
};

// 渲染图表
const renderCharts = (): void => {
  if (!filteredSchools.value.length) {
    console.warn('没有学校数据可渲染');
    return;
  }

  try {
    // 检查DOM元素是否存在，避免初始化失败
    if (studentPieChartRef.value && teacherPieChartRef.value && areaPieChartRef.value) {
      renderPieCharts();
    }
    if (lineChartRef.value) {
      renderLineChart();
    }
    if (barChartRef.value) {
      renderBarChart();
    }
    console.log('图表渲染完成');
  } catch (error) {
    console.error('渲染图表失败:', error);
  }
};

// 计算平均数的辅助函数
const avg = (numbers: number[]): number => {
  const validNumbers = numbers.filter(num => num > 0);
  if (!validNumbers.length) return 0;
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / validNumbers.length) * 10) / 10; // 保留一位小数
};

// 组件挂载时初始化数据
onMounted((): void => {
  console.log('组件挂载，开始初始化数据');
  initializeData();
  console.log('数据初始化完成');
});

// 渲染饼图
const renderPieCharts = (): void => {
  if (selectedDistrict.value === "all") {
    // 全部区域：按区域聚合数据
    renderDistrictPieCharts();
  } else {
    // 单个区域：按学校显示数据
    renderSchoolPieCharts();
  }
};

// 按区域显示饼图
const renderDistrictPieCharts = (): void => {
  const districtData: Record<string, { students: number; teachers: number; area: number }> = {};

  // 聚合各区域数据
  filteredSchools.value.forEach(school => {
    if (!districtData[school.district]) {
      districtData[school.district] = {
        students: 0,
        teachers: 0,
        area: 0
      };
    }
    districtData[school.district].students += school.studentCount || 0;
    districtData[school.district].teachers += school.fullTimeTeacherCount || 0;
    districtData[school.district].area += school.buildingArea || 0;
  });

  const districtsList = Object.keys(districtData);

  // 在校生数饼图
  const studentPieChart = echarts.init(studentPieChartRef.value!);
  studentPieChart.setOption({
    title: { text: "各区域在校生数分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "在校生数",
      type: "pie",
      radius: "55%",
      data: districtsList.map(district => ({
        value: districtData[district].students,
        name: district
      }))
    }]
  });

  // 专任教师数饼图
  const teacherPieChart = echarts.init(teacherPieChartRef.value!);
  teacherPieChart.setOption({
    title: { text: "各区域专任教师数分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "专任教师数",
      type: "pie",
      radius: "55%",
      data: districtsList.map(district => ({
        value: districtData[district].teachers,
        name: district
      }))
    }]
  });

  // 建筑面积饼图
  const areaPieChart = echarts.init(areaPieChartRef.value!);
  areaPieChart.setOption({
    title: { text: "各区域建筑面积分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "建筑面积",
      type: "pie",
      radius: "55%",
      data: districtsList.map(district => ({
        value: districtData[district].area,
        name: district
      }))
    }]
  });
};

// 按学校显示饼图
const renderSchoolPieCharts = (): void => {
  const sortedSchools = [...filteredSchools.value].sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));

  // 在校生数饼图
  const studentPieChart = echarts.init(studentPieChartRef.value!);
  studentPieChart.setOption({
    title: { text: "各学校在校生数分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "在校生数",
      type: "pie",
      radius: "55%",
      data: sortedSchools.map(school => ({
        value: school.studentCount || 0,
        name: school.schoolName
      }))
    }]
  });

  // 专任教师数饼图
  const teacherPieChart = echarts.init(teacherPieChartRef.value!);
  teacherPieChart.setOption({
    title: { text: "各学校专任教师数分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "专任教师数",
      type: "pie",
      radius: "55%",
      data: sortedSchools.map(school => ({
        value: school.fullTimeTeacherCount || 0,
        name: school.schoolName
      }))
    }]
  });

  // 建筑面积饼图
  const areaPieChart = echarts.init(areaPieChartRef.value!);
  areaPieChart.setOption({
    title: { text: "各学校建筑面积分布", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    series: [{
      name: "建筑面积",
      type: "pie",
      radius: "55%",
      data: sortedSchools.map(school => ({
        value: school.buildingArea || 0,
        name: school.schoolName
      }))
    }]
  });
};

// 渲染折线图 - 显示均衡性分数
const renderLineChart = (): void => {
  const lineChart = echarts.init(lineChartRef.value!);
  if (selectedDistrict.value === "all") {
    // 全部区域：计算每个区域的平均均衡性分数
    const districtData: Record<string, School[]> = {};
    filteredSchools.value.forEach(s => {
      if (!districtData[s.district]) districtData[s.district] = [];
      districtData[s.district].push(s);
    });

    const districtNames = Object.keys(districtData);
    const avgBalanceScores = districtNames.map(d =>
      avg(districtData[d].map(s => s.balanceScore || 0))
    );

    lineChart.setOption({
      title: { text: "各区均衡性平均分数", left: "center" },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const data = params[0];
          return `${data.name}<br/>平均分数: ${data.value}`;
        }
      },
      xAxis: {
        type: "category",
        data: districtNames,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        name: '分数'
      },
      series: [
        {
          name: "均衡性分数",
          type: "line",
          data: avgBalanceScores,
          itemStyle: {
            color: '#5470c6'
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    });
  } else {
    // 单个区域：显示每个学校的均衡性分数
    const sortedSchools = [...filteredSchools.value].sort((a, b) => (b.balanceScore || 0) - (a.balanceScore || 0));
    const xNames = sortedSchools.map(s => s.schoolName);
    const balanceScores = sortedSchools.map(s => s.balanceScore || 0);

    lineChart.setOption({
      title: { text: `${selectedDistrict.value} 各学校均衡性分数`, left: "center" },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const data = params[0];
          return `${data.name}<br/>均衡性分数: ${data.value}`;
        }
      },
      xAxis: {
        type: "category",
        data: xNames,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        name: '分数'
      },
      series: [
        {
          name: "均衡性分数",
          type: "line",
          data: balanceScores,
          itemStyle: {
            color: '#91cc75'
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    });
  }
};

// 渲染条形图
const renderBarChart = (): void => {
  const barChart = echarts.init(barChartRef.value!);
  const seniorTeachers = filteredSchools.value.map(s => s.seniorTeacherCount || 0);
  const specialTeachers = filteredSchools.value.map(s => s.specialGradeTeacherCount || 0);
  const aidedStudents = filteredSchools.value.map(s => s.aidedStudentCount || 0);
  const names = filteredSchools.value.map(s => s.schoolName);

  barChart.setOption({
    title: { text: "高级教师 / 特级教师 / 助学金学生条形图", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["高级教师数", "特级教师数", "助学金学生人数"], top: 25 },
    xAxis: {
      type: "category",
      data: names,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: { type: "value" },
    series: [
      { name: "高级教师数", type: "bar", data: seniorTeachers },
      { name: "特级教师数", type: "bar", data: specialTeachers },
      { name: "助学金学生人数", type: "bar", data: aidedStudents }
    ]
  });
};

watch(selectedDistrict, filterSchools);
</script>

<style scoped>
.school-visualization-container {
  padding: 20px;
  background: #f8fafc;
}
.header {
  text-align: center;
  margin-bottom: 10px;
}
.control-panel {
  text-align: center;
  margin: 10px 0;
}
.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.pie-charts-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}
.pie-chart-item {
  flex: 1;
  text-align: center;
}
.pie-chart-item h3 {
  margin-top: 10px;
  color: #333;
  font-size: 14px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
  font-size: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-top: 20px;
}
</style>
