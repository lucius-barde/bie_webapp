import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTranslation, getLocaleTranslations, supportedLocales, defaultLocale } from '../lib/i18n'

/**
 * Composable for managing the current locale and translations
 */
export const useLocale = () => {
  const route = useRoute()

  /**
   * Extract locale from route
   * Matches /fr/..., /en/..., /de/...
   */
  const locale = computed(() => {
    const pathParts = route.path.split('/')
    const possibleLocale = pathParts[1]
    return supportedLocales.includes(possibleLocale) ? possibleLocale : defaultLocale
  })

  /**
   * Translate a key using current locale
   */
  const t = (key) => {
    return getTranslation(key, locale.value)
  }

  /**
   * Get all translations for current locale
   */
  const translations = computed(() => {
    return getLocaleTranslations(locale.value)
  })

  /**
   * Get all supported locales
   */
  const getLocales = () => {
    return supportedLocales
  }

  /**
   * Check if a locale is current
   */
  const isCurrentLocale = (checkLocale) => {
    return locale.value === checkLocale
  }

  return {
    locale,
    t,
    translations,
    getLocales,
    isCurrentLocale,
    defaultLocale,
    supportedLocales
  }
}
