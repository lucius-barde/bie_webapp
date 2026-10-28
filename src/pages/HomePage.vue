<template>
  <main>
    <!-- Hero Section -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
        <h1 id="hero-title">{{ t('hero.title') }}</h1>
        <p class="hero-copy">{{ t('hero.subtitle') }}</p>

        <form class="search-form" @submit.prevent="handleSearch" role="search">
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('hero.placeholder')"
            :aria-label="t('hero.placeholder')"
          >
          <button class="button" type="submit">{{ t('common.search') }}</button>
        </form>

        <div class="topic-list" :aria-label="t('hero.topics')">
          <router-link :to="traditionalLink">{{ t('latest.traditional') }}</router-link>
          <router-link :to="medievalLink">{{ t('latest.medieval') }}</router-link>
          <router-link :to="militaryLink">{{ t('latest.military') }}</router-link>
          <router-link :to="royalistLink">{{ t('latest.royalist') }}</router-link>
          <router-link :to="sheetsLink">{{ t('common.sheets') }}</router-link>
          <router-link :to="personalLink">{{ t('latest.personal') }}</router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section container" aria-labelledby="explore-title">
      <div class="section-heading">
        <div>
          <h2 id="explore-title">{{ t('explore.title') }}</h2>
          <p>{{ t('explore.subtitle') }}</p>
        </div>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <h3>{{ t('explore.lyrics.title') }}</h3>
          <p>{{ t('explore.lyrics.description') }}</p>
          <router-link :to="exploreLink" class="text-link">{{ t('explore.lyrics.link') }}</router-link>
        </article>

        <article class="feature-card" id="partitions">
          <h3>{{ t('explore.sheets.title') }}</h3>
          <p>{{ t('explore.sheets.description') }}</p>
          <router-link to="/partitions-chants-folk" class="text-link">{{ t('explore.sheets.link') }}</router-link>
        </article>

        <article class="feature-card">
          <h3>{{ t('explore.albums.title') }}</h3>
          <p>{{ t('explore.albums.description') }}</p>
          <a href="https://linktr.ee/bardsinexile" target="_blank" class="text-link">{{ t('explore.albums.link') }}</a>
        </article>
      </div>
    </section>

    <!-- Latest Songs Section -->
    <section class="section latest-section" aria-labelledby="latest-title">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 id="latest-title">{{ t('latest.title') }}</h2>
            <p>{{ t('latest.subtitle') }}</p>
          </div>
          <router-link :to="exploreLink" class="text-link">{{ t('latest.link') }}</router-link>
        </div>

        <div class="chant-grid">
          <article v-for="song in latestSongs" :key="song.id" class="chant-card">
            <router-link :to="songDetailLink(song)" class="chant-card-image-link" :aria-label="`Read ${song.song_title}`">
              <img
                v-if="getSongImageUrl(song.song_image || song.song_image_gallery?.[0])"
                :src="getSongImageUrl(song.song_image || song.song_image_gallery?.[0])"
                :alt="`Illustration de: ${song.song_title}`"
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
                >{{ getSongOriginTranslated(song.song_origin_legacy) }}</router-link>
              </div>
              <router-link :to="songDetailLink(song)" class="song-title-link">
                <h3>{{ song.song_title }}</h3>
              </router-link>
              <p><span v-if="song.song_type_legacy">{{ translateSongType(song.song_type_legacy) }}. </span><span v-if="song.song_author_legacy">{{ song.song_author_legacy }}<span v-if="song.song_date_info">, {{ song.song_date_info }}</span></span></p>

              <router-link
                :to="songDetailLink(song)"
                class="button"
              >
                {{ t('common.readMore') }}
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Countries Section -->
    <section class="section container" aria-labelledby="countries-title">
      <div class="section-heading">
        <div>
          <h2 id="countries-title">{{ locale === 'fr' ? 'Voyagez par pays et par culture' : locale === 'en' ? 'Travel by country and culture' : 'Nach Land und Kultur reisen' }}</h2>
          <p>{{ locale === 'fr' ? 'Partez à la recherche de chants traditionnels, de mélodies médiévales et de répertoires régionaux.' : locale === 'en' ? 'Search for traditional songs, medieval melodies and regional repertoires.' : 'Suchen Sie nach Volksliedern, mittelalterlichen Melodien und regionalen Repertoires.' }}</p>
        </div>
      </div>

      <nav class="country-list" :aria-label="locale === 'fr' ? 'Explorer par pays ou région' : locale === 'en' ? 'Explore by country or region' : 'Nach Land oder Region erkunden'">
        <router-link
          v-for="origin in topOrigins"
          :key="origin.name"
          :to="originLink(origin.name)"
        >
          {{ getSongOriginTranslated(origin.name) }} ({{ origin.count }})
        </router-link>
        <router-link :to="exploreLink">{{ locale === 'fr' ? 'Toute l\'Europe' : locale === 'en' ? 'All of Europe' : 'Ganz Europa' }}</router-link>
      </nav>
    </section>

    <!-- Albums and Bardic Club Section -->
    <section class="section community-section" :aria-label="locale === 'fr' ? 'Albums et communauté' : locale === 'en' ? 'Albums and community' : 'Alben und Gemeinschaft'">
      <div class="container community-grid">
        <div id="albums" class="community-column" aria-labelledby="albums-title">
          <h2 id="albums-title">{{ locale === 'fr' ? 'Obtenez les albums' : locale === 'en' ? 'Get the albums' : 'Holen Sie sich die Alben' }}</h2>
          <p>{{ locale === 'fr' ? 'Soutenez le projet en achetant les albums ou en écoutant les titres sur les plateformes suivantes:' : locale === 'en' ? 'Support the project by buying albums or listening to tracks on the following platforms:' : 'Unterstützen Sie das Projekt, indem Sie Alben kaufen oder Tracks auf den folgenden Plattformen anhören:' }}</p>
          <nav class="platform-list" :aria-label="locale === 'fr' ? 'Plateformes musicales' : locale === 'en' ? 'Music platforms' : 'Musikplattformen'">
            <a class="button" href="https://open.spotify.com/artist/0Yt6J3E5DA54uRb1Tx3eOn?si=IBVJON99TrC74KzPQIWEpg" target="_blank" rel="noopener noreferrer">Spotify</a>
            <a class="button button-secondary" href="https://music.apple.com/us/artist/bards-in-exile/1720565414" target="_blank" rel="noopener noreferrer">Apple Music</a>
            <a class="button button-secondary" href="https://www.deezer.com/fr/artist/246895562" target="_blank" rel="noopener noreferrer">Deezer</a>
            <a class="button button-secondary" href="https://bardsinexile.bandcamp.com/" target="_blank" rel="noopener noreferrer">Bandcamp</a>
          </nav>
        </div>

        <div class="community-column" aria-labelledby="bardic-club-title">
          <h2 id="bardic-club-title">{{ locale === 'fr' ? 'Rejoignez le Bardic Club' : locale === 'en' ? 'Join the Bardic Club' : 'Treten Sie dem Bardic Club bei' }}</h2>
          <p>{{ locale === 'fr' ? 'Obtenez l\'accès aux futurs chants et à des livres audio bonus en rejoignant l\'espace Membres de la chaîne.' : locale === 'en' ? 'Get access to future songs and bonus audiobooks by joining the channel membership.' : 'Erhalten Sie Zugriff auf zukünftige Lieder und Bonus-Audiobooks durch die Kanalmitgliedschaft.' }}</p>
          <a class="button" href="https://www.youtube.com/@BardsInExileFolkRevival/join" target="_blank" rel="noopener noreferrer">{{ locale === 'fr' ? 'Rejoindre...' : locale === 'en' ? 'Join...' : 'Beitreten...' }}</a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section container" id="apropos" aria-labelledby="about-title">
      <div class="about-panel">
        <div>
          <p class="eyebrow">{{ locale === 'fr' ? 'Le projet' : locale === 'en' ? 'The project' : 'Das Projekt' }}</p>
          <h2 id="about-title">{{ locale === 'fr' ? 'Un chansonnier européen vivant' : locale === 'en' ? 'A living European songbook' : 'Ein lebendiges europäisches Liederbuch' }}</h2>
          <p>
            {{ locale === 'fr' ? 'Bards in Exile (Bardes en Exil) fait revivre des chants de toute l\'Europe et propose aussi des compositions originales. Lancé en 2019 par Lucius Barde, le projet met à disposition un répertoire pensé pour être découvert, écouté et chanté à plusieurs voix. Lucius propose ses propres arrangements et interprétations réalisées avec l\'aide de l\'outil informatique.' : locale === 'en' ? 'Bards in Exile brings songs from across Europe back to life and offers original compositions. Launched in 2019 by Lucius Barde, the project provides a repertoire designed to be discovered, listened to and sung in multiple voices. Lucius offers his own arrangements and interpretations created with the help of computer tools.' : 'Bards in Exile belebt Lieder aus ganz Europa wieder und bietet Originalkomposition an. Das Projekt wurde 2019 von Lucius Barde ins Leben gerufen und bietet ein Repertoire, das entdeckt, gehört und mehrstimmig gesungen werden kann. Lucius bietet seine eigenen Arrangements und Interpretationen, die mit Hilfe von Computerwerkzeugen erstellt wurden.' }}
          </p>
        </div>
        <aside class="about-note">
          <strong>{{ locale === 'fr' ? 'Pour les curieux et les interprètes' : locale === 'en' ? 'For the curious and performers' : 'Für die Neugierigen und Interpreten' }}</strong>
          <p>{{ locale === 'fr' ? 'Paroles, contexte historique, traductions et partitions selon les chants.' : locale === 'en' ? 'Lyrics, historical context, translations and sheet music as available.' : 'Texte, historischer Kontext, Übersetzungen und Noten je nach Verfügbarkeit.' }}</p>
          <router-link to="/le-projet" class="text-link">{{ locale === 'fr' ? 'En savoir plus →' : locale === 'en' ? 'Learn more →' : 'Mehr erfahren →' }}</router-link>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getSongImageUrl } from '../lib/songImages'
