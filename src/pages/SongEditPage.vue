<template>
  <main class="song-form-main">
    <div class="song-form-container">
      <!-- Loading State -->
      <div v-if="pageLoading" class="loading-state">
        Chargement du chant...
      </div>

      <!-- Form -->
      <div v-else>
        <div class="song-form-header">
          <router-link to="/admin" class="back-link">← Retour à l'administration</router-link>
          <h1>Modifier le chant: {{ formData.song_title || 'Chargement...' }}</h1>
        </div>

        <form @submit.prevent="submitForm" class="song-form">

            <div class="flex">
                <!-- Catalog ID (read-only) -->
                <div class="form-group w-1/2 pr-2">
                  <label for="song_catalog_id">ID du catalogue</label>
                  <input
                    id="song_catalog_id"
                    :value="formData.song_catalog_id"
                    type="number"
                    disabled
                    class="form-input"
                  />
                </div>

                <!-- Status -->
                <div class="form-group w-1/2 pl-2">
                  <label for="song_status">Statut</label>
                  <select v-model.number="formData.song_status" id="song_status" class="form-input">
                    <option :value="0">0 - En projet</option>
                    <option :value="1">1 - En composition</option>
                    <option :value="2">2 - En finalisation</option>
                    <option :value="3">3 - Publié</option>
                    <option :value="4">4 - Sorti en album</option>
                  </select>
                </div>

            </div>


            <!-- Title (Required) -->
          <div class="form-group">
            <label for="song_title">Titre du chant *</label>
            <input
              id="song_title"
              v-model="formData.song_title"
              type="text"
              required
              placeholder="Ex: Amazing Grace"
              class="form-input" style="font-size:1.15em;"
            />
          </div>


          <!-- Collection Legacy -->
          <div class="form-group">
            <label for="song_collection_legacy">Collection</label>
            <input
              id="song_collection_legacy"
              v-model="formData.song_collection_legacy"
              type="text"
              placeholder="Ex: Hymnes et Cantiques"
              class="form-input"
            />
          </div>


          <div class="flex">

            <!-- Track Number -->
            <div class="form-group w-1/2 pr-2">
                <label for="song_track_number">Numéro de piste</label>
                <input
                id="song_track_number"
                v-model.number="formData.song_track_number"
                type="number"
                placeholder="Ex: 5"
                class="form-input"
                />
            </div>


            <!-- Duration -->
            <div class="form-group w-1/2 pl-2">
                <label for="song_duration_sec">Durée (secondes)</label>
                <input
                id="song_duration_sec"
                v-model.number="formData.song_duration_sec"
                type="number"
                placeholder="Ex: 180"
                class="form-input"
                />
            </div>

          </div>

          <div class="flex">

            <!-- Type Legacy -->
            <div class="form-group w-1/2 pr-2">
                <label for="song_type_legacy">Type de chant</label>
                <input
                id="song_type_legacy"
                v-model="formData.song_type_legacy"
                type="text"
                placeholder="Ex: Hymne, Cantique, Ballade"
                class="form-input"
                />
            </div>

            <!-- Origin Legacy -->
            <div class="form-group w-1/2 pl-2">
                <label for="song_origin_legacy">Origine</label>
                <input
                id="song_origin_legacy"
                v-model="formData.song_origin_legacy"
                type="text"
                placeholder="Ex: France, Occitanie"
                class="form-input"
                />
            </div>
          </div>

          <!-- Author Legacy -->
          <div class="form-group">
            <label for="song_author_legacy">Auteur</label>
            <input
              id="song_author_legacy"
              v-model="formData.song_author_legacy"
              type="text"
              placeholder="Ex: Pierre Dupont"
              class="form-input"
            />
          </div>

          <!-- Date Info -->
          <div class="form-group">
            <label for="song_date_info">Époque / Date</label>
            <input
              id="song_date_info"
              v-model="formData.song_date_info"
              type="text"
              placeholder="Ex: XIXe siècle, 1850"
              class="form-input"
            />
          </div>

          <div class="flex">
              <div class="form-group w-1/2 pr-2">
                <textarea
                id="song_description_fr"
                v-model="formData.song_description_fr"
                placeholder="Entrer la description courte en français ici"
                class="form-textarea"
                ></textarea>
            </div>

            <div class="form-group w-1/2 pl-2">
                <label for="song_description_en">Description EN</label>
                <textarea
                id="song_description_en"
                v-model="formData.song_description_en"
                placeholder="Enter short description in English here"
                class="form-textarea" style="font-style:italic;"
                ></textarea>
            </div>
          </div>

          <!-- YouTube Link -->
          <div class="form-group">
            <label for="song_youtube_link">Lien YouTube</label>
            <input
              id="song_youtube_link"
              v-model="formData.song_youtube_link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              class="form-input"
            />
          </div>

          <!-- Music Sheet Link -->
          <div class="form-group">
            <label for="song_musicsheet_link">Lien vers la partition</label>
            <input
              id="song_musicsheet_link"
              v-model="formData.song_musicsheet_link"
              type="url"
              placeholder="https://..."
              class="form-input"
            />
          </div>

          <!-- Comments / BIE Comments -->
          <div class="form-group">
            <label for="song_bie_comments">Commentaires</label>
            <textarea
              id="song_bie_comments"
              v-model="formData.song_bie_comments"
              rows="6"
              placeholder="Entrez les commentaires sur ce chant..."
              class="form-textarea"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary"
            >
              {{ isLoading ? 'Mise à jour en cours...' : 'Mettre à jour' }}
            </button>
            <router-link to="/admin" class="btn btn-secondary">Annuler</router-link>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const pageLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  song_catalog_id: null,
  song_title: '',
  song_status: 0,
  song_collection_legacy: '',
  song_track_number: null,
  song_duration_sec: null,
  song_bie_comments: '',
  song_type_legacy: '',
  song_origin_legacy: '',
  song_author_legacy: '',
  song_date_info: '',
  song_description_fr: '',
  song_description_en: '',
  song_youtube_link: '',
  song_musicsheet_link: ''
})

