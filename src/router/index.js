import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

// Components
import HomePage from '../pages/HomePage.vue'
import SongsPage from '../pages/SongsPage.vue'
import SongDetailPage from '../pages/SongDetailPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import LogoutPage from '../pages/LogoutPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import SongCreatePage from '../pages/SongCreatePage.vue'
import SongEditPage from '../pages/SongEditPage.vue'
import AdminLyricsPage from '../pages/AdminLyricsPage.vue'
import AdminCollectionsPage from '../pages/AdminCollectionsPage.vue'
import LyricsCreatePage from '../pages/LyricsCreatePage.vue'
import LyricsEditPage from '../pages/LyricsEditPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LinksPage from '../pages/LinksPage.vue'
import SideProjectsPage from '../pages/SideProjectsPage.vue'
import { useHead } from '@vueuse/head'

const routes = [
  // Root routes - default to French
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { locale: 'fr' }
  },
  {
    path: '/en',
    name: 'english',
    component: HomePage,
    meta: { locale: 'en' }
  },
  {
    path: '/de',
    name: 'german',
    component: HomePage,
    meta: { locale: 'de' }
  },

  // Legacy French routes (backward compatibility) - will stay accessible
  {
    path: '/musique',
    name: 'songs',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/musique/page/:page',
    name: 'songs-page',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/categorie/chants',
    name: 'traditional-songs',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/categorie/chants/:origin',
    name: 'songs-by-origin',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/categorie/compositions-personnelles',
    name: 'original-compositions',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/partitions-chants-folk',
    name: 'folk-sheets',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/recherche',
    name: 'search',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/musique/:songId-:slug',
    name: 'song-detail',
    component: SongDetailPage,
    meta: { locale: 'fr' }
  },

  // French routes with /fr prefix
  {
    path: '/fr/musique',
    name: 'songs-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/musique/page/:page',
    name: 'songs-page-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/categorie/chants',
    name: 'traditional-songs-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/categorie/chants/:origin',
    name: 'songs-by-origin-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/categorie/compositions-personnelles',
    name: 'original-compositions-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/partitions-chants-folk',
    name: 'folk-sheets-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/recherche',
    name: 'search-fr',
    component: SongsPage,
    meta: { locale: 'fr' }
  },
  {
    path: '/fr/musique/:songId-:slug',
    name: 'song-detail-fr',
    component: SongDetailPage,
    meta: { locale: 'fr' }
  },

  // English routes with /en/music
  {
    path: '/en/music',
    name: 'songs-en',
    component: SongsPage,
    meta: { locale: 'en' }
  },
  {
    path: '/en/music/page/:page',
    name: 'songs-page-en',
    component: SongsPage,
    meta: { locale: 'en' }
  },
  {
    path: '/en/category/songs/:categorySlug',
    name: 'category-en',
    component: SongsPage,
    meta: { locale: 'en' }
  },
  {
    path: '/en/search',
    name: 'search-en',
    component: SongsPage,
    meta: { locale: 'en' }
  },
  {
    path: '/en/music/:songId-:slug',
    name: 'song-detail-en',
    component: SongDetailPage,
    meta: { locale: 'en' }
  },

  // German routes with /de/musik
  {
    path: '/de/musik',
    name: 'songs-de',
    component: SongsPage,
    meta: { locale: 'de' }
  },
  {
    path: '/de/musik/page/:page',
    name: 'songs-page-de',
    component: SongsPage,
    meta: { locale: 'de' }
  },
  {
    path: '/de/kategorie/lieder/:categorySlug',
    name: 'category-de',
    component: SongsPage,
    meta: { locale: 'de' }
  },
  {
    path: '/de/suche',
    name: 'search-de',
    component: SongsPage,
    meta: { locale: 'de' }
  },
  {
    path: '/de/musik/:songId-:slug',
    name: 'song-detail-de',
    component: SongDetailPage,
    meta: { locale: 'de' }
  },

  // Other pages
  {
    path: '/le-projet',
    name: 'about',
    component: AboutPage
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactPage
  },
  {
    path: '/liens',
    name: 'links',
    component: LinksPage
  },
  {
    path: '/altaborea',
    name: 'side-projects',
    component: SideProjectsPage
  },

  // Auth routes
  {
    path: '/bie-login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/bie-logout',
    name: 'logout',
    component: LogoutPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/song/create',
    name: 'song-create',
    component: SongCreatePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/song/:songId/edit',
    name: 'song-edit',
    component: SongEditPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/lyrics',
    name: 'admin-lyrics',
    component: AdminLyricsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/collections',
    name: 'admin-collections',
    component: AdminCollectionsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/lyrics/create',
    name: 'lyrics-create',
    component: LyricsCreatePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/lyrics/:lyricsId/edit',
    name: 'lyrics-edit',
    component: LyricsEditPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, left: 0 }
  }
})

// Default metadata
const defaultPageMeta = {
  title: 'Bards in Exile - Paroles, partitions et arrangements de chants traditionnels',
  description: `Explorez les paroles, traductions et partitions de chants folk, médiévaux et traditionnels de France, de Suisse et d'Europe avec Bards in Exile.`
}

// Update page title and meta based on route
router.afterEach((to) => {
  const publicPages = ['home', 'english', 'german', 'songs', 'songs-page', 'traditional-songs', 'songs-by-origin', 'original-compositions', 'folk-sheets', 'search', 'song-detail', 'songs-fr', 'songs-page-fr', 'traditional-songs-fr', 'songs-by-origin-fr', 'original-compositions-fr', 'folk-sheets-fr', 'search-fr', 'song-detail-fr', 'songs-en', 'songs-page-en', 'category-en', 'search-en', 'song-detail-en', 'songs-de', 'songs-page-de', 'category-de', 'search-de', 'song-detail-de']

  if (publicPages.includes(to.name)) return

  const titles = {
    about: 'Le projet',
    contact: 'Contact',
    links: 'Liens',
    'side-projects': 'Side projects'
  }

  const title = titles[to.name] || 'Espace membre'
  useHead({ title: `${title} | Bards in Exile`, meta: [{ name: 'description', content: defaultPageMeta.description }] })
})

// Protect admin routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/bie-login')
      return
    }
  }

  next()
})

export default router
