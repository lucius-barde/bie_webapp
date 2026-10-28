export const lyricLanguages = [
  { code: 'inst', name: 'fr:-- Instrumental --|en:-- Instrumental --|de:-- Instrumental --' },
  { code: 'de', name: 'fr:Allemand|en:German|de:Deutsch' },
  { code: 'de-old', name: 'fr:Allemand (ancien)|en:Old German|de:Altdeutsch' },
  { code: 'en', name: 'fr:Anglais|en:English|de:Englisch' },
  { code: 'en-old', name: 'fr:Anglais (ancien)|en:Old English|de:Altenglisch' },
  { code: 'arp', name: 'fr:Arpitan (patois, franco-provençal)|en:Arpitan (Franco-Provençal)|de:Arpitanisch (Franko-Provenzalisch)' },
  { code: 'bzh', name: 'fr:Breton|en:Breton|de:Bretonisch' },
  { code: 'bg', name: 'fr:Bulgare|en:Bulgarian|de:Bulgarisch' },
  { code: 'cat', name: 'fr:Catalan|en:Catalan|de:Katalanisch' },
  { code: 'cor', name: 'fr:Corse|en:Corsican|de:Korsisch' },
  { code: 'hr', name: 'fr:Croate|en:Croatian|de:Kroatisch'},
  { code: 'dk', name: 'fr:Danois|en:Danish|de:Dänisch'},
  { code: 'es', name: 'fr:Espagnol|en:Spanish|de:Spanisch' },
  { code: 'fi', name: 'fr:Finnois|en:Finnish|de:Finnisch' },
  { code: 'fr', name: 'fr:Français|en:French|de:Französisch' },
  { code: 'fr-old', name: 'fr:Français ancien|en:Old French|de:Altfranzösisch' },
  { code: 'ga-old', name: 'fr:Galaïco-portugais|en:Galician-Portuguese|de:Galizisch-Portugiesisch' },
  { code: 'cym', name: 'fr:Gallois|en:Welsh|de:Walisisch' },
  { code: 'ge', name: 'fr:Géorgien|en:Georgian|de:Georgisch' },
  { code: 'gr', name: 'fr:Grec|en:Greek|de:Griechisch' },
  { code: 'hu', name: 'fr:Hongrois|en:Hungarian|de:Ungarisch' },
  { code: 'ie', name: 'fr:Irlandais|en:Irish|de:Irisch' },
  { code: 'it', name: 'fr:Italien|en:Italian|de:Italienisch' },
  { code: 'la', name: 'fr:Latin|en:Latin|de:Latein' },
  { code: 'lv', name: 'fr:Lituanien|en:Lithuanian|de:Litauisch' },
  { code: 'lt', name: 'fr:Letton / Latgale|en:Latvian / Latgale|de:Lettisch / Latgalisch' },
  { code: 'mk', name: 'fr:Macédonien|en:Macedonian|de:Mazedonisch'},
  { code: 'no', name: 'fr:Norvégien|en:Norwegian|de:Norwegisch'},
  { code : 'oc', name: 'fr:Occitan|en:Occitan|de:Okzitanisch'},
  { code: 'pho', name: 'fr:Phonétique (translittération fr.)|en:Phonetic (Fr. transliteration)|de:Phonetisch (Französische Transkription)' },
  { code: 'ru', name: 'fr:Russe|en:Russian|de:Russisch' },
  { code: 'scots', name: 'fr:Scots (anglais écossais)|en:Scots (Scottish English)|de:Schottisch (Schottisches Englisch)' },
  { code: 'se', name: 'fr:Suédois|en:Swedish|de:Schwedisch'},
  { code: 'sr', name: 'fr:Serbe|en:Serbian|de:Serbisch'},
  { code: 'ch', name: 'fr:Suisse allemand|en:Swiss German|de:Schweizerdeutsch' },
  { code: 'ua', name: 'fr:Ukrainien|en:Ukrainian|de:Ukrainisch' },
]

/**
 * Get translated language name for a given language code
 * @param {string} languageCode - The language code (e.g., 'de', 'en', 'fr')
 * @param {string} locale - The interface locale (fr, en, de)
 * @returns {string|null} Translated language name or null if not found
 */
export const getLanguageName = (languageCode, locale = 'fr') => {
  if (!languageCode) return null
  
  const langEntry = lyricLanguages.find(({ code }) => code === languageCode)
  if (!langEntry) return languageCode
  
  // Parse the multilingual name format: "fr:text|en:text|de:text"
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
