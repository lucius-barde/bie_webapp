# Changelog - Bards in Exile

## [2.0.0] - 2024-12-15 - Ajout du système d'admin

### Ajout

#### Pages publiques
- **SongDetailPage.vue** - Sections placeholder pour Description, Paroles, Traductions et Sources
  - Layout 2 colonnes pour les infos: type/auteur/époque/durée/collection à gauche, lien YouTube à droite
  - Responsive: 1 colonne sur mobile
  - Elements collapsibles pour les traductions

#### Pages d'authentification
- **LoginPage.vue** - Formulaire de connexion avec email/mot de passe
  - Intégration Supabase Auth
  - Gestion des erreurs et états de chargement
  - Redirection vers /admin après connexion réussie

- **LogoutPage.vue** - Page de déconnexion
  - Appel à `supabase.auth.signOut()`
  - Redirection vers l'accueil

#### Pages d'administration
- **AdminPage.vue** - Dashboard de gestion des chants
  - Tableau avec toutes les métadonnées des chants
  - 4 options de tri: par ID, par ID inversé, par album, par statut
  - Couleurs des lignes selon le statut (0=blanc, 1=amber, 2=red, 3=lime, 4=blue)
  - Boutons Éditer/Supprimer pour chaque chant
  - Bouton "Nouveau chant"
  - Vérification d'authentification obligatoire

- **SongCreatePage.vue** - Formulaire de création d'un chant
  - Tous les champs modifiables sauf song_sources, song_image_gallery, song_artist, uuid, created_at, edited_at
  - Champ song_title obligatoire
  - Validation et gestion d'erreurs
  - Redirection vers /admin après création

- **SongEditPage.vue** - Formulaire d'édition d'un chant
  - Même formulaire que le create, pré-rempli avec les données existantes
  - Champ song_catalog_id en lecture seule
  - Redirection vers /admin après modification

#### Composants
- **Footer.vue** - Ajout d'un lien "Connexion" vers /bie-login

#### Routage (src/router/index.js)
- `/bie-login` → LoginPage
- `/bie-logout` → LogoutPage
- `/admin` → AdminPage (auth required)
- `/admin/song/create` → SongCreatePage (auth required)
- `/admin/song/:songId/edit` → SongEditPage (auth required)

### Modification

- **SongDetailPage.vue** - Restructuration de la section info en 2 colonnes
- **DEVELOPMENT.md** - Documentation complète des nouvelles pages et routes

### Sécurité

- Authentification obligatoire pour les routes `/admin/*`
- Redirection vers `/bie-login` si utilisateur non authentifié
- Suppression de chants nécessite confirmation

## [1.0.0] - Initial Release

### Ajout
- Structure Vue.js + Supabase
- Pages publiques: HomePage, SongsPage, SongDetailPage
- Routage avec Vue Router
- Pagination (30 items par page)
- Responsive design (mobile-first)
- Integration Supabase pour les lectures
- Footer et Header réutilisables
