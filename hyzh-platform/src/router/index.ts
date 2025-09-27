import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginForm from '@/pages/LoginForm.vue'
import RegisterForm from '@/pages/RegisterForm.vue'
import NewsPage from '@/pages/NewsPage.vue'
import DatabasePageVue from '@/pages/DatabasePage.vue'
import DashBoard from '@/pages/DashBoard.vue'
import NationalRegionalDbPageVue from '@/pages/db/NationalRegionalDbPage.vue'
import UniversityDbPageVue from '@/pages/db/UniversityDbPage.vue'
import NationalPlatformVue from '@/pages/platform/NationalPlatform.vue'
import CompanyPlatformVue from '@/pages/platform/CompanyPlatform.vue'
import PolicyLibraryPageVue from '@/pages/PolicyLibraryPage.vue'
import EducationResourcePageVue from '@/pages/EducationResourcePage.vue'
import ThinkTankPageVue from '@/pages/ThinkTankPage.vue'
import ResearchSupportPageVue from '@/pages/ResearchSupportPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import SmartQAPage from '@/pages/SmartQAPage.vue'
const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/register', name: 'register', component: RegisterForm },
  //{ path: '/results', name: 'results', component: () => import('@/pages/ResultsPage.vue') },
  { path: '/news', name: 'news', component: NewsPage },
  { path: '/database', name: 'database', component: DatabasePageVue },
  { path: '/dashboard', name: 'dashboard', component: DashBoard },
  { path: '/db/university', name: 'university-db', component: UniversityDbPageVue },
  { path: '/platform/national', name: 'national-platform', component: NationalPlatformVue },
  { path: '/platform/company', name: 'company-platform', component: CompanyPlatformVue },
  {
    path: '/national-regional-db',
    name: 'national-regional-db',
    component: NationalRegionalDbPageVue,
  },
  {path: '/policy-library', name: 'policy-library', component: PolicyLibraryPageVue},
  {path: '/education-resource', name: 'education-resource', component: EducationResourcePageVue},
  {path:'/dashboard2', name: 'dashboard2', component: ResearchSupportPageVue},
  {path:'/data-service/extension1', name: 'data-service-extension1', component: ThinkTankPageVue},
  {path:'/smart-qa', name: 'smart-qa', component: SmartQAPage},
  {path:'/about', name: 'about', component: AboutPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
