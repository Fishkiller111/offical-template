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
      <div v-if="activeSection === 'ai-assistant'" class="h-full flex">
        <!-- 主聊天区域 -->
        <div class="flex-1 flex flex-col">
          <!-- 聊天头部 -->
          <div class="p-4 lg:p-6 border-b border-dark-lighter bg-dark-light flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center">
                  <ShieldCheckIcon class="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h1 class="text-lg lg:text-xl font-semibold text-light">
                    {{ currentConversation?.title || $t('dashboard.ai_assistant') }}
                  </h1>
                  <p class="text-xs lg:text-sm text-light-dark">{{ $t('dashboard.ai_assistant_desc') }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="createNewConversation"
                  class="hidden lg:flex p-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors"
                  title="新建对话"
                >
                  <Icon icon="tabler:plus" class="w-5 h-5 text-white" />
                </button>
                <button 
                  @click="isChatSidebarOpen = !isChatSidebarOpen"
                  class="p-2 rounded-lg bg-dark hover:bg-dark-lighter transition-colors relative"
                  :title="isChatSidebarOpen ? '隐藏对话列表' : '显示对话列表'"
                >
                  <Icon icon="tabler:message-circle" class="w-5 h-5 text-light" />
                  <!-- 移动端提示小红点 -->
                  <div v-if="conversations.length > 0" class="lg:hidden absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- 聊天消息区域 -->
          <div class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 pb-28 lg:pb-6 chat-container" ref="chatContainer">
            <!-- 欢迎消息 -->
            <div v-if="chatMessages.length === 0" class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon class="w-5 h-5 text-white" />
              </div>
              <div class="bg-dark-light rounded-lg p-3 lg:p-4 max-w-xs lg:max-w-md">
                <p class="text-light text-sm lg:text-base whitespace-pre-wrap">{{ $t('dashboard.chat_welcome') }}</p>
                <div class="mt-3 space-y-2">
                  <button 
                    @click="sendQuickMessage($t('dashboard.quick_scan'))"
                    class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                  >
                    {{ $t('dashboard.quick_scan') }}
                  </button>
                  <button 
                    @click="sendQuickMessage($t('dashboard.upload_analysis'))"
                    class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                  >
                    {{ $t('dashboard.upload_analysis') }}
                  </button>
                  <button 
                    @click="sendQuickMessage($t('dashboard.security_tips'))"
                    class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                  >
                    {{ $t('dashboard.security_tips') }}
                  </button>
                  <button 
                    @click="sendQuickMessage($t('dashboard.medical_professional'))"
                    class="block w-full text-left px-3 py-2 bg-dark rounded-md text-xs lg:text-sm text-light hover:bg-dark-lighter tech-button will-change-transform gpu-accelerated"
                  >
                    {{ $t('dashboard.medical_professional') }}
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
                  message.isUser ? '' : 'tech-hover',
                  message.isError ? 'bg-red-900 border border-red-600' : ''
                ]"
              >
                <!-- 文件附件显示 -->
                <div v-if="message.files && message.files.length > 0" class="mb-2 space-y-1">
                  <div 
                    v-for="file in message.files" 
                    :key="file.upload_file_id"
                    class="flex items-center space-x-2 text-xs opacity-80"
                  >
                    <Icon icon="tabler:file-text" class="w-3 h-3" />
                    <span>已上传文件</span>
                  </div>
                </div>
                
                <p class="text-sm lg:text-base whitespace-pre-wrap">{{ message.content }}</p>
                
                <!-- AI回复的语音播放功能 -->
                <div v-if="!message.isUser && message.content" class="flex items-center justify-between mt-2">
                  <span class="text-xs opacity-70">{{ message.time }}</span>
                  <VoicePlayer 
                    :text="message.content"
                    :messageId="message.id"
                    class="ml-2"
                  />
                </div>
                
                <!-- 用户消息只显示时间 -->
                <span v-else class="text-xs opacity-70 mt-2 block">{{ message.time }}</span>
              </div>
            </div>

            <!-- 流式响应动画指示器 -->
            <Transition name="streaming" appear>
              <StreamingIndicator 
                v-if="streamingState.show"
                :stage="streamingState.stage"
                :previewText="streamingState.previewText"
                :startTime="streamingState.startTime"
              />
            </Transition>
          </div>

          <!-- 桌面端输入框 -->
          <div class="hidden lg:block p-4 lg:p-6 border-t border-dark-lighter bg-dark-light">
            <div class="flex space-x-2 lg:space-x-3">
              <input 
                v-model="newMessage"
                @keypress.enter="sendMessage"
                type="text" 
                :placeholder="$t('dashboard.type_message')"
                class="flex-1 input-default text-sm lg:text-base input-tech will-change-transform gpu-accelerated"
              >
              <input 
                ref="fileInput"
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
              >
              <!-- 语音录制组件 -->
              <VoiceRecorder 
                @transcriptReceived="handleVoiceTranscript"
                class="flex-shrink-0"
              />
              <button 
                @click="$refs.fileInput.click()"
                class="btn-secondary px-4 lg:px-6 tech-button will-change-transform gpu-accelerated"
                :disabled="isUploading"
              >
                <Icon icon="tabler:paperclip" class="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button 
                @click="sendMessage"
                :disabled="!newMessage.trim() || isSending"
                class="btn-primary px-4 lg:px-6 tech-button will-change-transform gpu-accelerated"
                :class="{ 'opacity-50 cursor-not-allowed': !newMessage.trim() || isSending }"
              >
                <PaperAirplaneIcon v-if="!isSending" class="w-4 h-4 lg:w-5 lg:h-5" />
                <Icon v-else icon="tabler:loader-2" class="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
              </button>
            </div>
            <!-- 文件预览 -->
            <div v-if="uploadedFiles.length > 0" class="mt-3 flex flex-wrap gap-2">
              <div 
                v-for="file in uploadedFiles" 
                :key="file.id"
                class="flex items-center space-x-2 bg-dark rounded-lg px-3 py-2 text-sm"
              >
                <Icon icon="tabler:file-text" class="w-4 h-4 text-primary" />
                <span class="text-light">{{ file.name }}</span>
                <button 
                  @click="removeFile(file.id)"
                  class="text-red-400 hover:text-red-300"
                >
                  <Icon icon="tabler:x" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 桌面端：右侧对话管理折叠栏 -->
        <div 
          :class="[
            'hidden lg:block bg-dark-light border-l border-dark-lighter transition-all duration-300 flex-shrink-0',
            isChatSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          ]"
        >
          <div class="w-80 h-full flex flex-col">
            <!-- 对话列表头部 -->
            <div class="p-4 border-b border-dark-lighter flex items-center justify-between">
              <h3 class="text-lg font-semibold text-light">对话记录</h3>
              <button 
                @click="createNewConversation"
                class="p-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors"
                title="新建对话"
              >
                <Icon icon="tabler:plus" class="w-4 h-4 text-white" />
              </button>
            </div>

            <!-- 对话列表 -->
            <div class="flex-1 overflow-y-auto p-2">
              <div v-if="conversations.length === 0" class="text-center text-light-dark py-8">
                <Icon icon="tabler:message-circle" class="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p class="text-sm">暂无对话记录</p>
                <button 
                  @click="createNewConversation"
                  class="mt-3 text-primary hover:text-primary/80 text-sm"
                >
                  创建第一个对话
                </button>
              </div>
              
              <div v-for="conversation in conversations" :key="conversation.id" class="mb-2">
                <div 
                  @click="loadConversation(conversation)"
                  :class="[
                    'p-3 rounded-lg cursor-pointer transition-colors border group',
                    currentConversation?.id === conversation.id 
                      ? 'bg-primary/10 border-primary text-light' 
                      : 'bg-dark border-dark-lighter hover:bg-dark-lighter text-light-dark'
                  ]"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="text-sm font-medium truncate flex-1 pr-2">
                      {{ conversation.title }}
                    </h4>
                    <button 
                      @click.stop="deleteConversation(conversation.id)"
                      class="text-red-400 hover:text-red-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon icon="tabler:trash" class="w-3 h-3" />
                    </button>
                  </div>
                  <div class="text-xs text-light-dark">
                    <p v-if="conversation.lastMessage" class="truncate mb-1">
                      {{ conversation.lastMessage }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span v-if="conversation.isLoadingDetails" class="animate-pulse">加载中...</span>
                     <span v-else>{{ conversation.messageCount }} 条消息</span>
                      <span>{{ formatTime(conversation.updatedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端输入框 -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-light border-t border-dark-lighter p-4 pb-6 z-20 mobile-input" style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom))">
          <!-- 文件预览 -->
          <div v-if="uploadedFiles.length > 0" class="mb-3 flex flex-wrap gap-2">
            <div 
              v-for="file in uploadedFiles" 
              :key="file.id"
              class="flex items-center space-x-2 bg-dark rounded-lg px-3 py-2 text-sm"
            >
              <Icon icon="tabler:file-text" class="w-4 h-4 text-primary" />
              <span class="text-light">{{ file.name }}</span>
              <button 
                @click="removeFile(file.id)"
                class="text-red-400 hover:text-red-300"
              >
                <Icon icon="tabler:x" class="w-3 h-3" />
              </button>
            </div>
          </div>
          <div class="flex space-x-3">
            <input 
              v-model="newMessage"
              @keypress.enter="sendMessage"
              type="text" 
              :placeholder="$t('dashboard.type_message')"
              class="flex-1 bg-dark border border-dark-lighter rounded-lg px-4 py-3 text-light placeholder-light-dark focus:outline-none focus:border-primary text-sm input-tech will-change-transform gpu-accelerated"
            >
            <input 
              ref="mobileFileInput"
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="hidden"
            >
            <!-- 移动端语音录制组件 -->
            <VoiceRecorder 
              @transcriptReceived="handleVoiceTranscript"
              class="flex-shrink-0"
            />
            <button 
              @click="$refs.mobileFileInput.click()"
              :disabled="isUploading"
              class="px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed tech-button will-change-transform gpu-accelerated"
            >
              <Icon icon="tabler:paperclip" class="w-5 h-5" />
            </button>
            <button 
              @click="sendMessage"
              :disabled="!newMessage.trim() || isSending"
              class="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed tech-button will-change-transform gpu-accelerated"
            >
              <PaperAirplaneIcon v-if="!isSending" class="w-5 h-5" />
              <Icon v-else icon="tabler:loader-2" class="w-5 h-5 animate-spin" />
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端：对话管理全屏侧边栏 -->
      <Transition name="mobile-sidebar">
        <div 
          v-if="isChatSidebarOpen"
          class="lg:hidden fixed inset-0 z-50"
        >
          <!-- 背景遮罩 -->
          <div 
            @click="isChatSidebarOpen = false"
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>
          
          <!-- 侧边栏内容 -->
          <div class="absolute right-0 top-0 h-full w-5/6 max-w-sm bg-dark-light border-l border-dark-lighter shadow-2xl transform transition-transform duration-300"
               :class="isChatSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
          >
            <!-- 侧边栏头部 -->
          <div class="p-4 border-b border-dark-lighter flex items-center justify-between">
            <h3 class="text-lg font-semibold text-light">对话记录</h3>
            <div class="flex items-center space-x-2">
              <button 
                @click="createNewConversation"
                class="p-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors"
                title="新建对话"
              >
                <Icon icon="tabler:plus" class="w-4 h-4 text-white" />
              </button>
              <button 
                @click="isChatSidebarOpen = false"
                class="p-2 rounded-lg bg-dark hover:bg-dark-lighter transition-colors"
                title="关闭"
              >
                <Icon icon="tabler:x" class="w-4 h-4 text-light" />
              </button>
            </div>
          </div>

          <!-- 对话列表 -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="conversations.length === 0" class="text-center text-light-dark py-16">
              <Icon icon="tabler:message-circle" class="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p class="text-base mb-4">暂无对话记录</p>
              <button 
                @click="createNewConversation"
                class="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors"
              >
                创建第一个对话
              </button>
            </div>
            
                         <div v-for="conversation in conversations" :key="conversation.id" class="mb-3">
               <div 
                 @click="loadConversation(conversation)"
                 :class="[
                   'p-4 rounded-xl cursor-pointer transition-all duration-200 border group active:scale-95',
                   currentConversation?.id === conversation.id 
                     ? 'bg-primary/15 border-primary/50 text-light shadow-lg shadow-primary/20' 
                     : 'bg-dark border-dark-lighter hover:bg-dark-lighter hover:border-primary/30 text-light-dark hover:shadow-lg'
                 ]"
               >
                 <div class="flex items-start justify-between mb-3">
                   <h4 class="text-base font-medium flex-1 pr-3 line-clamp-2 leading-snug">
                     {{ conversation.title }}
                   </h4>
                   <button 
                     @click.stop="deleteConversation(conversation.id)"
                     class="text-red-400 hover:text-red-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10"
                   >
                     <Icon icon="tabler:trash" class="w-4 h-4" />
                   </button>
                 </div>
                 <div class="text-sm text-light-dark">
                   <p v-if="conversation.lastMessage" class="line-clamp-2 mb-3 leading-relaxed text-light-dark/80">
                     {{ conversation.lastMessage }}
                   </p>
                   <div class="flex items-center justify-between">
                     <span class="bg-dark-lighter px-3 py-1.5 rounded-full text-xs font-medium">
                       <span v-if="conversation.isLoadingDetails" class="animate-pulse">加载中...</span>
                       <span v-else>{{ conversation.messageCount }} 条消息</span>
                     </span>
                     <span class="text-xs text-light-dark/60">{{ formatTime(conversation.updatedAt) }}</span>
                   </div>
                 </div>
               </div>
             </div>
                      </div>
          </div>
        </div>
      </Transition>

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
import { ref, nextTick, watch } from 'vue'
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
import StreamingIndicator from '~/components/ui/StreamingIndicator.vue'
import VoiceRecorder from '~/components/ui/VoiceRecorder.vue'
import VoicePlayer from '~/components/ui/VoicePlayer.vue'
import { Icon } from '@iconify/vue'
import { useModal } from '~/composables/useModal'

const { t } = useI18n()

// 获取用户信息和认证状态
const { user, isAuthenticated, logout } = useAuth()

// 使用弹窗管理
const { confirm, error, success, warning } = useModal()

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
const isSending = ref(false)
const isUploading = ref(false)
const chatContainer = ref()
const chatMessages = ref([])
const uploadedFiles = ref([])
const conversationId = ref('')
const fileInput = ref()
const mobileFileInput = ref()

// 流式响应状态
const streamingState = ref({
  show: false,
  stage: 'thinking', // thinking, streaming, processing
  previewText: '',
  startTime: new Date()
})

// 对话管理状态
const isChatSidebarOpen = ref(false)
const conversations = ref([])
const currentConversation = ref(null)
const isLoadingConversations = ref(false)

// 科技感鼠标效果状态
const mouseTracker = ref()
const mousePos = ref({ x: 0, y: 0 })
const isHovering = ref(false)
const isClicking = ref(false)
const showMouseEffect = ref(false)
const particles = ref([])

// 自动滚动函数
const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (chatContainer.value) {
      const scrollOptions = {
        top: chatContainer.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      }
      chatContainer.value.scrollTo(scrollOptions)
    }
  })
}

