# Gestion des Soutenances (Backend)

Backend Laravel pour l'application de gestion des soutenances de stages. Ce backend est indépendant du frontend et peut être lancé seul.

## Prérequis
- `PHP 8.2+`, `Composer`
- Base de données MySQL/MariaDB

## Installation
- Copier `.env.example` vers `.env` et configurer la base de données.
- Installer les dépendances: `composer install`.
- Générer la clé: `php artisan key:generate`.
- Migrer (et seed optionnel): `php artisan migrate --seed`.

## Démarrage
- Lancer le serveur: `php artisan serve`.
- Swagger UI: `http://127.0.0.1:8000/api/documentation`.
- Authentification Swagger: bouton Authorize, utiliser `Bearer <token>` (Sanctum).

## Fonctionnalités clés
- Auth: Administrateur, Étudiant, Professeur (login par rôle).
- Rapports: listing étudiant/professeur, ajout, remarques par professeur sur rapport.
- Juries (Admin): CRUD avec validation des membres distincts.
- Soutenances (Admin): planification, mise à jour, note finale.

## Endpoints (extrait)
- Admin Juries: `GET/POST/PUT/DELETE /api/admin/juries`
- Admin Soutenances: `GET/POST/PUT /api/admin/soutenances`, `PUT /api/admin/soutenances/{id}/note`
- Étudiants Rapports: `GET/POST /api/etudiants/{etudiant}/rapports`
- Professeurs Rapports: `GET /api/professeurs/{professeur}/rapports`
- Remarques: `GET/POST /api/rapports/{rapport}/remarques`

## Sécurité
- Routes protégées via `auth:sanctum`.
- Accès Admin vérifié via instance `Administrateur` dans les contrôleurs.

## Roadmap
- Détection de conflits planning (date/heure/salle).
- Filtres/pagination sur listes.
- Schémas OpenAPI (`components/schemas`).
- Tests (Feature/Unit) et données seed.
