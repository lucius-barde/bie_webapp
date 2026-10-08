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
import LyricsCreatePage from '../pages/LyricsCreatePage.vue'
import LyricsEditPage from '../pages/LyricsEditPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LinksPage from '../pages/LinksPage.vue'
import { useHead } from '@vueuse/head'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/musique',
    name: 'songs',
    component: SongsPage
  },
  {
    path: '/musique/page/:page',
    name: 'songs-page',
    component: SongsPage
  },
  {
    path: '/categorie/chants',
    name: 'traditional-songs',
    component: SongsPage
  },
  {
    path: '/categorie/chants/:origin',
    name: 'songs-by-origin',
    component: SongsPage
  },
  {
    path: '/categorie/compositions-personnelles',
    name: 'original-compositions',
    component: SongsPage
  },
  {
    path: '/partitions-chants-folk',
    name: 'folk-sheets',
    component: SongsPage
  },
  {
    path: '/recherche',
    name: 'search',
    component: SongsPage
  },
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
    path: '/musique/:songId-:slug',
    name: 'song-detail',
    component: SongDetailPage
  },
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

// Protect admin routes from unauthenticated users
const defaultPageMeta = {
  title: 'Bards in Exile - Paroles, partitions et arrangements de chants traditionnels',
  description: 'Explorez les paroles, traductions et partitions de chants folk, médiévaux et traditionnels de France, de Suisse et d’Europe avec Bards in Exile.'
}

router.afterEach((to) => {
  if (['home', 'songs', 'songs-page', 'traditional-songs', 'songs-by-origin', 'original-compositions', 'folk-sheets', 'search', 'song-detail'].includes(to.name)) return

  const title = to.name === 'about' ? 'Le projet' : to.name === 'contact' ? 'Contact' : to.name === 'links' ? 'Liens' : 'Espace membre'
  const description = to.name === 'about'
    ? 'Découvrez le projet Bards in Exile et son répertoire de chants folk, médiévaux et traditionnels.'
    : defaultPageMeta.description
  useHead({ title: `${title} | Bards in Exile`, meta: [{ name: 'description', content: description }] })
})

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
