<template>
  <div class="voice-player">
    <button
      @click="togglePlayback"
      :disabled="isLoading"
      class="play-button"
      :class="{ 'playing': isPlaying }"
      :title="isPlaying ? '暂停播放' : '播放语音'"
    >
      <Icon v-if="isLoading" icon="tabler:loader-2" class="w-4 h-4 animate-spin" />
      <Icon 
        v-else-if="isPlaying" 
        icon="tabler:player-pause-filled" 
        class="w-4 h-4" 
      />
      <Icon v-else icon="tabler:volume" class="w-4 h-4" />
    </button>
    
    <!-- 播放进度条 -->
    <div v-if="isPlaying && duration > 0" class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </span>
    </div>
    
    <!-- 隐藏的音频元素 -->
    <audio 
      ref="audioElement" 
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      style="display: none;"
      preload="none"
    ></audio>
  </div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  messageId: {
    type: String,
    default: null
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['playStart', 'playEnd', 'error'])

// 播放状态
const isLoading = ref(false)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const audioUrl = ref(null)

// 音频元素
const audioElement = ref(null)

// 计算进度百分比
const progressPercentage = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

// 切换播放状态
const togglePlayback = async () => {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    pauseAudio()
  } else {
    await playAudio()
  }
}

// 播放音频
const playAudio = async () => {
  try {
    // 如果没有音频源，先获取音频
    if (!audioUrl.value) {
      await generateAudio()
    }
    
    if (audioElement.value && audioUrl.value) {
      await audioElement.value.play()
      isPlaying.value = true
      emit('playStart')
    }
  } catch (error) {
    console.error('播放失败:', error)
    emit('error', error)
  }
}

// 暂停音频
const pauseAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

// 生成音频
const generateAudio = async () => {
  if (!props.text?.trim()) return
  
  isLoading.value = true
  
  try {
    const requestBody = {
      user: 'anonymous' // TODO: 使用实际用户ID
    }
    
    // 优先使用 message_id，如果没有则使用 text
    if (props.messageId) {
      requestBody.message_id = props.messageId
    } else {
      requestBody.text = props.text
    }
    
    const response = await fetch('https://api.dify.ai/v1/text-to-audio', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-0QAj1Mm0j17XJMQaTmTa6bzN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error(`语音生成失败: ${response.status}`)
    }
    
    // 获取音频数据
    const audioBlob = await response.blob()
    
    // 创建音频URL
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
    
    audioUrl.value = URL.createObjectURL(audioBlob)
    
    // 设置音频源
    if (audioElement.value) {
      audioElement.value.src = audioUrl.value
    }
    
  } catch (error) {
    console.error('语音生成失败:', error)
    // 使用项目的UI组件提示错误，而不是alert
    showError('语音生成失败，请重试')
    emit('error', error)
  } finally {
    isLoading.value = false
  }
}

// 音频元数据加载完成
const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    
    // 如果设置了自动播放，开始播放
    if (props.autoPlay) {
      playAudio()
    }
  }
}

// 播放时间更新
const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

// 播放结束
const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  emit('playEnd')
}

// 播放错误
const onError = (event) => {
  console.error('音频播放错误:', event)
  isPlaying.value = false
  isLoading.value = false
  showError('音频播放失败，请重试')
  emit('error', event)
}

// 显示错误提示 - 使用更友好的提示方式
const showError = (message) => {
  // 这里可以替换为项目的Modal组件
  // 目前使用confirm提供更好的用户体验
  if (confirm(message + '\n\n是否重试？')) {
    // 用户选择重试时重新生成音频
    generateAudio()
  }
}

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 监听文本变化，重新生成音频
watch(() => props.text, () => {
  // 文本变化时，清除之前的音频
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = null
  }
  
  if (audioElement.value) {
    audioElement.value.src = ''
  }
  
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
})
</script>

<style scoped>
.voice-player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.play-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #dbeafe;
  color: #2563eb;
  transition: all 0.2s;
}

.play-button:hover {
  background-color: #bfdbfe;
}

.dark .play-button {
  background-color: rgba(30, 64, 175, 0.3);
  color: #60a5fa;
}

.dark .play-button:hover {
  background-color: rgba(30, 64, 175, 0.5);
}

.play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-button.playing {
  background-color: #2563eb;
  color: white;
}

.play-button.playing:hover {
  background-color: #1d4ed8;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.progress-bar {
  flex: 1;
  height: 0.25rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.dark .progress-bar {
  background-color: #374151;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: all 0.1s ease-linear;
}

.time-display {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  white-space: nowrap;
}

.dark .time-display {
  color: #9ca3af;
}
</style> 