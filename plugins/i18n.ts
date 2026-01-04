import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import id from '../locales/id.json'
import en from '../locales/en.json'

export default defineNuxtPlugin(({ vueApp }: { vueApp: App }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'id',
    fallbackLocale: 'id',
    messages: {
      id,
      en
    }
  })

  vueApp.use(i18n)
})