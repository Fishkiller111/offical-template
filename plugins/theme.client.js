// 主题初始化插件 - 仅在客户端运行
export default defineNuxtPlugin(() => {
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

  // 立即初始化主题
  try {
    // 初始化颜色主题
    const savedTheme = localStorage.getItem('theme-color') || 'purple'
    const theme = themes.find(t => t.value === savedTheme)
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.color)
      const darkColor = adjustBrightness(theme.color, -20)
      document.documentElement.style.setProperty('--color-primary-dark', darkColor)
      document.documentElement.style.setProperty('--hero-gradient-end', theme.color)
    }
    
    // 初始化亮暗模式
    const savedDarkMode = localStorage.getItem('dark-mode')
    if (savedDarkMode !== null) {
      const isDarkMode = savedDarkMode === 'true'
      document.documentElement.classList.toggle('light-mode', !isDarkMode)
    } else {
      // 默认使用暗色模式
      document.documentElement.classList.remove('light-mode')
    }
  } catch (error) {
    console.warn('主题初始化失败:', error)
    // 使用默认主题
    document.documentElement.style.setProperty('--color-primary', '#8B5CF6')
    document.documentElement.style.setProperty('--color-primary-dark', '#7C3AED')
    document.documentElement.style.setProperty('--hero-gradient-end', '#8B5CF6')
    document.documentElement.classList.remove('light-mode')
  }
}) 