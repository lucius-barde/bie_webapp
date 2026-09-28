<template>
  <main>
    <div class="logout-container">
      <div class="logout-message">
        <p>Déconnexion en cours...</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

onMounted(async () => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Logout error:', error)
  }

  // Redirection vers l'accueil
  router.push('/')
})
</script>

<style scoped>
.logout-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.logout-message {
  text-align: center;
  padding: 40px;
  border-radius: 5px;
  background: rgb(200 230 201 / 20%);
  border: 1px solid rgb(76 175 80 / 30%);
}

.logout-message p {
  font-size: 16px;
  color: var(--ink);
  margin: 0;
}
</style>
