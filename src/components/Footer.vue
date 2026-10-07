<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-content">
        <div class="footer-col">
          <h4>Explorez</h4>
          <nav>
            <router-link to="/musique">Tous les chants</router-link>
            <a href="https://linktr.ee/bardsinexile" target="_blank" rel="noopener noreferrer">Discographie</a>
            <router-link to="/partitions-chants-folk">Partitions</router-link>
          </nav>
        </div>

        <div class="footer-col">
          <h4>À propos</h4>
          <nav>
            <router-link to="/le-projet">Le projet</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/liens">Liens et sources</router-link>
          </nav>
        </div>

        <div class="footer-col">
          <h4>Réseaux sociaux</h4>
          <nav>
            <a href="https://www.youtube.com/@bardsinexile" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://t.me/bardsinexile" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href="https://x.com/bardsinexile" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="https://linktr.ee/bardsinexile" target="_blank" rel="noopener noreferrer">Linktr.ee</a>
          </nav>
        </div>
      </div>

      <div class="copyright-bar">
        <p class="copyright">
          © Bards in Exile · Le chansonnier européen
          <span class="auth-info">
            <template v-if="user">
              Connecté: {{ user.email }} - <a href="/bie-logout" class="logout-link">Déconnexion</a>
            </template>
            <template v-else>
              <a href="/bie-login" class="login-link">Connexion</a>
            </template>
          </span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'

const user = ref(null)
let unsubscribe = null

onMounted(async () => {
  // Get current session
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
  }

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      user.value = session.user
    } else {
      user.value = null
    }
  })
  
  unsubscribe = subscription.unsubscribe
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.site-footer {
  padding-block: 28px;
  color: var(--paper);
  background: #214478;
}

.container {
  width: min(var(--content-width), calc(100% - 40px));
  margin-inline: auto;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-col nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col a {
  color: var(--paper);
  text-decoration: none;
  font-size: 13px;
}

.footer-col a:hover {
  text-decoration: underline;
}

.copyright-bar {
  padding-top: 20px;
  border-top: 1px solid rgba(239, 231, 220, 0.2);
}

.copyright {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.auth-info {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.login-link,
.logout-link {
  color: var(--paper);
  text-decoration: none;
  transition: opacity 160ms ease;
}

.login-link:hover,
.logout-link:hover {
  opacity: 0.7;
}

@media (max-width: 760px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .footer-col {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .footer-col h4 {
    margin: 0;
    min-width: 100px;
  }

  .footer-col nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .copyright {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-col {
    flex-direction: column;
  }

  .footer-col nav {
    flex-direction: column;
  }
}
</style>
