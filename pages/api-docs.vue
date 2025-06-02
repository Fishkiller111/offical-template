<template>
  <div class="min-h-screen bg-dark">
    <!-- 导航栏 -->
    <header class="bg-dark-light/50 backdrop-blur-lg border-b border-dark-lighter">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-light">
            WebAI
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
        <h1 class="text-4xl font-bold text-light mb-4">
          {{ $t('apiDocs.title') }}
        </h1>
        <p class="text-lg text-light-dark">
          {{ $t('apiDocs.description') }}
        </p>
      </div>
      
      <div class="bg-dark-light rounded-lg shadow-lg overflow-hidden border border-dark-lighter">
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
/* 应用项目的主题系统 */
:root {
  --bg-dark: #0F172A;
  --bg-dark-light: #1E293B;
  --bg-dark-lighter: #334155;
  --text-light: #F8FAFC;
  --text-light-dark: #94A3B8;
}

/* 亮色模式 */
:root.light-mode {
  --bg-dark: #FFFFFF;
  --bg-dark-light: #F8FAFC;
  --bg-dark-lighter: #E2E8F0;
  --text-light: #1E293B;
  --text-light-dark: #64748B;
}

/* 自定义Swagger UI样式 */
#swagger-ui .swagger-ui {
  font-family: inherit;
  background: var(--bg-dark-light);
  color: var(--text-light);
}

#swagger-ui .topbar {
  display: none;
}

#swagger-ui .info {
  margin: 2rem 0;
  color: var(--text-light) !important;
}

#swagger-ui .info h1,
#swagger-ui .info h2,
#swagger-ui .info h3 {
  color: var(--text-light) !important;
}

#swagger-ui .info .title {
  color: var(--text-light) !important;
}

#swagger-ui .scheme-container {
  background: var(--bg-dark-lighter);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 暗色模式的Swagger UI */
#swagger-ui.swagger-dark .swagger-ui {
  background: var(--bg-dark-light);
}

#swagger-ui.swagger-dark .swagger-ui .opblock {
  background: var(--bg-dark);
  border: 1px solid var(--bg-dark-lighter);
}

#swagger-ui.swagger-dark .swagger-ui .opblock .opblock-summary {
  border-color: var(--bg-dark-lighter);
}

/* 亮色模式的Swagger UI */
#swagger-ui.swagger-light .swagger-ui {
  background: var(--bg-dark-light);
}

#swagger-ui.swagger-light .swagger-ui .opblock {
  background: var(--bg-dark);
  border: 1px solid var(--bg-dark-lighter);
}

/* 通用样式 */
.bg-dark {
  background-color: var(--bg-dark);
}

.bg-dark-light {
  background-color: var(--bg-dark-light);
}

.border-dark-lighter {
  border-color: var(--bg-dark-lighter);
}

.text-light {
  color: var(--text-light);
}

.text-light-dark {
  color: var(--text-light-dark);
}
</style> 