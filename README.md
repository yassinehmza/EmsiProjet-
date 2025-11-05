# Gestion des Soutenances – Monorepo

Ce dépôt contient deux parties indépendantes:
- `gestion-soutenance-backend/` — Backend Laravel (API + Swagger + Auth Sanctum)
- `gestion-soutenance-frontend/` — Frontend React (Create React App)

## Utilisation rapide
- Backend: voir `gestion-soutenance-backend/README.md`
- Frontend: voir `gestion-soutenance-frontend/README.md`

## Flux de travail (équipe)
- Pousser les parties séparément pour plus de clarté:
  - Backend: `git add gestion-soutenance-backend && git commit -m "backend: ..."`
  - Frontend: `git add gestion-soutenance-frontend && git commit -m "frontend: ..."`
- Garder des messages de commit explicites (contexte, endpoints, validations, UI).

## Branches et push
- Branche par défaut: `main`.
- `git push -u origin main` pour publier.

## Documentation API
- Swagger: `http://127.0.0.1:8000/api/documentation`.
- Auth via `Bearer <token>` (Sanctum) dans Swagger.

## Roadmap commune
- Planning: détection des conflits, filtres/pagination.
- Schémas OpenAPI réutilisables.
- Tests (Feature/Unit) et seed de données.