// 检查是否需要自动滚动
const shouldAutoScroll = () => {
  if (!chatContainer.value) return true
  
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  const scrollBottom = scrollTop + clientHeight
  // 如果用户滚动到底部附近（容差50px），则自动滚动
  return scrollHeight - scrollBottom < 50
}

// 智能滚动函数 - 只有在用户在底部时才滚动
const smartScrollToBottom = (smooth = true) => {
  if (shouldAutoScroll()) {
    scrollToBottom(smooth)
  }
}

// 文件上传处理
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  isUploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user', user.value?.id || 'anonymous')
    
    // 直接调用Dify文件上传API
    const response = await fetch('https://api.dify.ai/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`文件上传失败: ${response.status}`)
    }
    
    const result = await response.json()
    
    uploadedFiles.value.push({
      id: result.id,
      name: result.name,
      upload_file_id: result.id
    })
    
  } catch (err) {
    console.error('文件上传失败:', err)
    await error('文件上传失败，请检查文件格式和大小后重试', {
      title: '上传失败'
    })
  } finally {
    isUploading.value = false
    // 清空文件输入
    event.target.value = ''
  }
}

// 移除文件
const removeFile = (fileId) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return
  
  // 新对话不需要预创建，直接在Dify中创建
  
  isSending.value = true
  
  const userMessage = {
    id: Date.now(),
    content: newMessage.value,
    isUser: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    files: uploadedFiles.value.map(file => ({
      type: 'image',
      transfer_method: 'local_file',
      upload_file_id: file.upload_file_id
    }))
  }
  
  chatMessages.value.push(userMessage)
  const messageContent = newMessage.value
  const messageFiles = [...uploadedFiles.value]
  
  // 清空输入
  newMessage.value = ''
  uploadedFiles.value = []
  
  // 发送消息后立即滚动到底部
  scrollToBottom(true)
  
  try {
    // 显示流式响应动画 - 思考阶段
    streamingState.value = {
      show: true,
      stage: messageFiles.length > 0 ? 'processing' : 'thinking',
      previewText: '',
      startTime: new Date()
    }
    
    const requestBody = {
      inputs: {},
      query: messageContent,
      response_mode: 'streaming',
      conversation_id: conversationId.value,
      user: user.value?.id || 'anonymous',
      files: messageFiles.map(file => ({
        type: 'image',
        transfer_method: 'local_file',
        upload_file_id: file.upload_file_id
      }))
    }
    
    // 直接调用Dify API
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    let aiMessage = {
      id: Date.now() + 1,
      content: '',
      isUser: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    chatMessages.value.push(aiMessage)
    
    // AI消息添加后滚动到底部
    scrollToBottom(true)
    
    // 切换到流式输出阶段
    streamingState.value.stage = 'streaming'
    
    let buffer = ''
    
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留不完整的行
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            
            if (data.event === 'message' || data.event === 'agent_message') {
              // 处理普通消息和Agent消息
              aiMessage.content += data.answer
              
              // 更新流式预览文本
              streamingState.value.previewText = aiMessage.content.slice(-50) + '...'
              
              // 流式输出时智能滚动
              smartScrollToBottom(false) // 使用不平滑滚动以减少性能影响
            } else if (data.event === 'agent_thought') {
              // Agent思考过程，可以显示思考状态
              console.log('Agent思考:', data.thought)
            } else if (data.event === 'message_end') {
              // 保存conversation_id用于后续对话
              if (data.conversation_id) {
                conversationId.value = data.conversation_id
                
                // 如果是新对话，重新加载对话列表
                if (!currentConversation.value) {
                  await loadConversations()
                  // 找到新创建的对话并设为当前对话
                  const newConv = conversations.value.find(c => c.id === data.conversation_id)
                  if (newConv) {
                    currentConversation.value = newConv
                  }
                } else {
                  // 更新当前对话的消息计数和最后一条消息
                  const currentConvIndex = conversations.value.findIndex(c => c.id === currentConversation.value?.id)
                  if (currentConvIndex !== -1) {
                    conversations.value[currentConvIndex].messageCount += 2 // 用户消息 + AI回复
                    conversations.value[currentConvIndex].lastMessage = aiMessage.content.length > 50 
                      ? aiMessage.content.substring(0, 50) + '...' 
                      : aiMessage.content
                    conversations.value[currentConvIndex].updatedAt = new Date().toISOString()
                  }
                }
              }
            }
            
            // 消息结束，隐藏流式动画并最终滚动
            if (data.event === 'message_end') {
              streamingState.value.show = false
              // 消息完成后进行最终滚动
              setTimeout(() => {
                scrollToBottom(true)
              }, 100)
            }
          } catch (e) {
            console.error('解析SSE数据失败:', e)
          }
        }
      }
    }

  } catch (error) {
    console.error('发送消息失败:', error)
    streamingState.value.show = false
    
    // 添加错误消息
    chatMessages.value.push({
      id: Date.now() + 2,
      content: '抱歉，消息发送失败，请稍后重试。',
      isUser: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isError: true
    })
    
    // 错误消息也要滚动到底部
    scrollToBottom(true)
  } finally {
    isSending.value = false
  }
}

