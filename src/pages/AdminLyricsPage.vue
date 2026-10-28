<template>
  <main class="admin-main">
    <div class="admin-container">
      <h1>Admin - Paroles</h1>

      <!-- Toolbar -->
      <AdminMobileNav :actions="[
        { label: '⬅️', to: '/admin' },
        { label: '📝', to: '/admin/lyrics/create', primary: true }
      ]">
        <label class="sort-control">
          <span>Trier par</span>
          <select v-model="currentSort" class="sort-select">
            <option
              v-for="sort in sortOptions"
              :key="sort.value"
              :value="sort.value"
            >
              {{ sort.label }}
            </option>
          </select>
        </label>
      </AdminMobileNav>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        Chargement des paroles...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>Erreur lors du chargement des paroles: {{ error }}</p>
        <button @click="fetchLyrics" class="btn btn-primary">Réessayer</button>
      </div>

      <!-- Lyrics Table -->
      <div v-else class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Actions</th>
              <th>ID</th>
              <th>Langue</th>
              <th>Aperçu</th>
              <th>Traductions</th>
              <th>Date de création</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lyric in lyrics" :key="lyric.id">
              <td class="actions">
                <router-link :to="`/admin/lyrics/${lyric.id}/edit`" class="action-link edit">✏️</router-link>
                <button @click="deleteLyric(lyric.id)" class="action-link delete">🗑️</button>
              </td>
              <td class="text-truncate">{{ truncateText(lyric.id, 12) }}</td>
              <td>{{ lyric.main_lyrics_language || '-' }}</td>
              <td class="text-truncate">{{ truncateText(lyric.main_lyrics, 50) }}</td>
              <td>{{ countTranslations(lyric) }}</td>
              <td>{{ formatDateTime(lyric.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && lyrics.length === 0" class="empty-state">
        Aucune parole trouvée.
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'
import AdminMobileNav from '../components/AdminToolbar.vue'

const router = useRouter()
const lyrics = ref([])
const loading = ref(true)
const error = ref(null)

const currentSort = ref('by_id')

const sortOptions = [
  { label: 'Tri par ID', value: 'by_id' },
  { label: 'Tri par ID inv.', value: 'by_id_desc' },
  { label: 'Tri par langue', value: 'by_language' },
  { label: 'Tri par date', value: 'by_date_desc' },
]

const fetchLyrics = async () => {
  loading.value = true
  error.value = null
  try {
    let query = supabase
      .from('bardsinexile_lyrics')
      .select('*')

    // Apply sorting
    if (currentSort.value === 'by_id') {
      query = query.order('id', { ascending: true })
    } else if (currentSort.value === 'by_id_desc') {
      query = query.order('id', { ascending: false })
    } else if (currentSort.value === 'by_language') {
      query = query.order('main_lyrics_language', { ascending: true })
        .order('id', { ascending: true })
    } else if (currentSort.value === 'by_date_desc') {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error: fetchError } = await query

    if (fetchError) throw fetchError
    lyrics.value = data || []
  } catch (err) {
    console.error('Error fetching lyrics:', err)
    error.value = err.message || 'Erreur inconnue'
    lyrics.value = []
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const dateStr = date.toLocaleDateString('fr-FR')
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return `${dateStr} ${timeStr}`
}

const truncateText = (text, maxLength = 64) => {
  if (!text) return '-'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const countTranslations = (lyric) => {
  let count = 0
  if (lyric.translation_one && lyric.translation_one_language) count++
  if (lyric.translation_two && lyric.translation_two_language) count++
  if (lyric.translation_three && lyric.translation_three_language) count++
  return count
}

const deleteLyric = async (lyricId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette parole?')) return

  try {
    const { error: deleteError } = await supabase
      .from('bardsinexile_lyrics')
      .delete()
      .eq('id', lyricId)

    if (deleteError) throw deleteError

    // Refresh the list
    await fetchLyrics()
  } catch (err) {
    console.error('Error deleting lyric:', err)
    alert('Erreur lors de la suppression')
  }
}

// Watch for sort changes and re-fetch
watch(() => currentSort.value, async () => {
  await fetchLyrics()
})

onMounted(async () => {
  await fetchLyrics()
})
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


.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
}

.btn-primary {
  background: var(--blue);
  color: white;
}

.btn-primary:hover {
  background: var(--blue-dark);
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
}

.sort-select {
  min-width: 190px;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink);
  background: var(--paper-deep);
  font: inherit;
  cursor: pointer;
}

.sort-select:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #d32f2f;
  border-radius: 4px;
}

.error-state p {
  margin-bottom: 20px;
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
  font-size: 13px;
  font-family: monospace;
  letter-spacing: -0.05em;
}

.admin-table thead {
  background: var(--paper-deep);
}

.admin-table th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--line);
}

.admin-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--line);
  height: 44px;
  white-space: nowrap;
  vertical-align: baseline;
}

.actions, .lyrics-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 44px;
}

.action-link {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: all 160ms ease;
  display: inline-block;
  flex-shrink: 0;
}

.action-link.edit {
  color: var(--blue);
  border-color: var(--blue);
}

.action-link.edit:hover {
  background: var(--blue);
  color: white;
}

.action-link.delete {
  color: #d32f2f;
  border-color: #d32f2f;
}

.action-link.delete:hover {
  background: #d32f2f;
  color: white;
}

.text-truncate {
  max-width: 25ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  color: var(--ink);
}

@media (max-width: 760px) {
  .admin-container {
    width: calc(100% - 20px);
    padding: 20px 0;
  }

  .admin-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }

  .sort-control {
    width: 100%;
    justify-content: space-between;
  }

  .sort-select {
    flex: 1;
    min-width: 0;
  }

  .admin-table {
    font-size: 12px;
  }

  .admin-table th,
  .admin-table td {
    padding: 8px 4px;
  }

  .action-link {
    padding: 3px 6px;
    font-size: 11px;
  }
}
</style>
