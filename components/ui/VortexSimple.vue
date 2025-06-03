<template>
  <div class="relative w-full h-full">
    <!-- 背景canvas -->
    <canvas 
      ref="canvasRef" 
      class="absolute inset-0 w-full h-full"
      :style="{ 
        background: backgroundGradient,
        transition: 'background 0.3s ease'
      }"
    ></canvas>
    
    <!-- 内容slot -->
    <div class="relative z-10 w-full h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNoise3D } from 'simplex-noise'
import { onMounted, onUnmounted, ref, computed, shallowRef } from 'vue'

// 常量定义
const TAU = 2 * Math.PI
const BASE_TTL = 50
const RANGE_TTL = 150
const PARTICLE_PROP_COUNT = 9
const RANGE_HUE = 60
const NOISE_STEPS = 3
const X_OFF = 0.00125
const Y_OFF = 0.00125
const Z_OFF = 0.0005

interface Props {
  particleCount?: number
  baseHue?: number
  baseSpeed?: number
  rangeSpeed?: number
  baseRadius?: number
  rangeRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 300,
  baseSpeed: 0.0,
  rangeSpeed: 1.2,
  baseRadius: 1,
  rangeRadius: 2,
  baseHue: 240
})

// 响应式变量
const tick = ref<number>(0)
const animationFrame = ref<number | null>(null)
const particleProps = shallowRef<Float32Array | null>(null)
const center = ref<[number, number]>([0, 0])
const ctx = shallowRef<CanvasRenderingContext2D | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 主题相关
const isLightMode = ref(false)
const currentPrimaryColor = ref('#8B5CF6')

// 粒子缓存对象
const particleCache = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
  ttl: 0,
  speed: 0,
  radius: 0,
  hue: 0,
}

// 创建噪声函数
const noise3D = createNoise3D()

// 工具函数
function rand(n: number) {
  return n * Math.random()
}

function randRange(n: number): number {
  return n - rand(2 * n)
}

function fadeInOut(t: number, m: number): number {
  const hm = 0.5 * m
  return Math.abs(((t + hm) % m) - hm) / hm
}

function lerp(n1: number, n2: number, speed: number): number {
  return (1 - speed) * n1 + speed * n2
}

// 将hex颜色转换为HSL
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

// 计算背景渐变
const backgroundGradient = computed(() => {
  if (isLightMode.value) {
    return 'radial-gradient(ellipse at center, rgba(248, 250, 252, 0.8) 0%, rgba(248, 250, 252, 0.95) 100%)'
  } else {
    return 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)'
  }
})

// 获取主题颜色的色调
const getThemeHue = () => {
  const [themeHue] = hexToHsl(currentPrimaryColor.value)
  return themeHue
}

// 更新主题状态
const updateThemeState = () => {
  if (typeof document !== 'undefined') {
    isLightMode.value = document.documentElement.classList.contains('light-mode')
    const computedStyle = getComputedStyle(document.documentElement)
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim()
    if (primaryColor && primaryColor !== currentPrimaryColor.value) {
      currentPrimaryColor.value = primaryColor
    }
  }
}

