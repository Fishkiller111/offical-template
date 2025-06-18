<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 z-[9999] flex items-center justify-center"
      @click.self="handleBackdropClick"
    >
      <!-- 背景遮罩 -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        :class="show ? 'opacity-100' : 'opacity-0'"
      ></div>
      
      <!-- 弹窗内容 -->
      <div 
        class="relative bg-dark border border-dark-lighter rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300"
        :class="show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- 头部 -->
        <div class="flex items-center justify-between p-6 border-b border-dark-lighter">
          <div class="flex items-center space-x-3">
            <!-- 图标 -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="iconColorClass"
            >
              <Icon :icon="iconName" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-semibold text-light">{{ title }}</h3>
          </div>
          
          <!-- 关闭按钮 -->
          <button 
            @click="handleClose"
            class="p-1 rounded-lg text-light-dark hover:text-light hover:bg-dark-lighter transition-colors"
          >
            <Icon icon="tabler:x" class="w-5 h-5" />
          </button>
        </div>
        
        <!-- 内容 -->
        <div class="p-6">
          <p class="text-light-dark leading-relaxed">{{ message }}</p>
        </div>
        
        <!-- 按钮区域 -->
        <div class="flex justify-end space-x-3 p-6 pt-0">
          <button 
            v-if="type === 'confirm'"
            @click="handleCancel"
            class="px-4 py-2 rounded-lg border border-dark-lighter text-light-dark hover:text-light hover:bg-dark-lighter transition-colors"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="handleConfirm"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="confirmButtonClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // info, warning, error, confirm, success
    validator: (value) => ['info', 'warning', 'error', 'confirm', 'success'].includes(value)
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  allowBackdropClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const iconName = computed(() => {
  const icons = {
    info: 'tabler:info-circle',
    warning: 'tabler:alert-triangle',
    error: 'tabler:alert-circle',
    confirm: 'tabler:help-circle',
    success: 'tabler:check-circle'
  }
  return icons[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    confirm: 'bg-primary/20 text-primary',
    success: 'bg-green-500/20 text-green-400'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    error: 'bg-red-500 hover:bg-red-600 text-white',
    confirm: 'bg-primary hover:bg-primary/80 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.allowBackdropClose) {
    handleClose()
  }
}
</script> 