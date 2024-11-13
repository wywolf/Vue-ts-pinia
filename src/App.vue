<template>
  <layout ref="layoutRef">
    <template #aside>
      <SideMenu
        v-model="activeMenu"
        :menus="menus"
        @select="handleMenuSelect"
        :is-collapse="layoutRef?.isCollapse"
      />
    </template>
    
    <template #header-left>
      <tab-view
        ref="tabViewRef"
        v-model="currentPath"
        @tab-click="handleTabClick"
      />
    </template>
    
    <template #header-right>
      <el-space>
        <el-dropdown>
          <el-avatar :size="32" src="https://example.com/avatar.jpg" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </template>
    
    <router-view></router-view>
    
    <template #footer>
      <div>© 2024 Your Company Name</div>
    </template>
  </layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from './components/Layout.vue'
import SideMenu from './components/SideMenu.vue'
import TabView from './components/TabView.vue'
import { useRoute } from 'vue-router'

const layoutRef = ref()
const tabViewRef = ref()
const currentPath = ref('')
const activeMenu = ref('')

// 示例菜单数据
const menus = [
  {
    title: '仪表盘',
    path: '/dashboard',
    icon: 'Odometer',
  },
  {
    title: '系统管理',
    path: '/system',
    icon: 'Setting',
    children: [
      {
        title: '用户管理',
        path: '/system/users',
      },
      {
        title: '角色管理',
        path: '/system/roles',
      }
    ]
  }
]

const handleMenuSelect = (path: string, title: string) => {
  tabViewRef.value?.addTab({ path, title })
  activeMenu.value = path
}

const handleTabClick = (path: string) => {
  activeMenu.value = path
}

const route = useRoute()

onMounted(() => {
  // 初始化当前路由对应的菜单和标签
  const currentPath = route.path
  const currentMenu = menus.flatMap(menu => 
    menu.children ? [menu, ...menu.children] : [menu]
  ).find(item => item.path === currentPath)
  
  if (currentMenu) {
    activeMenu.value = currentPath
    tabViewRef.value?.addTab({
      path: currentPath,
      title: currentMenu.title
    })
  }
})
</script>
