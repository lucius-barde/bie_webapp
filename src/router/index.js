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
  routes
})

// Protect admin routes from unauthenticated users
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