// 快速消息
const sendQuickMessage = (message) => {
  newMessage.value = message
  sendMessage()
}

// 处理语音转文字结果
const handleVoiceTranscript = (transcript) => {
  // 将语音转换的文字填入输入框
  newMessage.value = transcript
  
  // 可选：自动发送消息
  // sendMessage()
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

// 对话管理方法
const loadConversations = async () => {
  if (!isAuthenticated.value) return
  
  isLoadingConversations.value = true
  try {
    // 直接调用Dify API获取对话列表
    const params = new URLSearchParams({
      user: user.value?.id || 'anonymous',
      limit: '20'
    })
    const response = await fetch(`https://api.dify.ai/v1/conversations?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`获取对话列表失败: ${response.status}`)
    }
    
    const result = await response.json()
    
    console.log('对话列表API返回:', result)
    
    // 首先创建基础对话列表
    const basicConversations = result.data.map(conv => ({
      id: conv.id,
      title: conv.name,
      difyConversationId: conv.id,
      createdAt: new Date(conv.created_at * 1000).toISOString(),
      updatedAt: new Date(conv.updated_at * 1000).toISOString(),
      messageCount: 0, // 初始为0，将异步更新
      lastMessage: '加载中...',
      isLoadingDetails: true
    }))
    
    // 先显示基础列表
    conversations.value = basicConversations
    
    // 为每个对话异步获取消息计数和最后一条消息
    const conversationsWithDetails = await Promise.allSettled(
      result.data.map(async (conv, index) => {
        let messageCount = 0
        let lastMessage = ''
        
        try {
          // 获取每个对话的消息历史
          const msgParams = new URLSearchParams({
            conversation_id: conv.id,
            user: user.value?.id || 'anonymous',
            limit: '20' // 获取最近20条消息来计算数量
          })
          
          const msgResponse = await fetch(`https://api.dify.ai/v1/messages?${msgParams}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
              'Content-Type': 'application/json',
            }
          })
          
          if (msgResponse.ok) {
            const msgResult = await msgResponse.json()
            const messages = msgResult.data || []
            
            // 添加调试信息
            console.log(`对话 ${conv.name} 的消息数据:`, {
              total: msgResult.total || 0,
              messagesLength: messages.length,
              messages: messages.slice(0, 2) // 只打印前2条消息用于调试
            })
            
            // 更准确地计算消息数量
            let userMessages = 0
            let aiMessages = 0
            
            for (const msg of messages) {
              if (msg.query) userMessages++
              if (msg.answer) aiMessages++
            }
            
            messageCount = userMessages + aiMessages
            
            // 如果API提供了total字段，优先使用
            if (msgResult.total && msgResult.total > 0) {
              messageCount = msgResult.total * 2 // 假设每条记录包含一问一答
            }
            
            // 获取最后一条消息
            if (messages.length > 0) {
              const latestMsg = messages[0] // Dify返回的是按时间倒序
              // 优先显示AI的回答，如果没有则显示用户的问题
              lastMessage = latestMsg.answer || latestMsg.query || ''
              // 限制最后消息的长度
              if (lastMessage.length > 50) {
                lastMessage = lastMessage.substring(0, 50) + '...'
              }
            }
          }
        } catch (err) {
          console.warn(`获取对话 ${conv.id} 的消息详情失败:`, err)
          // 如果获取失败，使用默认值
          messageCount = 0
          lastMessage = '暂无消息'
        }
        
        // 实时更新列表中的对应项
        if (conversations.value[index]) {
          conversations.value[index].messageCount = messageCount
          conversations.value[index].lastMessage = lastMessage || '暂无消息'
          conversations.value[index].isLoadingDetails = false
        }
        
        return {
          id: conv.id,
          title: conv.name,
          difyConversationId: conv.id,
          createdAt: new Date(conv.created_at * 1000).toISOString(),
          updatedAt: new Date(conv.updated_at * 1000).toISOString(),
          messageCount,
          lastMessage: lastMessage || '暂无消息',
          isLoadingDetails: false
        }
      })
    )
    
    // 处理结果
    const finalConversations = conversationsWithDetails.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.error(`对话 ${index} 处理失败:`, result.reason)
        return basicConversations[index] // 使用基础数据作为fallback
      }
    })
    
    conversations.value = finalConversations
    
  } catch (err) {
    console.error('加载对话列表失败:', err)
    conversations.value = []
    await warning('无法加载对话列表，请检查网络连接', {
      title: '加载失败'
    })
  } finally {
    isLoadingConversations.value = false
  }
}

