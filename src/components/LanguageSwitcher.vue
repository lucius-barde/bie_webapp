<template>
  <div class="language-switcher">
    <a
      v-for="loc in locales"
      :key="loc"
      :href="hrefFor(loc)"
      :class="['lang-btn', { active: isCurrentLocale(loc) }]"
      :aria-label="`Switch to ${loc.toUpperCase()}`"
    >
      {{ loc.toUpperCase() }}
    </a>
  </div>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'

const { isCurrentLocale, supportedLocales } = useLocale()

const locales = supportedLocales

const hrefFor = (loc) => (loc === 'fr' ? '/' : `/${loc}`)
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lang-btn {
  padding: 4px 10px;
  border: 1px solid var(--blue);
  background: transparent;
  color: var(--blue);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 3px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.lang-btn:hover {
  background: var(--blue);
  color: white;
}

.lang-btn.active {
  background: var(--blue);
  color: white;
}
</style>
