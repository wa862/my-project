import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/DashBoard.vue'
import UserManagement from '@/views/UserManagement.vue'
import ArticleManagement from '@/views/ArticleManagement.vue'
import ResourceManagement from '@/views/ResourceManagement.vue'
import SurveyManagement from '@/views/SurveyManagement.vue'
import NationalPlatformManagement from '@/views/NationalPlatformManagement.vue'
import EnterprisePlatformManagement from '@/views/EnterprisePlatformManagement.vue'
import PolicyLibraryManagement from '@/views/PolicyLibraryManagement.vue'
import EduResourceManagement from '@/views/EduResourceManagement.vue'
import ResearchPlatformManagement from '@/views/ResearchPlatformManagement.vue'
import ThinktankManagement from '@/views/ThinktankManagement.vue'
import AboutPageAdmin from '@/views/AboutPageAdmin.vue'
import AdminLogin from '@/views/AdminLogin.vue'
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '数据概览' }
  },
  {
    path: '/user',
    name: 'UserManagement',
    component: UserManagement,
    meta: { title: '用户管理' }
  },
  {
    path: '/article',
    name: 'ArticleManagement',
    component: ArticleManagement,
    meta: { title: '文章管理' }
  },
  {
    path: '/resource',
    name: 'ResourceManagement',
    component: ResourceManagement,
    meta: { title: '资源管理' }
  },
  {
    path: '/survey',
    name: 'SurveyManagement',
    component: SurveyManagement,
    meta: { title: '调查问卷' }
  },
  {
    path: '/national-platform',
    name: 'NationalPlatformManagement',
    component: NationalPlatformManagement,
    meta: { title: '国家平台' }
  },
  {
    path: '/enterprise-platform',
    name: 'EnterprisePlatformManagement',
    component: EnterprisePlatformManagement,
    meta: { title: '企业平台' }
  },
  {
    path: '/policy-library',
    name: 'PolicyLibraryManagement',
    component: PolicyLibraryManagement,
    meta: { title: '政策库' }
  },
  {
    path: '/edu-resource',
    name: 'EduResourceManagement',
    component: EduResourceManagement,
    meta: { title: '教育资源' }
  },
  {
    path: '/research-platform',
    name: 'ResearchPlatformManagement',
    component: ResearchPlatformManagement,
    meta: { title: '研究平台' }
  },
  {
    path: '/thinktank',
    name: 'ThinktankManagement',
    component: ThinktankManagement,
    meta: { title: '智库管理' }
  },
  {
    path: '/about',
    name: 'AboutPageAdmin',
    component: AboutPageAdmin,
    meta: { title: '关于' }
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
