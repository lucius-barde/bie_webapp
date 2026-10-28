/**
 * Song origins/countries (song_origin_legacy) with translations
 * Each entry has the French name as key and translations for each language
 */
export const songOrigins = {
  'B.i.E': {
    fr: 'B.i.E',
    en: 'B.i.E',
    de: 'B.i.E'
  },
  'France': {
    fr: 'France',
    en: 'France',
    de: 'Frankreich'
  },
  'Suisse': {
    fr: 'Suisse',
    en: 'Switzerland',
    de: 'Schweiz'
  },
  'Allemagne': {
    fr: 'Allemagne',
    en: 'Germany',
    de: 'Deutschland'
  },
  'Italie': {
    fr: 'Italie',
    en: 'Italy',
    de: 'Italien'
  },
  'Espagne': {
    fr: 'Espagne',
    en: 'Spain',
    de: 'Spanien'
  },
  'Belgique': {
    fr: 'Belgique',
    en: 'Belgium',
    de: 'Belgien'
  },
  'Portugal': {
    fr: 'Portugal',
    en: 'Portugal',
    de: 'Portugal'
  },
  'Grèce': {
    fr: 'Grèce',
    en: 'Greece',
    de: 'Griechenland'
  },
  'Autriche': {
    fr: 'Autriche',
    en: 'Austria',
    de: 'Österreich'
  },
  'Pays-Bas': {
    fr: 'Pays-Bas',
    en: 'Netherlands',
    de: 'Niederlande'
  },
  'Scandinavie': {
    fr: 'Scandinavie',
    en: 'Scandinavia',
    de: 'Skandinavien'
  },
  'Norvège': {
    fr: 'Norvège',
    en: 'Norway',
    de: 'Norwegen'
  },
  'Suède': {
    fr: 'Suède',
    en: 'Sweden',
    de: 'Schweden'
  },
  'Danemark': {
    fr: 'Danemark',
    en: 'Denmark',
    de: 'Dänemark'
  },
  'Pologne': {
    fr: 'Pologne',
    en: 'Poland',
    de: 'Polen'
  },
  'Hongrie': {
    fr: 'Hongrie',
    en: 'Hungary',
    de: 'Ungarn'
  },
  'Tchéquie': {
    fr: 'Tchéquie',
    en: 'Czech Republic',
    de: 'Tschechien'
  },
  'Roumanie': {
    fr: 'Roumanie',
    en: 'Romania',
    de: 'Rumänien'
  },
  'Bulgarie': {
    fr: 'Bulgarie',
    en: 'Bulgaria',
    de: 'Bulgarien'
  },
  'Royaume-Uni': {
    fr: 'Royaume-Uni',
    en: 'United Kingdom',
    de: 'Vereinigtes Königreich'
  },
  'Irlande': {
    fr: 'Irlande',
    en: 'Ireland',
    de: 'Irland'
  },
  'Écosse': {
    fr: 'Écosse',
    en: 'Scotland',
    de: 'Schottland'
  },
  'Pays de Galles': {
    fr: 'Pays de Galles',
    en: 'Wales',
    de: 'Wales'
  },
  'Europe': {
    fr: 'Europe',
    en: 'Europe',
    de: 'Europa'
  },
  'Origines multiples': {
    fr: 'Origines multiples',
    en: 'Multiple origins',
    de: 'Mehrere Länder'
  }
}

/**
 * Get translated song origin
 * @param {string} frenchOrigin - The French name of the origin (key from songOrigins)
 * @param {string} locale - Language code (fr, en, de)
 * @returns {string} Translated origin or original value if not found in dictionary
 */
export const getSongOriginTranslation = (frenchOrigin, locale = 'fr') => {
  if (!frenchOrigin) return ''

  const originTranslations = songOrigins[frenchOrigin]

  if (!originTranslations) {
    // Fallback for unknown origins - return the original value
    return frenchOrigin
  }

  return originTranslations[locale] || originTranslations.fr
}

/**
 * Get all origin translations for a specific locale
 * @param {string} locale - Language code (fr, en, de)
 * @returns {array} Array of {original, translated} objects
 */
export const getSongOriginsForLocale = (locale = 'fr') => {
  return Object.entries(songOrigins).map(([frenchName, translations]) => ({
    fr: frenchName,
    translated: translations[locale] || translations.fr
  }))
}
