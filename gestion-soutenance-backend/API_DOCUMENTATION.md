# 📚 Documentation API - Gestion des Soutenances

## 🌐 URLs de base

- **Backend Laravel**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **API Documentation JSON**: `http://localhost:8000/api/documentation`

---

## 🔐 Authentication

Toutes les routes protégées nécessitent un **Bearer Token** dans le header :
```
Authorization: Bearer {votre_token}
```

---

## 📋 Liste complète des APIs

### 🔑 **Authentification** (Public)

#### 1. Login Étudiant
- **POST** `/api/auth/etudiant/login`
- **Body**:
```json
{
  "email": "etudiant@emsi.ma",
  "mot_de_passe": "password123"
}
```
- **Response**:
```json
{
  "token": "1|xxxxxxxxxxxxx",
  "user": {...}
}
```

#### 2. Login Professeur
- **POST** `/api/auth/professeur/login`
- **Body**:
```json
{
  "email": "professeur@emsi.ma",
  "mot_de_passe": "password123"
}
```

#### 3. Login Administrateur
- **POST** `/api/auth/admin/login`
- **Body**:
```json
{
  "email": "admin@emsi.ma",
  "mot_de_passe": "password123"
}
```

#### 4. Status API (Health Check)
- **GET** `/api/status`
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-12-13 10:30:00"
}
```

---

### 👨‍🎓 **Espace Étudiant**

#### 5. Déposer un rapport
- **POST** `/api/etudiants/{etudiant}/rapports`
- **Headers**: `Authorization: Bearer {token}`
- **Body** (multipart/form-data):
```
titre: "Rapport de stage mensuel"
type_rapport: "mensuel"
fichier: [FILE]
```

#### 6. Liste des rapports d'un étudiant
- **GET** `/api/etudiants/{etudiant}/rapports`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "titre": "Rapport mensuel",
    "type_rapport": "mensuel",
    "etat": "en_attente",
    "note": null,
    "date_depot": "2024-12-01"
  }
]
```

#### 7. Voir ma soutenance
- **GET** `/api/etudiants/{etudiant}/soutenance`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "id": 1,
  "date": "2024-12-15",
  "heure": "14:00",
  "salle": "C102",
  "jury_id": 5,
  "note": null
}
```

---

### 👨‍🏫 **Espace Professeur**

#### 8. Mes rapports (étudiants assignés)
- **GET** `/api/professeurs/{professeur}/rapports`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "titre": "Rapport final",
    "etudiant": {
      "id": 3,
      "nom": "Benani",
      "prenom": "Ahmed"
    },
    "etat": "en_attente"
  }
]
```

#### 9. Mes soutenances (membre du jury)
- **GET** `/api/professeurs/{professeur}/soutenances`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "date": "2024-12-20",
    "heure": "10:00",
    "etudiant": {...},
    "jury": {...}
  }
]
```

#### 10. Ajouter une remarque sur un rapport
- **POST** `/api/rapports/{rapport}/remarques`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "contenu": "Bon travail, mais améliorer la conclusion",
  "professeur_id": 2
}
```

#### 11. Liste des remarques d'un rapport
- **GET** `/api/rapports/{rapport}/remarques`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "contenu": "Très bon travail",
    "professeur": {
      "nom": "El Fassi",
      "prenom": "Ahmed"
    },
    "created_at": "2024-12-10"
  }
]
```

---

### 🔐 **Espace Admin**

#### **Gestion Étudiants**

#### 12. Liste tous les étudiants
- **GET** `/api/admin/etudiants`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "nom": "Benani",
    "prenom": "Ahmed",
    "email": "a.benani@emsi.ma",
    "filiere": "GINFO",
    "type_stage": "PFE",
    "encadrant_id": 2,
    "rapporteur_id": 3
  }
]
```

#### 13. Créer un étudiant
- **POST** `/api/admin/etudiants`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "nom": "Alami",
  "prenom": "Sara",
  "email": "s.alami@emsi.ma",
  "mot_de_passe": "password123",
  "filiere": "GINFO",
  "type_stage": "PFE"
}
```

#### 14. Modifier un étudiant
- **PUT** `/api/admin/etudiants/{etudiant}`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "nom": "Alami Updated",
  "email": "new.email@emsi.ma",
  "filiere": "GDATA"
}
```

#### 15. Supprimer un étudiant
- **DELETE** `/api/admin/etudiants/{etudiant}`
- **Headers**: `Authorization: Bearer {token}`

#### 16. Affecter encadrant/rapporteur
- **PUT** `/api/admin/etudiants/{etudiant}/affectations`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "encadrant_id": 2,
  "rapporteur_id": 3
}
```

---

#### **Gestion Professeurs**

#### 17. Liste tous les professeurs
- **GET** `/api/admin/professeurs`
- **Headers**: `Authorization: Bearer {token}`

#### 18. Créer un professeur
- **POST** `/api/admin/professeurs`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "nom": "Tazi",
  "prenom": "Mohamed",
  "email": "m.tazi@emsi.ma",
  "mot_de_passe": "password123",
  "role_soutenance": "president"
}
```

