<template>
  <main>
    <!-- Hero Section -->
    <section class="hero hero-simple" aria-labelledby="songs-title">
      <div class="hero-content">
        <h1 id="songs-title">{{ pageTitle }}</h1>
        <p class="hero-copy">{{ pageSubtitle }}</p>
      </div>
    </section>

    <Breadcrumbs :items="breadcrumbItems" />

    <!-- Songs Grid Section -->
    <section class="section container">
      <div v-if="loading" class="loading" aria-live="polite">
        Chargement des chants...
      </div>

      <div v-else-if="errorMessage" class="loading" role="alert">
        {{ errorMessage }}
      </div>

      <div v-else-if="songs.length === 0" class="loading">
        Aucun chant trouvé.
      </div>

      <div v-else>
        <div class="pagination">
          <router-link
            v-if="currentPage > 1"
            :to="pageLink(currentPage - 1)"
            class="pagination-link pagination-prev"
          >
            ← Précédent
          </router-link>

          <div class="pagination-info">
            Page {{ currentPage }} sur {{ totalPages }}
            ({{ totalSongs }} chants)
          </div>

          <router-link
            v-if="currentPage < totalPages"
            :to="pageLink(currentPage + 1)"
            class="pagination-link pagination-next"
          >
            Suivant →
          </router-link>
        </div>

        <div class="chant-grid">
          <article v-for="song in songs" :key="song.id" class="chant-card">
            <router-link :to="songDetailLink(song)" class="chant-card-image-link" :aria-label="`Lire ${song.song_title}`">
              <img
                v-if="song.song_image || song.song_image_gallery?.[0]"
                :src="getSongImage(song.song_image || song.song_image_gallery[0])"
                :alt="`Illustration de : ${song.song_title}`"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              >
              <div v-else class="chant-card-image-placeholder" aria-hidden="true"></div>
            </router-link>
            <div class="chant-card-body">
              <div class="song-card-meta">
                <span class="song-number">N° {{ song.song_catalog_id }}</span>
                <router-link
                  v-if="song.song_origin_legacy"
                  :to="originLink(song.song_origin_legacy)"
                  class="song-origin"
                >{{ song.song_origin_legacy }}</router-link>
              </div>
              <router-link :to="songDetailLink(song)" class="song-title-link">
                <h2>{{ song.song_title }}</h2>
              </router-link>
              <p v-if="song.song_type_legacy">{{ song.song_type_legacy }}</p>
              <a
                v-if="isSheetList && song.song_musicsheet_link"
                :href="song.song_musicsheet_link"
                class="button"
                target="_blank"
                rel="noopener noreferrer"
              >Voir la partition...</a>
              &nbsp;
              <router-link
                :to="songDetailLink(song)"
                :class="['button', { 'button-secondary': isSheetList }]"
              >
                Lire la suite...
              </router-link>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <router-link
            v-if="currentPage > 1"
            :to="pageLink(currentPage - 1)"
            class="pagination-link pagination-prev"
          >
            ← Précédent
          </router-link>

          <div class="pagination-info">
            Page {{ currentPage }} sur {{ totalPages }}
            ({{ totalSongs }} chants)
          </div>

          <router-link
            v-if="currentPage < totalPages"
            :to="pageLink(currentPage + 1)"
            class="pagination-link pagination-next"
          >
            Suivant →
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const route = useRoute()
const songs = ref([])
const totalSongs = ref(0)
const loading = ref(true)
const errorMessage = ref('')

const SONGS_PER_PAGE = 30

const currentPage = computed(() => Math.min(requestedPage.value, totalPages.value))