import { useLocale } from '../composables/useLocale'
import { getSongTypeTranslation } from '../lib/songTypes'
import { getSongOriginTranslation } from '../lib/songOrigins'

const router = useRouter()
const { locale, t } = useLocale()
const searchQuery = ref('')
const latestSongs = ref([])
const topOrigins = ref([])

// Generate locale-specific links
const traditionalLink = computed(() => {
  if (locale.value === 'fr') return '/categorie/chants'
  if (locale.value === 'en') return '/en/music'
  if (locale.value === 'de') return '/de/musik'
  return '/categorie/chants'
})

const medievalLink = computed(() => {
  const base = locale.value === 'fr' ? '/recherche?q=' : locale.value === 'en' ? '/en/music?q=' : '/de/musik?q='
  return locale.value === 'fr' ? `${base}médiéval` : locale.value === 'en' ? `${base}medieval` : `${base}Mittelalter`
})

const militaryLink = computed(() => {
  const base = locale.value === 'fr' ? '/recherche?q=' : locale.value === 'en' ? '/en/music?q=' : '/de/musik?q='
  return locale.value === 'fr' ? `${base}militaire` : locale.value === 'en' ? `${base}military` : `${base}Militär`
})

const royalistLink = computed(() => {
  const base = locale.value === 'fr' ? '/recherche?q=' : locale.value === 'en' ? '/en/music?q=' : '/de/musik?q='
  return locale.value === 'fr' ? `${base}royaliste` : locale.value === 'en' ? `${base}royalist` : `${base}Royalist`
})

