<template>
  <div class="min-h-screen bg-dark flex flex-col lg:flex-row relative">
    <!-- 移动端顶部导航栏 -->
    <div class="lg:hidden bg-dark-light border-b border-dark-lighter p-4 relative z-30">
      <div class="flex items-center justify-between">
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-lg bg-dark hover:bg-dark-lighter transition-colors"
        >
          <Icon icon="tabler:menu-2" class="w-6 h-6 text-light" />
        </button>
        <h1 class="text-lg font-semibold text-light">{{ getCurrentSectionTitle() }}</h1>
        <div class="w-10"></div> <!-- 占位元素保持居中 -->
      </div>
    </div>

    <!-- 移动端左拉菜单遮罩 -->
    <div 
      v-show="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- 移动端左拉菜单 -->
    <div 
      :class="[
        'lg:hidden fixed top-0 left-0 h-full w-80 bg-dark-light border-r border-dark-lighter z-50 transform transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- 菜单头部 -->
      <div class="p-6 border-b border-dark-lighter">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo/logo-_.png" alt="WebAI" class="h-8 w-auto">
          </NuxtLink>
          <button 
            @click="isMobileMenuOpen = false"
            class="p-2 rounded-lg bg-dark hover:bg-dark-lighter transition-colors"
          >
            <Icon icon="tabler:x" class="w-5 h-5 text-light" />
          </button>
        </div>
      </div>

      <!-- 菜单内容 -->
      <div class="flex-1 p-4">
        <nav class="space-y-2">
          <button 
            v-for="item in navigationItems"
            :key="item.key"
            @click="selectMobileSection(item.key)"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 nav-tech will-change-transform gpu-accelerated',
              activeSection === item.key ? 'bg-primary text-white glow-tech' : 'text-light hover:bg-dark-lighter'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ $t(item.label) }}</span>
          </button>
        </nav>
      </div>

      <!-- 菜单底部用户信息和上拉折叠菜单 -->
      <div class="p-4 border-t border-dark-lighter relative user-menu-container">
        <!-- 用户信息点击区域 -->
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center space-x-3 w-full text-left hover:bg-dark-lighter rounded-lg p-2 -m-2 transition-colors mb-2"
        >
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-semibold">{{ user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1">
            <div class="text-light text-sm font-medium">{{ user?.name || 'User' }}</div>
            <div class="text-light-dark text-xs">{{ user?.email || 'user@example.com' }}</div>
          </div>
          <ChevronUpIcon 
            :class="[
              'w-5 h-5 text-light-dark transition-transform duration-300',
              isUserMenuOpen ? 'rotate-180' : ''
            ]"
          />
        </button>
        
        <!-- 上拉折叠菜单 -->
        <div 
          :class="[
            'bg-dark border border-dark-lighter rounded-lg mb-2 transition-all duration-300 overflow-hidden',
            isUserMenuOpen ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0'
          ]"
        >
          <div class="p-2 space-y-1">
            <button 
              @click="selectMobileSection('profile'); isUserMenuOpen = false"
              :class="[
                'w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 text-sm transition-colors',
                activeSection === 'profile' ? 'bg-primary text-white' : 'text-light hover:bg-dark-lighter'
              ]"
            >
              <UserIcon class="w-4 h-4" />
              <span>{{ $t('dashboard.my_profile') }}</span>
            </button>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full btn-secondary text-sm py-2 flex items-center justify-center space-x-2"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          <span>{{ $t('nav.logout') }}</span>
        </button>
      </div>
    </div>

    <!-- 桌面端左侧导航栏 -->
    <aside class="hidden lg:flex w-64 bg-dark-light border-r border-dark-lighter flex-col">
      <!-- Logo区域 -->
      <div class="p-6 border-b border-dark-lighter">
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo/logo-_.png" alt="WebAI" class="h-10 w-auto">
        </NuxtLink>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li>
            <button 
              @click="activeSection = 'ai-assistant'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 nav-tech will-change-transform gpu-accelerated',
                activeSection === 'ai-assistant' ? 'bg-primary text-white glow-tech' : 'text-light hover:bg-dark-lighter'
              ]"
            >
              <CpuChipIcon class="w-5 h-5" />
              <span>{{ $t('dashboard.ai_assistant') }}</span>
            </button>
          </li>
          <li>
            <button 
              @click="activeSection = 'ai-instructor'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 nav-tech will-change-transform gpu-accelerated',
                activeSection === 'ai-instructor' ? 'bg-primary text-white glow-tech' : 'text-light hover:bg-dark-lighter'
              ]"
            >
              <AcademicCapIcon class="w-5 h-5" />
              <span>{{ $t('dashboard.ai_instructor') }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- 底部用户信息和上拉折叠菜单 -->
      <div class="p-4 border-t border-dark-lighter relative user-menu-container">
        <!-- 用户信息点击区域 -->
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center space-x-3 w-full text-left hover:bg-dark-lighter rounded-lg p-2 -m-2 transition-colors"
        >
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-semibold">{{ user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1">
            <div class="text-light text-sm font-medium">{{ user?.name || 'User' }}</div>
            <div class="text-light-dark text-xs">{{ user?.email || 'user@example.com' }}</div>
          </div>
          <ChevronUpIcon 
            :class="[
              'w-4 h-4 text-light-dark transition-transform duration-300',
              isUserMenuOpen ? 'rotate-180' : ''
            ]"
          />
        </button>
        
        <!-- 上拉折叠菜单 -->
        <div 
          :class="[
            'absolute bottom-full left-0 right-0 bg-dark-light border border-dark-lighter rounded-lg shadow-lg transition-all duration-300 overflow-hidden',
            isUserMenuOpen ? 'opacity-100 translate-y-0 max-h-48' : 'opacity-0 translate-y-4 max-h-0'
          ]"
          v-show="isUserMenuOpen"
        >
          <div class="p-2 space-y-1">
            <button 
              @click="activeSection = 'profile'; isUserMenuOpen = false"
              :class="[
                'w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 text-sm transition-colors',
                activeSection === 'profile' ? 'bg-primary text-white' : 'text-light hover:bg-dark-lighter'
              ]"
            >
              <UserIcon class="w-4 h-4" />
              <span>{{ $t('dashboard.my_profile') }}</span>
            </button>
            <hr class="border-dark-lighter my-1">
            <button 
              @click="handleLogout"
              class="w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
              <span>{{ $t('nav.logout') }}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="flex-1 overflow-hidden min-h-0 relative">
      <!-- AI消毒助手 - 聊天模式 -->
      <div v-if="activeSection === 'ai-assistant'" class="h-full flex flex-col">
        <!-- 聊天头部 -->
        <div class="p-4 lg:p-6 border-b border-dark-lighter bg-dark-light flex-shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center">
              <ShieldCheckIcon class="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 class="text-lg lg:text-xl font-semibold text-light">{{ $t('dashboard.ai_assistant') }}</h1>
              <p class="text-xs lg:text-sm text-light-dark">{{ $t('dashboard.ai_assistant_desc') }}</p>
            </div>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 pb-24 lg:pb-6" ref="chatContainer">
          <!-- 欢迎消息 -->
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon class="w-5 h-5 text-white" />
            </div>
            <div class="bg-dark-light rounded-lg p-3 lg:p-4 max-w-xs lg:max-w-md">
              <p class="text-light text-sm lg:text-base">{{ $t('dashboard.chat_welcome') }}</p>
              <div class="mt-3 space-y-2">
                <button 
                  @click="sendQuickMessage($t('dashboard.quick_scan'))"
                  class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                >
                  🛡️ {{ $t('dashboard.quick_scan') }}
                </button>
                <button 
                  @click="sendQuickMessage($t('dashboard.upload_analysis'))"
                  class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                >
                  📁 {{ $t('dashboard.upload_analysis') }}
                </button>
                <button 
                  @click="sendQuickMessage($t('dashboard.security_tips'))"
                  class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                >
                  💡 {{ $t('dashboard.security_tips') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 聊天消息 -->
          <div v-for="message in chatMessages" :key="message.id" class="flex items-start space-x-3" :class="{ 'flex-row-reverse space-x-reverse': message.isUser }">
            <div v-if="!message.isUser" class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 pulse-tech">
              <ShieldCheckIcon class="w-5 h-5 text-white" />
            </div>
            <div v-else class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon class="w-5 h-5 text-white" />
            </div>
            <div 
              :class="[
                'rounded-lg p-3 lg:p-4 max-w-xs lg:max-w-md message-tech will-change-transform gpu-accelerated',
                message.isUser ? 'bg-primary text-white user-message' : 'bg-dark-light text-light',
                message.isUser ? '' : 'tech-hover'
              ]"
            >
              <p class="text-sm lg:text-base">{{ message.content }}</p>
              <span class="text-xs opacity-70 mt-2 block">{{ message.time }}</span>
            </div>
          </div>

          <!-- 正在输入指示器 -->
          <div v-if="isTyping" class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon class="w-5 h-5 text-white" />
            </div>
            <div class="bg-dark-light rounded-lg p-4">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-light-dark rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-light-dark rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-light-dark rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 桌面端输入框 (在聊天区域内) -->
        <div class="hidden lg:block p-4 lg:p-6 border-t border-dark-lighter bg-dark-light">
          <div class="flex space-x-2 lg:space-x-3">
            <input 
              v-model="newMessage"
              @keypress.enter="sendMessage"
              type="text" 
              :placeholder="$t('dashboard.type_message')"
              class="flex-1 input-default text-sm lg:text-base input-tech will-change-transform gpu-accelerated"
            >
            <button 
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="btn-primary px-4 lg:px-6 tech-button will-change-transform gpu-accelerated"
              :class="{ 'opacity-50 cursor-not-allowed': !newMessage.trim() }"
            >
              <PaperAirplaneIcon class="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- AI消毒金牌讲师 -->
      <div v-if="activeSection === 'ai-instructor'" class="p-4 lg:p-8">
        <div class="mb-8">
          <h1 class="text-heading-1 text-light mb-4">
            {{ $t('dashboard.ai_instructor') }}
          </h1>
          <p class="text-body">
            {{ $t('dashboard.ai_instructor_desc') }}
          </p>
        </div>
        
        <div class="grid-responsive-3 mb-8">
          <div class="card-default card-tech will-change-transform gpu-accelerated">
            <div class="icon-container mb-4">
              <BookOpenIcon class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2 text-light">{{ $t('dashboard.security_courses') }}</h3>
            <p class="text-light-dark mb-4">{{ $t('dashboard.security_courses_desc') }}</p>
            <button class="btn-primary w-full tech-button will-change-transform gpu-accelerated">{{ $t('dashboard.view_courses') }}</button>
          </div>

          <div class="card-default card-tech will-change-transform gpu-accelerated">
            <div class="icon-container mb-4">
              <PlayIcon class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2 text-light">{{ $t('dashboard.video_tutorials') }}</h3>
            <p class="text-light-dark mb-4">{{ $t('dashboard.video_tutorials_desc') }}</p>
            <button class="btn-primary w-full tech-button will-change-transform gpu-accelerated">{{ $t('dashboard.watch_videos') }}</button>
          </div>

          <div class="card-default card-tech will-change-transform gpu-accelerated">
            <div class="icon-container mb-4">
              <ChatBubbleLeftRightIcon class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2 text-light">{{ $t('dashboard.ai_chat') }}</h3>
            <p class="text-light-dark mb-4">{{ $t('dashboard.ai_chat_desc') }}</p>
            <button class="btn-primary w-full tech-button will-change-transform gpu-accelerated">{{ $t('dashboard.start_chat') }}</button>
          </div>
        </div>
      </div>

      <!-- 个人中心 -->
      <div v-if="activeSection === 'profile'" class="p-4 lg:p-8">
        <div class="mb-8">
          <h1 class="text-heading-1 text-light mb-4">
            {{ $t('dashboard.my_profile') }}
          </h1>
          <p class="text-body">
            {{ $t('dashboard.profile_desc') }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <!-- 个人信息 -->
          <div class="card-default card-tech will-change-transform gpu-accelerated">
            <h2 class="text-heading-3 mb-6 text-light">{{ $t('dashboard.personal_info') }}</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-light text-sm font-medium mb-2">{{ $t('auth.name') }}</label>
                <input 
                  type="text" 
                  :value="user?.name || ''"
                  class="input-default w-full input-tech will-change-transform gpu-accelerated"
                  :placeholder="$t('auth.name_placeholder')"
                >
              </div>
              <div>
                <label class="block text-light text-sm font-medium mb-2">{{ $t('auth.email') }}</label>
                <input 
                  type="email" 
                  :value="user?.email || ''"
                  class="input-default w-full input-tech will-change-transform gpu-accelerated"
                  :placeholder="$t('auth.email_placeholder')"
                >
              </div>
              <button class="btn-primary tech-button will-change-transform gpu-accelerated">{{ $t('dashboard.save_changes') }}</button>
            </div>
          </div>

          <!-- 系统设置 -->
          <div class="card-default card-tech will-change-transform gpu-accelerated">
            <h2 class="text-heading-3 mb-6 text-light">{{ $t('dashboard.system_settings') }}</h2>
            <div class="space-y-6">
              <!-- 语言设置 -->
              <div>
                <label class="block text-light text-sm font-medium mb-2">{{ $t('dashboard.language') }}</label>
                <LanguageSwitcher />
              </div>
              
              <!-- 主题设置 -->
              <div>
                <label class="block text-light text-sm font-medium mb-2">{{ $t('dashboard.theme') }}</label>
                <ThemeSelector />
              </div>
              
              <!-- 通知设置 -->
              <div>
                <label class="block text-light text-sm font-medium mb-2">{{ $t('dashboard.notifications') }}</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input type="checkbox" class="mr-3" checked>
                    <span class="text-light">{{ $t('dashboard.email_notifications') }}</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="mr-3" checked>
                    <span class="text-light">{{ $t('dashboard.security_alerts') }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 移动端固定底部输入框 (仅在AI助手页面显示) -->
    <div v-if="activeSection === 'ai-assistant'" class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-light border-t border-dark-lighter p-4 z-20">
      <div class="flex space-x-3">
        <input 
          v-model="newMessage"
          @keypress.enter="sendMessage"
          type="text" 
          :placeholder="$t('dashboard.type_message')"
          class="flex-1 bg-dark border border-dark-lighter rounded-lg px-4 py-3 text-light placeholder-light-dark focus:outline-none focus:border-primary text-sm input-tech will-change-transform gpu-accelerated"
        >
        <button 
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed tech-button will-change-transform gpu-accelerated"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- 科技感鼠标跟踪效果 -->
    <div 
      ref="mouseTracker"
      class="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300"
      :style="{ opacity: showMouseEffect ? 1 : 0 }"
    >
      <!-- 主光标 -->
      <div 
        class="absolute w-4 h-4 bg-primary rounded-full mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        :style="{ 
          left: mousePos.x + 'px', 
          top: mousePos.y + 'px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`
        }"
      ></div>
      
      <!-- 外圈光环 -->
      <div 
        class="absolute w-8 h-8 border border-primary rounded-full mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
        :style="{ 
          left: mousePos.x + 'px', 
          top: mousePos.y + 'px',
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          opacity: isHovering ? 0.8 : 0.4
        }"
      ></div>
      
      <!-- 粒子效果 -->
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="absolute w-1 h-1 bg-primary rounded-full pointer-events-none"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          opacity: particle.opacity,
          transform: `scale(${particle.scale})`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  CpuChipIcon, 
  UserIcon, 
  AcademicCapIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  BookOpenIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronUpIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import ThemeSelector from '~/components/ThemeSelector.vue'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

// 获取用户信息和认证状态
const { user, isAuthenticated, logout } = useAuth()

// 当前激活的导航项
const activeSection = ref('ai-assistant')

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 导航项配置
const navigationItems = [
  {
    key: 'ai-assistant',
    label: 'dashboard.ai_assistant',
    icon: CpuChipIcon
  },
  {
    key: 'ai-instructor', 
    label: 'dashboard.ai_instructor',
    icon: AcademicCapIcon
  }
]

// 用户菜单折叠状态
const isUserMenuOpen = ref(false)

// 移动端选择导航项
const selectMobileSection = (section) => {
  activeSection.value = section
  isMobileMenuOpen.value = false
}

// 聊天相关状态
const newMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref()
const chatMessages = ref([])

// 科技感鼠标效果状态
const mouseTracker = ref()
const mousePos = ref({ x: 0, y: 0 })
const isHovering = ref(false)
const isClicking = ref(false)
const showMouseEffect = ref(false)
const particles = ref([])

// 性能优化：节流函数
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const userMessage = {
    id: Date.now(),
    content: newMessage.value,
    isUser: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  chatMessages.value.push(userMessage)
  const messageContent = newMessage.value
  newMessage.value = ''
  
  // 滚动到底部
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
  
  // 模拟AI回复
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const aiResponse = getAIResponse(messageContent)
    chatMessages.value.push({
      id: Date.now() + 1,
      content: aiResponse,
      isUser: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }, 1500)
}

// 快速消息
const sendQuickMessage = (message) => {
  newMessage.value = message
  sendMessage()
}

// AI回复逻辑
const getAIResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('扫描') || lowerMessage.includes('scan')) {
    return t('dashboard.ai_scan_response')
  } else if (lowerMessage.includes('文件') || lowerMessage.includes('file')) {
    return t('dashboard.ai_file_response')
  } else if (lowerMessage.includes('安全') || lowerMessage.includes('security')) {
    return t('dashboard.ai_security_response')
  } else {
    return t('dashboard.ai_default_response')
  }
}

