// 主题管理 composable
export const useTheme = () => {
  // 主题颜色配置
  const themes = [
    { name: '紫色', value: 'purple', color: '#8B5CF6' },
    { name: '蓝色', value: 'blue', color: '#3B82F6' },
    { name: '绿色', value: 'green', color: '#10B981' },
    { name: '红色', value: 'red', color: '#EF4444' },
    { name: '橙色', value: 'orange', color: '#F97316' },
    { name: '粉色', value: 'pink', color: '#EC4899' }
  ]

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

  // 应用主题色
  const applyThemeColor = (themeValue) => {
    if (!process.client) return
    
    const theme = themes.find(t => t.value === themeValue)
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.color)
      const darkColor = adjustBrightness(theme.color, -20)
      document.documentElement.style.setProperty('--color-primary-dark', darkColor)
      document.documentElement.style.setProperty('--hero-gradient-end', theme.color)
    }
  }

  // 应用暗色/亮色模式
  const applyDarkMode = (isDark) => {
    if (!process.client) return
    
    document.documentElement.classList.toggle('light-mode', !isDark)
  }

  // 初始化主题
  const initializeTheme = () => {
    if (!process.client) return

    try {
      // 初始化颜色主题
      const savedTheme = localStorage.getItem('theme-color') || 'purple'
      applyThemeColor(savedTheme)
      
      // 初始化亮暗模式
      const savedDarkMode = localStorage.getItem('dark-mode')
      if (savedDarkMode !== null) {
        const isDarkMode = savedDarkMode === 'true'
        applyDarkMode(isDarkMode)
      } else {
        // 默认使用暗色模式
        applyDarkMode(true)
      }
    } catch (error) {
      console.warn('主题初始化失败:', error)
      // 使用默认主题
      applyThemeColor('purple')
      applyDarkMode(true)
    }
  }

  // 设置主题色
  const setThemeColor = (themeValue) => {
    if (!process.client) return
    
    applyThemeColor(themeValue)
    localStorage.setItem('theme-color', themeValue)
  }

  // 设置暗色模式
  const setDarkMode = (isDark) => {
    if (!process.client) return
    
    applyDarkMode(isDark)
    localStorage.setItem('dark-mode', isDark.toString())
  }

  // 获取当前主题色
  const getCurrentTheme = () => {
    if (!process.client) return 'purple'
    return localStorage.getItem('theme-color') || 'purple'
  }

  // 获取当前暗色模式状态
  const getCurrentDarkMode = () => {
    if (!process.client) return true
    const saved = localStorage.getItem('dark-mode')
    return saved !== null ? saved === 'true' : true
  }

  return {
    themes,
    initializeTheme,
    setThemeColor,
    setDarkMode,
    getCurrentTheme,
    getCurrentDarkMode,
    applyThemeColor,
    applyDarkMode
  }
}

// 立即初始化主题（在模块加载时）
if (process.client) {
  const { initializeTheme } = useTheme()
  
  // 使用 requestAnimationFrame 确保在下一帧执行
  requestAnimationFrame(() => {
    initializeTheme()
  })
} 