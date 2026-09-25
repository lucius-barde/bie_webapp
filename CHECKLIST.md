# Checklist - Bards in Exile Web App

## ✅ Complété (Phase 1)

### Configuration et Setup
- [x] Initialisation npm avec Vue 3, Vite et Tailwind CSS
- [x] Configuration Vite avec plugin Vue
- [x] Configuration Tailwind CSS et PostCSS
- [x] Setup Vue Router avec 4 routes
- [x] Configuration Supabase client
- [x] .gitignore configuré
- [x] .env.example fourni

### Structure du projet
- [x] Dossiers src/components, pages, router, lib, styles créés
- [x] Package.json avec scripts (dev, build, preview)
- [x] index.html comme point d'entrée
- [x] App.vue comme composant racine

### Composants
- [x] Header.vue avec navigation
- [x] Footer.vue avec 3 colonnes + copyright
- [x] HomePage.vue - Page d'accueil
- [x] SongsPage.vue - Liste des chants (pagination 30/page)
- [x] SongDetailPage.vue - Détail d'une chanson

### Fonctionnalités
- [x] Récupération des chants depuis Supabase (song_status >= 3)
- [x] Tri par song_catalog_id DESC
- [x] Affichage en 3 colonnes responsive
- [x] Génération automatique de slugs URL
- [x] Pagination avec 30 items par page
- [x] Navigation précédent/suivant sur pages détail
- [x] Affichage des métadonnées (song_origin_legacy, song_type_legacy)
- [x] Liens vers YouTube et partitions (si disponibles)
- [x] Images placeholder Unsplash

### Design & Styling
- [x] Variables CSS du mockup intégrées
- [x] Grid responsive (3 colonnes, 2 colonnes mobile, 1 colonne petit mobile)
- [x] Styles réutilisés du mockup.html
- [x] Responsive design (760px, 520px breakpoints)
- [x] Tailwind CSS intégré

### Build & Déploiement
- [x] Build Vite fonctionne sans erreurs
- [x] Configuration vercel.json pour rewrites SPA
- [x] Serveur dev démarre sans erreurs
- [x] Documentation README.md
- [x] Documentation DEVELOPMENT.md

## 🚀 À faire (Phase 2+)

### Fonctionnalités futures
- [ ] Recherche fulltext
- [ ] Filtrage par pays/région
- [ ] Filtrage par type de chant
- [ ] Filtrage par époque
- [ ] Système d'authentification
- [ ] Favoris/signets utilisateur
- [ ] Partage sur réseaux sociaux
- [ ] Lecteur audio intégré
- [ ] Affichage des paroles
- [ ] Traductions affichées dynamiquement
- [ ] Galerie d'images pour chaque chant
- [ ] Commentaires/notes utilisateur

### Performance & SEO
- [ ] Meta tags (OpenGraph, Twitter)
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Optimization des images
- [ ] Lazy loading avancé
- [ ] Code splitting des routes
- [ ] Compression des assets

### Backend (API)
- [ ] API pour la recherche
- [ ] API pour les filtres
- [ ] API pour les favoris
- [ ] Authentification JWT
- [ ] Rate limiting

### Testing
- [ ] Tests unitaires (Vitest)
- [ ] Tests d'intégration
- [ ] Tests e2e (Cypress/Playwright)
- [ ] Lighthouse audit

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring et logs
- [ ] Error tracking (Sentry)
- [ ] Analytics
- [ ] Backup automatiques

### Documentation
- [ ] API documentation
- [ ] Guide de contribution
- [ ] Guide d'administration
- [ ] Changelog

## 📝 Notes

### Données manquantes à récupérer de Supabase
Pour tester l'application, vous devez:
1. Remplir `.env.local` avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
2. Vérifier que la table `bardsinexile_songs` contient des données avec `song_status >= 3`

### Placeholders actuels
- Images: Utilisation de 3 images Unsplash en rotation (à remplacer par de vraies images)
- Liens footer: Tous les liens pointent vers `#` (à dynamiser plus tard)

### Limitations connues
- Pas de recherche/filtrage côté serveur (à implémenter)
- Pas de cache (à ajouter)
- Pas d'authentification (à implémenter)

## 🎯 Priorités

**Court terme (Semaine 1)**
1. Tester avec les vraies données Supabase
2. Implémenter la recherche basique
3. Vérifier le déploiement Vercel

**Moyen terme (Semaine 2-3)**
1. Authentification utilisateur
2. Système de favoris
3. Optimisations SEO

**Long terme (Mois 2+)**
1. Backend API complète
2. Features avancées
3. Mobile app native
