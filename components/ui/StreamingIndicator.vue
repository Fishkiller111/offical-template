<template>
  <div class="flex items-start space-x-3">
    <!-- AI头像 -->
    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 pulse-tech">
      <ShieldCheckIcon class="w-5 h-5 text-white" />
    </div>
    
    <!-- 动画容器 -->
    <div class="bg-dark-light rounded-lg p-4 max-w-xs lg:max-w-md">
      <!-- 思考阶段动画 -->
      <div v-if="stage === 'thinking'" class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span class="text-light-dark text-sm">AI正在思考...</span>
        </div>
        
        <!-- 思考进度条 -->
        <div class="w-full bg-dark rounded-full h-1 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full thinking-progress"></div>
        </div>
      </div>
      
      <!-- 流式输出阶段 -->
      <div v-else-if="stage === 'streaming'" class="space-y-3">
        <div class="flex items-center space-x-2">
          <!-- 打字机效果图标 -->
          <div class="relative">
            <Icon icon="tabler:edit" class="w-4 h-4 text-primary typing-icon" />
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <span class="text-light-dark text-sm">正在回复中...</span>
        </div>
        
        <!-- 流式文本预览 -->
        <div class="relative">
          <div class="text-light text-sm min-h-[1.5rem] leading-relaxed">
            <span v-if="previewText">{{ previewText }}</span>
            <!-- 光标动画 -->
            <span class="inline-block w-[2px] h-4 bg-primary ml-1 cursor-blink"></span>
          </div>
        </div>
        
        <!-- 数据流动画 -->
        <div class="flex items-center space-x-1">
          <div class="flex space-x-1">
            <div 
              v-for="i in 8" 
              :key="i"
              class="w-1 h-3 bg-primary/30 rounded-full data-flow-bar"
              :style="{ animationDelay: `${i * 0.1}s` }"
            ></div>
          </div>
          <span class="text-xs text-light-dark ml-2">数据流传输中</span>
        </div>
      </div>
      
      <!-- 处理文件阶段 -->
      <div v-else-if="stage === 'processing'" class="space-y-3">
        <div class="flex items-center space-x-2">
          <Icon icon="tabler:file-search" class="w-4 h-4 text-yellow-400 animate-spin" />
          <span class="text-light-dark text-sm">正在分析文件...</span>
        </div>
        
        <!-- 文件处理进度 -->
        <div class="space-y-2">
          <div class="flex justify-between text-xs text-light-dark">
            <span>解析进度</span>
            <span>{{ processingProgress }}%</span>
          </div>
          <div class="w-full bg-dark rounded-full h-1.5 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300"
              :style="{ width: `${processingProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- 时间显示 -->
      <div class="text-xs text-light-dark/70 mt-2 flex items-center justify-between">
        <span>{{ formatElapsedTime() }}</span>
        <div class="flex items-center space-x-1">
          <div class="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          <span>实时</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { Icon } from '@iconify/vue'

const props = defineProps({
  stage: {
    type: String,
    default: 'thinking', // thinking, streaming, processing
    validator: (value) => ['thinking', 'streaming', 'processing'].includes(value)
  },
  previewText: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    default: () => new Date()
  }
})

const processingProgress = ref(0)
const elapsedTime = ref(0)

let progressInterval = null
let timeInterval = null

// 模拟处理进度
const updateProgress = () => {
  if (props.stage === 'processing' && processingProgress.value < 100) {
    processingProgress.value += Math.random() * 10
    if (processingProgress.value > 100) {
      processingProgress.value = 100
    }
  }
}

// 更新经过时间
const updateElapsedTime = () => {
  elapsedTime.value = Date.now() - props.startTime.getTime()
}

const formatElapsedTime = () => {
  const seconds = Math.floor(elapsedTime.value / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
}

onMounted(() => {
  // 启动进度更新
  progressInterval = setInterval(updateProgress, 200)
  // 启动时间更新
  timeInterval = setInterval(updateElapsedTime, 1000)
  updateElapsedTime()
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* 思考进度条动画 */
.thinking-progress {
  animation: thinking-wave 2s ease-in-out infinite;
  width: 0%;
}

@keyframes thinking-wave {
  0%, 100% { width: 20%; }
  25% { width: 60%; }
  50% { width: 80%; }
  75% { width: 40%; }
}

/* 打字机图标动画 */
.typing-icon {
  animation: typing-bounce 1s ease-in-out infinite;
}

@keyframes typing-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* 光标闪烁动画 */
.cursor-blink {
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 数据流动画 */
.data-flow-bar {
  animation: data-flow 1.5s ease-in-out infinite;
}

@keyframes data-flow {
  0%, 100% { 
    background-color: rgb(59 130 246 / 0.3);
    transform: scaleY(0.3);
  }
  50% { 
    background-color: rgb(59 130 246);
    transform: scaleY(1);
  }
}

/* 脉冲科技效果 */
.pulse-tech {
  position: relative;
  animation: pulse-tech 2s infinite;
}

.pulse-tech::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  animation: pulse-ring 2s infinite;
  z-index: -1;
}

@keyframes pulse-tech {
  0%, 100% {
    box-shadow: 
      0 0 0 0 rgba(59, 130, 246, 0.4),
      0 0 0 0 rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 
      0 0 0 8px rgba(59, 130, 246, 0.1),
      0 0 0 16px rgba(59, 130, 246, 0.05);
  }
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
</style> 