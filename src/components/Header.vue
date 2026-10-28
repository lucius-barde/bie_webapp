<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link :to="homeLink" class="brand" :aria-label="t('header.aria_home')">
        <img class="brand-logo" src="/bardsinexile_logo.png" alt="" />
        <span>
          <span class="brand-name">Bards in Exile</span>
          <span class="brand-caption">{{ t('header.tagline') }}</span>
        </span>
      </router-link>

      <nav class="main-nav" aria-label="Navigation principale">
        <router-link v-if="isAuthenticated" to="/admin">{{ t('common.admin') }}</router-link>
        <router-link :to="albumsLink">{{ t('common.albums') }}</router-link>
        <router-link :to="sheetsLink">{{ t('common.sheets') }}</router-link>
        <router-link to="/le-projet">{{ t('common.about') }}</router-link>
        <router-link :to="exploreLink" class="button">{{ t('common.explore') }}</router-link>
        <LanguageSwitcher />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useLocale } from '../composables/useLocale'
import LanguageSwitcher from './LanguageSwitcher.vue'

const isAuthenticated = ref(false)
let authSubscription
const { locale, t } = useLocale()

// Generate locale-specific links
const homeLink = computed(() => {
  return locale.value === 'fr' ? '/' : `/${locale.value}`
})

const albumsLink = computed(() => {
  return `${homeLink.value}#albums`
})

const sheetsLink = computed(() => {
  return locale.value === 'fr' ? '/' : `/${locale.value}`
})

const exploreLink = computed(() => {
  return locale.value === 'fr' ? '/' : `/${locale.value}`
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isAuthenticated.value = Boolean(session?.user)

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.value = Boolean(session?.user)
  })
  authSubscription = data.subscription
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})
</script>

<style scoped>
.site-header {
  border-bottom: 1px solid rgb(34 34 34 / 12%);
}

.header-inner {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.brand-name {
  display: block;
  font-family: var(--serif);
  font-size: 20px;
  line-height: 1.1;
}

.brand-caption {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-nav a:not(.button) {
  font-size: 14px;
  text-decoration: none;
  color: inherit;
}

.main-nav a:not(.button):hover {
  color: var(--blue);
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

@media (max-width: 760px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    padding-block: 16px;
    gap: 14px;
  }

  .main-nav {
    width: 100%;
    flex-wrap: wrap;
    gap: 12px 18px;
  }

  .main-nav .button {
    min-height: 36px;
    padding: 7px 12px;
  }
}
</style>
