<template>
  <div class="min-h-screen bg-dark text-light">
    <!-- Header -->
    <header class="navbar-default fixed w-full z-50">
      <nav class="container-default h-20 flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-light">WebAI</h1>
        </div>
        <div class="hidden lg:flex space-x-8">
          <a href="#" class="nav-link">{{ $t('nav.home') }}</a>
          <a href="#" class="nav-link">{{ $t('nav.tools') }}</a>
          <a href="#" class="nav-link">{{ $t('nav.features') }}</a>
          <a href="#" class="nav-link">{{ $t('nav.testimonials') }}</a>
          <a href="#" class="nav-link">{{ $t('nav.price') }}</a>
        </div>
        <div class="hidden lg:flex items-center space-x-4">
          <!-- 根据认证状态显示不同内容 -->
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <div class="text-light">{{ $t('nav.welcome') }}, {{ user?.name || 'User' }}</div>
            <button 
              @click="handleLogout"
              class="btn-secondary"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
          <NuxtLink 
            v-else
            to="/auth"
            class="btn-primary"
          >
            {{ $t('nav.tryFree') }}
          </NuxtLink>
          <LanguageSwitcher />
          <ThemeSelector />
        </div>
        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="pt-20 relative overflow-hidden min-h-screen flex items-center">
      <Vortex 
        :particle-count="400"
        :base-speed="0.0"
        :range-speed="1.5"
        :base-radius="1"
        :range-radius="2"
      >
        <div class="container-default py-24 relative z-10">
          <div class="text-center">
            <h1 class="text-heading-1 animate-fade-up">
              {{ $t('hero.title') }}
              <span class="text-primary block mt-2">{{ $t('hero.subtitle') }}</span>
            </h1>
            <p class="mt-8 text-body max-w-3xl mx-auto animate-fade-up animation-delay-200">
              {{ $t('hero.description') }}
            </p>
            <div class="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up animation-delay-400">
              <NuxtLink 
                v-if="!isAuthenticated"
                to="/auth"
                class="btn-primary text-lg font-semibold px-8 py-4"
              >
                {{ $t('hero.tryFree') }}
              </NuxtLink>
              <div 
                v-else
                class="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold opacity-75 cursor-default"
              >
                {{ $t('hero.welcome_back') }}, {{ user?.name }}!
              </div>
              <button class="btn-secondary text-lg font-semibold px-8 py-4">
                {{ $t('hero.viewDemo') }}
              </button>
            </div>
          </div>
        </div>
      </Vortex>
    </section>

    <!-- Partners Section -->
    <section class="section-padding bg-gradient-1 overflow-hidden scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-12">
          <h2 class="text-heading-3 mb-4">{{ $t('partners.title') }}</h2>
          <p class="text-light-dark">{{ $t('partners.subtitle') }}</p>
        </div>
        <div class="flex space-x-8 animate-scroll">
          <div class="flex space-x-8 animate-scroll-duplicate">
            <img src="https://via.placeholder.com/120x40" alt="Partner 1" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 2" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 3" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 4" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 5" class="h-8 object-contain"/>
          </div>
          <div class="flex space-x-8 animate-scroll-duplicate">
            <img src="https://via.placeholder.com/120x40" alt="Partner 1" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 2" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 3" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 4" class="h-8 object-contain"/>
            <img src="https://via.placeholder.com/120x40" alt="Partner 5" class="h-8 object-contain"/>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section-padding bg-gradient-2 scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-16">
          <h2 class="text-heading-2 mb-4">{{ $t('features.title') }}</h2>
          <p class="text-light-dark">{{ $t('features.subtitle') }}</p>
        </div>
        
        <div class="grid-responsive-3">
          <div v-for="(feature, index) in localizedFeatures" :key="feature.title" 
               class="card-default scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="icon-container mb-6">
              <component :is="getIconComponent(feature.icon)" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-4">{{ feature.title }}</h3>
            <p class="text-light-dark">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section class="section-padding bg-gradient-3 scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-16">
          <h2 class="text-heading-2 mb-4">{{ $t('tools.title') }}</h2>
          <p class="text-light-dark">{{ $t('tools.subtitle') }}</p>
        </div>

        <div class="grid-responsive-3">
          <div v-for="(tool, index) in localizedTools" :key="tool.title"
               class="card-default scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="icon-container mb-6 mx-auto">
              <component :is="getIconComponent(tool.icon)" class="w-8 h-8 text-primary flex-shrink-0" />
            </div>
            <h3 class="text-xl font-semibold mb-4">{{ tool.title }}</h3>
            <p class="text-light-dark mb-6">{{ tool.description }}</p>
            <a href="#" class="nav-link">{{ $t('tools.learn_more') }} →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Topics Section -->
    <section class="section-padding bg-gradient-radial scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-16">
          <h2 class="text-heading-2 mb-4">{{ $t('trending.title') }}</h2>
          <p class="text-light-dark">{{ $t('trending.subtitle') }}</p>
        </div>

        <div class="grid-responsive-3">
          <div v-for="(topic, index) in localizedTrendingTopics" :key="topic.title"
               class="card-default scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-lg font-semibold mb-4">{{ topic.title }}</h3>
            <p class="text-light-dark mb-6">{{ topic.description }}</p>
            <div class="flex items-center space-x-2">
              <div v-for="avatar in topic.avatars" :key="avatar" class="icon-container-sm -ml-2 first:ml-0 border-2 border-dark overflow-hidden">
                <img :src="avatar" alt="User" class="w-full h-full object-cover" />
              </div>
              <span class="text-light-dark text-sm ml-2">+{{ topic.additionalUsers }} {{ $t('trending.users') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section-padding bg-gradient-1 scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-16">
          <h2 class="text-heading-2 mb-4">{{ $t('faq.title') }}</h2>
          <p class="text-light-dark">{{ $t('faq.subtitle') }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in localizedFaqs" :key="index" class="mb-4">
            <button 
              @click="toggleFaq(index)"
              class="w-full text-left p-6 bg-dark rounded-xl flex justify-between items-center hover:bg-dark-lighter transition-colors"
            >
              <span class="font-semibold">{{ faq.question }}</span>
              <span class="transform transition-transform" :class="{ 'rotate-180': faq.isOpen }">↓</span>
            </button>
            <div v-show="faq.isOpen" class="p-6 bg-dark-light mt-2 rounded-xl">
              <p class="text-light-dark">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="section-padding bg-gradient-2 scroll-reveal">
      <div class="container-default">
        <div class="text-center mb-16">
          <h2 class="text-heading-2 mb-4">{{ $t('pricing.title') }}</h2>
          <p class="text-light-dark">{{ $t('pricing.subtitle') }}</p>
        </div>

        <div class="grid-responsive-4">
          <div v-for="(plan, index) in localizedPlans" :key="plan.name"
               class="card-default scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline mb-8">
              <span class="text-4xl font-bold">${{ plan.price }}</span>
              <span class="text-light-dark ml-2">{{ $t('pricing.price_per_month') }}</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center">
                <span class="text-primary mr-2">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <button class="btn-primary w-full py-3">
              {{ $t('pricing.try_plan') }} {{ plan.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="navbar-default py-12">
      <div class="container-default text-center">
        <h1 class="text-2xl font-bold text-light mb-4">{{ $t('footer.title') }}</h1>
        <p class="text-light-dark">{{ $t('footer.subtitle') }}</p>
        <div class="mt-8 text-light-dark">
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
})
</script>

<style scoped>
/* 页面特定样式，如果有的话可以保留在这里 */
</style> 