<template>
  <el-container class="layout-container">
    <el-aside :width="layoutStore.sidebarCollapsed ? '64px' : '200px'" class="layout-aside">
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo" v-if="!layoutStore.sidebarCollapsed">
        <img src="/logo-small.png" alt="Logo" class="logo-small" v-else>
      </div>
      <slot name="aside" :active-menu="activeMenu"></slot>
    </el-aside>
    
    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon 
            class="collapse-icon"
            @click="layoutStore.toggleSidebar"
          >
            <Fold v-if="!layoutStore.sidebarCollapsed"/>
            <Expand v-else/>
          </el-icon>
          <slot name="header-left"></slot>
        </div>
        <div class="header-right">
          <slot name="header-right"></slot>
        </div>
      </el-header>
      
      <el-main class="layout-main">
        <div class="main-wrapper">
          <div class="tab-container">
            <slot name="tabs" ref="tabViewRef"></slot>
          </div>
          <div class="main-content">
            <router-view></router-view>
          </div>
        </div>
      </el-main>
      
      <el-footer v-if="$slots.footer" height="50px" class="layout-footer">
        <slot name="footer"></slot>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { Fold, Expand } from '@element-plus/icons-vue'
import { useLayoutStore } from '../stores/layout'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const layoutStore = useLayoutStore()
const route = useRoute()
const tabViewRef = ref()
const activeMenu = ref(route.path)

// 监听路由变化
watch(() => route.path, (newPath) => {
  // 添加新标签
  tabViewRef.value?.addTab({
    title: route.meta.title as string,
    path: newPath
  })
  
  // 更新菜单激活状态
  activeMenu.value = newPath
})

// 添加监听标签页激活状态的变化
watch(() => tabViewRef.value?.activeTab, (newPath) => {
  if (newPath) {
    activeMenu.value = newPath
  }
}, { deep: true })
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
}

.logo {
  height: 32px;
  max-width: 180px;
}

.logo-small {
  height: 32px;
  max-width: 32px;
}

.layout-header {
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #303133;
}

.layout-main {
  background-color: #f0f2f5;
  padding: 0;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-container {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: #fff;
}

:deep(.el-tabs__header) {
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.layout-footer {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e6e6e6;
}
</style> 