#### 19. Modifier un professeur
- **PUT** `/api/admin/professeurs/{professeur}`
- **Headers**: `Authorization: Bearer {token}`

#### 20. Supprimer un professeur
- **DELETE** `/api/admin/professeurs/{professeur}`
- **Headers**: `Authorization: Bearer {token}`

---

#### **Gestion Jurys**

#### 21. Liste tous les jurys
- **GET** `/api/admin/juries`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
[
  {
    "id": 1,
    "president_id": 2,
    "examinateur_id": 3,
    "encadrant_id": 4,
    "statut": "actif"
  }
]
```

#### 22. Créer un jury
- **POST** `/api/admin/juries`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "president_id": 2,
  "examinateur_id": 3,
  "encadrant_id": 4
}
```

#### 23. Voir un jury
- **GET** `/api/admin/juries/{jury}`
- **Headers**: `Authorization: Bearer {token}`

#### 24. Modifier un jury
- **PUT** `/api/admin/juries/{jury}`
- **Headers**: `Authorization: Bearer {token}`

#### 25. Supprimer un jury
- **DELETE** `/api/admin/juries/{jury}`
- **Headers**: `Authorization: Bearer {token}`

#### 26. Annuler un jury
- **PUT** `/api/admin/juries/{jury}/annuler`
- **Headers**: `Authorization: Bearer {token}`

---

#### **Gestion Soutenances**

#### 27. Liste toutes les soutenances
- **GET** `/api/admin/soutenances`
- **Headers**: `Authorization: Bearer {token}`

#### 28. Créer une soutenance
- **POST** `/api/admin/soutenances`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "etudiant_id": 1,
  "jury_id": 2,
  "date": "2024-12-20",
  "heure": "14:00",
  "salle": "C102"
}
```

#### 29. Voir une soutenance
- **GET** `/api/admin/soutenances/{soutenance}`
- **Headers**: `Authorization: Bearer {token}`

#### 30. Modifier une soutenance
- **PUT** `/api/admin/soutenances/{soutenance}`
- **Headers**: `Authorization: Bearer {token}`

#### 31. Supprimer une soutenance
- **DELETE** `/api/admin/soutenances/{soutenance}`
- **Headers**: `Authorization: Bearer {token}`

#### 32. Attribuer une note
- **PUT** `/api/admin/soutenances/{soutenance}/note`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "note": 16.5
}
```

#### 33. Annuler une soutenance
- **PUT** `/api/admin/soutenances/{soutenance}/annuler`
- **Headers**: `Authorization: Bearer {token}`

---

## 🚀 Comment utiliser dans **Postman**

### 1. Importer la collection

Créez une nouvelle collection Postman avec ces variables d'environnement :
```
BASE_URL = http://localhost:8000/api
TOKEN = (vide au départ)
```

### 2. Workflow typique :

#### Étape 1 : Login
1. **Request**: POST `{{BASE_URL}}/auth/etudiant/login`
2. **Body** (JSON):
```json
{
  "email": "etudiant@emsi.ma",
  "mot_de_passe": "password123"
}
```
3. **Tests** (Scripts Postman) :
```javascript
var jsonData = pm.response.json();
pm.environment.set("TOKEN", jsonData.token);
```

#### Étape 2 : Requêtes protégées
1. **Headers** → Ajouter :
```
Authorization: Bearer {{TOKEN}}
```
2. Maintenant vous pouvez appeler les autres endpoints

---

## 📖 Comment utiliser **Swagger UI**

### Accéder à Swagger :
1. Ouvrir le navigateur : `http://localhost:8000/docs`
2. Cliquer sur **"Authorize"** 🔒
3. Entrer : `Bearer {votre_token}`
4. Tester les endpoints directement dans l'interface

### Générer la documentation Swagger :
```bash
cd C:\Users\hbenl\Desktop\EmsiProjet-\gestion-soutenance-backend
php artisan l5-swagger:generate
```

---

## ⚙️ Configuration CORS

Si vous avez des erreurs CORS dans le frontend, vérifier `config/cors.php` :
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## 🔧 Codes de réponse HTTP

| Code | Signification |
|------|---------------|
| 200  | Succès |
| 201  | Créé |
| 204  | Succès sans contenu |
| 400  | Mauvaise requête |
| 401  | Non authentifié |
| 403  | Non autorisé |
| 404  | Non trouvé |
| 422  | Erreur de validation |
| 500  | Erreur serveur |

---

## 📞 Support

Pour toute question sur l'API, consulter :
- Documentation Swagger : `http://localhost:8000/docs`
- Code source : `routes/api.php`
- Contrôleurs : `app/Http/Controllers/`
