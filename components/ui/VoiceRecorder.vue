<template>
  <div class="voice-recorder">
    <!-- 录音按钮 -->
    <button
      v-if="!isRecording && !audioBlob"
      @click="handleClick"
      @mousedown="handlePressStart"
      @mouseup="stopPressRecording"
      @mouseleave="stopPressRecording"
      @touchstart="handlePressStart"
      @touchend="stopPressRecording"
      :disabled="isProcessing"
      class="record-button"
      :class="{ 
        'press-recording': isPressRecording,
        'permission-denied': hasPermission === false 
      }"
      :title="isPressRecording ? '松开停止录音' : hasPermission === false ? '点击查看麦克风权限设置' : '按住录音 / 点击开始录音'"
    >
      <Icon 
        v-if="!isProcessing" 
        :icon="isPressRecording ? 'tabler:microphone-filled' : hasPermission === false ? 'tabler:microphone-off' : 'tabler:microphone'" 
        class="w-5 h-5" 
        :class="{ 'text-red-500': hasPermission === false }"
      />
      <Icon v-else icon="tabler:loader-2" class="w-5 h-5 animate-spin" />
    </button>

    <!-- 录音中状态 -->
    <div v-if="isRecording" class="recording-controls">
      <div class="recording-indicator">
        <div class="pulse-dot"></div>
        <span class="recording-time">{{ formatTime(recordingTime) }}</span>
      </div>
      <button 
        @click="stopRecording"
        class="stop-button"
        title="停止录音"
      >
        <Icon icon="tabler:square-filled" class="w-4 h-4" />
      </button>
    </div>

    <!-- 录音完成后的预览 -->
    <div v-if="audioBlob && !isRecording" class="audio-preview">
      <button 
        @click="playAudio"
        :disabled="isPlaying"
        class="play-button"
        title="播放录音"
      >
        <Icon 
          :icon="isPlaying ? 'tabler:player-pause-filled' : 'tabler:player-play-filled'" 
          class="w-4 h-4" 
        />
      </button>
      <div class="audio-info">
        <span class="duration">{{ formatTime(audioDuration) }}</span>
        <span class="size">{{ formatFileSize(audioBlob.size) }}</span>
      </div>
      <div class="audio-actions">
        <button 
          @click="sendAudio"
          :disabled="isProcessing"
          class="send-button"
          title="发送录音"
        >
          <Icon v-if="!isProcessing" icon="tabler:send" class="w-4 h-4" />
          <Icon v-else icon="tabler:loader-2" class="w-4 h-4 animate-spin" />
        </button>
        <button 
          @click="resetRecording"
          class="reset-button"
          title="重新录音"
        >
          <Icon icon="tabler:refresh" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio ref="audioElement" @ended="onAudioEnded" style="display: none;"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['audioRecorded', 'transcriptReceived'])

// 录音状态
const isRecording = ref(false)
const isPressRecording = ref(false)
const isProcessing = ref(false)
const isPlaying = ref(false)
const recordingTime = ref(0)
const audioDuration = ref(0)
const hasPermission = ref(null) // null: 未检查, true: 有权限, false: 无权限

// 录音相关
const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioBlob = ref(null)
const audioElement = ref(null)
const stream = ref(null)

// 计时器
let recordingTimer = null
let pressTimer = null

// 开始录音
const startRecording = async () => {
  // 检查浏览器支持
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError('您的浏览器不支持录音功能，请使用现代浏览器（Chrome、Firefox、Safari等）')
    return
  }

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })
    
    mediaRecorder.value = new MediaRecorder(stream.value, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    })
    
    audioChunks.value = []
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }
    
    mediaRecorder.value.onstop = () => {
      const mimeType = mediaRecorder.value.mimeType
      audioBlob.value = new Blob(audioChunks.value, { type: mimeType })
      
      // 计算音频时长
      const url = URL.createObjectURL(audioBlob.value)
      const audio = new Audio(url)
      audio.onloadedmetadata = () => {
        audioDuration.value = audio.duration
        URL.revokeObjectURL(url)
      }
      
      emit('audioRecorded', audioBlob.value)
    }
    
    mediaRecorder.value.start(100) // 每100ms收集一次数据
    isRecording.value = true
    recordingTime.value = 0
    
    // 开始计时
    recordingTimer = setInterval(() => {
      recordingTime.value += 1
    }, 1000)
    
  } catch (error) {
    console.error('录音权限被拒绝或设备不支持:', error)
    handleMicrophoneError(error)
  }
}

