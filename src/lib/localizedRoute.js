const homePaths = {
  fr: '/',
  en: '/en',
  de: '/de'
}

const songListPaths = {
  fr: '/musique',
  en: '/en/music',
  de: '/de/musik'
}

const categoryPaths = {
  fr: '/categorie/chants',
  en: '/en/category/songs',
  de: '/de/kategorie/lieder'
}

const searchPaths = {
  fr: '/recherche',
  en: '/en/search',
  de: '/de/suche'
}

const personalCompositionPaths = {
  fr: '/categorie/compositions-personnelles',
  en: '/en/category/songs/compositions-personnelles',
  de: '/de/kategorie/lieder/compositions-personnelles'
}

const isSongDetailRoute = (name) => [
  'song-detail', 'song-detail-fr', 'song-detail-en', 'song-detail-de'
].includes(name)

const isSongListRoute = (name) => [
  'songs', 'songs-page', 'songs-fr', 'songs-page-fr',
  'songs-en', 'songs-page-en', 'songs-de', 'songs-page-de'
].includes(name)

const isOriginCategoryRoute = (name) => [
  'songs-by-origin', 'songs-by-origin-fr', 'category-en', 'category-de'
].includes(name)

const isPersonalCompositionRoute = (route) => [
  'original-compositions', 'original-compositions-fr'
].includes(route.name) || route.params.categorySlug === 'compositions-personnelles'

const isTraditionalCategoryRoute = (route) => [
  'traditional-songs', 'traditional-songs-fr'
].includes(route.name) || route.params.categorySlug === 'chants'

const isSearchRoute = (name) => ['search', 'search-fr', 'search-en', 'search-de'].includes(name)

const withQuery = (path, route) => ({ path, query: { ...route.query } })

/** Return the equivalent supported page in the target locale, or that locale's home. */
export const getLocalizedPath = (route, locale) => {
  const home = homePaths[locale] || homePaths.fr

  if (isSongDetailRoute(route.name) && route.params.songId && route.params.slug) {
    return withQuery(`${songListPaths[locale] || songListPaths.fr}/${route.params.songId}-${encodeURIComponent(route.params.slug)}`, route)
  }

  if (isPersonalCompositionRoute(route)) {
    return withQuery(personalCompositionPaths[locale] || personalCompositionPaths.fr, route)
  }

  if (isOriginCategoryRoute(route.name)) {
    const origin = route.params.origin || route.params.categorySlug
    if (origin) {
      return withQuery(`${categoryPaths[locale] || categoryPaths.fr}/${encodeURIComponent(origin)}`, route)
    }
  }

  if (isTraditionalCategoryRoute(route)) {
    return withQuery(categoryPaths[locale] || categoryPaths.fr, route)
  }

  if (isSearchRoute(route.name)) {
    return withQuery(searchPaths[locale] || searchPaths.fr, route)
  }

  if (isSongListRoute(route.name)) {
    const page = route.params.page
    const path = page ? `${songListPaths[locale] || songListPaths.fr}/page/${encodeURIComponent(page)}` : (songListPaths[locale] || songListPaths.fr)
    return withQuery(path, route)
  }

  return home
}
