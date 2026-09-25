# Quick Start - Bards in Exile

## 🚀 5 minutes pour démarrer

### 1. Cloner/Accéder au projet

```bash
cd C:\Users\lpicc\Web\bie_webapp
```

### 2. Configurer l'environnement

Créer `.env.local` à la racine (copier de `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Où trouver ces valeurs?**
- Aller sur https://supabase.com
- Ouvrir votre projet
- Paramètres → API
- Copier `Project URL` et `anon public key`

### 3. Installer les dépendances

```bash
npm install
```

### 4. Démarrer le serveur

```bash
npm run dev
```

Accéder à: **http://localhost:5173**

## 📱 Tester les pages

| URL | Description |
|-----|-------------|
| http://localhost:5173/ | Page d'accueil |
| http://localhost:5173/musique | Liste des chants (page 1) |
| http://localhost:5173/musique/page/2 | Page 2 de la pagination |
| http://localhost:5173/musique/1-chanson | Détail d'un chant |

## 🔧 Commandes utiles

```bash
# Développement
npm run dev        # Lancer le serveur local

# Build
npm run build      # Build pour production
npm run preview    # Prévisualiser la build

# Arrêter le serveur
Ctrl + C
```

## ✅ Checklist de test

### Page d'accueil
- [ ] Header affiche le logo et navigation
- [ ] Hero section avec recherche
- [ ] 3 cartes de features
- [ ] 3 derniers chants affichés
- [ ] Section "Voyagez par pays"
- [ ] Footer avec 3 colonnes

### Liste des chants (/musique)
- [ ] Chants affichés en grille 3 colonnes
- [ ] Images de placeholder visibles
- [ ] Titre, type et bouton "Lire la suite..." pour chaque chant
- [ ] Pagination en bas
- [ ] Bouton "Suivant" ou "Précédent" selon la page

### Détail d'un chant (/musique/:id)
- [ ] Image hero en background
- [ ] Titre et métadonnées affichés
- [ ] Infos du chant (type, artiste, durée, etc.)
- [ ] Liens YouTube et partitions (si disponibles)
- [ ] Boutons navigation "Chanson précédente/suivante"

### Responsive
- [ ] À 760px: 2 colonnes pour les grilles
- [ ] À 520px: 1 colonne, header en colonne
- [ ] Navigation sur mobile accessible

## 🐛 Troubleshooting

### Port 5173 déjà utilisé
```bash
# Vite essaiera automatiquement le port suivant (5174, 5175, etc.)
# Ou tuer le processus existant:
# Windows: taskkill /PID [pid] /F
# Linux/Mac: kill -9 [pid]
```

### Erreur Supabase "Missing environment variables"
- Vérifier `.env.local` existe et n'est pas vide
- Vérifier les clés Supabase sont correctes
- Redémarrer le serveur dev après changement

### Aucun chant n'apparaît
- Vérifier la connexion Supabase
- Vérifier que des chants avec `song_status >= 3` existent
- Ouvrir la console (F12) pour voir les erreurs

### Build échoue
```bash
# Vérifier que tout est installé
npm install

# Nettoyer et relancer
rm -r node_modules
npm install
npm run build
```

## 📚 Documentation complète

- **README.md** - Présentation générale du projet
- **DEVELOPMENT.md** - Guide technique détaillé
- **CHECKLIST.md** - État du projet et futures étapes

## 🚀 Déploiement Vercel (simple)

1. Pusher le code sur GitHub
2. Aller sur https://vercel.com
3. Importer le repository
4. Ajouter les variables d'environnement Supabase
5. Vercel construit et déploie automatiquement ✨

## 💡 Conseils

- **DevTools Vue**: Installer l'extension Chrome "Vue DevTools"
- **Logs**: Ouvrir la console (F12) pour voir les logs et erreurs
- **Données**: Les données affichées viennent de Supabase en temps réel
- **Styling**: Tailwind pour utilitaires, variables CSS pour les couleurs

## 🎯 Prochaines étapes

1. **Ajouter des données** - Insérer des chants dans Supabase
2. **Implémenter la recherche** - Ajouter un backend API
3. **Authentification** - Permettre aux utilisateurs de se connecter
4. **Favoris** - Laisser les utilisateurs sauvegarder des chants

---

**Besoin d'aide?** Consulter DEVELOPMENT.md pour la documentation technique complète.
