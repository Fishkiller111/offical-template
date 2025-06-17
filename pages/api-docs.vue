<template>
  <div class="min-h-screen bg-dark">
    <!-- 导航栏 -->
    <header class="navbar-default">
      <nav class="container-default h-16 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo/logo-_.png" alt="WebAI" class="h-8 w-auto">
          </NuxtLink>
          <span class="ml-3 text-light-dark">/ API 文档</span>
        </div>
        <div class="flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSelector />
        </div>
      </nav>
    </header>

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-heading-1 text-light mb-4">
          {{ $t('apiDocs.title') }}
        </h1>
        <p class="text-body">
          {{ $t('apiDocs.description') }}
        </p>
      </div>
      
      <div class="card-default shadow-lg overflow-hidden">
        <div id="swagger-ui" ref="swaggerContainer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// Import components
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import ThemeSelector from '~/components/ThemeSelector.vue'

const { t } = useI18n()
const swaggerContainer = ref()

useHead({
  title: computed(() => t('apiDocs.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('apiDocs.description'))
    }
  ]
})

// 监听主题变化并重新应用Swagger UI样式
const updateSwaggerTheme = () => {
  const isLightMode = document.documentElement.classList.contains('light-mode')
  const swaggerWrapper = document.querySelector('#swagger-ui')
  if (swaggerWrapper) {
    if (isLightMode) {
      swaggerWrapper.classList.add('swagger-light')
      swaggerWrapper.classList.remove('swagger-dark')
    } else {
      swaggerWrapper.classList.add('swagger-dark')
      swaggerWrapper.classList.remove('swagger-light')
    }
  }
}

onMounted(async () => {
  try {
    // 动态导入Swagger UI
    const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js')).default
    
    // 导入CSS
    await import('swagger-ui-dist/swagger-ui.css')
    
    // 初始化Swagger UI
    SwaggerUIBundle({
      url: '/api/docs',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis
      ],
      tryItOutEnabled: true,
      filter: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      onComplete: () => {
        console.log('Swagger UI loaded successfully')
        // 初始主题应用
        setTimeout(updateSwaggerTheme, 100)
      },
      onFailure: (err) => {
        console.error('Swagger UI failed to load:', err)
      }
    })

    // 监听主题变化
    const observer = new MutationObserver(() => {
      updateSwaggerTheme()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
  } catch (error) {
    console.error('Error loading Swagger UI:', error)
  }
})
</script>

<style>
/* 页面特定的Swagger UI样式微调，如果需要的话 */
</style> 