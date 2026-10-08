<template>
  <main>
    <div v-if="loading" class="container loading-container">
      Chargement de la chanson...
    </div>

    <div v-else-if="song" class="song-detail">
      <!-- Hero Section with Song Image -->
      <section class="song-hero">
        <img
          :src="getSongImage(song.song_image_gallery?.[0], song.song_catalog_id)"
          :alt="`Illustration pour ${song.song_title}`"
          class="song-hero-image"
          fetchpriority="high"
          width="1600"
          height="900"
        >
        <div class="song-hero-overlay">
          <div class="container song-hero-content">
            <router-link to="/musique" class="back-link">← Retour aux chants</router-link>
            <h1>{{ song.song_title }}</h1>
            <p class="song-meta">
              <span class="song-number">N° {{ song.song_catalog_id }}</span>
              <span v-if="song.song_origin_legacy">{{ song.song_origin_legacy }}</span>
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs :items="breadcrumbItems" />

      <!-- Song Content -->
      <section class="container song-content">
        <article class="song-article">
          <!-- Main Info -->
          <div class="song-info">
            <div class="info-left">
              <div v-if="song.song_type_legacy" class="info-row">
                <strong>Type:</strong>
                <span>{{ song.song_type_legacy }}</span>
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
              <div v-if="lyrics && lyrics.main_lyrics_language" class="info-row">
                <strong>Langue:</strong>
                <span>{{ getLanguageName(lyrics.main_lyrics_language) }}</span>
              </div>
              <div v-if="song.song_collection_legacy" class="info-row">
                <strong>Collection:</strong>
                <span>{{ song.song_collection_legacy }}</span>
              </div>
            </div>
            <div v-if="youtubeEmbedUrl" class="info-right">
              <div class="youtube-player">
                <iframe
                  :src="youtubeEmbedUrl"
                  :title="`Lecteur YouTube pour ${song.song_title}`"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>


          <!-- Description Section -->
          <section v-if="song.song_description_fr || song.song_description_en" class="song-section">
            <h2>Description</h2>
            <div class="flex">
              <div v-if="song.song_description_fr" class="w-1/2 pr-2">
                <p class="song-description-fr">{{ song.song_description_fr }}</p>
              </div>
              <div v-if="song.song_description_en" class="w-1/2 pl-2" style="font-style: italic;">
                <p class="song-description-en">{{ song.song_description_en }}</p>
              </div>
            </div>
          </section>

          <!-- Lyrics Section -->
          <section v-if="lyrics && lyrics.main_lyrics" class="song-section">
            <h2>Paroles</h2>
            <div class="bie-lyrics text-2xl">{{ lyrics.main_lyrics }}</div>
          </section>

          <!-- Translations Section -->
          <section v-if="lyrics && (lyrics.translation_one || lyrics.translation_two || lyrics.translation_three)" class="song-section">
            <h2>Traductions</h2>
            <details v-if="lyrics.translation_one && lyrics.translation_one_language" class="translation-details">
              <summary>{{ getLanguageName(lyrics.translation_one_language) }}</summary>
              <div class="bie-lyrics">{{ lyrics.translation_one }}</div>
            </details>
            <details v-if="lyrics.translation_two && lyrics.translation_two_language" class="translation-details">
              <summary>{{ getLanguageName(lyrics.translation_two_language) }}</summary>
              <div class="bie-lyrics">{{ lyrics.translation_two }}</div>
            </details>
            <details v-if="lyrics.translation_three && lyrics.translation_three_language" class="translation-details">
              <summary>{{ getLanguageName(lyrics.translation_three_language) }}</summary>
              <div class="bie-lyrics">{{ lyrics.translation_three }}</div>
            </details>
          </section>

          <!-- Sources Section -->
          <section v-if="song.song_musicsheet_link" class="song-section">
            <h2>Partition musicale</h2>
            <ul style="list-style: square inside;"><li><a class="underline" :href="song.song_musicsheet_link" target="_blank" rel="noopener noreferrer">Voir la partition de {{ song.song_title }}</a></li></ul>
          </section>

          <section v-if="song.song_sources?.length" class="song-section">
            <h2>Sources</h2>
            <ul style="list-style: square inside;">
              <li v-for="(source, index) in song.song_sources" :key="index">
                <a class="underline"
                  v-if="getSourceLink(source)"
                  :href="getSourceLink(source).url"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ getSourceLink(source).text }}</a>
                <span v-else>{{ source }}</span>
              </li>
            </ul>
          </section>

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
import { getLanguageName } from '../lib/languages'
import { useHead } from '@vueuse/head'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const route = useRoute()
const song = ref(null)
const lyrics = ref(null)
const previousSong = ref(null)
const nextSong = ref(null)
const loading = ref(true)

