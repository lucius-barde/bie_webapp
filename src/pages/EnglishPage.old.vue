<template>
  <main lang="en" class="english-page">
    <section class="hero hero-simple" aria-labelledby="english-title">
      <div class="hero-content">
        <h1 id="english-title">Songs from across Europe, waiting to be rediscovered</h1>
        <p class="hero-copy">
          Bards in Exile brings folk, medieval and traditional songs back to life,
          with lyrics, translations and sheet music from France, Switzerland and beyond.
        </p>
      </div>
    </section>

    <section class="container availability-note" aria-labelledby="availability-title">
      <p class="eyebrow">A note for English-speaking visitors</p>
      <h2 id="availability-title">The English section is temporarily unavailable</h2>
      <p>
        I am currently working on a multilingual module for the website, but first I need
        to finalise some new aspects of the French database, in order for categories and search functions to be fully translatable. <br /><br /> Meanwhile, you can follow me
        on Telegram, where I also share news in English.
      </p>
      <a
        class="underline"
        href="https://t.me/bardsinexile"
        target="_blank"
        rel="noopener noreferrer"
      >Follow Bards in Exile on Telegram</a>
    </section>
  </main>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'English section temporarily unavailable | Bards in Exile',
  meta: [{
    name: 'description',
    content: 'Discover Bards in Exile, a project bringing European folk, medieval and traditional songs back to life. The English section is temporarily unavailable.'
  }]
})
</script>

<style scoped>
.hero {
  padding: 72px 20px 64px;
  text-align: center;
  background: linear-gradient(135deg, var(--paper) 0%, var(--paper-deep) 100%);
}

.hero-content {
  max-width: 760px;
  margin-inline: auto;
}

.hero h1 {
  max-width: 680px;
  margin-inline: auto;
}

.hero-copy {
  max-width: 650px;
  margin: 18px auto 0;
  color: rgb(34 34 34 / 78%);
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.availability-note {
  max-width: 760px;
  min-height: 40vh;
  padding-block: 64px 80px;
  text-align: center;
}

.availability-note h2 {
  margin-top: 8px;
}

.availability-note > p:not(.eyebrow) {
  margin: 18px auto 26px;
  max-width: 680px;
}

@media (max-width: 600px) {
  .hero {
    padding-block: 56px 48px;
  }

  .availability-note {
    padding-block: 48px 64px;
  }
}
</style>
