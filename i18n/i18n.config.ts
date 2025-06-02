import zh from '../locale/zh'
import en from '../locale/en'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh',
  defaultLocale: 'zh',
  strategy: 'no_prefix',
  messages: {
    zh,
    en
  }
})) 