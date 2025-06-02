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
</script>