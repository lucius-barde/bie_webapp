<template>
  <main class="song-form-main">
    <div class="song-form-container">
      <!-- Loading State -->
      <div v-if="pageLoading" class="loading-state">
        Chargement de la parole...
      </div>

      <!-- Form -->
      <div v-else>
        <div class="song-form-header">
          <router-link to="/admin/lyrics" class="back-link">← Retour à la gestion des paroles</router-link>
          <h1>Modifier la parole</h1>
        </div>

        <form @submit.prevent="submitForm" class="song-form">

          <!-- Main Lyrics (Required) -->
          <div class="form-group">
            <label for="main_lyrics">Paroles principales *</label>
            <textarea
              id="main_lyrics"
              v-model="formData.main_lyrics"
              type="text"
              required
              placeholder="Entrez les paroles principales..."
              class="form-textarea"
              rows="12"
            ></textarea>
          </div>

          <!-- Main Language (Required) -->
          <div class="form-group">
            <label for="main_lyrics_language">Langue des paroles principales *</label>
            <select v-model="formData.main_lyrics_language" id="main_lyrics_language" class="form-input" required>
              <option value="">-- Sélectionner une langue --</option>
              <option value="fr">Français</option>
              <option value="fr-old">Ancien français</option>
              <option value="en">Anglais</option>
              <option value="en-old">Moyen anglais</option>
              <option value="de">Allemand</option>
              <option value="de-old">Moyen / Haut allemand</option>
              <option value="it">Italien</option>
              <option value="la">Latin</option>
              <option value="hu">Hongrois</option>
              <option value="ru">Russe</option>
              <option value="arp">Arpitan (patois, franco-provençal)</option>
              <option value="pho">Phonétique</option>
            </select>
          </div>

          <!-- Translation One -->
          <div class="form-group">
            <label for="translation_one">Traduction 1</label>
            <textarea
              id="translation_one"
              v-model="formData.translation_one"
              placeholder="Entrez la première traduction (optionnel)..."
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>

          <!-- Translation One Language -->
          <div class="form-group">
            <label for="translation_one_language">Langue de la traduction 1</label>
            <select v-model="formData.translation_one_language" id="translation_one_language" class="form-input">
              <option value="">-- Aucune (laisser vide si pas de traduction) --</option>
              <option value="fr">Français</option>
              <option value="fr-old">Ancien français</option>
              <option value="en">Anglais</option>
              <option value="en-old">Moyen anglais</option>
              <option value="de">Allemand</option>
              <option value="de-old">Moyen / Haut allemand</option>
              <option value="it">Italien</option>
              <option value="la">Latin</option>
              <option value="hu">Hongrois</option>
              <option value="ru">Russe</option>
              <option value="arp">Arpitan (patois, franco-provençal)</option>
              <option value="pho">Phonétique</option>
            </select>
          </div>

          <!-- Translation Two -->
          <div class="form-group">
            <label for="translation_two">Traduction 2</label>
            <textarea
              id="translation_two"
              v-model="formData.translation_two"
              placeholder="Entrez la deuxième traduction (optionnel)..."
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>

          <!-- Translation Two Language -->
          <div class="form-group">
            <label for="translation_two_language">Langue de la traduction 2</label>
            <select v-model="formData.translation_two_language" id="translation_two_language" class="form-input">
              <option value="">-- Aucune (laisser vide si pas de traduction) --</option>
              <option value="fr">Français</option>
              <option value="fr-old">Ancien français</option>
              <option value="en">Anglais</option>
              <option value="en-old">Moyen anglais</option>
              <option value="de">Allemand</option>
              <option value="de-old">Moyen / Haut allemand</option>
              <option value="it">Italien</option>
              <option value="la">Latin</option>
              <option value="hu">Hongrois</option>
              <option value="ru">Russe</option>
              <option value="arp">Arpitan (patois, franco-provençal)</option>
              <option value="pho">Phonétique</option>
            </select>
          </div>

          <!-- Translation Three -->
          <div class="form-group">
            <label for="translation_three">Traduction 3</label>
            <textarea
              id="translation_three"
              v-model="formData.translation_three"
              placeholder="Entrez la troisième traduction (optionnel)..."
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>

          <!-- Translation Three Language -->
          <div class="form-group">
            <label for="translation_three_language">Langue de la traduction 3</label>
            <select v-model="formData.translation_three_language" id="translation_three_language" class="form-input">
              <option value="">-- Aucune (laisser vide si pas de traduction) --</option>
              <option value="fr">Français</option>
              <option value="fr-old">Ancien français</option>
              <option value="en">Anglais</option>
              <option value="en-old">Moyen anglais</option>
              <option value="de">Allemand</option>
              <option value="de-old">Moyen / Haut allemand</option>
              <option value="it">Italien</option>
              <option value="la">Latin</option>
              <option value="hu">Hongrois</option>
              <option value="ru">Russe</option>
              <option value="arp">Arpitan (patois, franco-provençal)</option>
              <option value="pho">Phonétique</option>
            </select>
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
            <router-link to="/admin/lyrics" class="btn btn-secondary">Annuler</router-link>
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
  main_lyrics: '',
  main_lyrics_language: 'fr',
  translation_one: null,
  translation_one_language: null,
  translation_two: null,
  translation_two_language: null,
  translation_three: null,
  translation_three_language: null
})

const fetchLyricsData = async () => {
  pageLoading.value = true
  errorMessage.value = ''

  try {
    const lyricsId = route.params.lyricsId
    if (!lyricsId) throw new Error('Invalid lyrics ID')

    const { data, error } = await supabase
      .from('bardsinexile_lyrics')
      .select('*')
      .eq('id', lyricsId)
      .single()

    if (error) throw error

    if (data) {
      formData.value = {
        main_lyrics: data.main_lyrics || '',
        main_lyrics_language: data.main_lyrics_language || 'fr',
        translation_one: data.translation_one || null,
        translation_one_language: data.translation_one_language || null,
        translation_two: data.translation_two || null,
        translation_two_language: data.translation_two_language || null,
        translation_three: data.translation_three || null,
        translation_three_language: data.translation_three_language || null
      }
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error)
    errorMessage.value = `Erreur lors du chargement: ${error.message}`
  } finally {
    pageLoading.value = false
  }
}

const submitForm = async () => {
  // Validate required fields
  if (!formData.value.main_lyrics.trim()) {
    errorMessage.value = 'Les paroles principales sont obligatoires'
    return
  }

  if (!formData.value.main_lyrics_language) {
    errorMessage.value = 'La langue des paroles principales est obligatoire'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Prepare data for update
    const dataToUpdate = {
      main_lyrics: formData.value.main_lyrics,
      main_lyrics_language: formData.value.main_lyrics_language,
      translation_one: formData.value.translation_one || null,
      translation_one_language: formData.value.translation_one_language || null,
      translation_two: formData.value.translation_two || null,
      translation_two_language: formData.value.translation_two_language || null,
      translation_three: formData.value.translation_three || null,
      translation_three_language: formData.value.translation_three_language || null
    }

    const { error } = await supabase
      .from('bardsinexile_lyrics')
      .update(dataToUpdate)
      .eq('id', route.params.lyricsId)

    if (error) throw error

    successMessage.value = 'Parole mise à jour avec succès'

    // Redirect to admin page after 1 second
    setTimeout(() => {
      router.push('/admin/lyrics')
    }, 1000)
  } catch (error) {
    console.error('Error updating lyrics:', error)
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

  // Fetch lyrics data
  await fetchLyricsData()
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
  font-family: monospace;
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