// 页面标题
useHead({
  title: computed(() => t('dashboard.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('dashboard.welcome_message'))
    }
  ]
})

// 获取当前页面标题
const getCurrentSectionTitle = () => {
  const section = navigationItems.find(item => item.key === activeSection.value)
  return section ? t(section.label) : t('dashboard.ai_assistant')
}

// 处理登出
const handleLogout = async () => {
  await logout()
  await navigateTo('/')
}

// 鼠标跟踪和粒子效果
const initMouseEffects = () => {
  let particleId = 0
  
  // 节流的鼠标移动处理
  const handleMouseMove = throttle((e) => {
    mousePos.value = { x: e.clientX, y: e.clientY }
    
    // 随机生成粒子效果
    if (Math.random() < 0.1 && particles.value.length < 20) {
      const particle = {
        id: particleId++,
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        opacity: 1,
        scale: Math.random() * 0.5 + 0.5
      }
      
      particles.value.push(particle)
      
      // 粒子动画和清理
      const animateParticle = () => {
        particle.opacity -= 0.02
        particle.scale *= 0.98
        particle.y -= 1
        
        if (particle.opacity <= 0) {
          const index = particles.value.findIndex(p => p.id === particle.id)
          if (index > -1) particles.value.splice(index, 1)
        } else {
          requestAnimationFrame(animateParticle)
        }
      }
      
      requestAnimationFrame(animateParticle)
    }
  }, 16) // 60fps
  
  const handleMouseEnter = () => {
    showMouseEffect.value = true
  }
  
  const handleMouseLeave = () => {
    showMouseEffect.value = false
  }
  
  const handleMouseDown = () => {
    isClicking.value = true
  }
  
  const handleMouseUp = () => {
    isClicking.value = false
  }
  
  const handleHoverStart = () => {
    isHovering.value = true
  }
  
  const handleHoverEnd = () => {
    isHovering.value = false
  }
  
  // 添加事件监听器
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseenter', handleMouseEnter)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  
  // 为可交互元素添加hover效果
  const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll('button, a, input, .card-default')
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })
  }
  
  // 延迟添加hover效果，确保DOM已渲染
  setTimeout(addHoverEffects, 100)
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseenter', handleMouseEnter)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}

