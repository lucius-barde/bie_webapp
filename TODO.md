# TODO - Bards in Exile

## Tâches terminées ✓

### Étape 1 - Backend d'administration
- [x] Pages de login/logout avec Supabase Auth
- [x] Page AdminPage avec tableau de gestion des chants
  - [x] Options de tri (4 variantes)
  - [x] Couleurs de statut selon song_status
  - [x] Boutons Éditer/Supprimer
- [x] Formulaire SongCreatePage (création)
- [x] Formulaire SongEditPage (édition)
- [x] Lien "Connexion" dans le footer

### Étape 2 - Pages détail améliorées
- [x] Sections placeholder: Description, Paroles, Traductions, Sources
- [x] Layout 2 colonnes pour les infos (responsive)
- [x] Elements collapsibles pour traductions
- [x] Placeholder pour lien YouTube

## Tâches à venir

### Phase 3 - Contenu réel
- [ ] Implémenter l'édition des paroles (pour les admin)
- [ ] Implémenter l'édition des traductions
- [ ] Implémenter l'édition des sources
- [ ] Upload et galerie d'images
- [ ] Intégration du lecteur YouTube

### Phase 4 - Améliorations
- [ ] Recherche fulltext sur les chants
- [ ] Filtrage avancé (par origine, type, collection)
- [ ] Export en PDF/ePub
- [ ] Système de commentaires
- [ ] Favoris/signets utilisateurs

### Phase 5 - Maintenance
- [ ] Tests unitaires (Jest/Vitest)
- [ ] Tests e2e (Playwright/Cypress)
- [ ] Audit de performance
- [ ] Audit de sécurité (CSRF, XSS, etc.)

## Notes

- Les pages admin vérifient l'authentification au montage
- Le formulaire d'édition utilise `song_catalog_id` depuis la route
- Les couleurs de statut utilisent les classes Tailwind
- La suppression nécessite une confirmation via `confirm()`
