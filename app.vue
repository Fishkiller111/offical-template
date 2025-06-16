<template>
  <div>
    <NuxtPage />
    <!-- Stagewise Toolbar - Development Only -->
    <ClientOnly>
      <StagewiseToolbarComponent />
    </ClientOnly>
  </div>
</template>

<script setup>
// Import Stagewise Toolbar Component
import StagewiseToolbarComponent from '~/components/StagewiseToolbar.vue'
// 全局样式将会在pages/index.vue中定义

// 使用主题管理 composable
const { initializeTheme } = useTheme()

// 确保主题在应用启动时立即初始化
onMounted(() => {
  if (process.client) {
    initializeTheme()
  }
})
</script>