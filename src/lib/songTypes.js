/**
 * Song types (song_type_legacy) with translations
 * Each entry has the French name as key and translations for each language
 */
export const songTypes = {
  'Chant traditionnel': {
    fr: 'Chant traditionnel',
    en: 'Traditional song',
    de: 'Volkslied'
  },
  'Chanson médiévale': {
    fr: 'Chanson médiévale',
    en: 'Medieval song',
    de: 'Mittelalterliches Lied'
  },
  'Autres chants': {
    fr: 'Chant non-classé',
    en: 'Unclassified song',
    de: 'Nicht klassifiziertes Lied'
  },
  'Chant de marins': {
    fr: 'Chant de marins',
    en: 'Sea shanty',
    de: 'Seemannslied'
  },
  'Chanson à boire': {
    fr: 'Chanson à boire',
    en: 'Drinking song',
    de: 'Trinklied'
  },
  'Chanson à texte d\'héroïque-fantaisie': {
    fr: 'Chanson à texte d\'héroïque-fantaisie',
    en: 'Heroic-fantasy song',
    de: 'Heroisch-fantastisches Lied'
  },
  'Chant militaire': {
    fr: 'Chant militaire',
    en: 'Military song',
    de: 'Militärlied'
  },
  'Chant médiéval': {
    fr: 'Chant médiéval',
    en: 'Medieval song',
    de: 'Mittelalterliches Lied'
  },
  'Chant de type hymne': {
    fr: 'Chant de type hymne',
    en: 'Hymn-type song',
    de: 'Hymnenartiges Lied'
  },
  'Chant de la Renaissance': {
    fr: 'Chant de la Renaissance',
    en: 'Renaissance song',
    de: 'Renaissancelied'
  },
  'Composition instrumentale': {
    fr: 'Composition instrumentale',
    en: 'Instrumental composition',
    de: 'Instrumentale Komposition'
  },
  'Chant populaire': {
    fr: 'Chant populaire',
    en: 'Popular song',
    de: 'Volkslied'
  },
  'Mélodie traditionnelle instrumentale': {
    fr: 'Mélodie traditionnelle instrumentale',
    en: 'Traditional instrumental melody',
    de: 'Traditionelle Instrumentalmelodie'
  },
  'Chant néofolk': {
    fr: 'Chant néofolk',
    en: 'Neofolk song',
    de: 'Neofolk-Lied'
  },
  'Chant polyphonique': {
    fr: 'Chant polyphonique',
    en: 'Polyphonic song',
    de: 'Polyphonisches Lied'
  },
  'Chant ancien': {
    fr: 'Chant ancien',
    en: 'Ancient song',
    de: 'Altes Lied'
  },
  'Chant contemporain': {
    fr: 'Chant contemporain',
    en: 'Contemporary song',
    de: 'Zeitgenössisches Lied'
  },
  'Chanson de fête': {
    fr: 'Chanson de fête',
    en: 'Festival song',
    de: 'Festlied'
  },
  'Chant de randonneurs': {
    fr: 'Chant de randonneurs',
    en: 'Hiker\'s song',
    de: 'Wanderlied'
  },
  'Chant néo-médiéval': {
    fr: 'Chant néo-médiéval',
    en: 'Neo-medieval song',
    de: 'Neomedievales Lied'
  },
  'Chant satirique ou burlesque': {
    fr: 'Chant satirique ou burlesque',
    en: 'Satirical or burlesque song',
    de: 'Satirisches oder burleskes Lied'
  },
  'Arrangement moderne d\'un chant ancien': {
    fr: 'Arrangement moderne d\'un chant ancien',
    en: 'Modern arrangement of an ancient song',
    de: 'Moderne Bearbeitung eines alten Liedes'
  },
  'Chant de travail': {
    fr: 'Chant de travail',
    en: 'Work song',
    de: 'Arbeitslied'
  }
}

/**
 * Get translated song type
 * @param {string} frenchType - The French name of the song type (key from songTypes)
 * @param {string} locale - Language code (fr, en, de)
 * @returns {string} Translated song type or "other" fallback if not found
 */
export const getSongTypeTranslation = (frenchType, locale = 'fr') => {
  if (!frenchType) return ''

  const typeTranslations = songTypes[frenchType]

  if (!typeTranslations) {
    // Fallback for unknown types
    const fallbacks = {
      fr: 'Chant non-classé',
      en: 'Unclassified song',
      de: 'Nicht klassifiziertes Lied'
    }
    return fallbacks[locale] || fallbacks.fr
  }

  return typeTranslations[locale] || typeTranslations.fr
}

/**
 * Get all song type translations for a specific locale
 * @param {string} locale - Language code (fr, en, de)
 * @returns {array} Array of {original, translated} objects
 */
export const getSongTypesForLocale = (locale = 'fr') => {
  return Object.entries(songTypes).map(([frenchName, translations]) => ({
    fr: frenchName,
    translated: translations[locale] || translations.fr
  }))
}
