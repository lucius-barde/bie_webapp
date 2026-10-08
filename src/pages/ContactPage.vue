<template>
  <main>
    <Breadcrumbs :items="[{ label: 'Accueil', to: '/' }, { label: 'Contact et mentions légales' }]" />
    <section class="container construction-page">
    <h1>Contact et mentions légales</h1>
    <p>Cette page est en construction. Les informations de contact et les mentions légales seront bientôt disponibles.</p>
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
