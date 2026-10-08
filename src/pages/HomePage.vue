<template>
  <main>
    <!-- Hero Section -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="eyebrow">Chants folk · médiévaux · traditionnels</p>
        <h1 id="hero-title">Paroles de chants d'Europe à découvrir et à faire revivre</h1>
        <p class="hero-copy">
          Parcourez un répertoire de chants anciens et populaires de France, de Suisse et d'ailleurs,
          avec paroles, traductions et partitions.
        </p>

        <form class="search-form" @submit.prevent="handleSearch" role="search">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher un chant, un pays ou une époque…"
            aria-label="Rechercher un chant, un pays ou une époque"
          >
          <button class="button" type="submit">Rechercher</button>
        </form>

        <div class="topic-list" aria-label="Thèmes populaires">
          <router-link to="/categorie/chants">Chants traditionnels</router-link>
          <router-link to="/recherche?q=médiéval">Chants médiévaux</router-link>
          <router-link to="/recherche?q=militaire">Chants militaires</router-link>
          <router-link to="/recherche?q=royaliste">Chants royalistes</router-link>
          <router-link to="/partitions-chants-folk">Partitions</router-link>
          <router-link to="/categorie/compositions-personnelles">Compositions personnelles</router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section container" aria-labelledby="explore-title">
      <div class="section-heading">
        <div>
          <h2 id="explore-title">Explorez le chansonnier</h2>
          <p>Retrouvez des chants d'Europe, des compositions originales et des ressources pour les interpréter.</p>
        </div>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <span class="feature-icon" aria-hidden="true">♬</span>
          <h3>Paroles de chants</h3>
          <p>Découvrez des chants folk, médiévaux et traditionnels, accompagnés de leur contexte et de leurs paroles.</p>
          <router-link to="/musique" class="text-link">Parcourir les chants →</router-link>
        </article>

        <article class="feature-card" id="partitions">
          <span class="feature-icon" aria-hidden="true">♫</span>
          <h3>Partitions & traductions</h3>
          <p>Explorez les ressources disponibles pour apprendre les mélodies et comprendre les textes d'autres langues.</p>
          <router-link to="/partitions-chants-folk" class="text-link">Voir les partitions →</router-link>
        </article>

        <article class="feature-card">
          <span class="feature-icon" aria-hidden="true">▤</span>
          <h3>Albums & compositions</h3>
          <p>Écoutez les albums de Bards in Exile et découvrez les compositions de Lucius Barde sur Spotify, Apple Music, Bandcamp et autres.</p>
          <a href="https://linktr.ee/bardsinexile" target="_blank" class="text-link">Plateformes disponibles →</a>
        </article>
      </div>
    </section>

    <!-- Latest Songs Section -->
    <section class="section latest-section" aria-labelledby="latest-title">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 id="latest-title">Découvrez les nouveaux chants</h2>
            <p>Retrouvez ici les chants publiés récemment dans le répertoire.</p>
          </div>
          <router-link to="/musique" class="text-link">Tous les chants →</router-link>
        </div>

        <div class="chant-grid">
          <article v-for="song in latestSongs" :key="song.id" class="chant-card">
            <router-link :to="songDetailLink(song)" class="chant-card-image-link" :aria-label="`Lire ${song.song_title}`">
              <img
                :src="getSongImage(song.song_image || song.song_image_gallery?.[0])"
                :alt="`Illustration de ${song.song_title}`"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              >
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
                <h3>{{ song.song_title }}</h3>
              </router-link>
              <p v-if="song.song_type_legacy">{{ song.song_type_legacy }}</p>
              <router-link
                :to="songDetailLink(song)"
                class="button"
              >
                Lire la suite...
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
          <h2 id="countries-title">Voyagez par pays et par culture</h2>
          <p>Partez à la recherche de chants traditionnels, de mélodies médiévales et de répertoires régionaux.</p>
        </div>
      </div>

      <nav class="country-list" aria-label="Explorer par pays ou région">
        <router-link
          v-for="origin in topOrigins"
          :key="origin.name"
          :to="originLink(origin.name)"
        >
          {{ origin.name }} ({{ origin.count }})
        </router-link>
        <router-link to="/musique">Toute l'Europe</router-link>
      </nav>
    </section>

    <!-- Albums and Bardic Club Section -->
    <section class="section community-section" aria-label="Albums et communauté">
      <div class="container community-grid">
        <div id="albums" class="community-column" aria-labelledby="albums-title">
          <h2 id="albums-title">Obtenez les albums</h2>
          <p>Soutenez le projet en achetant les albums ou en écoutant les titres sur les plateformes suivantes:</p>
          <nav class="platform-list" aria-label="Plateformes musicales">
            <a class="button" href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">Spotify</a>
            <a class="button button-secondary" href="https://music.apple.com/" target="_blank" rel="noopener noreferrer">Apple Music</a>
            <a class="button button-secondary" href="https://www.deezer.com/" target="_blank" rel="noopener noreferrer">Deezer</a>
            <a class="button button-secondary" href="https://music.amazon.com/" target="_blank" rel="noopener noreferrer">Amazon</a>
            <a class="button button-secondary" href="https://bardsinexile.bandcamp.com/" target="_blank" rel="noopener noreferrer">Bandcamp</a>
          </nav>
        </div>

        <div class="community-column" aria-labelledby="bardic-club-title">
          <h2 id="bardic-club-title">Rejoignez le Bardic Club</h2>
          <p>Obtenez l'accès aux futurs chants et à des livres audio bonus en rejoignant l'espace Membres de la chaîne.</p>
          <a class="button" href="https://www.youtube.com/@BardsInExileFolkRevival/join" target="_blank" rel="noopener noreferrer">Rejoindre...</a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section container" id="apropos" aria-labelledby="about-title">
      <div class="about-panel">
        <div>
          <p class="eyebrow">Le projet</p>
          <h2 id="about-title">Un chansonnier européen vivant</h2>
          <p>
            Bards in Exile (Bardes en Exil) fait revivre des chants de toute l'Europe et propose
            aussi des compositions originales. Lancé en 2019 par Lucius Barde,
            le projet met à disposition un répertoire pensé pour être découvert,
            écouté et chanté à plusieurs voix.
          </p>
        </div>
        <aside class="about-note">
          <strong>Pour les curieux et les interprètes</strong>
          <p>Paroles, contexte historique, traductions et partitions selon les chants.</p>
          <router-link to="/le-projet" class="text-link">En savoir plus →</router-link>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const searchQuery = ref('')
const latestSongs = ref([])
const topOrigins = ref([])

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
      .slice(0, 6)
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

const getSongImage = (image) => image?.startsWith('http') ? image : `/supabase-url-here/${image || ''}`

const songDetailLink = (song) => `/musique/${song.song_catalog_id}-${generateSlug(song.song_title)}`

const originLink = (origin) => origin === 'B.i.E'
  ? '/categorie/compositions-personnelles'
  : `/categorie/chants/${encodeURIComponent(origin)}`

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) router.push({ path: '/recherche', query: { q: query } })
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
    url("https://www.bardsinexile.org/wp-content/uploads/Lucius-Barde-2026.jpg")
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
  min-height: 225px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: rgb(255 255 255 / 18%);
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
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  color: #e5e7eb;
  background: var(--ink);
  font-size: 10px;
  font-weight: 700;
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
  background: rgb(255 255 255 / 18%);
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
    padding: 44px 14px;
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
