<template>
  <main>
    <div v-if="loading" class="container loading-container">
      Chargement de la chanson...
    </div>

    <div v-else-if="song" class="song-detail">
      <!-- Hero Section with Song Image -->
      <section class="song-hero">
        <img
          :src="getPlaceholderImage(song.song_catalog_id)"
          :alt="`Illustration pour ${song.song_title}`"
          class="song-hero-image"
        >
        <div class="song-hero-overlay">
          <div class="container song-hero-content">
            <router-link to="/musique" class="back-link">← Retour aux chants</router-link>
            <h1>{{ song.song_title }}</h1>
            <p v-if="song.song_origin_legacy" class="song-meta">{{ song.song_origin_legacy }}</p>
          </div>
        </div>
      </section>

      <!-- Song Content -->
      <section class="container song-content">
        <article class="song-article">
          <!-- Main Info -->
          <div class="song-info">
            <div v-if="song.song_type_legacy" class="info-row">
              <strong>Type:</strong>
              <span>{{ song.song_type_legacy }}</span>
            </div>
            <div v-if="song.song_artist" class="info-row">
              <strong>Artiste:</strong>
              <span>{{ song.song_artist }}</span>
            </div>
            <div v-if="song.song_author_legacy" class="info-row">
              <strong>Auteur:</strong>
              <span>{{ song.song_author_legacy }}</span>
            </div>
            <div v-if="song.song_date_info" class="info-row">
              <strong>Époque:</strong>
              <span>{{ song.song_date_info }}</span>
            </div>
            <div v-if="song.song_duration_sec" class="info-row">
              <strong>Durée:</strong>
              <span>{{ formatDuration(song.song_duration_sec) }}</span>
            </div>
            <div v-if="song.song_collection_legacy" class="info-row">
              <strong>Collection:</strong>
              <span>{{ song.song_collection_legacy }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="song.song_bie_comments" class="song-description">
            <h2>À propos de ce chant</h2>
            <p>{{ song.song_bie_comments }}</p>
          </div>

          <!-- Links Section -->
          <div class="song-links">
            <h2>Ressources</h2>
            <div class="links-grid">
              <a
                v-if="song.song_youtube_link"
                :href="song.song_youtube_link"
                target="_blank"
                rel="noopener noreferrer"
                class="resource-link"
              >
                ▶ Écouter sur YouTube
              </a>
              <a
                v-if="song.song_musicsheet_link"
                :href="song.song_musicsheet_link"
                target="_blank"
                rel="noopener noreferrer"
                class="resource-link"
              >
                ♫ Consulter la partition
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div class="song-navigation">
            <router-link v-if="previousSong" :to="previousSongLink" class="nav-button prev-button">
              ← Chanson précédente
            </router-link>
            <router-link to="/musique" class="nav-button home-button">
              Tous les chants
            </router-link>
            <router-link v-if="nextSong" :to="nextSongLink" class="nav-button next-button">
              Chanson suivante →
            </router-link>
          </div>
        </article>
      </section>
    </div>

    <div v-else class="container error-container">
      <p>Chanson non trouvée.</p>
      <router-link to="/musique" class="button">Retour aux chants</router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const song = ref(null)
const previousSong = ref(null)
const nextSong = ref(null)
const loading = ref(true)

const previousSongLink = computed(() => {
  if (!previousSong.value) return '#'
  return `/musique/${previousSong.value.song_catalog_id}-${generateSlug(previousSong.value.song_title)}`
})

const nextSongLink = computed(() => {
  if (!nextSong.value) return '#'
  return `/musique/${nextSong.value.song_catalog_id}-${generateSlug(nextSong.value.song_title)}`
})

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

const formatDuration = (seconds) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const fetchSongData = async () => {
  loading.value = true
  try {
    // Parse the song_catalog_id from the route param
    const songIdPart = route.params.songId
    if (!songIdPart) throw new Error('Invalid song ID')

    const songCatalogId = parseInt(songIdPart.split('-')[0])

    // Fetch the current song
    const { data: songData, error: songError } = await supabase
      .from('bardsinexile_songs')
      .select('*')
      .eq('song_catalog_id', songCatalogId)
      .gte('song_status', 3)
      .single()

    if (songError) {
      console.error('Error fetching song:', songError)
      song.value = null
    } else {
      song.value = songData

      // Fetch previous song (lower catalog_id)
      const { data: prevData } = await supabase
        .from('bardsinexile_songs')
        .select('*')
        .lt('song_catalog_id', songCatalogId)
        .gte('song_status', 3)
        .order('song_catalog_id', { ascending: false })
        .limit(1)
        .single()

      previousSong.value = prevData || null

      // Fetch next song (higher catalog_id)
      const { data: nextData } = await supabase
        .from('bardsinexile_songs')
        .select('*')
        .gt('song_catalog_id', songCatalogId)
        .gte('song_status', 3)
        .order('song_catalog_id', { ascending: true })
        .limit(1)
        .single()

      nextSong.value = nextData || null
    }
  } catch (error) {
    console.error('Error in fetchSongData:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSongData()
})

watch(() => route.params.songId, () => {
  fetchSongData()
})
</script>

<style scoped>
.song-detail {
  min-height: 100vh;
}

.song-hero {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.song-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6)
  );
  display: flex;
  align-items: flex-end;
  padding-bottom: 40px;
}

