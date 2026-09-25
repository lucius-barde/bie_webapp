# Bards in Exile - Application Web

Une application web moderne pour explorer un répertoire de chants folk, médiévaux et traditionnels d'Europe.

## 🚀 Technologies

- **Vue.js 3** - Framework JavaScript progressif
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend et base de données
- **Vue Router** - Routage côté client
- **Vercel** - Plateforme de déploiement

## 📋 Prérequis

- Node.js 16+ et npm

## 🔧 Installation

```bash
# Installer les dépendances
npm install
```

## 🌐 Configuration Supabase

Créer un fichier `.env.local` à la racine du projet avec les variables d'environnement:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Ces informations sont disponibles dans votre dashboard Supabase.

## 💻 Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible à `http://localhost:5173` (ou le port disponible suivant).

## 🏗️ Build

```bash
# Construire pour la production
npm run build

# Prévisualiser la build
npm run preview
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── Header.vue       # En-tête avec navigation
│   └── Footer.vue       # Pied de page avec 3 colonnes
├── pages/
│   ├── HomePage.vue         # Page d'accueil
│   ├── SongsPage.vue        # Liste des chants (avec pagination)
│   └── SongDetailPage.vue   # Détail d'un chant
├── lib/
│   └── supabase.js     # Client Supabase
├── router/
│   └── index.js         # Configuration des routes
├── styles/
│   └── globals.css      # Styles globaux et variables CSS
├── main.js              # Point d'entrée Vue
└── App.vue              # Composant racine
```

## 🛣️ Routes disponibles

- `/` - Page d'accueil avec sélection des 3 derniers chants
- `/musique` - Liste complète des chants (page 1)
- `/musique/page/:page` - Pagination (30 chants par page)
- `/musique/:songId-:slug` - Détail d'un chant

## 🎨 Design

Le design s'inspire du mockup fourni et respecte les variables CSS suivantes:

- `--paper`: Couleur de fond (#efe7dc)
- `--ink`: Couleur du texte (#222222)
- `--blue`: Couleur primaire (#2c5aa0)
- `--blue-dark`: Couleur primaire foncée (#214478)
- `--serif`: Police serif (Faculty Glyphic)
- `--sans`: Police sans-serif (Lato)

## 🚢 Déploiement Vercel

1. Connecter le repository GitHub à Vercel
2. Ajouter les variables d'environnement:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel construira et déploiera automatiquement

## 🔒 Données de la base de données

La table `bardsinexile_songs` contient les chants avec les champs:

- `song_catalog_id` - Identifiant unique du chant
- `song_status` - Statut (0-4, filtré >= 3)
- `song_title` - Titre du chant
- `song_origin_legacy` - Origine/pays du chant
- `song_type_legacy` - Type de chant
- `song_artist` - Artiste
- `song_author_legacy` - Auteur
- `song_date_info` - Époque/date
- `song_duration_sec` - Durée en secondes
- `song_youtube_link` - Lien YouTube
- `song_musicsheet_link` - Lien vers la partition
- `song_bie_comments` - Commentaires/description
- `song_collection_legacy` - Collection

## 📝 Notes

- Les slug d'URL sont générés automatiquement à partir du titre du chant (minuscules, accents supprimés, espaces remplacés par des tirets)
- Les images des chants utilisent des placeholders Unsplash en attendant des images réelles
- La pagination est basée sur des offsets (30 chants par page)
- Responsive design optimisé pour mobile, tablette et desktop

## 📄 Licence

© Bards in Exile · Le chansonnier européen