// 处理麦克风错误
const handleMicrophoneError = (error) => {
  let errorMessage = '录音功能暂时无法使用'
  
  switch (error.name) {
    case 'NotFoundError':
      errorMessage = '未找到麦克风设备，请检查：\n• 是否连接了麦克风\n• 麦克风是否被其他应用占用\n• 重新插拔麦克风设备'
      break
    case 'NotAllowedError':
      errorMessage = '麦克风权限被拒绝，请：\n• 点击地址栏左侧的🔒图标\n• 允许麦克风权限\n• 刷新页面重试'
      break
    case 'NotReadableError':
      errorMessage = '麦克风被其他应用占用，请：\n• 关闭其他使用麦克风的应用\n• 重启浏览器后重试'
      break
    case 'OverconstrainedError':
      errorMessage = '麦克风设备不支持当前设置，请尝试使用其他麦克风设备'
      break
    case 'SecurityError':
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        errorMessage = '录音功能需要HTTPS环境，请使用：\n• https://网址\n• 或在localhost下使用'
      } else {
        errorMessage = '浏览器安全限制，请检查麦克风权限设置'
      }
      break
    default:
      errorMessage = `录音出错：${error.message || '未知错误'}\n\n解决方案：\n• 检查麦克风权限\n• 重启浏览器\n• 尝试其他浏览器`
  }
  
  showError(errorMessage)
}

// 显示错误提示
const showError = (message) => {
  // 使用更好的错误提示方式
  if (window.confirm(message + '\n\n点击"确定"查看详细帮助')) {
    // 可以跳转到帮助页面或显示更多信息
    window.open('https://support.google.com/chrome/answer/2693767', '_blank')
  }
}

// 检查麦克风权限
const checkMicrophonePermission = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      hasPermission.value = false
      return false
    }

    // 检查权限状态
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'microphone' })
      if (result.state === 'granted') {
        hasPermission.value = true
        return true
      } else if (result.state === 'denied') {
        hasPermission.value = false
        return false
      }
    }

    // 尝试获取权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop()) // 立即停止
    hasPermission.value = true
    return true
  } catch (error) {
    hasPermission.value = false
    return false
  }
}

// 点击录音处理
const handleClick = async () => {
  // 检查权限
  if (hasPermission.value === null) {
    const permitted = await checkMicrophonePermission()
    if (!permitted) {
      showPermissionGuide()
      return
    }
  } else if (hasPermission.value === false) {
    showPermissionGuide()
    return
  }
  
  startRecording()
}

// 按住录音处理
const handlePressStart = async () => {
  // 检查权限
  if (hasPermission.value === null) {
    const permitted = await checkMicrophonePermission()
    if (!permitted) {
      showPermissionGuide()
      return
    }
  } else if (hasPermission.value === false) {
    showPermissionGuide()
    return
  }
  
  startPressRecording()
}

// 显示权限引导
const showPermissionGuide = () => {
  const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  
  let message = '需要麦克风权限才能录音\n\n'
  
  if (!isHttps) {
    message += '⚠️ 当前网站未使用HTTPS，录音功能可能受限\n\n请尝试：\n• 使用 https:// 访问\n• 或在 localhost 下使用\n\n'
  }
  
  message += '权限设置步骤：\n\n'
  message += '🔧 Chrome/Edge：\n'
  message += '1. 点击地址栏左侧的🔒或🛡️图标\n'
  message += '2. 找到"麦克风"选项\n'
  message += '3. 选择"允许"\n'
  message += '4. 刷新页面\n\n'
  
  message += '🔧 Safari：\n'
  message += '1. 点击Safari菜单 → 偏好设置\n'
  message += '2. 选择"网站"标签\n'
  message += '3. 左侧选择"麦克风"\n'
  message += '4. 为此网站设置为"允许"\n\n'
  
  message += '🔧 Firefox：\n'
  message += '1. 点击地址栏的🔒图标\n'
  message += '2. 点击"权限"标签\n'
  message += '3. 允许麦克风权限\n\n'
  
  message += '❓ 其他可能问题：\n'
  message += '• 检查麦克风是否连接\n'
  message += '• 关闭其他使用麦克风的应用\n'
  message += '• 重启浏览器后重试\n'
  message += '• 尝试不同的浏览器'
  
  if (confirm(message + '\n\n点击"确定"查看官方帮助文档')) {
    window.open('https://support.google.com/chrome/answer/2693767', '_blank')
  }
}

