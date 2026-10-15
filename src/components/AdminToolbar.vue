<template>
  <div class="admin-toolbar">
    <div class="toolbar-buttons">
      <router-link
        v-for="action in actions"
        :key="action.label"
        :to="action.to"
        :class="['btn', action.primary ? 'btn-primary' : 'btn-sort']"
      >{{ action.label }}</router-link>
    </div>
    <div v-if="$slots.default" class="sort-buttons">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.toolbar-buttons,
.sort-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.btn-primary {
  border-color: var(--blue);
  color: #fff;
  background: var(--blue);
}

.btn-sort {
  color: var(--ink);
  background: var(--paper-deep);
}

@media (max-width: 760px) {
  .admin-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-buttons,
  .sort-buttons {
    width: 100%;
  }

  .toolbar-buttons .btn {
    flex: 1;
    text-align: center;
  }

  .sort-buttons :deep(.btn) {
    flex: 1;
  }
}
</style>
