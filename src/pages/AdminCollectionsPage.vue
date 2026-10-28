<template>
  <main class="admin-main">
    <div class="admin-container">
      <h1>Admin - Collections</h1>

      <AdminMobileNav :actions="[{ label: 'Retour', to: '/admin' }]" />

      <div v-if="loading" class="state-message" aria-live="polite">Chargement des collections...</div>
      <div v-else-if="errorMessage" class="error-state" role="alert">{{ errorMessage }}</div>
      <div v-else-if="collections.length === 0" class="state-message">Aucune collection trouvée.</div>
      <div v-else class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>Pistes</th>
              <th>Total</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="collection in collections"
              :key="collection.name"
              :class="collection.statusClass"
            >
              <td>{{ collection.name }}</td>
              <td>{{ collection.songCount }}</td>
              <td>{{ formatDuration(collection.totalDuration) }}</td>
              <td>{{ collection.statusLabel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'
import AdminMobileNav from '../components/AdminToolbar.vue'

const collections = ref([])
const loading = ref(true)
const errorMessage = ref('')

const formatDuration = (durationInSeconds) => {
  const totalSeconds = Math.max(0, Math.floor(durationInSeconds || 0))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = (Math.floor((totalSeconds % 3600) / 60) < 9 ? '0' : '') + Math.floor((totalSeconds % 3600) / 60)
  const seconds = (Math.floor(totalSeconds % 60) < 9 ? '0' : '') + (totalSeconds % 60)

  if (hours) return `${hours}:${minutes}:${seconds}`
  if (minutes) return `${minutes}:${seconds}`
  return `${seconds} s`
}

const fetchCollections = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase
      .from('bardsinexile_songs')
      .select('song_collection_legacy, song_duration_sec, song_status')
      .not('song_collection_legacy', 'is', null)
      .neq('song_collection_legacy', '')
      .range(0, 9999)

    if (error) throw error

    const collectionMap = new Map()
    for (const song of data || []) {
      const name = song.song_collection_legacy.trim()
      if (!name) continue

      const collection = collectionMap.get(name) || {
        name,
        songCount: 0,
        totalDuration: 0,
        statuses: []
      }
      collection.songCount += 1
      collection.totalDuration += Number(song.song_duration_sec) || 0
      collection.statuses.push(Number(song.song_status))
      collectionMap.set(name, collection)
    }

    collections.value = [...collectionMap.values()]
      .map((collection) => {
        const allPublished = collection.statuses.every((status) => status === 4)
        const allFinalized = collection.statuses.every((status) => status >= 3)
        return {
          ...collection,
          statusLabel: allPublished ? 'Publié' : allFinalized ? 'Finalisé' : 'En projet',
          statusClass: allPublished ? 'row-status-4' : allFinalized ? 'row-status-3' : ''
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  } catch (error) {
    console.error('Error fetching collections:', error)
    errorMessage.value = 'Impossible de charger les collections pour le moment.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCollections)
</script>

<style scoped>
.admin-main {
  min-height: calc(100vh - 200px);
  padding-bottom: 76px;
  background: var(--paper);
}

.admin-container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
  padding: 40px 0;
}

.admin-container h1 {
  margin-bottom: 20px;
  font-size: 28px;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 4px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
}

.admin-table thead {
  background: var(--paper-deep);
}

.admin-table th,
.admin-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.admin-table tbody tr:last-child td {
  border-bottom: 0;
}

.admin-table tbody tr.row-status-3 {
  background-color: #dcfce7;
}

.admin-table tbody tr.row-status-4 {
  background-color: #dbeafe;
}

.state-message,
.error-state {
  padding: 32px;
  text-align: center;
}

.error-state {
  color: #b42318;
}

@media (max-width: 760px) {
  .admin-container {
    width: calc(100% - 20px);
    padding: 20px 0;
  }
}
</style>
