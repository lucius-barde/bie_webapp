# Multilingue Setup - Bards in Exile

## Vue d'ensemble

Le site supporte maintenant 3 langues : **Français** (fr), **Anglais** (en) et **Allemand** (de).

## Architecture

### 1. Structure des traductions

Les traductions sont stockées dans `src/locales/` en format JSON :
- `src/locales/fr.json` - Traductions françaises
- `src/locales/en.json` - Traductions anglaises
- `src/locales/de.json` - Traductions allemandes

### 2. Utilitaires i18n

**`src/lib/i18n.js`** :
- `getTranslation(key, locale)` - Récupère une traduction avec notation pointée
- `getLocaleTranslations(locale)` - Retourne l'objet complet de traductions
- `supportedLocales` - Array des locales supportées
- `defaultLocale` - Locale par défaut (fr)

### 3. Composable Vue

**`src/composables/useLocale.js`** :
```javascript
const { locale, t, translations, getLocales, isCurrentLocale } = useLocale()
```

Propriétés :
- `locale` : Locale actuelle détectée depuis la route
- `t(key)` : Fonction de traduction
- `translations` : Objet de traductions pour la locale actuelle
- `getLocales()` : Array des locales supportées
- `isCurrentLocale(loc)` : Vérifie si une locale est active

### 4. Routage multilingue

Routes structurées avec préfixes de langue :

**Français** (par défaut) :
- `/` → HomePage FR
- `/musique` → SongsPage FR
- `/musique/:songId-:slug` → SongDetailPage FR
- `/fr/musique` → SongsPage FR (version explicite)

**Anglais** :
- `/en` → HomePage EN
- `/en/music` → SongsPage EN
- `/en/music/:songId-:slug` → SongDetailPage EN

**Allemand** :
- `/de` → HomePage DE
- `/de/musik` → SongsPage DE
- `/de/musik/:songId-:slug` → SongDetailPage DE

**Rétrocompatibilité** :
- Les URLs legacy `/musique/*` restent accessibles et fonctionnent en français

### 5. Composant LanguageSwitcher

**`src/components/LanguageSwitcher.vue`** :
- Affiche un sélecteur de langue dans le Header
- Bascule entre les locales
- Adapte automatiquement le chemin selon la langue

## Utilisation dans les composants

### Exemple basique :
```vue
<script setup>
import { useLocale } from '../composables/useLocale'

const { t, locale } = useLocale()
</script>

<template>
  <h1>{{ t('common.home') }}</h1>
  <p v-if="locale === 'fr'">Texte français seulement</p>
</template>
```

### Traduction de champs dynamiques :
```javascript
import { getSongTypeTranslation } from '../lib/songTypes'
import { getLanguageName } from '../lib/languages'

const typeTranslated = getSongTypeTranslation(song.song_type_legacy, locale.value)
const langName = getLanguageName('de', locale.value) // "Allemand" en FR, "German" en EN, etc.
```

## Traductions des métadonnées

### Types de chants (`song_type_legacy`)

**`src/lib/songTypes.js`** contient les traductions pour :
- Chant traditionnel
- Chanson médiévale
- Chant de marins
- Chanson à boire
- Chanson à texte d'héroïque-fantaisie
- Chant militaire
- Chant de type hymne
- Chant de la Renaissance
- Composition instrumentale
- Chant populaire
- Mélodie traditionnelle instrumentale
- Chant néofolk
- Chant polyphonique
- Chant ancien
- Chant contemporain
- Chanson de fête
- Chant de randonneurs
- Chant néo-médiéval
- Chant satirique ou burlesque
- Arrangement moderne d'un chant ancien
- Chant de travail

Pour les types non reconnus, affiche "Autre" (FR), "Other" (EN), "Sonstige" (DE).

### Langues des paroles (`lyricLanguages`)

**`src/lib/languages.js`** contient les traductions pour 38 langues/codes de paroles :
- Allemand / German / Deutsch
- Anglais / English / Englisch
- Français / French / Französisch
- Et bien d'autres...

Format : `"fr:...|en:...|de:..."`

## Description des chansons

- `song_description_fr` - Affichée quand `locale === 'fr'`
- `song_description_en` - Affichée quand `locale === 'en'` (fallback à FR si vide)

## Origines des chansons (`song_origin_legacy`)

Les origines sont affichées telles quelles de la base de données. Pour traduire les origines, elles doivent d'abord être standardisées.

## Détection automatique de la locale

La locale est détectée automatiquement depuis la route :
- `/en/*` → locale = 'en'
- `/de/*` → locale = 'de'
- `/` ou `/fr/*` ou autres → locale = 'fr' (par défaut)

## Ajouter une nouvelle traduction

1. Ajouter la clé dans `src/locales/fr.json` (le français est la source)
2. Ajouter les traductions dans `src/locales/en.json` et `src/locales/de.json`
3. Utiliser `{{ t('chemin.de.la.clé') }}` dans le template

Exemple :
```json
// fr.json
{
  "newSection": {
    "title": "Mon titre",
    "description": "Ma description"
  }
}
```

Puis dans le composant :
```vue
{{ t('newSection.title') }}
{{ t('newSection.description') }}
```

## Pages traduites

- ✅ HomePage (complètement traduite)
- ✅ SongDetailPage (complètement traduite)
- ⏳ SongsPage (partiellement)
- ❌ AboutPage, LinksPage, ContactPage (non traduites pour l'instant)
- ❌ Admin (non traduit pour l'instant)

## Prochaines étapes

1. Traduire complètement SongsPage et les autres pages publiques
2. Ajouter des traductions pour les origines des chants (`song_origin_legacy`)
3. Considérer une traduction des sections administratives
4. Ajouter le support du changement de langue via l'URL query string

## Notes techniques

- Pas de dépendance `vue-i18n` lourde
- Système JSON simple et maintenable
- Réactif (mise à jour automatique quand la route change)
- Fallback automatique au français si traduction manquante
- Support des caractères spéciaux (accents, apostrophes, etc.)
