<template>
  <el-menu
    :default-active="modelValue"
    class="side-menu"
    :collapse="layoutStore.sidebarCollapsed"
    :unique-opened="true"
    @select="handleSelect"
    :popper-options="{
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            enabled: true
          }
        }
      ]
    }"
  >
    <template v-for="menu in menus" :key="menu.path">
      <el-sub-menu v-if="menu.children" :index="menu.path">
        <template #title>
          <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item 
          v-for="child in menu.children" 
          :key="child.path" 
          :index="child.path"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.path">
        <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
        <span>{{ menu.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLayoutStore } from '../stores/layout'
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  title: string
  path: string
  icon?: string
  children?: MenuItem[]
}

const props = defineProps<{
  menus: MenuItem[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'select', path: string, title: string): void
  (e: 'update:modelValue', value: string): void
}>()

const layoutStore = useLayoutStore()
const router = useRouter()
const route = useRoute()

const findMenuItem = (items: MenuItem[]): MenuItem | undefined => {
  for (const item of items) {
    if (item.path === route.path) return item
    if (item.children) {
      const found = findMenuItem(item.children)
      if (found) return found
    }
  }
}

onMounted(() => {
  // 等待路由更新完成后再执行
  router.isReady().then(() => {
    const currentPath = route.path
    
    const menuItem = findMenuItem(props.menus)
    
    if (menuItem) {
      emit('select', currentPath, menuItem.title)
      emit('update:modelValue', currentPath)
    } else {
      console.warn('未找到匹配的菜单项，路径:', currentPath)
    }
  })
})

const handleSelect = (path: string) => {
  // 使用选中的路径查找对应的菜单项
  const findMenuItemByPath = (items: MenuItem[], targetPath: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.path === targetPath) return item
      if (item.children) {
        const found = findMenuItemByPath(item.children, targetPath)
        if (found) return found
      }
    }
  }

  const menuItem = findMenuItemByPath(props.menus, path)
  if (menuItem) {
    emit('select', path, menuItem.title)
    emit('update:modelValue', path)
    router.push(path)
  }
}
</script>

<style scoped>
.side-menu {
  height: 100vh;
  border-right: solid 1px #e6e6e6;
}

.side-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu--collapse {
  width: 64px;
}

:deep(.el-menu--popup) {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

:deep(.el-sub-menu__title):hover,
:deep(.el-menu-item):hover {
  outline: none;
}
</style> 