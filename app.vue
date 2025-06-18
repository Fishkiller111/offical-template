<template>
  <div>
    <NuxtPage />
    <!-- Stagewise Toolbar - Development Only -->
    <ClientOnly>
      <StagewiseToolbarComponent />
    </ClientOnly>
    
    <!-- 全局弹窗组件 -->
    <ClientOnly>
      <Modal 
        :show="modalState.show"
        :type="modalState.type"
        :title="modalState.title"
        :message="modalState.message"
        :confirmText="modalState.confirmText"
        :cancelText="modalState.cancelText"
        :allowBackdropClose="modalState.allowBackdropClose"
        @confirm="confirmModal"
        @cancel="cancelModal"
        @close="closeModal"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
// Import Stagewise Toolbar Component
import StagewiseToolbarComponent from '~/components/StagewiseToolbar.vue'
import Modal from '~/components/ui/Modal.vue'
import { useModal } from '~/composables/useModal'

// 全局样式将会在pages/index.vue中定义

// 使用主题管理 composable
const { initializeTheme } = useTheme()

// 使用弹窗管理 composable
const { modalState, confirmModal, cancelModal, closeModal } = useModal()

// 确保主题在应用启动时立即初始化
onMounted(() => {
  if (process.client) {
    initializeTheme()
  }
})
</script>