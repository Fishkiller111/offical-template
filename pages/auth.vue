<template>
  <div class="min-h-screen bg-dark text-light flex items-center justify-center p-4">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-hero-pattern"></div>
    
    <!-- Auth form container -->
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-dark-light/80 backdrop-blur-lg border border-dark-lighter rounded-2xl p-8 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-light mb-2">{{ $t('auth.welcome') }}</h1>
          <p class="text-light-dark">{{ isLogin ? $t('auth.login_subtitle') : $t('auth.register_subtitle') }}</p>
        </div>

        <!-- Toggle buttons -->
        <div class="flex bg-dark-lighter rounded-xl p-1 mb-6">
          <button 
            @click="isLogin = true"
            class="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200"
            :class="isLogin ? 'bg-primary text-white' : 'text-light-dark hover:text-light'"
          >
            {{ $t('auth.login') }}
          </button>
          <button 
            @click="isLogin = false"
            class="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200"
            :class="!isLogin ? 'bg-primary text-white' : 'text-light-dark hover:text-light'"
          >
            {{ $t('auth.register') }}
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Error message -->
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Name field (register only) -->
          <div v-if="!isLogin" class="space-y-2">
            <label class="text-sm font-medium text-light">{{ $t('auth.name') }}</label>
            <input 
              v-model="form.name"
              type="text" 
              required
              class="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-xl text-light placeholder-light-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              :placeholder="$t('auth.name_placeholder')"
            />
          </div>

          <!-- Email field -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-light">{{ $t('auth.email') }}</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              class="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-xl text-light placeholder-light-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              :placeholder="$t('auth.email_placeholder')"
            />
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-light">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-xl text-light placeholder-light-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
                :placeholder="$t('auth.password_placeholder')"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-dark hover:text-light transition-colors"
              >
                <Icon :icon="showPassword ? 'tabler:eye-off' : 'tabler:eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Confirm password (register only) -->
          <div v-if="!isLogin" class="space-y-2">
            <label class="text-sm font-medium text-light">{{ $t('auth.confirm_password') }}</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              required
              class="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-xl text-light placeholder-light-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              :placeholder="$t('auth.confirm_password_placeholder')"
            />
          </div>

          <!-- Submit button -->
          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <Icon icon="tabler:loader-2" class="w-5 h-5 animate-spin mr-2" />
              {{ $t('auth.processing') }}
            </span>
            <span v-else>{{ isLogin ? $t('auth.login') : $t('auth.register') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-dark-lighter"></div>
          <span class="px-4 text-sm text-light-dark">{{ $t('auth.or_divider') }}</span>
          <div class="flex-1 border-t border-dark-lighter"></div>
        </div>

        <!-- Social login -->
        <div class="space-y-3">
          <button class="w-full flex items-center justify-center py-3 px-4 border border-dark-lighter rounded-xl text-light hover:bg-dark-lighter transition-colors">
            <Icon icon="tabler:brand-google" class="w-5 h-5 mr-3" />
            {{ $t('auth.google_continue') }}
          </button>
          <button class="w-full flex items-center justify-center py-3 px-4 border border-dark-lighter rounded-xl text-light hover:bg-dark-lighter transition-colors">
            <Icon icon="tabler:brand-github" class="w-5 h-5 mr-3" />
            {{ $t('auth.github_continue') }}
          </button>
        </div>

        <!-- Back to home -->
        <div class="text-center mt-8">
          <NuxtLink 
            to="/"
            class="text-primary hover:text-primary-dark transition-colors text-sm"
          >
            {{ $t('auth.back_to_home') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive } from 'vue'

// 获取i18n实例
const { t } = useI18n()

// 获取认证函数
const { login } = useAuth()

// 页面meta
useHead({
  title: () => `${t('auth.login')} / ${t('auth.register')} - WebAI`,
  meta: [
    { name: 'description', content: () => t('auth.login_subtitle') }
  ]
})

const isLogin = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!isLogin.value && form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.password_mismatch')
    return
  }
  
  loading.value = true
  
  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const payload = isLogin.value 
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password }

    const { data } = await $fetch(endpoint, {
      method: 'POST',
      body: payload
    })

    // 使用composable登录
    login(data.user, data.token)

    // 显示成功消息
    const successMessage = isLogin.value 
      ? t('auth.login_success') 
      : t('auth.register_success')
    
    console.log(successMessage, data.user)
    
    // 成功后跳转到首页
    await navigateTo('/')
  } catch (error) {
    console.error('认证失败:', error)
    
    // 处理错误消息
    if (error.data?.statusMessage) {
      errorMessage.value = error.data.statusMessage
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = isLogin.value ? '登录失败' : '注册失败'
    }
  } finally {
    loading.value = false
  }
}
</script> 