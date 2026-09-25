<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-content">
        <div class="footer-col">
          <h4>Explorez</h4>
          <nav>
            <a href="#chants">Tous les chants</a>
            <a href="#albums">Discographie</a>
            <a href="#partitions">Partitions</a>
          </nav>
        </div>

        <div class="footer-col">
          <h4>À propos</h4>
          <nav>
            <a href="#project">Le projet</a>
            <a href="#contact">Contact</a>
            <a href="#legal">Mentions légales</a>
          </nav>
        </div>

        <div class="footer-col">
          <h4>Ressources</h4>
          <nav>
            <a href="#community">Communauté</a>
            <a href="#blog">Blog</a>
            <a href="#social">Réseaux sociaux</a>
          </nav>
        </div>
      </div>

      <div class="copyright-bar">
        <p class="copyright">© Bards in Exile · Le chansonnier européen</p>
      </div>
    </div>
  </footer>
</template>

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