const cleanMetaText = (value, maxLength = 155) => String(value || '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength)

const songMetaTitle = computed(() => {
  const title = song.value?.song_title || 'Chant'
  const hasSheet = Boolean(song.value?.song_musicsheet_link)
  return `${title} - Paroles${hasSheet ? ' et partitions' : ''} | Bards in Exile`
})
const songMetaDescription = computed(() => {
  if (!song.value) return 'Paroles et ressources autour des chants folk et traditionnels de Bards in Exile.'

  const metadata = [
    song.value.song_type_legacy,
    song.value.song_origin_legacy,
    [song.value.song_author_legacy, song.value.song_date_info]
      .filter(Boolean)
      .join(' ')
  ].filter(Boolean)
  const description = cleanMetaText(song.value.song_description_fr, 100)

  return cleanMetaText([...metadata, description].filter(Boolean).join('. '))
})

useHead(() => ({
  title: songMetaTitle.value,
  meta: [{ name: 'description', content: songMetaDescription.value }],
  link: song.value ? [{ rel: 'canonical', href: `${window.location.origin}/musique/${song.value.song_catalog_id}-${generateSlug(song.value.song_title)}` }] : []
}))


const getYoutubeVideoId = (value) => {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null

    const hostname = url.hostname.toLowerCase()
    let videoId = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0]
    } else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v')
      } else {
        videoId = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
      }
    }

    return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null
  } catch {
    return null
  }
}

const youtubeEmbedUrl = computed(() => {
  const videoId = getYoutubeVideoId(song.value?.song_youtube_link)
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null
})

const getSourceLink = (source) => {
  if (typeof source !== 'string') return null

  const match = source.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/i)
  if (!match) return null

  try {
    const url = new URL(match[2])
    return url.protocol === 'https:' ? { text: match[1], url: url.href } : null
  } catch {
    return null
  }
}

const breadcrumbItems = computed(() => {
  const items = [{ label: 'Accueil', to: '/' }]
  const isOriginalComposition = song.value?.song_origin_legacy === 'B.i.E'

  if (isOriginalComposition) {
    items.push({ label: 'Compositions personnelles', to: '/categorie/compositions-personnelles' })
  } else {
    items.push({ label: 'Chants traditionnels', to: '/categorie/chants' })
    if (song.value?.song_origin_legacy) items.push({
      label: song.value.song_origin_legacy,
      to: `/categorie/chants/${encodeURIComponent(song.value.song_origin_legacy)}`
    })
  }

  if (song.value?.song_title) items.push({ label: song.value.song_title })
  return items
})

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

const getSongImage = (image, catalogId) => {
  if (image) return image.startsWith('http') ? image : `/supabase-url-here/${image}`
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
      lyrics.value = null
    } else {
      song.value = songData

      // Fetch lyrics for this song
      try {
        const { data: lyricData, error: lyricError } = await supabase
          .from('bardsinexile_songs_have_lyrics')
          .select('lyrics_id')
          .eq('song_catalog_id', songCatalogId)
          .single()

        if (!lyricError && lyricData) {
          // Fetch the full lyrics data
          const { data: fullLyricData } = await supabase
            .from('bardsinexile_lyrics')
            .select('*')
            .eq('id', lyricData.lyrics_id)
            .single()
          lyrics.value = fullLyricData || null
        } else {
          lyrics.value = null
        }
      } catch (error) {
        lyrics.value = null
      }

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
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 12px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.song-number {
  color: rgb(229 231 235 / 78%);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  text-shadow: none;
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.song-content {
  padding: 52px 0;
}

/*
.song-article {
  max-width: 760px;
}*/



.info-left,
.info-right {
  flex: 1;
}

.info-right > strong {
  display: block;
  margin-bottom: 12px;
  color: var(--blue-dark);
  font-size: 14px;
  font-weight: 600;
}

.youtube-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.youtube-player iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 4px;
}

.song-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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

.song-section {
  margin-bottom: 40px;
}

.song-section h2 {
  margin-bottom: 16px;
}

.bie-lyrics {
  padding: 20px;
  background: rgb(255 255 255 / 50%);
  border-left: 4px solid var(--blue);
  border-radius: 2px;
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.8;
}

.translation-details {
  margin-bottom: 12px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
}

.translation-details summary {
  padding: 12px 16px;
  background: var(--paper-deep);
  cursor: pointer;
  font-weight: 600;
  user-select: none;
}

.translation-details summary:hover {
  background: var(--line);
}

.translation-details[open] summary {
  background: rgb(44 90 160 / 10%);
  border-bottom: 1px solid var(--line);
}

.translation-details > div {
  padding: 16px;
  background: white;
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

.song-section p {
  line-height: 1.8;
  color: rgb(34 34 34 / 85%);
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

  .song-info {
    grid-template-columns: 1fr;
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

  .translation-details summary {
    padding: 10px 12px;
    font-size: 14px;
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
    grid-template-columns: 1fr;
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
