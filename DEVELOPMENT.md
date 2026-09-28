# Guide de Développement - Bards in Exile

## Architecture

### Frontend (Vue.js)

L'application utilise le modèle de composants Vue 3 avec le système de routage Vue Router v4.

#### Structure des composants

**Pages publiques:**
- **HomePage.vue** - Page d'accueil avec mise en avant des 3 derniers chants
- **SongsPage.vue** - Page de listing avec pagination (30 items/page)
- **SongDetailPage.vue** - Page détail avec métadonnées, descriptions, traductions et sources

**Pages admin (authentifiées):**
- **LoginPage.vue** - Formulaire de connexion Supabase
- **LogoutPage.vue** - Déconnexion et redirection vers l'accueil
- **AdminPage.vue** - Tableau de gestion des chants avec tri
- **SongCreatePage.vue** - Formulaire de création d'un chant
- **SongEditPage.vue** - Formulaire d'édition d'un chant

**Composants réutilisables:**
- **Header.vue** - Navigation principale (toutes les pages)
- **Footer.vue** - Pied de page avec liens et connexion (toutes les pages)

#### Logique partagée

La fonction `generateSlug()` est utilisée dans plusieurs composants pour convertir les titres en URLs:
- Conversion en minuscules
- Suppression des accents (normalization NFD)
- Remplacement des espaces et caractères spéciaux par des tirets

## Backend (Supabase)

### Connexion à la base de données

Le fichier `src/lib/supabase.js` initialise le client Supabase avec les variables d'environnement:

```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Les clés doivent être définies dans `.env.local`.

### Opérations CRUD sur les chants

#### Récupérer tous les chants

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  .order('song_catalog_id', { ascending: false })
  .range(offset, offset + 29)
```

#### Récupérer un chant spécifique

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .eq('song_catalog_id', catalogId)
  .single()
```

#### Créer un chant

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .insert([songData])
```

#### Modifier un chant

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .update(songData)
  .eq('song_catalog_id', songId)
```

#### Supprimer un chant

```javascript
const { error } = await supabase
  .from('bardsinexile_songs')
  .delete()
  .eq('song_catalog_id', songId)
