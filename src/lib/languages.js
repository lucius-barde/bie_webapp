export const lyricLanguages = [
  { code: 'de', name: 'Allemand' },
  { code: 'de-old', name: 'Allemand moyen / haut allemand' },
  { code: 'en', name: 'Anglais' },
  { code: 'en-old', name: 'Anglais moyen' },
  { code: 'arp', name: 'Arpitan (patois, franco-provençal)' },
  { code: 'bzh', name: 'Breton' },
  { code: 'bg', name: 'Bulgare' },
  { code: 'cat', name: 'Catalan' },
  { code: 'cor', name: 'Corse' },
  { code: 'hr', name: 'Croate'},
  { code: 'dk', name: 'Danois'},
  { code: 'es', name: 'Espagnol' },
  { code: 'fi', name: 'Finnois' },
  { code: 'fr', name: 'Français' },
  { code: 'fr-old', name: 'Français ancien' },
  { code: 'ga-old', name: 'Galaïco-portugais' },
  { code: 'ge', name: 'Géorgien' },
  { code: 'hu', name: 'Hongrois' },
  { code: 'it', name: 'Italien' },
  { code: 'la', name: 'Latin' },
  { code: 'lt', name: 'Lituanien' },
  { code: 'mk', name: 'Macédonien'},
  { code: 'no', name: 'Norvégien'},
  { code : 'oc', name: 'Occitan'},
  { code: 'pho', name: 'Phonétique' },
  { code: 'ru', name: 'Russe' },
  { code: 'scots', name: 'Scots (anglais écossais)' },
  { code: 'se', name: 'Suédois'},
  { code: 'sr', name: 'Serbe'},
  { code: 'ch', name: 'Suisse allemand' },
  { code: 'ua', name: 'Ukrainien' },
]

export const getLanguageName = (languageCode) => {
  if (!languageCode) return null
  return lyricLanguages.find(({ code }) => code === languageCode)?.name || languageCode
}
