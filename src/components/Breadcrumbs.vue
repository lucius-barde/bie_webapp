<template>
  <nav v-if="items.length" class="breadcrumbs container" :aria-label="ariaLabel">
    <ol>
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">/</span>
        <router-link
          v-if="item.to && index < items.length - 1"
          :to="item.to"
        >{{ item.label }}</router-link>
        <span v-else :aria-current="index === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

defineProps({
  items: {
    type: Array,
    required: true
  },
  translations: {
    type: Object,
    default: null
  }
})

const { t } = useLocale()
const ariaLabel = computed(() => t('common.breadcrumbs') || 'Breadcrumbs')
</script>

<style scoped>
.breadcrumbs {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
  padding-block: 14px;
  color: rgb(34 34 34 / 72%);
  font-size: 13px;
}

.breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  list-style: none;
}

.breadcrumbs li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.breadcrumbs a {
  color: var(--blue-dark);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: rgb(34 34 34 / 48%);
}
</style>