```

## Routage

Les routes sont définies dans `src/router/index.js`:

**Routes publiques:**

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomePage | Accueil |
| `/musique` | SongsPage | Liste des chants (page 1) |
| `/musique/page/:page` | SongsPage | Pagination |
| `/musique/:songId-:slug` | SongDetailPage | Détail d'un chant |

**Routes admin (authentification requise):**

| Route | Composant | Description |
|-------|-----------|-------------|
| `/bie-login` | LoginPage | Connexion |
| `/bie-logout` | LogoutPage | Déconnexion |
| `/admin` | AdminPage | Dashboard avec tableau des chants |
| `/admin/song/create` | SongCreatePage | Créer un nouveau chant |
| `/admin/song/:songId/edit` | SongEditPage | Éditer un chant existant |

### Paramètres de route

- `songId`: Format `{catalog_id}-{generated-slug}` (ex: `12-ce-que-laino`)
- `page`: Numéro de page (ex: `2`)
- `slug`: Généré automatiquement à partir du titre

## Styles

### Variables CSS

Les variables CSS sont définies dans `:root` de `src/styles/globals.css`:

```css
--paper: #efe7dc          /* Couleur de fond */
--ink: #222222            /* Couleur du texte */
--blue: #2c5aa0           /* Primaire */
--blue-dark: #214478      /* Primaire foncée */
--paper-deep: #e4d8c9     /* Fond alternatif */
--line: #cdbfae           /* Bordures */
--serif: "Faculty Glyphic" /* Police serif */
--sans: "Lato"            /* Police sans-serif */
```

### Media Queries

L'application utilise des breakpoints personnalisés:
- `max-width: 760px` - Tablette
- `max-width: 520px` - Mobile

## Authentification Admin

L'authentification utilise Supabase Auth avec email/mot de passe.

**Flux de connexion:**
1. L'utilisateur accède à `/bie-login`
2. Connexion avec email/mot de passe via `supabase.auth.signInWithPassword()`
3. Redirection vers `/admin` après succès
4. Les pages admin vérifient `supabase.auth.getUser()` au montage
5. Redirection vers `/bie-login` si non authentifié

**Déconnexion:**
1. Lien "Connexion" dans le footer => `/bie-login` (si pas connecté)
2. Lien "Déconnexion" dans l'admin => `/bie-logout`
3. Déconnexion via `supabase.auth.signOut()` et redirection vers `/`

## Admin - Pages détails

### AdminPage.vue

Tableau de gestion avec colonnes:
- **Actions** - Éditer/Supprimer
- **ID** - Identifiant du chant
- **St.** - Statut (0-4)
- **Titre, Collection, N°, Durée, Commentaires, Type, Origine, Auteur, Date, Édité le**

Options de tri (boutons onglets):
- Tri par ID (ASC)
- Tri par ID inv. (DESC)  
- Tri par album (collection ASC, track ASC, ID ASC)
- Tri par statut (status DESC, ID ASC)

Couleurs des statuts (Tailwind):
- 0 = blanc (#fff)
- 1 = amber-100 (#fef3c7)
- 2 = red-100 (#fee2e2)
- 3 = lime-100 (#dcfce7)
- 4 = blue-100 (#dbeafe)

### SongDetailPage.vue

**Sections (avec placeholders):**
- **Description** - Bloc d'informations
- **Paroles** - Affichage des lyrics (.bie-lyrics)
- **Traductions** - Details collapsibles (Langue 1, Langue 2, etc.)
- **Sources** - Liens et références

**Layout:**
- Colonne gauche: Type, Auteur, Époque, Durée, Collection
- Colonne droite: Lien YouTube (placeholder)
- Responsive: 1 colonne sur mobile

### SongCreatePage.vue / SongEditPage.vue

Formulaires avec champs:
- **Obligatoire:** song_title
- **Modifiables:** song_catalog_id, song_status, song_collection_legacy, song_track_number, song_duration_sec, song_bie_comments, song_type_legacy, song_origin_legacy, song_author_legacy, song_date_info, song_youtube_link, song_musicsheet_link
- **Non modifiables:** song_sources, song_image_gallery, song_artist, uuid, created_at, edited_at

States de champ song_status:
- 0 = Brouillon
- 1 = À réviser
- 2 = Rejeté
- 3 = Publié
- 4 = En vedette

## Développement local

### Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5173` par défaut.

### Déboguer

1. Ouvrir les DevTools du navigateur (F12)
2. Utiliser l'extension Vue Devtools pour inspecter les composants
3. Consulter la console pour les logs d'erreur

### Hot Module Replacement (HMR)

Vite supporte le HMR automatique - les changements dans les fichiers `.vue` se reflètent immédiatement sans rechargement complet.

## Build et déploiement

### Build local

```bash
npm run build
npm run preview
```

### Déploiement sur Vercel

1. Créer un repository GitHub
2. Connecter Vercel au repository
3. Ajouter les variables d'environnement dans les paramètres Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel construit et déploie automatiquement

Configuration dans `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{
    "source": "/(.*)",
    "destination": "/index.html"
  }]
}
```

## Futures améliorations

- [ ] Recherche fulltext
- [ ] Filtrage par origine/type
- [ ] Favoris/signets
- [ ] Partage sur réseaux sociaux
- [ ] Lecteur audio intégré
- [ ] Commentaires/notes utilisateur
- [ ] Multilangues (EN, ES, DE, etc.)
- [ ] Gestion des sources et galerie d'images
- [ ] Édition des traductions et paroles
- [ ] Upload d'images pour la galerie

## Ressources

- [Vue.js Documentation](https://vuejs.org)
- [Vue Router](https://router.vuejs.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
