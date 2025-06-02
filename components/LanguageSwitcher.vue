<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-light/50 border border-dark-lighter hover:border-primary transition-colors"
    >
      <Icon icon="tabler:language" class="w-5 h-5 text-light-dark" />
      <span class="text-light-dark text-sm">{{ currentLocale?.flag }}</span>
      <Icon icon="tabler:chevron-down" class="w-4 h-4 text-light-dark" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <div 
      v-show="isOpen"
      class="absolute top-full right-0 mt-2 w-40 bg-dark-light border border-dark-lighter rounded-lg shadow-lg z-50"
    >
      <div 
        v-for="locale in availableLocales" 
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="flex items-center space-x-3 px-4 py-3 hover:bg-dark-lighter cursor-pointer transition-colors"
        :class="{ 'bg-primary/10 text-primary': $i18n.locale === locale.code }"
      >
        <span class="text-lg">{{ locale.flag }}</span>
        <span class="text-sm">{{ locale.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => locales.value)
const currentLocale = computed(() => locales.value.find(l => l.code === locale.value))

const switchLanguage = (code) => {
  setLocale(code)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      isOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script> 