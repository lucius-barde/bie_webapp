<template>
  <main class="side-projects-page">
    <Breadcrumbs :items="[{ label: 'Accueil', to: '/' }, { label: 'Side projects' }]" />
    <section class="container links-page">
      <h1>Altaborea</h1>
      <p>An Alpine-themed synthwave/darkwave project by Lucius Barde, with some folk, metal, rock, and medieval elements. Distributed by B.i.E. Made with LMMS.</p>
      <ul class="mt-8">
          <li><a href="https://open.spotify.com/intl-fr/artist/3NOq0XigdAAfyM0Tm2d67x" target="_blank">Altaborea (Spotify)</a></li>
          <li><a href="https://bardsinexile.bandcamp.com" target="_blank">Altaborea (Bandcamp)</a></li>
      </ul>
      <p><small>Also available on Deezer, Apple Music and Amazon.</small></p>
    </section>
  </main>
</template>

<script setup>
import Breadcrumbs from '../components/Breadcrumbs.vue'
</script>

<style scoped>

.side-projects-page{

    background-color: #333;
    color:#eee;

}

.side-projects-page nav{
    color:#eee;
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.links-page {
  min-height: 50vh;
  padding-block: 72px;
}

.links-page p {
  margin-top: 20px;
}


.links-page a:hover,
.links-page a:active {
  text-decoration: underline;
}

.links-page h2,
.links-page h3 {
  margin-top: 1em;
  margin-bottom: 0.3em;
}

.links-page ul {
  list-style: square inside;
  font-size: 0.9em;
}


.side-projects-page .links-page a {
  color: #cc44cc;
}

</style>
