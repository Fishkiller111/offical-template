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

const isOpen = ref(false)
const selectedTheme = ref('purple')
const isDarkMode = ref(true)

const themes = [
  { name: '紫色', value: 'purple', color: '#8B5CF6' },
  { name: '蓝色', value: 'blue', color: '#3B82F6' },
  { name: '绿色', value: 'green', color: '#10B981' },
  { name: '红色', value: 'red', color: '#EF4444' },
  { name: '橙色', value: 'orange', color: '#F97316' },
  { name: '粉色', value: 'pink', color: '#EC4899' }
]

const currentTheme = computed(() => themes.find(t => t.value === selectedTheme.value))

const selectTheme = (theme) => {
  selectedTheme.value = theme.value
  document.documentElement.style.setProperty('--color-primary', theme.color)
  // 设置较深的变体用于hover等状态
  const darkColor = adjustBrightness(theme.color, -20)
  document.documentElement.style.setProperty('--color-primary-dark', darkColor)
  // 更新hero背景渐变的主题色
  document.documentElement.style.setProperty('--hero-gradient-end', theme.color)
  localStorage.setItem('theme-color', theme.value)
  isOpen.value = false
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('light-mode', !isDarkMode.value)
  localStorage.setItem('dark-mode', isDarkMode.value.toString())
}

// 辅助函数：调整颜色亮度
const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

// 初始化主题
onMounted(() => {
  // 初始化颜色主题
  const savedTheme = localStorage.getItem('theme-color') || 'purple'
  selectedTheme.value = savedTheme
  const theme = themes.find(t => t.value === savedTheme)
  if (theme) {
    document.documentElement.style.setProperty('--color-primary', theme.color)
    const darkColor = adjustBrightness(theme.color, -20)
    document.documentElement.style.setProperty('--color-primary-dark', darkColor)
    // 初始化hero背景渐变的主题色
    document.documentElement.style.setProperty('--hero-gradient-end', theme.color)
  }
  
  // 初始化亮暗模式
  const savedDarkMode = localStorage.getItem('dark-mode')
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true'
  }
  document.documentElement.classList.toggle('light-mode', !isDarkMode.value)
  
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