// 如果未认证，重定向到登录页
onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo('/auth')
  }
  
  // 监听窗口大小变化，在桌面端关闭移动菜单
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      isMobileMenuOpen.value = false
    }
  }
  
  // 点击外部区域关闭用户菜单
  const handleClickOutside = (event) => {
    if (isUserMenuOpen.value && !event.target.closest('.user-menu-container')) {
      isUserMenuOpen.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  
  // 初始化鼠标效果（仅在桌面端）
  let cleanupMouseEffects
  if (window.innerWidth >= 1024) {
    cleanupMouseEffects = initMouseEffects()
  }
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('click', handleClickOutside)
    if (cleanupMouseEffects) {
      cleanupMouseEffects()
    }
  })
})
</script>

<style scoped>
/* 科技感动画效果 */
.tech-hover {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tech-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent
  );
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.tech-hover:hover::before {
  left: 100%;
}

.tech-hover:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(59, 130, 246, 0.1);
}

/* 按钮科技感效果 */
.tech-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tech-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
  z-index: 0;
}

.tech-button:hover::before {
  width: 300px;
  height: 300px;
}

.tech-button:hover {
  transform: scale(1.02);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(59, 130, 246, 0.2);
}

/* 聊天消息科技感效果 */
.message-tech {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-tech:hover {
  transform: translateX(4px);
  box-shadow: 
    -4px 0 15px rgba(59, 130, 246, 0.1),
    0 4px 15px rgba(0, 0, 0, 0.2);
}

.message-tech.user-message:hover {
  transform: translateX(-4px);
  box-shadow: 
    4px 0 15px rgba(59, 130, 246, 0.1),
    0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 导航项科技感效果 */
.nav-tech {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-tech::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-tech:hover::after {
  width: 100%;
}

.nav-tech:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

/* 输入框科技感效果 */
.input-tech {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-tech:focus {
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.2),
    inset 0 1px 3px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.input-tech:focus::placeholder {
  color: rgba(156, 163, 175, 0.6);
}

/* 卡片科技感效果 */
.card-tech {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.card-tech::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    transparent 50%,
    rgba(139, 92, 246, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}

.card-tech:hover::before {
  opacity: 1;
}

.card-tech:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

/* 脉冲动画 */
@keyframes pulse-tech {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.pulse-tech {
  animation: pulse-tech 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 发光效果 */
.glow-tech {
  position: relative;
}

.glow-tech::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
  border-radius: inherit;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  filter: blur(8px);
}

.glow-tech:hover::after {
  opacity: 0.7;
}

/* 性能优化：减少重绘 */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* 硬件加速 */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style> 