// 创建新对话
const createNewConversation = () => {
  currentConversation.value = null
  chatMessages.value = []
  conversationId.value = ''
  streamingState.value.show = false
  
  // 创建新对话后确保滚动位置正确
  scrollToBottom(false)
  
  // 在移动端自动关闭侧边栏
  if (window.innerWidth < 1024) {
    isChatSidebarOpen.value = false
  }
}

// 监听聊天消息变化，自动滚动（防抖处理）
let scrollTimeout = null
watch(chatMessages, () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = setTimeout(() => {
    // 只有在消息真正变化时才滚动
    if (chatMessages.value.length > 0) {
      smartScrollToBottom(true)
    }
  }, 100)
}, { deep: true })

const loadConversation = async (conversation) => {
  currentConversation.value = conversation
  conversationId.value = conversation.difyConversationId || conversation.id
  
  try {
    // 使用Dify API获取消息历史
    const params = new URLSearchParams({
      conversation_id: conversationId.value,
      user: user.value?.id || 'anonymous',
      limit: '50'
    })
    
    const response = await fetch(`https://api.dify.ai/v1/messages?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`获取消息历史失败: ${response.status}`)
    }
    
    const result = await response.json()
    
    // 转换Dify消息格式为前端格式
    chatMessages.value = []
    
    // Dify返回的消息是倒序的，需要反转
    const messages = result.data.reverse()
    
    for (const msg of messages) {
      // 用户消息
      if (msg.query) {
        chatMessages.value.push({
          id: `${msg.id}-user`,
          content: msg.query,
          isUser: true,
          time: formatTime(new Date(msg.created_at * 1000).toISOString()),
          files: msg.message_files || []
        })
      }
      
      // AI回复
      if (msg.answer) {
        chatMessages.value.push({
          id: msg.id,
          content: msg.answer,
          isUser: false,
          time: formatTime(new Date(msg.created_at * 1000).toISOString())
        })
      }
    }
    
    // 更新对话列表中当前对话的消息计数
    const currentConvIndex = conversations.value.findIndex(c => c.id === conversation.id)
    if (currentConvIndex !== -1) {
      conversations.value[currentConvIndex].messageCount = chatMessages.value.length
      // 更新最后一条消息
      if (chatMessages.value.length > 0) {
        const lastMsg = chatMessages.value[chatMessages.value.length - 1]
        conversations.value[currentConvIndex].lastMessage = lastMsg.content.length > 50 
          ? lastMsg.content.substring(0, 50) + '...' 
          : lastMsg.content
      }
    }
    
  } catch (err) {
    console.error('加载消息历史失败:', err)
    chatMessages.value = []
    await warning('无法加载对话历史，请检查网络连接', {
      title: '加载失败'
    })
  }
  
  // 加载完消息后滚动到底部
  scrollToBottom(false) // 使用非平滑滚动快速定位
  
  // 在移动端自动关闭侧边栏
  if (window.innerWidth < 1024) {
    isChatSidebarOpen.value = false
  }
}

const deleteConversation = async (convId) => {
  const confirmed = await confirm('确定要删除这个对话吗？此操作无法撤销。', {
    title: '删除对话',
    confirmText: '删除',
    cancelText: '取消'
  })
  
  if (!confirmed) return
  
  try {
    // 调用Dify API删除对话
    const response = await fetch(`https://api.dify.ai/v1/conversations/${convId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer app-PpZo5LZtLpt4snU8Hefs8SrN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user.value?.id || 'anonymous'
      })
    })
    
    if (!response.ok) {
      throw new Error(`删除对话失败: ${response.status}`)
    }
    
    // 从本地列表中移除
    conversations.value = conversations.value.filter(c => c.id !== convId)
    
    // 如果删除的是当前对话，清空聊天区域
    if (currentConversation.value?.id === convId) {
      currentConversation.value = null
      chatMessages.value = []
      conversationId.value = ''
    }
      } catch (err) {
      console.error('删除对话失败:', err)
      await error('删除对话失败，请稍后重试', {
        title: '删除失败'
      })
    }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

