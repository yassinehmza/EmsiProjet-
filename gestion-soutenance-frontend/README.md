# Gestion des Soutenances (Frontend)

Frontend React (Create React App) pour l'application de gestion des soutenances. Ce frontend est indépendant du backend et peut être lancé seul.

## Prérequis
- Node.js 18+
- npm

## Installation
- Installer les dépendances: `npm install`.
- Configurer l'URL de l'API si nécessaire (par défaut `http://127.0.0.1:8000/api`).

## Démarrage
- `npm start` pour lancer en développement (http://localhost:3000).
- Assurez-vous que le backend est démarré pour les appels API.

## Authentification
- Le frontend utilise des tokens Sanctum (Bearer) retournés par les endpoints de login.
- Les appels protégés doivent inclure `Authorization: Bearer <token>`.

## Intégration Backend
- La documentation API est disponible via Swagger: `http://127.0.0.1:8000/api/documentation`.
- Les endpoints clés disponibles: juries, soutenances, rapports, remarques.

## À venir
- Pages dédiées: planification admin, liste juries, rapports étudiants, rapports professeurs.
- Gestion des rôles et redirections.
