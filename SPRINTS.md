# Myway - Planification des Sprints

## Vue d'ensemble du projet

**Projet**: Myway - Application de gestion des modules étudiants
**Durée totale**: 4 sprints
**Équipe**: 1 développeur (Claude + vous)
**Stack**: React + Node.js/Express + SQLite + Docker

---

## SPRINT 1: Initialisation et Fondations (Semaine 1)

### Objectifs du Sprint
- Mettre en place l'architecture de base de l'application
- Initialiser la base de données avec le schéma principal
- Créer les routes API essentielles pour les modules
- Configurer le frontend avec React et Vite

### Tâches réalisées

#### Backend
- [ ] Initialiser le projet Node.js avec Express
- [ ] Configurer les variables d'environnement (PORT, DB_PATH, UPLOAD_DIR)
- [ ] Créer la couche de base de données SQLite
  - Implémenter les méthodes async: runAsync(), getAsync(), allAsync()
  - Gérer les connexions et erreurs gracieusement
- [ ] Créer le schéma de base de données (schema.sql)
  - Table `modules` avec id, name, description, color, created_at
  - Table `resources` avec types (url, note, file)
  - Table `todos` avec priorités (low, medium, high)
  - Ajouter les contraintes de clés étrangères et CASCADE delete
- [ ] Implémenter les routes CRUD pour les modules
  - GET /api/modules (récupérer tous les modules)
  - GET /api/modules/:id (détails d'un module)
  - POST /api/modules (créer un module)
  - PUT /api/modules/:id (mettre à jour)
  - DELETE /api/modules/:id (supprimer avec cascade)
- [ ] Configurer le middleware d'erreur centralisé
- [ ] Tester les endpoints avec Postman/curl

#### Frontend
- [ ] Initialiser le projet React avec Vite
- [ ] Configurer les variables d'environnement (VITE_API_URL)
- [ ] Créer la structure des dossiers (components, contexts, services)
- [ ] Implémenter le service API
  - Wrapper fetch centralisé avec gestion d'erreurs
  - Exports: modulesAPI, resourcesAPI, todosAPI
- [ ] Créer le ModuleContext pour la gestion d'état
  - État: modules[], selectedModule, resources[]
  - Méthodes: loadModules(), selectModule(), createModule(), updateModule(), deleteModule()
- [ ] Créer la mise en page CSS Grid 3 panneaux
  - Panneau gauche (350px): liste des modules
  - Panneau centre (flexible): ressources et todos
  - Panneau droit (350px): minuteur Pomodoro
- [ ] Créer les composants de base
  - ModuleList avec ModuleCard
  - Ajouter styling CSS responsive
- [ ] Tester la connexion frontend-backend

#### DevOps/Configuration
- [ ] Créer .gitignore pour ignorer node_modules, uploads, .env
- [ ] Initialiser le dépôt Git
- [ ] Commit initial avec setup de base

### Livrables Sprint 1
✅ Application fonctionnelle avec modules CRUD
✅ Interface utilisateur basique avec 3 panneaux
✅ Connexion frontend-backend établie

---

## SPRINT 2: Fonctionnalités Complètes (Semaine 2)

### Objectifs du Sprint
- Implémenter le système complet de ressources
- Ajouter la gestion des tâches (todos)
- Implémenter l'upload de fichiers
- Configurer le minuteur Pomodoro basique

### Tâches réalisées

#### Backend - Ressources
- [ ] Configurer multer pour les uploads de fichiers
  - Limite: 10MB par fichier
  - Types acceptés: pdf, doc, docx, txt, jpg, jpeg, png, gif, zip, rar
  - Stocker dans backend/uploads/ avec noms générés (timestamp + random)
- [ ] Implémenter les routes CRUD pour les ressources
  - POST /api/modules/:moduleId/resources (avec upload file)
  - GET /api/modules/:moduleId/resources (lister)
  - GET /api/uploads/:filename (servir le fichier statique)
  - PUT /api/modules/:moduleId/resources/:id
  - DELETE /api/modules/:moduleId/resources/:id (supprimer aussi le fichier)
- [ ] Ajouter middleware de validation pour les uploads

#### Backend - Todos
- [ ] Implémenter les routes CRUD pour les todos
  - GET /api/modules/:moduleId/todos (lister)
  - POST /api/modules/:moduleId/todos (créer)
  - PUT /api/modules/:moduleId/todos/:id (mettre à jour)
  - DELETE /api/modules/:moduleId/todos/:id
  - PATCH /api/modules/:moduleId/todos/:id/toggle (basculer completed)
- [ ] Ajouter validation des priorités

#### Backend - Seeding
- [ ] Créer le script seed.js
  - Générer 3 modules avec descriptions et couleurs variées
  - Ajouter 2-3 ressources par module
  - Ajouter 3-5 todos par module avec priorités mixtes
  - Rendre le script idempotent (nettoyer avant de remplir)

#### Frontend - ResourceContext & Composants
- [ ] Créer ResourceContext
  - État: resources[] pour le module sélectionné
  - Charger les ressources lors du changement de module
  - Méthodes: loadResources(), createResource(), updateResource(), deleteResource()
- [ ] Créer composants de ressources
  - ResourceList affichant les 3 types (URL, Note, Fichier)
  - ResourceItem avec options d'édition/suppression
  - ResourceForm avec sélection de type + upload de fichier
  - Traiter FormData pour les uploads

#### Frontend - TodoContext & Composants
- [ ] Créer TodoContext
  - État: todos[], filter (all/active/completed)
  - Charger les todos au changement de module
  - Méthodes: loadTodos(), createTodo(), updateTodo(), toggleTodo(), deleteTodo()
  - Implémenter le filtrage côté client
- [ ] Créer composants de todos
  - TodoList affichant les todos filtrés
  - TodoItem avec checkbox + édition + suppression
  - TodoForm pour créer/éditer avec sélection de priorité
  - Afficher les badges de priorité (couleurs)

#### Frontend - PomodoroContext & Composants
- [ ] Créer PomodoroContext (état pur client)
  - État: mode (work/shortBreak/longBreak), timeRemaining, sessionsCompleted, selectedTodo
  - Durées: 25min (work), 5min (short break), 15min (long break)
  - Logique: après 4 sessions work, break devient long (15min)
- [ ] Créer composants Pomodoro
  - PomodoroTimer affichant le timer principal
  - TimerControls avec start/pause/stop
  - Sélecteur de todo à associer au timer
- [ ] Ajouter notifications du navigateur (Browser Notification API)
  - Demander la permission au premier démarrage
  - Afficher notification à la fin du timer
  - Auto-switch au mode suivant

#### Frontend - Styling & UX
- [ ] Compléter le CSS dans App.css
  - Styles pour ResourceList et ResourceItem
  - Styles pour TodoList et TodoItem avec badges
  - Styles pour PomodoroTimer
  - Animations de transition et hover
  - Responsive design (media query pour <1200px)
- [ ] Ajouter Header avec titre et statut

#### Tests & Validation
- [ ] Tester CRUD complet pour modules, ressources, todos
- [ ] Tester l'upload et téléchargement de fichiers
- [ ] Tester le minuteur Pomodoro (manuellement)
- [ ] Tester le filtrage des todos
- [ ] Vérifier la persistance des données au refresh

### Livrables Sprint 2
✅ Application complète avec modules, ressources et todos fonctionnels
✅ Upload/téléchargement de fichiers
✅ Minuteur Pomodoro basique avec notifications
✅ Script de seed pour les données de test

---

## SPRINT 3: Mode Démo & Analytics (Semaine 3)

### Objectifs du Sprint
- Implémenter le mode démo avec données réalistes
- Créer un dashboard analytics
- Ajouter les sessions Pomodoro persistantes
- Configurer Docker

### Tâches réalisées

#### Backend - Mode Démo
- [ ] Créer demoData.js avec 190 sessions Pomodoro réalistes
  - Données étalées sur 30 jours
  - 5 modules avec activité variée
  - 25 tâches (11 complétées, 14 en attente)
  - Sessions avec durées, modes, timestamps réalistes
  - Pics d'activité l'après-midi/soirée (14:00-22:00)
- [ ] Créer les routes /api/demo/*
  - GET /api/demo/modules
  - GET /api/demo/modules/:id/resources
  - GET /api/demo/modules/:id/todos
  - GET /api/demo/pomodoro-sessions
  - Bloquer les write operations (POST/PUT/DELETE) avec erreur "Cannot modify in demo mode"
- [ ] Ajouter endpoint de vérification /api/health

#### Backend - Pomodoro Sessions Storage
- [ ] Ajouter table `pomodoro_sessions` à schema.sql
  - Colonnes: id, module_id, todo_id, mode, duration, completed, started_at, ended_at
- [ ] Implémenter les routes pour les sessions
  - POST /api/modules/:moduleId/pomodoro-sessions (créer)
  - GET /api/modules/:moduleId/pomodoro-sessions (lister)
  - GET /api/pomodoro-sessions/stats (statistiques globales)

#### Backend - Analytics Routes
- [ ] Créer les routes analytics
  - GET /api/analytics/overview (totaux, moyennes)
  - GET /api/analytics/module-engagement (sessions par module)
  - GET /api/analytics/productivity-patterns (heures et jours)
  - GET /api/analytics/task-trends (création/complétion over time)
- [ ] Ajouter support du paramètre ?demo=true aux routes

#### Frontend - Mode Démo
- [ ] Détecter le paramètre ?demo=true dans l'URL
- [ ] Créer DemoContext ou flag global
- [ ] Router les appels API vers /api/demo/* en mode démo
- [ ] Ajouter badge "DEMO MODE" au Header
- [ ] Bloquer les edits avec message d'erreur

#### Frontend - Analytics Pages & Components
- [ ] Créer une page Analytics.jsx
  - Routing: /analytics avec support du ?demo=true
  - Navigation entre Dashboard et Analytics
- [ ] Créer composants analytics
  - OverviewDashboard: cartes de statistiques (modules, tasks, focus time)
  - ModuleEngagement: graphique des sessions par module
  - ProductivityPatterns: heatmap heures/jours d'activité
  - TaskTrends: graphique linéaire création/complétion
- [ ] Utiliser Chart.js ou simple SVG pour visualisations

#### Frontend - Pomodoro Sessions Storage
- [ ] Mettre à jour PomodoroContext pour sauvegarder les sessions
  - Au lieu de tout oublier au refresh, appeler POST /api/modules/:moduleId/pomodoro-sessions
  - Charger les sessions existantes au démarrage
  - Afficher l'historique des sessions

#### Docker
- [ ] Créer backend/Dockerfile (Node multi-stage)
  - Build stage: npm install + npm run build (si applicable)
  - Production stage: node server.js
- [ ] Créer frontend/Dockerfile (Node + Nginx multi-stage)
  - Build stage: npm install + npm run build
  - Production stage: nginx alpine servant les fichiers
- [ ] Créer docker-compose.yml
  - Services: backend, frontend
  - Volumes pour données persistantes
  - Réseau bridge
- [ ] Tester: docker-compose up

#### Documentation
- [ ] Mettre à jour CLAUDE.md avec architecture complète
- [ ] Créer DEMO_MODE.md expliquant le mode et les données
- [ ] Ajouter DOCKER_GUIDE.md (première version)

### Livrables Sprint 3
✅ Mode démo fonctionnel avec données réalistes
✅ Dashboard analytics avec visualisations
✅ Sessions Pomodoro persistantes
✅ Images Docker construites et testées
✅ Documentation complète

---

## SPRINT 4: Finalisation & Optimisation (Semaine 4)

### Objectifs du Sprint
- Corriger le bug du mode démo en Docker
- Améliorer l'expérience utilisateur
- Ajouter les scripts d'automatisation
- Déployer sur Docker Hub

### Tâches réalisées

#### Bug Fix - Mode Démo en Docker
- [ ] Identifier les problèmes
  - nginx retourne 404 pour les routes (manque configuration)
  - Frontend utilise localhost:5000 au lieu du service Docker
  - API calls ne sont pas proxiées correctement
- [ ] Créer frontend/nginx.conf
  - try_files pour React Router: $uri $uri/ /index.html
  - Proxy block pour /api/ vers http://myway-backend:5000
  - Cache headers pour assets statiques
- [ ] Créer frontend/.env.production
  - VITE_API_URL=/api (relative pour que nginx le proxy)
- [ ] Mettre à jour frontend/Dockerfile
  - Décommenter: COPY nginx.conf /etc/nginx/conf.d/default.conf
- [ ] Reconstruire et tester
  - docker build -t myway-frontend:latest ./frontend
  - Vérifier http://localhost:3000/?demo=true fonctionne

#### Scripts d'Automatisation
- [ ] Créer rebuild-backend.sh et rebuild-backend.bat
  - Build backend image
  - Tag pour Docker Hub
  - Push à Docker Hub
- [ ] Créer rebuild-frontend.sh et rebuild-frontend.bat
  - Build frontend image
  - Tag pour Docker Hub
  - Push à Docker Hub
- [ ] Créer rebuild-all.sh et rebuild-all.bat
  - Exécuter les deux scripts ci-dessus
  - Nettoyer les images inutilisées
  - Afficher les prochaines étapes
- [ ] Créer REBUILD_SCRIPTS.md avec documentation

#### Documentation Finale
- [ ] Mettre à jour DOCKER_GUIDE.md
  - Ajouter section "Quick Method: Use Rebuild Scripts"
  - Améliorer le troubleshooting
  - Ajouter section pour la configuration nginx
- [ ] Créer docker-compose.dockerhub.yml
  - Utiliser les images de Docker Hub
  - Configuration de production
- [ ] Créer SPRINTS.md (ce fichier)
  - Documenter tous les sprints et tâches

#### Docker Hub & Déploiement
- [ ] Tagger les images finales
  - docker tag myway-backend:latest kappa20/myway-backend:latest
  - docker tag myway-frontend:latest kappa20/myway-frontend:latest
- [ ] Push les images
  - docker push kappa20/myway-backend:latest
  - docker push kappa20/myway-frontend:latest
- [ ] Vérifier les images sur Docker Hub
  - https://hub.docker.com/u/kappa20

#### Commits & Git
- [ ] Commit: "feat: Initialize Myway student module management app"
- [ ] Commit: "feat: Complete redesign and analytics dashboard implementation"
- [ ] Commit: "feat: Implement demo mode with realistic test data"
- [ ] Commit: "fix: Fix Docker demo mode not working and add rebuild automation scripts"

#### Tests Finaux
- [ ] Test complet: http://localhost:3000 (mode normal)
  - Créer module → Ajouter ressources → Ajouter todos → Minuteur Pomodoro
  - Vérifier la persistance des données
- [ ] Test démo: http://localhost:3000/?demo=true
  - Affichage des données de démo
  - Badge "DEMO MODE" visible
  - Vérifier les restrictions d'édition
- [ ] Test analytics: http://localhost:3000/analytics?demo=true
  - Tous les graphiques affichent les données
  - Navigation fonctionne
- [ ] Test Docker
  - docker-compose up fonctionne
  - Tous les ports sont accessibles
  - Les volumes persistent les données

#### Polissage & Optimisations
- [ ] Responsive design sur mobile
  - Tester sur DevTools (< 1200px)
  - Vérifier la mise en page à une colonne
- [ ] Performance
  - Vérifier que les transitions CSS sont fluides
  - Charger efficacement les données d'analytics
- [ ] Gestion des erreurs
  - Messages d'erreur clairs
  - Graceful degradation
- [ ] Nettoyage du code
  - Vérifier les console.log en production
  - Assurer la cohérence du style de code

### Livrables Sprint 4
✅ Bug du mode démo corrigé
✅ Scripts d'automatisation Docker
✅ Images publiées sur Docker Hub
✅ Documentation complète et actualisée
✅ Application prête pour la production

---

## Résumé des Commits

```
Sprint 1: 7f36716 - feat: Initialize Myway student module management app
Sprint 2: [Commits intermédiaires pour CRUD]
Sprint 3: 22735ff - feat: Complete redesign and analytics dashboard implementation
Sprint 3: 0c561a9 - feat: Implement demo mode with realistic test data
Sprint 4: 895b261 - fix: Fix Docker demo mode not working and add rebuild automation scripts
```

---

## Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Durée totale** | 4 sprints (4 semaines) |
| **Nombre de fichiers créés** | ~50+ |
| **Lignes de code** | ~5000+ |
| **Routes API** | 30+ endpoints |
| **Composants React** | 15+ |
| **Base de données** | 3 tables + données de démo |
| **Images Docker** | 2 (backend + frontend) |
| **Scripts d'automatisation** | 6 (batch + shell) |

---

## Technologies Utilisées

### Backend
- Node.js + Express
- SQLite3
- Multer (file uploads)
- CORS middleware

### Frontend
- React 18
- Vite
- Context API (state management)
- CSS3 (Grid, Flexbox, Animations)
- Fetch API
- Browser Notification API

### DevOps
- Docker + Docker Compose
- Nginx (reverse proxy)
- Docker Hub (registry)
- Git + GitHub

---

## Points Clés d'Apprentissage

1. **Architecture deux tiers**: Séparation claire frontend/backend
2. **State management**: Context API sans Redux pour MVP
3. **API RESTful**: Conventions et bonnes pratiques
4. **File handling**: Upload/téléchargement sécurisé
5. **Docker**: Multi-stage builds, networking, volumes
6. **CI/CD**: Scripts d'automatisation pour déploiement rapide
7. **Data-driven UI**: Analytics avec données réalistes
8. **Mode démo**: Permettre l'exploration sans modification
9. **Responsive design**: Mobile-first approach
10. **Documentation**: README, CLAUDE.md, DOCKER_GUIDE.md

---

## Prochaines Étapes Potentielles

- [ ] Ajouter authentification utilisateur
- [ ] Migrer vers PostgreSQL pour production multi-utilisateur
- [ ] Ajouter CI/CD (GitHub Actions)
- [ ] Implémenter les tests automatisés (Jest, React Testing Library)
- [ ] Ajouter des graphiques plus avancés (D3.js)
- [ ] Implémenter les notifications temps réel (WebSockets)
- [ ] Ajouter l'export des données (CSV, PDF)
- [ ] Optimiser les images Docker
- [ ] Ajouter le dark mode
- [ ] Intégrer Sentry pour le monitoring

---

**Date de fin**: 2026-01-17
**Statut**: ✅ Terminé et prêt pour la production
