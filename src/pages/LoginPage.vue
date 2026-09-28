<template>
  <main>
    <div class="login-container">
      <div class="login-panel">
        <h1>Connexion - Bards in Exile</h1>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="isLoading"
            >
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="submit-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Connexion en cours...</span>
            <span v-else>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message || 'Erreur lors de la connexion'
      isLoading.value = false
      return
    }

    // Connexion réussie, rediriger vers /admin
    router.push('/admin')
  } catch (err) {
    errorMessage.value = 'Une erreur inattendue s\'est produite'
    console.error('Login error:', err)
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.login-panel {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--paper);
}

.login-panel h1 {
  margin-bottom: 32px;
  text-align: center;
  font-size: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  min-height: 42px;
  padding: 10px 15px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink);
  background: var(--paper);
  font: 15px var(--sans);
  font-size: 16px;
  transition: border-color 160ms ease;
}

.form-group input:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
  border-color: var(--blue);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  border-radius: 4px;
  background-color: #fee;
  color: #c33;
  font-size: 14px;
  border: 1px solid #fcc;
}

.submit-button {
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: #fff;
  background: var(--blue);
  font: 600 14px var(--sans);
  text-align: center;
  transition: background-color 160ms ease, border-color 160ms ease;
  cursor: pointer;
  margin-top: 12px;
}

.submit-button:hover:not(:disabled),
.submit-button:active:not(:disabled) {
  border-color: var(--blue-dark);
  background: var(--blue-dark);
  color: #fff;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .login-container {
    min-height: auto;
    padding: 20px;
  }

  .login-panel {
    padding: 24px;
  }

  .login-panel h1 {
    font-size: 20px;
    margin-bottom: 24px;
  }
}
</style>
