# Documentation Base de Données - Bards in Exile

## Table `bardsinexile_songs`

### Schéma

```sql
CREATE TABLE public.bardsinexile_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_catalog_id INTEGER NOT NULL UNIQUE,
  song_status INTEGER NOT NULL DEFAULT 0 (CHECK: 0-4),
  song_title TEXT NOT NULL,
  song_track_number INTEGER,
  song_duration_sec INTEGER,
  song_bie_comments TEXT,
  song_origin_legacy TEXT,
  song_type_legacy TEXT,
  song_author_legacy TEXT,
  song_date_info TEXT,
  song_youtube_link TEXT,
  song_musicsheet_link TEXT,
  song_sources JSONB DEFAULT '[]'::jsonb,
  song_image_gallery TEXT[] DEFAULT '{}'::text[],
  song_artist TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  song_collection_legacy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Champs importants

#### Identifiants
- **id** - UUID unique généré automatiquement
- **song_catalog_id** - Numéro de catalogue unique (utilisé dans les URLs)

#### Statut
- **song_status** - Niveau de publication (0-4)
  - 0: Brouillon
  - 1: En révision
  - 2: En attente
  - 3: Publié
  - 4: Archivé
  
  **Filtre utilisé**: `song_status >= 3` (publié et archivé)

#### Contenu
- **song_title** - Titre du chant (utilisé pour générer le slug)
- **song_origin_legacy** - Origine du chant (pays/région)
- **song_type_legacy** - Type de chant (folk, médiéval, militaire, etc.)
- **song_artist** - Artiste ou interprète principal
- **song_author_legacy** - Auteur ou compositeur
- **song_date_info** - Époque ou date du chant
- **song_bie_comments** - Description/notes sur le chant
- **song_collection_legacy** - Collection à laquelle appartient le chant

#### Ressources
- **song_track_number** - Numéro de piste
- **song_duration_sec** - Durée en secondes
- **song_youtube_link** - Lien vers une vidéo YouTube
- **song_musicsheet_link** - Lien vers une partition
- **song_sources** - JSON array de sources (ouvrages, références)
- **song_image_gallery** - Array d'URLs d'images supplémentaires

#### Métadonnées
- **author_id** - UUID de l'utilisateur qui a créé/édité
- **created_at** - Timestamp de création
- **edited_at** - Timestamp de la dernière modification

## Requêtes courantes

### Récupérer tous les chants publiés

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  .order('song_catalog_id', { ascending: false })
```

### Récupérer une page (pagination)

```javascript
const LIMIT = 30
const page = 1
const offset = (page - 1) * LIMIT

const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  .order('song_catalog_id', { ascending: false })
  .range(offset, offset + LIMIT - 1)
```

### Compter les chants

```javascript
const { count, error } = await supabase
  .from('bardsinexile_songs')
  .select('*', { count: 'exact', head: true })
  .gte('song_status', 3)
```

### Récupérer un chant spécifique

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .eq('song_catalog_id', catalogId)
  .gte('song_status', 3)
  .single()
```

### Chercher par titre

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  .ilike('song_title', `%${searchTerm}%`)
```

### Filtrer par origine

```javascript
const { data, error } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gte('song_status', 3)
  .ilike('song_origin_legacy', '%France%')
```

### Obtenir les chants précédent et suivant

```javascript
// Chant précédent (catalog_id < currentId)
const { data: prevData } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .lt('song_catalog_id', currentCatalogId)
  .gte('song_status', 3)
  .order('song_catalog_id', { ascending: false })
  .limit(1)
  .single()

// Chant suivant (catalog_id > currentId)
const { data: nextData } = await supabase
  .from('bardsinexile_songs')
  .select('*')
  .gt('song_catalog_id', currentCatalogId)
  .gte('song_status', 3)
  .order('song_catalog_id', { ascending: true })
  .limit(1)
  .single()
```

## Exemples de données

### Exemple minimal

```json
{
  "song_catalog_id": 1,
  "song_status": 3,
  "song_title": "Chanson de l'Oignon",
  "song_origin_legacy": "France",
  "song_type_legacy": "Chant militaire"
}
```

### Exemple complet

```json
{
  "song_catalog_id": 42,
  "song_status": 3,
  "song_title": "De la gençor qu'om vey",
  "song_track_number": 5,
  "song_duration_sec": 245,
  "song_bie_comments": "Un chant médiéval remarquable du troubadour Berenguer de Palou.",
  "song_origin_legacy": "Catalogne",
  "song_type_legacy": "Chant médiéval",
  "song_author_legacy": "Berenguer de Palou",
  "song_date_info": "XIIe-XIIIe siècle",
  "song_youtube_link": "https://youtube.com/...",
  "song_musicsheet_link": "https://example.com/partition.pdf",
  "song_artist": "Bards in Exile",
  "song_collection_legacy": "Troubadours de Catalogne",
  "song_sources": [
    "Chansonnier de Nostre Dame",
    "Corpus des troubadours"
  ],
  "song_image_gallery": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

## Génération de slug

Le slug est généré côté frontend à partir du `song_title`:

```javascript
function generateSlug(title) {
  return title
    .toLowerCase()                    // Minuscules
    .normalize('NFD')                 // Normaliser les caractères accentués
    .replace(/[\u0300-\u036f]/g, '')  // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')      // Remplacer les espaces/caractères par tirets
    .replace(/(^-|-$)/g, '')          // Supprimer tirets au début/fin
}
```

### Exemples

| Titre | URL |
|-------|-----|
| Chanson de l'Oignon | 1-chanson-de-loignon |
| De la gençor qu'om vey | 42-de-la-gencor-quom-vey |
| L'Odeur du Foin | 5-lodeur-du-foin |
| Cé qu'ê l'ainô | 12-ce-que-laino |

## Politique d'accès Supabase

### Règles de sécurité recommandées

```sql
-- Permettre la lecture des chants publiés
CREATE POLICY "Anyone can read published songs"
ON bardsinexile_songs
FOR SELECT
USING (song_status >= 3);

-- Permettre la modification seulement aux auteurs
CREATE POLICY "Authors can update their own songs"
ON bardsinexile_songs
FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Permettre la création seulement aux utilisateurs connectés
CREATE POLICY "Authenticated users can create"
ON bardsinexile_songs
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

## Performances et indexation

### Index recommandés

```sql
-- Pour le filtrage par statut
CREATE INDEX idx_song_status ON bardsinexile_songs(song_status);

-- Pour les ordres
CREATE INDEX idx_song_catalog_id ON bardsinexile_songs(song_catalog_id DESC);

-- Pour les recherches fulltext (future)
CREATE INDEX idx_song_title_trgm ON bardsinexile_songs USING gin(song_title gin_trgm_ops);
```

## Migrations futures

- [ ] Ajouter des tables pour les commentaires utilisateur
- [ ] Ajouter une table d'authentification utilisateur
- [ ] Ajouter des tables pour les favoris
- [ ] Ajouter des tables pour les traductions
- [ ] Ajouter une table d'analytics/vues