const sheetsLink = computed(() => {
  if (locale.value === 'fr') return '/partitions-chants-folk'
  if (locale.value === 'en') return '/en/music'
  if (locale.value === 'de') return '/de/musik'
  return '/partitions-chants-folk'
})

const personalLink = computed(() => {
  if (locale.value === 'fr') return '/categorie/compositions-personnelles'
  if (locale.value === 'en') return '/en/music'
  if (locale.value === 'de') return '/de/musik'
  return '/categorie/compositions-personnelles'
})

const exploreLink = computed(() => {
  if (locale.value === 'fr') return '/musique'
  if (locale.value === 'en') return '/en/music'
  if (locale.value === 'de') return '/de/musik'
  return '/musique'
})

// Load the latest songs and count published origins for the homepage.
import { useHead } from '@vueuse/head'

useHead({
  link: [{ rel: 'canonical', href: `${window.location.origin}/` }],
  title: 'Bards in Exile - Paroles, partitions et arrangements de chants traditionnels',
  meta: [{
    name: 'description',
    content: 'Explorez les paroles, traductions et partitions de chants folk, médiévaux et traditionnels de France, de Suisse et d’Europe avec Bards in Exile.'
  }]
})

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('bardsinexile_songs')
      .select('*')
      .gte('song_status', 3)
      .order('song_catalog_id', { ascending: false })
      .limit(3)

    if (error) throw error
    latestSongs.value = data || []

    const { data: originRows, error: originsError } = await supabase
      .from('bardsinexile_songs')
      .select('song_origin_legacy')
      .gte('song_status', 3)
      .not('song_origin_legacy', 'is', null)
      .range(0, 9999)

    if (originsError) throw originsError

    const counts = new Map()
    for (const row of originRows || []) {
      const origin = row.song_origin_legacy?.trim()
      if (origin) counts.set(origin, (counts.get(origin) || 0) + 1)
    }
    topOrigins.value = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 12)
  } catch (error) {
    console.error('Error fetching homepage songs and origins:', error)
  }
})

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}


const songDetailLink = (song) => {
  const slug = generateSlug(song.song_title)
  if (locale.value === 'fr') return `/musique/${song.song_catalog_id}-${slug}`
  if (locale.value === 'en') return `/en/music/${song.song_catalog_id}-${slug}`
  if (locale.value === 'de') return `/de/musik/${song.song_catalog_id}-${slug}`
  return `/musique/${song.song_catalog_id}-${slug}`
}

