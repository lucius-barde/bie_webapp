<template>
  <main>
    <Breadcrumbs :items="[{ label: 'Accueil', to: '/' }, { label: 'Le projet' }]" />
    <section class="container construction-page">
    <h1>À propos de Bards in Exile</h1>
    <p>Cette page est en construction. Vous y trouverez bientôt davantage d'informations sur le projet Bards in Exile.</p>
    </section>
  </main>
</template>

<script setup>
import Breadcrumbs from '../components/Breadcrumbs.vue'
</script>

<style scoped>
.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.construction-page {
  min-height: 50vh;
  padding-block: 72px;
}

.construction-page p {
  margin-top: 20px;
}
</style>