// 移动端键盘处理
const handleMobileKeyboard = () => {
  if (window.innerWidth < 1024) {
    // 检测视口高度变化（通常由键盘弹出引起）
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDiff = initialViewportHeight - currentHeight
      
      // 如果高度差超过150px，认为是键盘弹出
      if (heightDiff > 150) {
        // 键盘弹出时延迟滚动，确保布局稳定
        setTimeout(() => {
          scrollToBottom(true)
        }, 300)
      }
    }
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      
      return () => {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
      }
    }
  }
  return null
}

// 如果未认证，重定向到登录页
onMounted(async () => {
  if (!isAuthenticated.value) {
    navigateTo('/auth')
    return
  }
  
  // 加载对话列表
  await loadConversations()
  
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
  
  // 初始化移动端键盘处理
  const cleanupMobileKeyboard = handleMobileKeyboard()
  
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
    if (cleanupMobileKeyboard) {
      cleanupMobileKeyboard()
    }
    // 清理滚动超时
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
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

/* 流式响应动画入场效果 */
.streaming-enter-active,
.streaming-leave-active {
  transition: all 0.3s ease-in-out;
}

.streaming-enter-from,
.streaming-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.streaming-enter-to,
.streaming-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 移动端侧边栏动画 */
.mobile-sidebar-enter-active,
.mobile-sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-sidebar-enter-from,
.mobile-sidebar-leave-to {
  opacity: 0;
}

.mobile-sidebar-enter-from .bg-black\/50,
.mobile-sidebar-leave-to .bg-black\/50 {
  opacity: 0;
}

.mobile-sidebar-enter-from [class*="translate-x"],
.mobile-sidebar-leave-to [class*="translate-x"] {
  transform: translateX(100%);
}

.mobile-sidebar-enter-to,
.mobile-sidebar-leave-from {
  opacity: 1;
}

/* 桌面端侧边栏动画 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.sidebar-enter-to,
.sidebar-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* 工具类 */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 移动端优化 */
@media (max-width: 1023px) {
  .tech-button:active {
    transform: scale(0.95);
  }
  
  .user-message {
    max-width: calc(100vw - 6rem);
  }
  
  .bg-dark-light {
    background-color: rgba(23, 23, 23, 0.95);
    backdrop-filter: blur(10px);
  }
  
  /* 移动端滚动优化 */
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
}

/* 聊天容器滚动优化 */
.chat-container {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* 消息淡入动画 */
@keyframes message-fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-tech {
  animation: message-fade-in 0.3s ease-out;
}

/* iOS安全区域适配 */
@supports (padding: max(0px)) {
  .mobile-input {
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  }
}
</style> 