.song-hero-content {
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
  transition: color 160ms ease;
}

.back-link:hover {
  color: white;
}

.song-hero-content h1 {
  margin: 0;
  font-size: 36px;
}

.song-meta {
  margin: 12px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.song-content {
  padding: 52px 0;
}

.song-article {
  max-width: 760px;
}

.song-info {
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: rgb(255 255 255 / 18%);
}

.info-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row strong {
  color: var(--blue-dark);
  font-weight: 600;
}

.song-description {
  margin-bottom: 40px;
}

.song-description h2 {
  margin-bottom: 16px;
}

.song-description p {
  line-height: 1.8;
  color: rgb(34 34 34 / 85%);
}

.song-links {
  margin-bottom: 40px;
}

.song-links h2 {
  margin-bottom: 16px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: var(--blue);
  text-decoration: none;
  transition: all 160ms ease;
  font-size: 14px;
}

.resource-link:hover {
  background: var(--blue);
  color: white;
}

.song-navigation {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--line);
}

.nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: #fff;
  background: var(--blue);
  font: 600 14px var(--sans);
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.nav-button:hover {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
}

.prev-button,
.next-button {
  flex-grow: 1;
  text-align: center;
}

.home-button {
  flex-grow: 1;
}

.loading-container,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.error-container {
  flex-direction: column;
  gap: 24px;
}

.button {
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
  cursor: pointer;
}

.button:hover {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
}

@media (max-width: 760px) {
  .song-hero {
    height: 300px;
  }

  .song-hero-content h1 {
    font-size: 28px;
  }

  .song-content {
    padding: 38px 0;
  }

  .info-row {
    grid-template-columns: 100px 1fr;
  }

  .song-navigation {
    grid-template-columns: 1fr;
  }

  .prev-button,
  .next-button {
    flex-grow: 0;
  }
}

@media (max-width: 520px) {
  .container {
    width: min(100% - 28px, var(--content-width));
  }

  .song-hero {
    height: 250px;
  }

  .song-hero-overlay {
    padding-bottom: 24px;
  }

  .song-hero-content h1 {
    font-size: 22px;
  }

  .song-content {
    padding: 28px 0;
  }

  .song-info {
    padding: 16px;
  }

  .info-row {
    grid-template-columns: 80px 1fr;
    gap: 12px;
  }

  .song-navigation {
    flex-direction: column;
  }
}
</style>