const originLink = (origin) => {
  const path = origin === 'B.i.E'
    ? 'compositions-personnelles'
    : `chants/${encodeURIComponent(origin)}`

  if (locale.value === 'fr') return `/categorie/${path}`
  if (locale.value === 'en') return '/en/music'
  if (locale.value === 'de') return '/de/musik'
  return `/categorie/${path}`
}

const translateSongType = (frenchType) => {
  return getSongTypeTranslation(frenchType, locale.value)
}

const getSongOriginTranslated = (frenchOrigin) => {
  return getSongOriginTranslation(frenchOrigin, locale.value)
}

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) return

  if (locale.value === 'fr') router.push({ path: '/recherche', query: { q: query } })
  else if (locale.value === 'en') router.push({ path: '/en/search', query: { q: query } })
  else if (locale.value === 'de') router.push({ path: '/de/suche', query: { q: query } })
}
</script>

<style scoped>
.hero {
  position: relative;
  padding: 72px 20px 64px;
  overflow: hidden;
  text-align: center;
  background:
    linear-gradient(rgb(239 231 220 / 83%), rgb(239 231 220 / 92%)),
    url("/Lucius-Barde-2026.jpg")
      center 42% / cover no-repeat;
  text-shadow: 0px 0px 3px #fff;
}

.hero-content {
  position: relative;
  max-width: 760px;
  margin-inline: auto;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--blue-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero h1 {
  max-width: 680px;
  margin-inline: auto;
}

.hero-copy {
  max-width: 610px;
  margin: 18px auto 24px;
}

.search-form {
  display: flex;
  max-width: 590px;
  margin: 0 auto 18px;
  gap: 8px;
}

.search-form input {
  width: 100%;
  min-width: 0;
  min-height: 46px;
  padding: 10px 15px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink);
  background: var(--paper);
  font: 15px var(--sans);
}

.search-form input:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
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
  text-align: center;
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;
  cursor: pointer;
}

.button:hover,
.button:active {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
  color: #fff;
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.topic-list a {
  padding: 6px 11px;
  border: 1px solid var(--line);
  border-radius: 99px;
  font-size: 12px;
  text-decoration: none;
}

.topic-list a:hover {
  border-color: var(--blue);
  color: var(--blue);
}

.section {
  padding-block: 52px;
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.section-heading p {
  max-width: 580px;
  margin: 8px 0 0;
  color: rgb(34 34 34 / 78%);
}

.text-link {
  color: var(--blue);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.text-link:hover {
  color: var(--blue-dark);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: rgb(255 255 255 / 39%);
}

.feature-icon {
  margin-bottom: 17px;
  font-size: 26px;
}

.feature-card h3 {
  margin: 0;
}

.feature-card p {
  margin: 9px 0 20px;
  font-size: 14px;
}

.feature-card .text-link {
  margin-top: auto;
}

.latest-section {
  background: rgb(228 216 201 / 35%);
}

.chant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
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

.song-card-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
  margin-bottom: 7px;
}

.song-number {
  color: rgb(34 34 34 / 62%);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
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

.chant-card h3 {
  margin: 0 0 9px;
  font-size: 19px;
}

.chant-card-body > p:not(.song-origin) {
  min-height: 48px;
  margin: 0 0 16px;
  font-size: 14px;
}

.chant-card .button {
  min-height: 38px;
  padding: 8px 13px;
  font-size: 13px;
}

.country-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.country-list a {
  padding: 10px 15px;
  border: 1px solid var(--line);
  border-radius: 4px;
  text-decoration: none;
}

.country-list a:hover {
  border-color: var(--blue);
  color: var(--blue);
}

.community-section {
  background: rgb(228 216 201 / 35%);
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 36px;
}

.community-column {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.community-column p {
  margin: 10px 0 20px;
}

.platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.button-secondary {
  border-color: var(--blue);
  color: var(--blue);
  background: transparent;
}

.button-secondary:hover,
.button-secondary:active {
  border-color: var(--blue-dark);
  color: var(--blue-dark);
  background: transparent;
}


.about-panel {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: center;
  gap: 36px;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: rgb(255 255 255 / 39%);
}

.about-panel p {
  margin-bottom: 0;
}

.about-note {
  padding: 20px;
  border-left: 3px solid var(--blue);
  font-size: 14px;
}

@media (max-width: 760px) {
  .hero {
    padding-block: 54px;
  }

  .search-form {
    flex-direction: column;
  }

  .section {
    padding-block: 38px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .feature-grid,
  .chant-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-panel {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .community-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 520px) {
  .hero {
      padding: 84px 28px;
  }

  .hero-copy {
    font-size: 15px;
  }

  .search-form {
    flex-direction: column;
  }

  .feature-grid,
  .chant-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: auto;
  }

  .chant-card img {
    height: 210px;
  }

  .about-panel {
    padding: 22px;
  }
}
</style>
