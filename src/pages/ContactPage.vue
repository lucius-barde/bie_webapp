<template>
  <main>
    <Breadcrumbs :items="[{ label: 'Accueil', to: '/' }, { label: 'Contact et mentions légales' }]" />
    <section class="container contact-page">
    <h1>Contact et mentions légales</h1>
    <div class="entry-content single-content">

    <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>



    <p class="wp-block-paragraph">«&nbsp;Bards in Exile&nbsp;», aussi appelé «&nbsp;Bardes en Exil&nbsp;» ou B.i.E, est un projet musical géré par Lucius Barde. L’adresse du site est&nbsp;: <a href="https://www.bardsinexile.org" target="_blank" rel="noreferrer noopener">https://www.bardsinexile.org</a>. Les profils sociaux officiels sont listés sur <a href="https://linktr.ee/bardsinexile">https://linktr.ee/bardsinexile</a>.</p>
    <p class="wp-block-paragraph">Adresse de contact pour le site : <em>carteblanche {at} tutamail [point] com</em>.</p>


    <h2 class="wp-block-heading">Utiliser ma musique dans vos projets</h2>
    <p class="wp-block-paragraph">Signalez-moi par e-mail. J'autorise généralement l'usage des musiques notamment comme musique de fond pour des vidéos, avec mention de l'auteur et un backlink (lien menant à ma chaîne ou mon site) dans la description. L'achat de la piste sur <a href="https://bardsinexile.bandcamp.com" target="_blank">bardsinexile.bandcamp.com</a> est apprécié, en plus vous aurez le son dans la meilleure qualité possible.</p>
    <p class="wp-block-paragraph">Adresse de contact pour l'usage de la musique: <em>carteblanche {at} tutamail [point] com</em>.</p>

    <h2 class="wp-block-heading">Politique de confidentialité</h2>
    <p class="wp-block-paragraph">Actuellement, le site n’utilise pas de cookies à des fins de traçage, de statistiques ou de publicité. Certains modules chargent un lecteur externe au site (YouTube): celui-ci peut récupérer des informations comme si vous naviguiez sur le site externe.</p>
    </div>

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

.contact-page {
  min-height: 50vh;
  padding-block: 72px;
}

.contact-page p {
  margin-top: 20px;
}

.contact-page a{
    color: var(--blue);
}

.contact-page a:hover, .links-page a:active{
    text-decoration:underline;
}

.contact-page h2, .links-page h3{
    margin-top: 1em;
    margin-bottom:0.3em;
}

</style>
