# Architecture - Bards in Exile

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    Utilisateur (Navigateur)             │
└─────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         Application Vue 3 (Vite)        │
        │                                         │
        ├─ /src                                  │
        │  ├─ App.vue (Racine)                  │
        │  ├─ main.js (Bootstrap)               │
        │  ├─ /components                       │
        │  │  ├─ Header.vue                     │
        │  │  └─ Footer.vue                     │
        │  ├─ /pages                            │
        │  │  ├─ HomePage.vue                   │
        │  │  ├─ SongsPage.vue                  │
        │  │  └─ SongDetailPage.vue             │
        │  ├─ /router (Vue Router)              │
        │  │  └─ index.js (Routes)              │
        │  ├─ /lib                              │
        │  │  └─ supabase.js (Client)           │
        │  └─ /styles                           │
        │     └─ globals.css (Tailwind + CSS)   │
        │                                         │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │       Supabase (Backend-as-a-Service)   │
        │                                         │
        ├─ PostgreSQL Database                  │
        │  └─ bardsinexile_songs (table)         │
        │                                         │
        └─────────────────────────────────────────┘
```

## Flux de données

```
1. Accueil (HomePage)
   └─ Supabase: SELECT * WHERE status >= 3 ORDER BY id DESC LIMIT 3
      └─ Affiche les 3 derniers chants

2. Liste des chants (SongsPage)
   └─ Supabase: SELECT * WHERE status >= 3 LIMIT 30 OFFSET x
      └─ Affiche 30 chants avec pagination

3. Détail d'un chant (SongDetailPage)
   └─ Parse l'URL: /musique/:id-:slug
   └─ Supabase: SELECT * WHERE catalog_id = id
      └─ Affiche le chant complet + navigation prev/next
```

## Structure des composants

```
App.vue (Racine)
├─ Header.vue (Réutilisable)
│  ├─ Logo + Navigation
│  └─ Bouton "Explorer"
├─ RouterView (Pages dynamiques)
│  ├─ HomePage.vue
│  │  ├─ Hero section
│  │  ├─ Features grid (3 cartes)
│  │  ├─ Latest songs grid (3 chants)
│  │  ├─ Countries list
│  │  └─ About section
│  │
│  ├─ SongsPage.vue
│  │  ├─ Hero simple
│  │  ├─ Chant grid (3 colonnes)
│  │  └─ Pagination
│  │
│  └─ SongDetailPage.vue
│     ├─ Hero avec image
│     ├─ Song infos
│     ├─ Description
│     ├─ Resources links
│     └─ Navigation prev/next
│
└─ Footer.vue (Réutilisable)
   ├─ Colonne 1: Explorez
   ├─ Colonne 2: À propos
   ├─ Colonne 3: Ressources
   └─ Copyright bar
```

## Routage

```
Vue Router (Frontend)
├─ / → HomePage
├─ /musique → SongsPage (page 1)
├─ /musique/page/:page → SongsPage
└─ /musique/:songId-:slug → SongDetailPage
```

## Intégration Supabase

```
src/lib/supabase.js
├─ Initialise le client avec env vars
│  ├─ VITE_SUPABASE_URL
│  └─ VITE_SUPABASE_ANON_KEY
└─ Exporte: const supabase = createClient(...)

Utilisation dans les pages:
import { supabase } from '../lib/supabase'

const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  ...
```

## Styles et variables CSS

```
src/styles/globals.css
├─ Variables CSS (dans :root)
│  ├─ Couleurs: --paper, --ink, --blue, --blue-dark, etc.
│  ├─ Typographies: --serif, --sans
│  └─ Dimensions: --content-width
│
├─ Tailwind CSS (reset + utilities)
├─ Global styles (reset HTML5)
└─ Component styles (scoped dans .vue)
```

## Build et déploiement

```
npm run dev
└─ Vite dev server + HMR
   └─ http://localhost:5173

npm run build
├─ Vite build
│  ├─ Minification
│  ├─ Tree-shaking
│  └─ Code splitting
└─ Output: dist/
   ├─ index.html
   ├─ assets/index-*.css
   └─ assets/index-*.js