// 初始化粒子
function initParticle(i: number) {
  if (!particleProps.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const themeHue = getThemeHue()
  
  particleCache.x = rand(canvas.width)
  particleCache.y = rand(canvas.height)
  particleCache.vx = 0
  particleCache.vy = 0
  particleCache.life = 0
  particleCache.ttl = BASE_TTL + rand(RANGE_TTL)
  particleCache.speed = props.baseSpeed + rand(props.rangeSpeed)
  particleCache.radius = props.baseRadius + rand(props.rangeRadius)
  particleCache.hue = themeHue + rand(RANGE_HUE)

  particleProps.value.set(
    [
      particleCache.x,
      particleCache.y,
      particleCache.vx,
      particleCache.vy,
      particleCache.life,
      particleCache.ttl,
      particleCache.speed,
      particleCache.radius,
      particleCache.hue,
    ],
    i,
  )
}

// 更新粒子
function updateParticle(i: number) {
  if (!particleProps.value || !canvasRef.value || !ctx.value) return

  const canvas = canvasRef.value
  const props = particleProps.value
  const context = ctx.value

  particleCache.x = props[i]
  particleCache.y = props[i + 1]
  particleCache.vx = props[i + 2]
  particleCache.vy = props[i + 3]
  particleCache.life = props[i + 4]
  particleCache.ttl = props[i + 5]
  particleCache.speed = props[i + 6]
  particleCache.radius = props[i + 7]
  particleCache.hue = props[i + 8]

  // 使用噪声函数生成更自然的运动
  const n =
    noise3D(particleCache.x * X_OFF, particleCache.y * Y_OFF, tick.value * Z_OFF) *
    NOISE_STEPS *
    TAU

  const nextVx = lerp(particleCache.vx, Math.cos(n), 0.5)
  const nextVy = lerp(particleCache.vy, Math.sin(n), 0.5)
  const nextX = particleCache.x + nextVx * particleCache.speed
  const nextY = particleCache.y + nextVy * particleCache.speed

  // 绘制粒子轨迹
  context.save()
  context.lineCap = 'round'
  context.lineWidth = particleCache.radius
  
  // 根据主题调整颜色亮度和饱和度
  const saturation = isLightMode.value ? 80 : 100
  const lightness = isLightMode.value ? 50 : 70
  const alpha = fadeInOut(particleCache.life, particleCache.ttl)
  
  context.strokeStyle = `hsla(${particleCache.hue}, ${saturation}%, ${lightness}%, ${alpha})`
  context.beginPath()
  context.moveTo(particleCache.x, particleCache.y)
  context.lineTo(nextX, nextY)
  context.stroke()
  context.restore()

  // 更新粒子属性
  props[i] = nextX
  props[i + 1] = nextY
  props[i + 2] = nextVx
  props[i + 3] = nextVy
  props[i + 4] = particleCache.life + 1

  // 检查是否需要重新初始化粒子
  if (
    nextX > canvas.width ||
    nextX < 0 ||
    nextY > canvas.height ||
    nextY < 0 ||
    particleCache.life > particleCache.ttl
  ) {
    initParticle(i)
  }
}

// 主绘制循环
function draw() {
  if (!canvasRef.value || !ctx.value || !particleProps.value) return

  const canvas = canvasRef.value
  const context = ctx.value

  tick.value++

  // 清空画布
  context.clearRect(0, 0, canvas.width, canvas.height)

  // 更新所有粒子
  for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
    updateParticle(i)
  }

  // 添加发光效果
  context.save()
  context.filter = 'blur(8px) brightness(200%)'
  context.globalCompositeOperation = 'lighter'
  context.drawImage(canvas, 0, 0)
  context.restore()

  context.save()
  context.filter = 'blur(4px) brightness(200%)'
  context.globalCompositeOperation = 'lighter'
  context.drawImage(canvas, 0, 0)
  context.restore()

  animationFrame.value = requestAnimationFrame(draw)
}

// 处理窗口大小变化
function handleResize() {
  if (!canvasRef.value || !ctx.value) return

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  
  canvas.width = rect.width
  canvas.height = rect.height
  center.value = [0.5 * canvas.width, 0.5 * canvas.height]
}

// 节流函数
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 监听主题变化
const observeThemeChanges = () => {
  if (typeof document === 'undefined') return null
  
  const observer = new MutationObserver(throttle(() => {
    const oldPrimaryColor = currentPrimaryColor.value
    updateThemeState()
    
    // 如果主题颜色发生了变化，更新所有粒子的颜色
    if (oldPrimaryColor !== currentPrimaryColor.value && particleProps.value) {
      const themeHue = getThemeHue()
      for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
        particleProps.value[i + 8] = themeHue + rand(RANGE_HUE)
      }
    }
  }, 100))
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style']
  })
  
  return observer
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx.value = canvas.getContext('2d')
  if (!ctx.value) return

  // 初始化主题状态
  updateThemeState()
  
  // 设置画布大小
  handleResize()

  // 初始化粒子数组
  const particlePropsLength = props.particleCount * PARTICLE_PROP_COUNT
  particleProps.value = new Float32Array(particlePropsLength)

  // 创建所有粒子
  for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
    initParticle(i)
  }

  // 开始动画
  draw()
  
  // 添加事件监听器
  const throttledResize = throttle(handleResize, 200)
  window.addEventListener('resize', throttledResize)
  const themeObserver = observeThemeChanges()
  
  // 清理函数
  onUnmounted(() => {
    if (themeObserver) {
      themeObserver.disconnect()
    }
    window.removeEventListener('resize', throttledResize)
  })
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  ctx.value = null
  particleProps.value = null
})
</script> 