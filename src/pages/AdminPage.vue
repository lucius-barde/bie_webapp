<template>
  <main class="admin-main">
    <div class="admin-container">
      <h1>Admin Dashboard</h1>

      <!-- Toolbar -->
      <div class="admin-toolbar">
        <div class="toolbar-buttons">
          <router-link to="/admin/song/create" class="btn btn-primary">+ Nouveau chant</router-link>
          <router-link to="/admin/lyrics" class="btn btn-sort">Gérer les paroles</router-link>
        </div>

        <div class="sort-buttons">
          <button
            v-for="sort in sortOptions"
            :key="sort.value"
            :class="['btn', 'btn-sort', { active: currentSort === sort.value }]"
            @click="currentSort = sort.value"
          >
            {{ sort.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        Chargement des chants...
      </div>

      <!-- Songs Table -->
      <div v-else class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Éditer</th>
              <th>ID</th>
              <th>St.</th>
              <th>Titre</th>
              <th>Collection</th>
              <th>N°</th>
              <th>Durée (s)</th>
              <th>Commentaires</th>
              <th>Type</th>
              <th>Origine</th>
              <th>Auteur</th>
              <th>Date</th>
              <th>Édité le</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="song in songs"
              :key="song.song_catalog_id"
              :class="`row-status-${song.song_status}`"
            >
              <td class="actions">
                <router-link :to="`/admin/song/${song.song_catalog_id}/edit`" class="action-link edit">Éditer</router-link>

                <router-link
                  v-if="getLyricsId(song)"
                  :to="`/admin/lyrics/${getLyricsId(song)}/edit`"
                  class="action-link lyrics"
                >
                  Paroles
                </router-link>
              </td>
              <td>{{ song.song_catalog_id }}</td>
              <td>{{ song.song_status }}</td>
              <td class="text-truncate underline">
                <router-link :to="`/musique/${song.song_catalog_id}-${generateSlug(song.song_title)}`">
                  {{ song.song_title }}
                </router-link>
              </td>
              <td class="text-truncate">{{ song.song_collection_legacy || '-' }}</td>
              <td>{{ song.song_track_number || '-' }}</td>
              <td>{{ song.song_duration_sec || '-' }}</td>
              <td class="text-truncate">{{ song.song_bie_comments || '-' }}</td>
              <td class="text-truncate">{{ song.song_type_legacy || '-' }}</td>
              <td class="text-truncate">{{ song.song_origin_legacy || '-' }}</td>
              <td class="text-truncate">{{ song.song_author_legacy || '-' }}</td>
              <td>{{ song.song_date_info || '-' }}</td>
              <td>{{ formatDateTime(song.edited_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && songs.length === 0" class="empty-state">
        Aucun chant trouvé.
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const songs = ref([])
const loading = ref(true)
const currentSort = ref('by_id')

const sortOptions = [
  { label: 'Tri par ID', value: 'by_id', query: 'order by song_catalog_id ASC' },
  { label: 'Tri par ID inv.', value: 'by_id_desc', query: 'order by song_catalog_id DESC' },
  { label: 'Tri par album', value: 'by_album', query: 'order by song_collection_legacy ASC, song_track_number ASC, song_catalog_id ASC' },
  { label: 'Tri par statut', value: 'by_status', query: 'order by song_status DESC, song_catalog_id ASC' },
]

const fetchSongs = async () => {
  loading.value = true
  try {
    let query = supabase
      .from('bardsinexile_songs')
      .select('*')

    // Apply sorting
    const sortOption = sortOptions.find(s => s.value === currentSort.value)
    if (sortOption.value === 'by_id') {
      query = query.order('song_catalog_id', { ascending: true })
    } else if (sortOption.value === 'by_id_desc') {
      query = query.order('song_catalog_id', { ascending: false })
    } else if (sortOption.value === 'by_album') {
      query = query.order('song_collection_legacy', { ascending: true })
        .order('song_track_number', { ascending: true })
        .order('song_catalog_id', { ascending: true })
    } else if (sortOption.value === 'by_status') {
      query = query.order('song_status', { ascending: false })
        .order('song_catalog_id', { ascending: true })
    }

    const { data, error } = await query

    if (error) throw error

    // Fetch lyrics associations separately
    const { data: lyricsData, error: lyricsError } = await supabase
      .from('bardsinexile_songs_have_lyrics')
      .select('song_catalog_id, lyrics_id')

    if (lyricsError) console.error('Error fetching lyrics associations:', lyricsError)

    // Create a map of song_catalog_id to lyrics_id
    const lyricsMap = {}
    if (lyricsData) {
      lyricsData.forEach(entry => {
        lyricsMap[entry.song_catalog_id] = entry.lyrics_id
      })
    }

    // Add lyrics_id to each song
    const songsWithLyrics = data.map(song => ({
      ...song,
      lyrics_id: lyricsMap[song.song_catalog_id] || null
    }))

    songs.value = songsWithLyrics || []
  } catch (error) {
    console.error('Error fetching songs:', error)
    songs.value = []
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

const getLyricsId = (song) => {
  return song.lyrics_id || null
}

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Watch for sort changes and re-fetch
watch(() => currentSort.value, async () => {
  await fetchSongs()
})

onMounted(async () => {
  // Fetch songs (auth is handled by router guard)
  await fetchSongs()
})
</script>

<style scoped>
.admin-main {
  min-height: calc(100vh - 200px);
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

.toolbar-buttons {
  display: flex;
  gap: 12px;
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

.sort-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sort {
  background: var(--paper-deep);
  color: var(--ink);
  border: 1px solid var(--line);
}

.btn-sort:hover,
.btn-sort.active {
  background: var(--blue);
  color: white;
  border-color: var(--blue);
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
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
  font-size: 16px;
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
  height: 56px;
  white-space: nowrap;
  vertical-align: baseline;
}

/* Row status colors */
.admin-table tbody tr.row-status-0 {
  background-color: #fff;
}

.admin-table tbody tr.row-status-1 {
  background-color: #fef3c7;
}

.admin-table tbody tr.row-status-2 {
  background-color: #fee2e2;
}

.admin-table tbody tr.row-status-3 {
  background-color: #dcfce7;
}

.admin-table tbody tr.row-status-4 {
  background-color: #dbeafe;
}

.actions {
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


.action-link.lyrics {
  color: #7c3aed;
  border-color: #7c3aed;
}

.action-link.lyrics:hover {
  background: #7c3aed;
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

  .sort-buttons {
    width: 100%;
  }

  .btn-sort {
    flex: 1;
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
