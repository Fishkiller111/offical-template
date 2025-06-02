<template>
  <ClientOnly>
    <div v-if="isDevelopment">
      <StagewiseToolbar :config="stagewiseConfig" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { StagewiseToolbar } from '@stagewise/toolbar-vue'

// 配置对象
const stagewiseConfig = {
  plugins: []
}

// 只在开发环境中显示
const isDevelopment = process.env.NODE_ENV === 'development'
</script> 