import { lyricLanguages } from '../lib/languages'
import { getTranslation } from '../lib/i18n'

/**
 * Composable for managing lyric language names and translations
 */
export const useLanguages = () => {
  /**
   * Get translated language name
   * @param {string} languageCode - Language code (e.g., 'de', 'en', 'fr')
   * @param {string} locale - Current interface locale
   * @returns {string} Translated language name
   */
  const getLanguageName = (languageCode, locale = 'fr') => {
    if (!languageCode) return ''

    const langEntry = lyricLanguages.find(({ code }) => code === languageCode)
    if (!langEntry) return languageCode

    // Extract translations from the entry
    const parts = langEntry.name.split('|')
    const translations = {}

    for (const part of parts) {
      const [lng, val] = part.split(':')
      if (lng && val) {
        translations[lng.trim()] = val.trim()
      }
    }

    return translations[locale] || translations['fr'] || languageCode
  }

  /**
   * Get all language names for current locale
   * @param {string} locale - Current interface locale
   * @returns {array} Array of language objects
   */
  const getLanguageNames = (locale = 'fr') => {
    return lyricLanguages.map(lang => ({
      code: lang.code,
      name: getLanguageName(lang.code, locale),
      original: lang.name
    }))
  }

  return {
    getLanguageName,
    getLanguageNames
  }
}
