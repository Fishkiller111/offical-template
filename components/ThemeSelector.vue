<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-light/50 border border-dark-lighter hover:border-primary transition-colors"
    >
      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: currentTheme.color }"></div>
      <Icon :icon="isDarkMode ? 'tabler:moon' : 'tabler:sun'" class="w-4 h-4 text-light-dark" />
      <Icon icon="tabler:chevron-down" class="w-4 h-4 text-light-dark" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <div 
      v-show="isOpen"
      class="absolute top-full right-0 mt-2 w-52 bg-dark-light border border-dark-lighter rounded-lg shadow-lg z-50"
    >
      <div class="p-2">
        <!-- 亮暗模式切换 -->
        <div class="flex items-center justify-between px-3 py-2 mb-2 border-b border-dark-lighter">
          <span class="text-sm font-semibold text-light">主题模式</span>
          <button 
            @click="toggleDarkMode"
            class="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-dark-lighter transition-colors"
          >
            <Icon :icon="isDarkMode ? 'tabler:moon' : 'tabler:sun'" class="w-4 h-4 text-primary" />
            <span class="text-xs text-light-dark">{{ isDarkMode ? '暗色' : '亮色' }}</span>
          </button>
        </div>
        
        <!-- 主题颜色选择 -->
        <div class="text-xs font-semibold text-light-dark mb-2 px-2">选择主题颜色</div>
        <div 
          v-for="theme in themes" 
          :key="theme.name"
          @click="selectTheme(theme)"
          class="flex items-center space-x-3 px-3 py-2 hover:bg-dark-lighter cursor-pointer transition-colors rounded-md"
          :class="{ 'bg-primary/10': currentTheme.name === theme.name }"
        >
          <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: theme.color }"></div>
          <span class="text-sm text-light">{{ theme.name }}</span>
          <Icon v-if="currentTheme.name === theme.name" icon="tabler:check" class="w-4 h-4 text-primary ml-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 使用主题管理 composable
const { themes, setThemeColor, setDarkMode, getCurrentTheme, getCurrentDarkMode } = useTheme()

const isOpen = ref(false)
const selectedTheme = ref('purple')
const isDarkMode = ref(true)

const currentTheme = computed(() => themes.find(t => t.value === selectedTheme.value))

const selectTheme = (theme) => {
  selectedTheme.value = theme.value
  setThemeColor(theme.value)
  isOpen.value = false
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  setDarkMode(isDarkMode.value)
}

// 初始化主题
onMounted(() => {
  // 从 composable 获取当前设置
  selectedTheme.value = getCurrentTheme()
  isDarkMode.value = getCurrentDarkMode()
  
  // 点击外部关闭下拉菜单
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      isOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script> 