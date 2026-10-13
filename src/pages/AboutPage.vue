<template>
  <main>
    <Breadcrumbs :items="[{ label: 'Accueil', to: '/' }, { label: 'Le projet' }]" />
    <section class="container about-page">
    <h1>À propos de Bards in Exile</h1>
    <p>La biographie du projet sera disponible prochainement. En attendant, vous pouvez obtenir plus d'infos sur ces sites externes.</p>

    <h2>Ils en parlent !</h2>
    <ul class="wp-block-list">
    <li><a href="https://chantsdefrance.fr/repertoire/webzine/itw-bards-in-exile" data-type="link" data-id="https://chantsdefrance.fr/repertoire/webzine/itw-bards-in-exile" target="_blank" rel="noreferrer noopener">Chants de France</a> (01.2025)</li>
    <li><a href="https://www.unebonnedroite.fr/mythes-culture/tour-musical-d-europe-avec-bardes-en-exil/" data-type="link" data-id="https://www.unebonnedroite.fr/mythes-culture/tour-musical-d-europe-avec-bardes-en-exil/" target="_blank" rel="noreferrer noopener">Une Bonne Droite</a> (04.2023)</li>
    </ul>
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

.about-page {
  min-height: 50vh;
  padding-block: 72px;
}

.about-page p {
  margin-top: 20px;
}

.about-page a{
    color: var(--blue);
}

.about-page a:hover, .about-page a:active{
    text-decoration:underline;
}

.about-page h2, .about-page h3{
    margin-top: 1em;
    margin-bottom:0.3em;
}

.about-page ul{
    list-style: square inside;
    font-size: 0.9em;
}
</style>
