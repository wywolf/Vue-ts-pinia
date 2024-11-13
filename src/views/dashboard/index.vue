<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('仪表盘组件已加载')
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  color: #333;
}
</style> 