Vercel Deployment
├─ Git push → Vercel webhook
├─ npm run build
├─ Upload to CDN
└─ https://your-domain.vercel.app
```

## Responsive Design

```
Desktop (≥ 761px)
├─ Header: Flex row
├─ Grids: 3 colonnes
├─ About: 2 colonnes (1.3fr 0.7fr)
└─ Footer: 3 colonnes

Tablet (761px > x ≥ 521px)
├─ Header: Flex column
├─ Grids: 2 colonnes
├─ About: 1 colonne
└─ Footer: 1 colonne

Mobile (< 521px)
├─ Header: Flex column, full-width
├─ Grids: 1 colonne
├─ About: 1 colonne
└─ Footer: 1 colonne vertical
```

## Performance

```
Build outputs:
├─ index.html (0.43 kB gzip: 0.30 kB)
├─ index-*.css (22.07 kB gzip: 4.65 kB)
└─ index-*.js (336.73 kB gzip: 99.65 kB)

Optimizations:
├─ Vue 3 (plus petit, plus rapide)
├─ Vite (bundler moderne)
├─ Tailwind (CSS purging)
├─ Code splitting (par route)
├─ Image lazy loading
└─ Placeholder rotation
```

## Flux de recherche de chanson

```
URL: /musique/12-ce-que-laino

1. Vue Router parse l'URL
   ├─ songId = "12-ce-que-laino"
   ├─ Extract: catalogId = 12
   └─ Extract: slug = "ce-que-laino"

2. SongDetailPage monte
   ├─ Fetch: SELECT * WHERE song_catalog_id = 12
   ├─ Fetch: Previous song (id < 12)
   ├─ Fetch: Next song (id > 12)
   └─ Display song + navigation

3. Navigation
   ├─ Click "Chanson précédente"
   │  └─ Router.push('/musique/11-...')
   └─ Click "Chanson suivante"
      └─ Router.push('/musique/13-...')
```

## Cycle de vie d'une page

```
1. Composant monté (onMounted)
   └─ Supabase fetch
      └─ Loading = true

2. Données reçues
   └─ Mise à jour state
   └─ Loading = false

3. Rendu Vue
   └─ Template compile
   └─ Affichage utilisateur

4. Changement de route
   └─ Composant démonté
   └─ Nouveau composant monté
   └─ Boucle au point 1
```

## Security

```
Publique (sans authentification):
├─ Lectures des chants (song_status >= 3)
└─ Lectures des métadonnées

Sécurisé (avec authentification):
├─ Créations de chants
├─ Modifications
└─ Suppressions

.env.local
└─ NON committée (.gitignore)
└─ Clé Supabase limitée en permissions
```

## Stack technologique

```
Frontend
├─ Vue 3.3.8 (Framework)
├─ Vue Router 4.2.5 (Routage)
├─ Vite 5.0.8 (Build tool)
├─ Tailwind CSS 3.3.6 (Styles)
└─ PostCSS 8.4.32 (Autoprefixer)

Backend
├─ Supabase (Backend-as-a-Service)
├─ PostgreSQL (Database)
└─ API REST

Deployment
├─ Vercel (Hosting)
└─ GitHub (Repository)
```

## Fichiers clés

```
Root
├─ index.html ← Point d'entrée
├─ package.json ← Dépendances
├─ vite.config.js ← Config build
├─ tailwind.config.js ← Config styles
├─ postcss.config.js ← Config PostCSS
├─ vercel.json ← Config déploiement
└─ .gitignore ← Files to ignore

src/
├─ main.js ← Bootstrap Vue
├─ App.vue ← Root component
├─ components/ ← Réutilisables
├─ pages/ ← Routes
├─ router/ ← Configuration routes
├─ styles/ ← CSS global
└─ lib/ ← Utilities (Supabase)
```

## Évolution future

```
Phase 2: Recherche et filtres
├─ Backend API
├─ Recherche fulltext
├─ Filtres par pays/type/époque
└─ Cache côté client

Phase 3: Authentification
├─ Supabase Auth
├─ Profil utilisateur
├─ Favoris
└─ Historique

Phase 4: Features avancées
├─ Lecteur audio
├─ Affichage paroles
├─ Traductions
├─ Partage social
└─ Commentaires

Phase 5: Optimisations
├─ SEO (Nuxt?)
├─ SSR
├─ PWA
└─ Mobile app
```
