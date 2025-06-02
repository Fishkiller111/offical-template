// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/global.css'],
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