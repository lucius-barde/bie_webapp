<template>
  <main>
    <!-- Hero Section -->
    <section class="hero hero-simple" aria-labelledby="songs-title">
      <div class="hero-content">
        <h1 id="songs-title">Le répertoire de chants</h1>
        <p class="hero-copy">Explorez notre sélection de chants folk, médiévaux et traditionnels d'Europe</p>
      </div>
    </section>

    <!-- Songs Grid Section -->
    <section class="section container">
      <div v-if="loading" class="loading">
        Chargement des chants...
      </div>

      <div v-else>
        <div class="chant-grid">
          <article v-for="song in songs" :key="song.id" class="chant-card">
            <img
              :src="getPlaceholderImage(song.song_catalog_id)"
              :alt="`Illustration pour ${song.song_title}`"
              loading="lazy"
            >
            <div class="chant-card-body">
              <p v-if="song.song_origin_legacy" class="chant-meta">{{ song.song_origin_legacy }}</p>
              <h2>{{ song.song_catalog_id }}. {{ song.song_title }}</h2>
              <p v-if="song.song_type_legacy">{{ song.song_type_legacy }}</p>
              <router-link
                :to="`/musique/${song.song_catalog_id}-${generateSlug(song.song_title)}`"
                class="button"
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
            :to="`/musique/page/${currentPage - 1}`"
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
            :to="`/musique/page/${currentPage + 1}`"
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

const route = useRoute()
const songs = ref([])
const totalSongs = ref(0)
const loading = ref(true)

const SONGS_PER_PAGE = 30

const currentPage = computed(() => {
  const page = parseInt(route.params.page) || 1
  return Math.max(1, page)
})

const totalPages = computed(() => {
  return Math.ceil(totalSongs.value / SONGS_PER_PAGE)
})

const fetchSongs = async () => {
  loading.value = true
  try {
    // Get total count
    const { count } = await supabase
      .from('bardsinexile_songs')
      .select('*', { count: 'exact', head: true })
      .gte('song_status', 3)

    totalSongs.value = count || 0

    // Get paginated songs
    const offset = (currentPage.value - 1) * SONGS_PER_PAGE
    const { data, error } = await supabase
      .from('bardsinexile_songs')
      .select('*')
      .gte('song_status', 3)
      .order('song_catalog_id', { ascending: false })
      .range(offset, offset + SONGS_PER_PAGE - 1)

    if (error) throw error
    songs.value = data || []
  } catch (error) {
    console.error('Error fetching songs:', error)
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

const getPlaceholderImage = (catalogId) => {
  const placeholderImages = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  ]
  return placeholderImages[catalogId % placeholderImages.length]
}

onMounted(() => {
  fetchSongs()
})

watch(() => route.params.page, () => {
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
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: rgb(34 34 34 / 66%);
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

.chant-meta {
  margin: 0 0 7px;
  color: var(--blue-dark);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.chant-card h3 {
  margin: 0 0 9px;
  font-size: 19px;
}

.chant-card-body > p:not(.chant-meta) {
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