// 停止录音
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    
    // 停止麦克风
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    
    // 清除计时器
    if (recordingTimer) {
      clearInterval(recordingTimer)
      recordingTimer = null
    }
  }
}

// 按住录音开始
const startPressRecording = () => {
  isPressRecording.value = true
  // 延迟500ms开始录音，避免误触
  pressTimer = setTimeout(() => {
    if (isPressRecording.value && !isRecording.value) {
      startRecording()
    }
  }, 500)
}

// 按住录音结束
const stopPressRecording = () => {
  isPressRecording.value = false
  
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
  
  if (isRecording.value) {
    stopRecording()
  }
}

// 播放录音
const playAudio = () => {
  if (audioBlob.value && audioElement.value) {
    const url = URL.createObjectURL(audioBlob.value)
    audioElement.value.src = url
    audioElement.value.play()
    isPlaying.value = true
  }
}

// 音频播放结束
const onAudioEnded = () => {
  isPlaying.value = false
  if (audioElement.value) {
    URL.revokeObjectURL(audioElement.value.src)
  }
}

// 发送录音进行转换
const sendAudio = async () => {
  if (!audioBlob.value) return
  
  isProcessing.value = true
  
  try {
    const formData = new FormData()
    
    // 转换为支持的格式
    const supportedType = audioBlob.value.type.includes('webm') ? 'webm' : 'mp4'
    const fileName = `recording.${supportedType}`
    
    formData.append('file', audioBlob.value, fileName)
    formData.append('user', 'anonymous') // TODO: 使用实际用户ID
    
    const response = await fetch('https://api.dify.ai/v1/audio-to-text', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN'
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`语音转换失败: ${response.status}`)
    }
    
    const result = await response.json()
    emit('transcriptReceived', result.text)
    
    // 重置录音状态
    resetRecording()
    
  } catch (error) {
    console.error('语音转文字失败:', error)
    alert('语音转换失败，请重试')
  } finally {
    isProcessing.value = false
  }
}

// 重置录音
const resetRecording = () => {
  audioBlob.value = null
  audioDuration.value = 0
  recordingTime.value = 0
  
  if (audioElement.value) {
    audioElement.value.src = ''
  }
}

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 组件初始化时检查权限
onMounted(async () => {
  await checkMicrophonePermission()
})

// 清理资源
onBeforeUnmount(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
  }
  if (pressTimer) {
    clearTimeout(pressTimer)
  }
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.voice-recorder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.record-button {
  padding: 0.75rem;
  border-radius: 9999px;
  background-color: #16a34a;
  color: white;
  transition: all 0.2s;
}

.record-button:hover {
  background-color: #15803d;
}

.record-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.record-button.permission-denied {
  background-color: #dc2626;
}

.record-button.permission-denied:hover {
  background-color: #b91c1c;
}

.record-button.press-recording {
  background-color: #dc2626;
  animation: pulse 1s infinite;
}

.record-button.press-recording:hover {
  background-color: #b91c1c;
}

.recording-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #fef2f2;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.dark .recording-controls {
  background-color: rgba(127, 29, 29, 0.2);
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse-dot {
  width: 0.75rem;
  height: 0.75rem;
  background-color: #ef4444;
  border-radius: 9999px;
  animation: pulse 1s infinite;
}

.recording-time {
  color: #dc2626;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.875rem;
}

.dark .recording-time {
  color: #f87171;
}

.stop-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #dc2626;
  color: white;
  transition: background-color 0.2s;
}

.stop-button:hover {
  background-color: #b91c1c;
}

.audio-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eff6ff;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.dark .audio-preview {
  background-color: rgba(30, 64, 175, 0.2);
}

.play-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: white;
  transition: background-color 0.2s;
}

.play-button:hover {
  background-color: #1d4ed8;
}

.play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-info {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: #2563eb;
}

.dark .audio-info {
  color: #60a5fa;
}

.audio-actions {
  display: flex;
  gap: 0.25rem;
}

.send-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary, #2563eb);
  color: white;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: var(--color-primary-dark, #1d4ed8);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #4b5563;
  color: white;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #374151;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
</style> 