const totalPages = computed(() => Math.ceil(totalSongs.value / SONGS_PER_PAGE) || 1)
const searchTerm = computed(() => String(route.query.q || '').trim())
const requestedPage = computed(() => Math.max(1, parseInt(route.params.page || route.query.page) || 1))
const isSheetList = computed(() => route.path === '/partitions-chants-folk')
const pageTitle = computed(() => {
  if (route.path === '/partitions-chants-folk') return 'Partitions de chants traditionnels'
  if (route.path === '/categorie/compositions-personnelles') return 'Compositions personnelles'
  if (route.path === '/categorie/chants') return 'Chants traditionnels'
  if (route.params.origin) return String(route.params.origin)
  if (route.path === '/recherche') return 'Résultats de recherche'
  return 'Tous les chants'
})
const pageMetaTitle = computed(() => {
  const title = pageTitle.value
  if (route.path === '/recherche') return `${title} « ${searchTerm.value} » | Paroles de chants - Bards in Exile`
  return `${title} | Paroles${isSheetList.value ? ' et partitions' : ''} de chants - Bards in Exile`
})
const pageMetaDescription = computed(() => {
  if (isSheetList.value) return 'Parcourez les partitions de chants folk et traditionnels de France, de Suisse et d’Europe proposées par Bards in Exile.'
  if (route.path === '/recherche') return `Résultats de recherche pour « ${searchTerm.value} » dans le répertoire de chants Bards in Exile.`
  if (route.params.origin) return `Découvrez les paroles et les histoires de chants folk et traditionnels originaires de ${String(route.params.origin)}.`
  if (route.path === '/categorie/compositions-personnelles') return 'Découvrez les paroles et arrangements des compositions originales de Bards in Exile.'
  if (route.path === '/categorie/chants') return 'Explorez des paroles de chants folk, médiévaux et traditionnels d’Europe.'
  return 'Explorez le répertoire de paroles de chants folk, médiévaux et traditionnels de Bards in Exile.'
})
const breadcrumbItems = computed(() => {
  const home = { label: 'Accueil', to: '/' }
  const title = route.path === '/recherche' ? 'Résultats de recherche' : pageTitle.value
  const items = [home]

  if (route.params.origin) {
    items.push({ label: 'Chants traditionnels', to: '/categorie/chants' })
    items.push({ label: String(route.params.origin) })
  } else {
    items.push({ label: title })
  }

  return items
})
const pageSubtitle = computed(() => {
  if (route.path === '/partitions-chants-folk') return "Parcourez un répertoire de partitions de chants anciens et populaires de France, de Suisse et d'ailleurs, disponibles sur MuseScore."
  if (route.path === '/categorie/compositions-personnelles') return 'Découvrez les compositions exclusives des projets du label Bards in Exile'
  if (route.path === '/categorie/chants') return "Explorez notre sélection de chants folk, médiévaux et traditionnels d'Europe"
  if (route.params.origin) return 'Paroles de chansons folk et traditionnelles, triés par pays'
  if (route.path === '/recherche') return `Résultats pour « ${searchTerm.value} »`
  return 'Explorez le répertoire complet du projet Bards in Exile'
})

const fetchSongs = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const applyFilters = (query) => {
      query = query.gte('song_status', 3)

      if (route.path === '/categorie/compositions-personnelles') {
        query = query.eq('song_origin_legacy', 'B.i.E')
      } else if (route.path === '/categorie/chants' && !route.params.origin) {
        query = query.neq('song_origin_legacy', 'B.i.E')
      } else if (route.params.origin) {
        query = query.eq('song_origin_legacy', String(route.params.origin))
      }

      if (isSheetList.value) query = query.not('song_musicsheet_link', 'is', null).neq('song_musicsheet_link', '')

      if (route.path === '/recherche' && searchTerm.value) {
        const escaped = searchTerm.value.replace(/[\\%,()]/g, ' ').trim()
        if (!escaped) return query
        query = query.or([
          'song_title',
          'song_origin_legacy',
          'song_type_legacy',
          'song_author_legacy',
          'song_description_fr',
          'song_description_en'
        ].map((field) => `${field}.ilike.%${escaped}%`).join(','))
      }

      return query
    }

    const { count, error: countError } = await applyFilters(supabase
      .from('bardsinexile_songs')
      .select('*', { count: 'exact', head: true }))
    if (countError) throw countError
    totalSongs.value = count || 0

    const offset = (currentPage.value - 1) * SONGS_PER_PAGE
    const { data, error } = await applyFilters(supabase
      .from('bardsinexile_songs')
      .select('*'))
      .order('song_catalog_id', { ascending: false })
      .range(offset, offset + SONGS_PER_PAGE - 1)

    if (error) throw error
    songs.value = data || []
  } catch (error) {
    console.error('Error fetching songs:', error)
    songs.value = []
    errorMessage.value = 'Impossible de charger les chants pour le moment.'
  } finally {
    loading.value = false
  }
}

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const getSongImage = (image) => image?.startsWith('http') ? image : `/supabase-url-here/${image || ''}`

