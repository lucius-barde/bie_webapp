<template>
  <main>
    <!-- Hero Section -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="eyebrow">Chants folk · médiévaux · traditionnels</p>
        <h1 id="hero-title">Paroles de chants d'Europe à découvrir et à faire revivre</h1>
        <p class="hero-copy">
          Parcourez un répertoire de chants anciens et populaires,
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
          <a href="/musique">Chants médiévaux</a>
          <a href="/musique">Folk revival</a>
          <a href="/musique">Chants traditionnels</a>
          <a href="/musique">Paroles & traductions</a>
          <a href="#partitions">Partitions</a>
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
          <a href="#" class="text-link">Voir les ressources →</a>
        </article>

        <article class="feature-card">
          <span class="feature-icon" aria-hidden="true">▤</span>
          <h3>Albums & compositions</h3>
          <p>Écoutez les albums de Bards in Exile et découvrez les compositions de Lucius Barde.</p>
          <a href="#albums" class="text-link">Découvrir les albums →</a>
        </article>
      </div>
    </section>

    <!-- Latest Songs Section -->
    <section class="section latest-section" aria-labelledby="latest-title">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 id="latest-title">À découvrir</h2>
            <p>Une sélection de chants et de compositions récemment publiés dans le répertoire.</p>
          </div>
          <router-link to="/musique" class="text-link">Tous les chants →</router-link>
        </div>

        <div class="chant-grid">
          <article v-for="song in latestSongs" :key="song.id" class="chant-card">
            <img
              :src="getPlaceholderImage(song.song_catalog_id)"
              :alt="`Illustration pour ${song.song_title}`"
              loading="lazy"
            >
            <div class="chant-card-body">
              <p v-if="song.song_origin_legacy" class="chant-meta">{{ song.song_origin_legacy }}</p>
              <h3>{{ song.song_title }}</h3>
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
        <a href="#france">🇫🇷 France</a>
        <a href="#switzerland">🇨🇭 Suisse</a>
        <a href="#spain">🇪🇸 Espagne</a>
        <a href="#occitanie">Occitanie</a>
        <a href="#catalogne">Catalogne</a>
        <a href="#europe">Toute l'Europe</a>
      </nav>
    </section>

    <!-- About Section -->
    <section class="section container" id="apropos" aria-labelledby="about-title">
      <div class="about-panel">
        <div>
          <p class="eyebrow">Le projet</p>
          <h2 id="about-title">Un chansonnier européen vivant</h2>
          <p>
            Bards in Exile fait revivre des chants de toute l'Europe et propose
            aussi des compositions originales. Lancé en 2019 par Lucius Barde,
            le projet met à disposition un répertoire pensé pour être découvert,
            écouté et chanté à plusieurs voix.
          </p>
        </div>
        <aside class="about-note">
          <strong>Pour les curieux et les interprètes</strong>
          <p>Paroles, contexte historique, traductions et partitions selon les chants.</p>
          <a href="#" class="text-link">En savoir plus →</a>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const searchQuery = ref('')
const latestSongs = ref([])

// Fetch latest 3 songs for the homepage
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
  } catch (error) {
    console.error('Error fetching latest songs:', error)
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

const getPlaceholderImage = (catalogId) => {
  const placeholderImages = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  ]
  return placeholderImages[catalogId % placeholderImages.length]
}

const handleSearch = () => {
  // Placeholder for search functionality
  console.log('Searching for:', searchQuery.value)
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
