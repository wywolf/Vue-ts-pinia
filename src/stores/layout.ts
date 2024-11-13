import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    // 侧边栏折叠状态，默认展开（false）
    sidebarCollapsed: false,
    // 当前激活的标签页
    activeTab: '',
    // 打开的标签页列表
    tabs: [] as string[]
  }),

  actions: {
    // 切换侧边栏状态
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置当前激活的标签页
    setActiveTab(tab: string) {
      this.activeTab = tab
      if (!this.tabs.includes(tab)) {
        this.tabs.push(tab)
      }
    },

    // 关闭标签页
    closeTab(tab: string) {
      const index = this.tabs.indexOf(tab)
      if (index > -1) {
        this.tabs.splice(index, 1)
        // 如果关闭的是当前激活的标签页，则激活前一个标签页
        if (tab === this.activeTab && this.tabs.length) {
          this.activeTab = this.tabs[Math.max(0, index - 1)]
        }
      }
    }
  },

  persist: {
    enabled: true
  }
}) 