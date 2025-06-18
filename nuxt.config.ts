// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@vueuse/motion/nuxt'],
  css: ['~/assets/css/global.css'],
  devServer: {
    port: 4000,
    host: 'localhost'
  },
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.API_BASE_URL || "http://localhost:3001/api",
        changeOrigin: true
      }
    }
  },
  runtimeConfig: {
    // 服务器端运行时配置（仅在服务器端可用）
    serverPort: process.env.NUXT_PORT || '3000',
    serverHost: process.env.NUXT_HOST || '0.0.0.0',
    difyApiKey: process.env.DIFY_API_KEY,
    difyBaseUrl: process.env.DIFY_BASE_URL,
    // 公共配置（暴露给客户端）
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
    }
  },
  i18n: {
    locales: [
      { 
        code: 'zh', 
        name: '中文', 
        flag: '🇨🇳' 
      },
      { 
        code: 'en', 
        name: 'English', 
        flag: '🇺🇸' 
      }
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    vueI18n: 'i18n.config.ts'
  },
  app: {
    head: {
      title: 'WebAI - AI Development Solutions',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI Development Solutions and Services' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})