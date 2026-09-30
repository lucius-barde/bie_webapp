<template>
  <main class="song-form-main">
    <div class="song-form-container">
      <div v-if="pageLoading" class="loading-state">
        Chargement de la parole...
      </div>

      <div v-else>
        <div class="song-form-header">
          <router-link to="/admin/lyrics" class="back-link">← Retour à la gestion des paroles</router-link>
          <h1>Modifier la parole</h1>
        </div>

        <form @submit.prevent="submitForm" class="song-form">
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

          <div class="form-group">
            <label for="main_lyrics_language">Langue des paroles principales *</label>
            <select v-model="formData.main_lyrics_language" id="main_lyrics_language" class="form-input" required>
              <option value="">-- Sélectionner une langue --</option>
              <option v-for="language in lyricLanguages" :key="language.code" :value="language.code">
                {{ language.name }}
              </option>
            </select>
          </div>

          <div v-for="(translation, index) in translations" :key="translation.textField">
            <div class="form-group">
              <label :for="translation.textField">Traduction {{ index + 1 }}</label>
              <textarea
                :id="translation.textField"
                v-model="formData[translation.textField]"
                :placeholder="`Entrez la ${index === 0 ? 'première' : index === 1 ? 'deuxième' : 'troisième'} traduction (optionnel)...`"
                class="form-textarea"
                rows="8"
              ></textarea>
            </div>

            <div class="form-group">
              <label :for="translation.languageField">Langue de la traduction {{ index + 1 }}</label>
              <select v-model="formData[translation.languageField]" :id="translation.languageField" class="form-input">
                <option value="">-- Aucune (laisser vide si pas de traduction) --</option>
                <option v-for="language in lyricLanguages" :key="language.code" :value="language.code">
                  {{ language.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="isLoading" class="btn btn-primary">
              {{ isLoading ? 'Mise à jour en cours...' : 'Mettre à jour' }}
            </button>
            <router-link to="/admin/lyrics" class="btn btn-secondary">Annuler</router-link>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

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
import { lyricLanguages } from '../lib/languages'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const pageLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const translations = [
  { textField: 'translation_one', languageField: 'translation_one_language' },
  { textField: 'translation_two', languageField: 'translation_two_language' },
  { textField: 'translation_three', languageField: 'translation_three_language' },
]

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
  const { data } = await supabase.auth.getUser()
  if (!data?.user) {
    router.push('/admin/login')
    return
  }
  fetchLyricsData()
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
  padding: 60px 40px;
  font-size: 16px;
  text-align: center;
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
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: white;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.form-group label {
  margin-bottom: 8px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
}

.form-input,
.form-textarea {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink);
  background: white;
  font-family: var(--sans);
  font-size: 14px;
  transition: border-color 160ms ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 160ms ease;
}

.btn-primary {
  color: white;
  background: var(--blue);
}

.btn-primary:hover:not(:disabled) {
  background: var(--blue-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  color: var(--ink);
  background: var(--paper-deep);
  border: 1px solid var(--line);
}

.btn-secondary:hover {
  background: var(--line);
}

.error-message,
.success-message {
  margin-top: 20px;
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
}

.error-message {
  color: #dc2626;
  background: #fee2e2;
  border-color: #fecaca;
}

.success-message {
  color: #16a34a;
  background: #dcfce7;
  border-color: #86efac;
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
