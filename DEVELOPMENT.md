# Guide de Développement - Bards in Exile

## Architecture

### Frontend (Vue.js)

L'application utilise le modèle de composants Vue 3 avec le système de routage Vue Router v4.

#### Structure des composants

- **Header.vue** - Composant réutilisable affichant la navigation principale
- **Footer.vue** - Composant réutilisable avec 3 colonnes de liens
- **HomePage.vue** - Page d'accueil avec mise en avant des 3 derniers chants
- **SongsPage.vue** - Page de listing avec pagination (30 items/page)
- **SongDetailPage.vue** - Page détail avec tous les métadonnées et ressources

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

### Requêtes courantes

#### Récupérer les chants

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)           // Filtrer par statut
  .order('song_catalog_id', { ascending: false })
  .range(offset, offset + 29)      // Pagination
```

#### Récupérer un chant spécifique

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .eq('song_catalog_id', catalogId)
  .single()  // Retourne un seul objet
```

#### Compter les résultats

```javascript
const { count } = await supabase
  .from('bardsinexile_songs')
  .select('*', { count: 'exact', head: true })
  .gte('song_status', 3)
```

## Routage

Les routes sont définies dans `src/router/index.js`:

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomePage | Accueil |
| `/musique` | SongsPage | Liste des chants (page 1) |
| `/musique/page/:page` | SongsPage | Pagination |
| `/musique/:songId-:slug` | SongDetailPage | Détail d'un chant |

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

## Performance

### Optimisations

1. **Images lazy loading** - Attribut `loading="lazy"` sur les images
2. **Placeholder images** - Rotation entre 3 images Unsplash
3. **Pagination** - Limitation à 30 items par page
4. **Build Vite** - Tree-shaking et minification

### Bundle Size

La build production génère:
- `index.html` - ~0.43 kB
- `index-*.css` - ~22.07 kB (gzipped: 4.65 kB)
- `index-*.js` - ~336.73 kB (gzipped: 99.65 kB)

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
3. Ajouter les variables d'environnement dans les paramètres Vercel
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
- [ ] Système d'authentification utilisateur
- [ ] Favoris/signets
- [ ] Partage sur réseaux sociaux
- [ ] Lecteur audio intégré
- [ ] Commentaires/notes utilisateur
- [ ] Multilangues (EN, ES, DE, etc.)

## Ressources

- [Vue.js Documentation](https://vuejs.org)
- [Vue Router](https://router.vuejs.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
