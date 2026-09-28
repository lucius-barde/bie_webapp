import { createRouter, createWebHistory } from 'vue-router'

// Components
import HomePage from '../pages/HomePage.vue'
import SongsPage from '../pages/SongsPage.vue'
import SongDetailPage from '../pages/SongDetailPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import LogoutPage from '../pages/LogoutPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import SongCreatePage from '../pages/SongCreatePage.vue'
import SongEditPage from '../pages/SongEditPage.vue'

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
    component: AdminPage
  },
  {
    path: '/admin/song/create',
    name: 'song-create',
    component: SongCreatePage
  },
  {
    path: '/admin/song/:songId/edit',
    name: 'song-edit',
    component: SongEditPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