const songDetailLink = (song) => `/musique/${song.song_catalog_id}-${generateSlug(song.song_title)}`

const originLink = (origin) => origin === 'B.i.E'
  ? '/categorie/compositions-personnelles'
  : `/categorie/chants/${encodeURIComponent(origin)}`

const pageLink = (page) => route.path === '/musique' || route.path.startsWith('/musique/page/')
  ? `/musique/page/${page}`
  : { path: route.path, query: { ...route.query, page: String(page) } }

import { useHead } from '@vueuse/head'

useHead(() => ({
  title: pageMetaTitle.value,
  meta: [{ name: 'description', content: pageMetaDescription.value }]
}))

onMounted(() => {
  fetchSongs()
})

watch(() => [route.path, route.params.page, route.params.origin, route.query.page, route.query.q], () => {
  fetchSongs()
})
</script>

<style scoped>
.hero {
  position: relative;
  padding: 72px 20px 64px;
  overflow: hidden;
  text-align: center;
  background:
    linear-gradient(rgb(239 231 220 / 83%), rgb(239 231 220 / 92%)),
    url("https://www.bardsinexile.org/wp-content/uploads/Lucius-Barde-2026.jpg")
      center 42% / cover no-repeat;
  text-shadow: 0px 0px 3px #fff;
}

.hero-simple {
  background: linear-gradient(135deg, var(--paper) 0%, var(--paper-deep) 100%);
  text-shadow: none;
}

.hero-content {
  position: relative;
  max-width: 760px;
  margin-inline: auto;
}

.hero h1 {
  max-width: 680px;
  margin-inline: auto;
}

.hero-copy {
  max-width: 610px;
  margin: 18px auto 24px;
  color: rgb(34 34 34 / 78%);
}

.section {
  padding-block: 52px;
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.loading {
  min-height: 440px;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: rgb(34 34 34 / 66%);
}

.chant-card-image-placeholder {
  height: 190px;
  background: var(--paper-deep);
}

.song-card-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
  margin-bottom: 7px;
}

.song-number {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  color: #e5e7eb;
  background: var(--ink);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
}

.chant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 40px;
}

.chant-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--paper);
}

.chant-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  background: var(--paper-deep);
}

.chant-card-body {
  padding: 18px;
}

.song-origin {
  display: inline-block;
  margin: 0;
  color: var(--blue-dark);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.song-origin:hover {
  text-decoration: underline;
}

.chant-card h2,
.chant-card h3 {
  margin: 0 0 9px;
  font-size: 19px;
}

.song-title-link {
  color: inherit;
  text-decoration: none;
}

.song-title-link:hover {
  color: var(--blue-dark);
}

.chant-card-image-link {
  display: block;
}


.chant-card-body > p:not(.song-origin) {
  min-height: 48px;
  margin: 0 0 16px;
  font-size: 14px;
}

.chant-card .button {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  padding: 8px 13px;
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: #fff;
  background: var(--blue);
  font: 600 13px var(--sans);
  text-align: center;
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;
  cursor: pointer;
}

.chant-card .button:hover,
.chant-card .button:active {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
}

.chant-card .button.button-secondary,
.chant-card .button.button-secondary:hover,
.chant-card .button.button-secondary:active {
  border-color: var(--blue);
  color: var(--blue);
  background: transparent;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
  text-align: center;
}

.pagination-info {
  font-size: 14px;
  color: rgb(34 34 34 / 66%);
}

.pagination-link {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: #fff;
  background: var(--blue);
  font: 600 14px var(--sans);
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.pagination-link:hover {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
}

@media (max-width: 760px) {
  .hero {
    padding-block: 54px;
  }

  .chant-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pagination {
    flex-wrap: wrap;
    gap: 12px;
  }
}

@media (max-width: 520px) {
  .hero {
    padding: 44px 14px;
  }

  .hero-copy {
    font-size: 15px;
  }

  .section {
    padding-block: 38px;
  }

  .container {
    width: min(100% - 28px, var(--content-width));
  }

  .chant-grid {
    grid-template-columns: 1fr;
  }

  .chant-card img {
    height: 210px;
  }

  .pagination {
    flex-direction: column;
  }

  .pagination-info {
    order: -1;
  }
}
</style>
