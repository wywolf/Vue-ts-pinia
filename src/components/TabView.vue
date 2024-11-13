<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.path"
      :label="tab.title"
      :name="tab.path"
    />
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Tab {
  title: string
  path: string
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'tab-click', path: string): void
}>()

const activeTab = ref(props.modelValue)
const tabs = ref<Tab[]>([])
const router = useRouter()

// 监听外部传入的值变化
watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue
})

// 监听内部值变化
watch(activeTab, (newValue) => {
  emit('update:modelValue', newValue)
})

// 添加新标签页
const addTab = (tab: Tab) => {
  if (!tabs.value.some(t => t.path === tab.path)) {
    tabs.value.push(tab)
  }
  activeTab.value = tab.path
}

// 移除标签页
const removeTab = (targetPath: string | number) => {
  const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
  if (targetIndex === -1) return
  
  tabs.value.splice(targetIndex, 1)
  
  if (activeTab.value === targetPath) {
    // 如果关闭的是当前标签，则切换到最后一个标签并跳转路由
    if (tabs.value.length) {
      const lastPath = tabs.value[tabs.value.length - 1].path
      activeTab.value = lastPath
      router.push(lastPath)
    } else {
      activeTab.value = ''
      router.push('/')
    }
  }
}

// 修改标签点击处理方法，添加路由跳转
const handleClick = (tab: any) => {
  const path = tab.props.name
  activeTab.value = path
  emit('update:modelValue', path)
  emit('tab-click', path)
  router.push(path)
}

// 暴露方法给父组件
defineExpose({
  addTab
})
</script>

<style scoped>
.el-tabs {
  padding: 0 16px;
}
</style> 