const fetchSongData = async () => {
  pageLoading.value = true
  errorMessage.value = ''

  try {
    const songId = parseInt(route.params.songId)
    if (!songId) throw new Error('Invalid song ID')

    const { data, error } = await supabase
      .from('bardsinexile_songs')
      .select('*')
      .eq('song_catalog_id', songId)
      .single()

    if (error) throw error

    if (data) {
      formData.value = {
        song_catalog_id: data.song_catalog_id || null,
        song_title: data.song_title || '',
        song_status: data.song_status ?? 0,
        song_collection_legacy: data.song_collection_legacy || '',
        song_track_number: data.song_track_number || null,
        song_duration_sec: data.song_duration_sec || null,
        song_bie_comments: data.song_bie_comments || '',
        song_type_legacy: data.song_type_legacy || '',
        song_origin_legacy: data.song_origin_legacy || '',
        song_author_legacy: data.song_author_legacy || '',
        song_date_info: data.song_date_info || '',
        song_description_fr: data.song_description_fr ?? '',
        song_description_en: data.song_description_en ?? '',
        song_youtube_link: data.song_youtube_link || '',
        song_musicsheet_link: data.song_musicsheet_link || ''
      }
    }
  } catch (error) {
    console.error('Error fetching song:', error)
    errorMessage.value = `Erreur lors du chargement: ${error.message}`
  } finally {
    pageLoading.value = false
  }
}

const submitForm = async () => {
  // Validate required field
  if (!formData.value.song_title.trim()) {
    errorMessage.value = 'Le titre du chant est obligatoire'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Prepare data for update (remove null values except for catalog_id)
    const dataToUpdate = {}
    for (const [key, value] of Object.entries(formData.value)) {
      if (key !== 'song_catalog_id') {
        if (key === 'song_description_fr' || key === 'song_description_en') {
          dataToUpdate[key] = value || null
        } else if (value !== null && value !== '') {
          dataToUpdate[key] = value
        } else if (value === null) {
          // Keep null to allow clearing values
          dataToUpdate[key] = null
        }
      }
    }

    const { error } = await supabase
      .from('bardsinexile_songs')
      .update(dataToUpdate)
      .eq('song_catalog_id', formData.value.song_catalog_id)

    if (error) throw error

    successMessage.value = 'Chant mis à jour avec succès'

    // Redirect to admin page after 1 second
    setTimeout(() => {
      router.push('/admin')
    }, 1000)
  } catch (error) {
    console.error('Error updating song:', error)
    errorMessage.value = `Erreur lors de la mise à jour: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Check authentication
  const { data } = await supabase.auth.getUser()
  if (!data?.user) {
    router.push('/bie-login')
    return
  }

  // Fetch song data
  await fetchSongData()
})
</script>

<style scoped>
.song-form-main {
  min-height: calc(100vh - 200px);
  background: var(--paper);
}

.song-form-container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
  padding: 40px 0;
}

.loading-state {
  text-align: center;
  padding: 60px 40px;
  font-size: 16px;
}

.song-form-header {
  margin-bottom: 40px;
}

.back-link {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--blue);
  text-decoration: none;
  font-size: 14px;
  transition: color 160ms ease;
}

.back-link:hover {
  color: var(--blue-dark);
}

.song-form-header h1 {
  margin-bottom: 0;
}

.song-form {
  background: white;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink);
}

.form-input,
.form-textarea {
  padding: 12px 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink);
  background: white;
  transition: border-color 160ms ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
}

.form-input:disabled {
  background: var(--paper-deep);
  color: rgb(34 34 34 / 50%);
  cursor: not-allowed;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgb(34 34 34 / 50%);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: var(--blue);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--blue-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--paper-deep);
  color: var(--ink);
  border: 1px solid var(--line);
}

.btn-secondary:hover {
  background: var(--line);
}

.error-message {
  margin-top: 20px;
  padding: 12px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  font-size: 14px;
}

.success-message {
  margin-top: 20px;
  padding: 12px 16px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 4px;
  color: #16a34a;
  font-size: 14px;
}

@media (max-width: 760px) {
  .song-form-container {
    width: calc(100% - 20px);
    padding: 20px 0;
  }

  .song-form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
