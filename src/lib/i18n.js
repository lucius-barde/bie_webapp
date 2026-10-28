import fr from '../locales/fr.json'
import en from '../locales/en.json'
import de from '../locales/de.json'

const translations = {
  fr,
  en,
  de
}

/**
 * Get a translation value using dot notation
 * @param {string} key - Path to translation (e.g., 'common.home')
 * @param {string} locale - Language code (fr, en, de)
 * @returns {string} Translated text or key if not found
 */
export const getTranslation = (key, locale = 'fr') => {
  if (!key) return ''
  if (!translations[locale]) return key

  const keys = key.split('.')
  let value = translations[locale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Get all translations for a specific locale
 * @param {string} locale - Language code
 * @returns {object} Translation object
 */
export const getLocaleTranslations = (locale = 'fr') => {
  return translations[locale] || translations.fr
}

export const supportedLocales = ['fr', 'en', 'de']
export const defaultLocale = 'fr'
