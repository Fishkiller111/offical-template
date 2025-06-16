<template>
  <div class="min-h-screen bg-dark text-light">
    <!-- Header -->
    <header class="navbar-default fixed w-full z-50">
      <nav class="container-default h-16 lg:h-20 flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-xl lg:text-2xl font-bold text-light">WebAI</h1>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden lg:flex space-x-8">
          <a href="#features" class="nav-link">{{ $t('nav.features') }}</a>
          <a href="#tools" class="nav-link">{{ $t('nav.tools') }}</a>
          <a href="#trending" class="nav-link">{{ $t('nav.testimonials') }}</a>
          <a href="#pricing" class="nav-link">{{ $t('nav.price') }}</a>
        </div>
        
        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center space-x-4">
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <div class="text-light text-sm">{{ $t('nav.welcome') }}, {{ user?.name || 'User' }}</div>
            <button 
              @click="handleLogout"
              class="btn-secondary text-sm"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
          <NuxtLink 
            v-else
            to="/auth"
            class="btn-primary text-sm"
          >
            {{ $t('nav.tryFree') }}
          </NuxtLink>
          <LanguageSwitcher />
          <ThemeSelector />
        </div>
        
        <!-- Mobile menu button -->
        <div class="lg:hidden flex items-center space-x-3">
          <div v-if="isAuthenticated">
            <NuxtLink 
              to="/dashboard"
              class="btn-primary text-sm px-3 py-2"
            >
              Dashboard
            </NuxtLink>
          </div>
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="nav-link p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div 
        v-show="isMobileMenuOpen" 
        class="lg:hidden bg-dark-light border-t border-dark-lighter"
      >
        <div class="container-default py-4 space-y-4">
          <a href="#features" @click="isMobileMenuOpen = false" class="block nav-link py-2">{{ $t('nav.features') }}</a>
          <a href="#tools" @click="isMobileMenuOpen = false" class="block nav-link py-2">{{ $t('nav.tools') }}</a>
          <a href="#trending" @click="isMobileMenuOpen = false" class="block nav-link py-2">{{ $t('nav.testimonials') }}</a>
          <a href="#pricing" @click="isMobileMenuOpen = false" class="block nav-link py-2">{{ $t('nav.price') }}</a>
          
          <div class="pt-4 border-t border-dark-lighter space-y-3">
            <div v-if="isAuthenticated" class="space-y-3">
              <div class="text-light text-sm">{{ $t('nav.welcome') }}, {{ user?.name || 'User' }}</div>
              <button 
                @click="handleLogout"
                class="btn-secondary w-full text-sm"
              >
                {{ $t('nav.logout') }}
              </button>
            </div>
            <NuxtLink 
              v-else
              to="/auth"
              class="btn-primary w-full text-center block text-sm"
              @click="isMobileMenuOpen = false"
            >
              {{ $t('nav.tryFree') }}
            </NuxtLink>
            
            <div class="flex items-center justify-center space-x-4">
              <LanguageSwitcher />
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-16 lg:pt-20 relative overflow-hidden min-h-screen flex items-center">
      <Vortex 
        :particle-count="400"
        :base-speed="0.0"
        :range-speed="1.5"
        :base-radius="1"
        :range-radius="2"
      >
        <div class="container-default py-12 lg:py-24 relative z-10">
          <div class="text-center px-4 lg:px-0">
            <h1 class="text-3xl lg:text-heading-1 font-bold animate-fade-up">
              {{ $t('hero.title') }}
              <span class="text-primary block mt-2">{{ $t('hero.subtitle') }}</span>
            </h1>
            <p class="mt-6 lg:mt-8 text-base lg:text-body max-w-3xl mx-auto animate-fade-up animation-delay-200 text-light-dark">
              {{ $t('hero.description') }}
            </p>
            <div class="mt-8 lg:mt-12 flex flex-col sm:flex-row justify-center gap-3 lg:gap-4 animate-fade-up animation-delay-400">
              <NuxtLink 
                v-if="!isAuthenticated"
                to="/auth"
                class="btn-primary text-base lg:text-lg font-semibold px-6 lg:px-8 py-3 lg:py-4"
              >
                {{ $t('hero.tryFree') }}
              </NuxtLink>
              <NuxtLink 
                v-else
                to="/dashboard"
                class="btn-primary text-base lg:text-lg font-semibold px-6 lg:px-8 py-3 lg:py-4"
              >
                Get Start
              </NuxtLink>
              <button class="btn-secondary text-base lg:text-lg font-semibold px-6 lg:px-8 py-3 lg:py-4">
                {{ $t('hero.viewDemo') }}
              </button>
            </div>
          </div>
        </div>
      </Vortex>
    </section>

    <!-- Partners Section -->
    <section class="py-12 lg:py-16 bg-gradient-1 overflow-hidden scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-8 lg:mb-12">
          <h2 class="text-2xl lg:text-heading-3 mb-4 font-semibold">{{ $t('partners.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('partners.subtitle') }}</p>
        </div>
        <div class="flex space-x-6 lg:space-x-8 animate-scroll">
          <div class="flex space-x-6 lg:space-x-8 animate-scroll-duplicate">
            <img src="https://via.placeholder.com/120x40" alt="Partner 1" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 2" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 3" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 4" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 5" class="h-6 lg:h-8 object-contain"/>
          </div>
          <div class="flex space-x-6 lg:space-x-8 animate-scroll-duplicate">
            <img src="https://via.placeholder.com/120x40" alt="Partner 1" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 2" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 3" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 4" class="h-6 lg:h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 5" class="h-6 lg:h-8 object-contain"/>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-12 lg:py-16 bg-gradient-2 scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl lg:text-heading-2 mb-4 font-bold">{{ $t('features.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('features.subtitle') }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div v-for="(feature, index) in localizedFeatures" :key="feature.title" 
               class="card-default scroll-reveal text-center"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="icon-container mb-4 lg:mb-6 mx-auto">
              <component :is="getIconComponent(feature.icon)" class="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
            </div>
            <h3 class="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">{{ feature.title }}</h3>
            <p class="text-light-dark text-sm lg:text-base">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section id="tools" class="py-12 lg:py-16 bg-gradient-3 scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl lg:text-heading-2 mb-4 font-bold">{{ $t('tools.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('tools.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div v-for="(tool, index) in localizedTools" :key="tool.title"
               class="card-default scroll-reveal text-center"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="icon-container mb-4 lg:mb-6 mx-auto">
              <component :is="getIconComponent(tool.icon)" class="w-6 h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
            </div>
            <h3 class="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">{{ tool.title }}</h3>
            <p class="text-light-dark mb-4 lg:mb-6 text-sm lg:text-base">{{ tool.description }}</p>
            <a href="#" class="nav-link text-sm lg:text-base">{{ $t('tools.learn_more') }} →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Topics Section -->
    <section id="trending" class="py-12 lg:py-16 bg-gradient-radial scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl lg:text-heading-2 mb-4 font-bold">{{ $t('trending.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('trending.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div v-for="(topic, index) in localizedTrendingTopics" :key="topic.title"
               class="card-default scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-base lg:text-lg font-semibold mb-3 lg:mb-4">{{ topic.title }}</h3>
            <p class="text-light-dark mb-4 lg:mb-6 text-sm lg:text-base">{{ topic.description }}</p>
            <div class="flex items-center space-x-2">
              <div v-for="avatar in topic.avatars" :key="avatar" class="w-6 h-6 lg:w-8 lg:h-8 -ml-1 first:ml-0 border-2 border-dark overflow-hidden rounded-full">
                <img :src="avatar" alt="User" class="w-full h-full object-cover" />
              </div>
              <span class="text-light-dark text-xs lg:text-sm ml-2">+{{ topic.additionalUsers }} {{ $t('trending.users') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-12 lg:py-16 bg-gradient-1 scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl lg:text-heading-2 mb-4 font-bold">{{ $t('faq.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('faq.subtitle') }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in localizedFaqs" :key="index" class="mb-3 lg:mb-4">
            <button 
              @click="toggleFaq(index)"
              class="w-full text-left p-4 lg:p-6 bg-dark rounded-xl flex justify-between items-center hover:bg-dark-lighter transition-colors"
            >
              <span class="font-semibold text-sm lg:text-base pr-4">{{ faq.question }}</span>
              <span class="transform transition-transform text-lg flex-shrink-0" :class="{ 'rotate-180': faq.isOpen }">↓</span>
            </button>
            <div v-show="faq.isOpen" class="p-4 lg:p-6 bg-dark-light mt-2 rounded-xl">
              <p class="text-light-dark text-sm lg:text-base">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-12 lg:py-16 bg-gradient-2 scroll-reveal">
      <div class="container-default px-4 lg:px-0">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl lg:text-heading-2 mb-4 font-bold">{{ $t('pricing.title') }}</h2>
          <p class="text-light-dark text-sm lg:text-base">{{ $t('pricing.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div v-for="(plan, index) in localizedPlans" :key="plan.name"
               class="card-default scroll-reveal text-center"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-xl lg:text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline justify-center mb-6 lg:mb-8">
              <span class="text-3xl lg:text-4xl font-bold">${{ plan.price }}</span>
              <span class="text-light-dark ml-2 text-sm lg:text-base">{{ $t('pricing.price_per_month') }}</span>
            </div>
            <ul class="space-y-3 lg:space-y-4 mb-6 lg:mb-8 text-left">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                <span class="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                <span class="text-sm lg:text-base">{{ feature }}</span>
              </li>
            </ul>
            <button class="btn-primary w-full py-2 lg:py-3 text-sm lg:text-base">
              {{ $t('pricing.try_plan') }} {{ plan.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="navbar-default py-8 lg:py-12">
      <div class="container-default text-center px-4 lg:px-0">
        <h1 class="text-xl lg:text-2xl font-bold text-light mb-3 lg:mb-4">{{ $t('footer.title') }}</h1>
        <p class="text-light-dark text-sm lg:text-base">{{ $t('footer.subtitle') }}</p>
        <div class="mt-6 lg:mt-8 text-light-dark text-xs lg:text-sm">
          {{ $t('footer.copyright') }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  CpuChipIcon, 
  LanguageIcon, 
  PencilSquareIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'

// Import Language Switcher Component
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
// Import ThemeSelector Component
import ThemeSelector from '~/components/ThemeSelector.vue'
// Import Vortex Component (simplified version for testing)
import Vortex from '~/components/ui/VortexSimple.vue'

// 获取i18n实例
const { t } = useI18n()

// 获取认证状态
const { user, isAuthenticated, logout } = useAuth()

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 处理登出
const handleLogout = async () => {
  await logout()
  await navigateTo('/auth')
}

// 图标组件映射
const iconComponents = {
  CpuChipIcon,
  LanguageIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName]
}

// 本地化的features数据
const localizedFeatures = computed(() => [
  {
    icon: 'CpuChipIcon',
    title: t('features.latest_ai'),
    description: t('features.latest_ai_desc')
  },
  {
    icon: 'LanguageIcon',
    title: t('features.multiple_languages'),
    description: t('features.multiple_languages_desc')
  },
  {
    icon: 'PencilSquareIcon',
    title: t('features.edit_text'),
    description: t('features.edit_text_desc')
  }
])

// 本地化的tools数据
const localizedTools = computed(() => [
  {
    icon: 'DocumentTextIcon',
    title: t('tools.blog_post'),
    description: t('tools.blog_post_desc')
  },
  {
    icon: 'GlobeAltIcon',
    title: t('tools.social_media'),
    description: t('tools.social_media_desc')
  },
  {
    icon: 'EnvelopeIcon',
    title: t('tools.email'),
    description: t('tools.email_desc')
  },
  {
    icon: 'QuestionMarkCircleIcon',
    title: t('tools.faq'),
    description: t('tools.faq_desc')
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: t('tools.testimonials'),
    description: t('tools.testimonials_desc')
  },
  {
    icon: 'DevicePhoneMobileIcon',
    title: t('tools.app_description'),
    description: t('tools.app_description_desc')
  }
])

// 本地化的trending topics数据
const localizedTrendingTopics = computed(() => [
  {
    title: t('trending.ai_content_generation'),
    description: t('trending.ai_content_generation_desc'),
    avatars: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3'
    ],
    additionalUsers: 128
  },
  {
    title: t('trending.marketing_copy'),
    description: t('trending.marketing_copy_desc'),
    avatars: [
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5'
    ],
    additionalUsers: 89
  },
  {
    title: t('trending.seo_optimization'),
    description: t('trending.seo_optimization_desc'),
    avatars: [
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=7',
      'https://i.pravatar.cc/150?img=8',
      'https://i.pravatar.cc/150?img=9'
    ],
    additionalUsers: 256
  }
])

// 本地化的FAQ数据
const faqOpenStates = ref([false, false, false])

const localizedFaqs = computed(() => [
  {
    question: t('faq.q1'),
    answer: t('faq.a1'),
    isOpen: faqOpenStates.value[0]
  },
  {
    question: t('faq.q2'),
    answer: t('faq.a2'),
    isOpen: faqOpenStates.value[1]
  },
  {
    question: t('faq.q3'),
    answer: t('faq.a3'),
    isOpen: faqOpenStates.value[2]
  }
])

const toggleFaq = (index) => {
  faqOpenStates.value[index] = !faqOpenStates.value[index]
}

// 本地化的pricing plans数据
const localizedPlans = computed(() => [
  {
    name: t('pricing.free'),
    price: '0',
    features: [
      t('pricing.features.words_5k'),
      t('pricing.features.basic_templates'),
      t('pricing.features.standard_support'),
      t('pricing.features.single_user')
    ]
  },
  {
    name: t('pricing.starter'),
    price: '39',
    features: [
      t('pricing.features.words_50k'),
      t('pricing.features.all_templates'),
      t('pricing.features.priority_support'),
      t('pricing.features.users_3')
    ]
  },
  {
    name: t('pricing.basic'),
    price: '89',
    features: [
      t('pricing.features.words_200k'),
      t('pricing.features.custom_templates'),
      t('pricing.features.support_24_7'),
      t('pricing.features.users_10')
    ]
  },
  {
    name: t('pricing.enterprise'),
    price: '149',
    features: [
      t('pricing.features.words_unlimited'),
      t('pricing.features.custom_solutions'),
      t('pricing.features.dedicated_support'),
      t('pricing.features.users_unlimited')
    ]
  }
])

onMounted(() => {
  // 滚动动画观察器
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el)
  })

  // 监听窗口大小变化，在桌面端关闭移动菜单
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      isMobileMenuOpen.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  // 平滑滚动到锚点
  const handleSmoothScroll = (e) => {
    const href = e.target.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const headerHeight = 80 // 导航栏高度
        const targetPosition = targetElement.offsetTop - headerHeight
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
        isMobileMenuOpen.value = false
      }
    }
  }

  // 为所有锚点链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', handleSmoothScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.removeEventListener('click', handleSmoothScroll)
    })
  })
})
</script>

<style scoped>
/* 页面特定样式，如果有的话可以保留在这里 */
</style> 