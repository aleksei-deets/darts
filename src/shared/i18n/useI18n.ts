import { computed } from 'vue'
import { useSettingsStore } from '@/shared/stores/settingsStore'
import type { Language } from '@/shared/types/settings'
import { ru, type TranslationKey, type TranslationMap } from './locales/ru'
import { en } from './locales/en'

const translations: Record<Language, TranslationMap> = { ru, en }

export function useI18n() {
  const settings = useSettingsStore()

  const currentTranslations = computed(() => translations[settings.language])

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let text: string = currentTranslations.value[key] ?? key
    if (params) {
      for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{{${param}}}`, String(value))
      }
    }
    return text
  }

  return { t }
}
