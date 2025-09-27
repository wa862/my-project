<template>
  <el-dropdown trigger="hover" placement="bottom-start" :hide-on-click="false">
    <span class="dropdown-link">实践应用 </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <router-link to="/education-resource" class="dropdown-item-link">教学资源</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/dashboard2" class="dropdown-item-link">科技支持</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/data-service/extension1" class="dropdown-item-link"
            >智库研究</router-link
          >
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* 去除点击后的边框 */
:deep(.el-dropdown__caret-button:focus) {
  outline: none !important;
}

:deep(.el-dropdown__caret-button:hover) {
  outline: none !important;
}

.dropdown-link {
  display: inline-flex;
  align-items: center;
  padding: 0 0px;
  height: 100%;
  color: var(--el-text-color-primary);
  font-size: 17px;
  cursor: pointer;
  transition: all 0.3s;
  outline: none !important; /* 确保没有轮廓线 */
  margin-top: 1px;
}

.dropdown-link:hover {
  color: var(--el-color-primary);
}

.dropdown-item-link {
  display: block;
  width: 100%;
  padding: 10px 15px;
  color: var(--el-text-color-regular);
  text-decoration: none;
  outline: none !important; /* 确保没有轮廓线 */
}

.dropdown-item-link:hover {
  color: var(--el-color-primary);
}

.el-dropdown-menu {
  margin-top: 5px;
}

/* 去除下拉菜单项的焦点边框 */
:deep(.el-dropdown-menu__item:focus) {
  outline: none !important;
  background-color: transparent !important;
}

/* 去除激活状态的下划线 */
:deep(.router-link-active) {
  text-decoration: none !important;
}
</style>
