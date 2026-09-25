import { createRouter, createWebHistory } from 'vue-router'

// Components
import HomePage from '../pages/HomePage.vue'
import SongsPage from '../pages/SongsPage.vue'
import SongDetailPage from '../pages/SongDetailPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
