# 📚 DOCUMENTATION FRONTEND - RÉVISION EXAMEN
## Système de Gestion des Soutenances - EMSI

---

## 📋 TABLE DES MATIÈRES

1. [Architecture Générale](#1-architecture-générale)
2. [Configuration Client API (Axios)](#2-configuration-client-api-axios)
3. [Gestion d'État (Zustand)](#3-gestion-détat-zustand)
4. [Système de Routage](#4-système-de-routage)
5. [API - Fonctions d'Authentification](#5-api---fonctions-dauthentification)
6. [API - Fonctions Admin](#6-api---fonctions-admin)
7. [API - Fonctions Étudiant](#7-api---fonctions-étudiant)
8. [API - Fonctions Professeur](#8-api---fonctions-professeur)
9. [Composants Réutilisables](#9-composants-réutilisables)
10. [Pages Admin](#10-pages-admin)
11. [Pages Étudiant](#11-pages-étudiant)
12. [Pages Professeur](#12-pages-professeur)
13. [Hooks React Utilisés](#13-hooks-react-utilisés)
14. [Résumé des Concepts Clés](#14-résumé-des-concepts-clés)

---

## 1. Architecture Générale

### 📁 Structure du Projet
```
src/
├── api/                    # Services API (appels HTTP)
│   ├── client.js           # Configuration Axios
│   ├── auth.js             # Authentification
│   ├── admin.js            # Endpoints Admin
│   ├── etudiant.js         # Endpoints Étudiant
│   └── professeur.js       # Endpoints Professeur
├── store/                  # Gestion d'état (Zustand)
│   ├── auth.js             # État d'authentification
│   └── ui.js               # État UI (toasts)
├── routes/                 # Protection des routes
│   └── ProtectedRoute.jsx  # Route protégée
├── components/             # Composants réutilisables
├── pages/                  # Pages publiques
├── Admin/                  # Pages administrateur
├── Etudiant/               # Pages étudiant
└── Professeur/             # Pages professeur
```

### 🔧 Technologies Utilisées
- **React** - Bibliothèque UI
- **React Router DOM** - Routage
- **Axios** - Requêtes HTTP
- **Zustand** - Gestion d'état
- **TailwindCSS** - Styles CSS

---

## 2. Configuration Client API (Axios)

### 📄 Fichier: `src/api/client.js`

```javascript
import axios from 'axios';

// URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Création de l'instance Axios
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json' 
  },
});

// INTERCEPTEUR DE REQUÊTE
// Ajoute automatiquement le token JWT à chaque requête
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// INTERCEPTEUR DE RÉPONSE
// Gère les erreurs 401 (non autorisé)
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Déconnexion automatique
    }
    return Promise.reject(error);
  }
);

export default client;
```

### 🎯 Points Clés à Retenir:
| Concept | Description |
|---------|-------------|
| `axios.create()` | Crée une instance Axios configurée |
| `interceptors.request` | Modifie les requêtes avant envoi |
| `interceptors.response` | Traite les réponses/erreurs |
| `Bearer Token` | Format d'authentification JWT |
| `localStorage` | Stockage persistant du token |

---

## 3. Gestion d'État (Zustand)

### 📄 Fichier: `src/store/auth.js` - État d'Authentification

```javascript
import { create } from 'zustand';

export const useAuth = create(set => ({
  // ÉTAT INITIAL
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  profile: null,
  
  // ACTION: Définir l'authentification
  setAuth: ({ token, role, profile }) => {
    if (token) localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
    set({ token, role, profile });
  },
  
  // ACTION: Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null, profile: null });
  },
}));
```

### 📄 Fichier: `src/store/ui.js` - État UI (Toasts/Notifications)

```javascript
import { create } from 'zustand';

export const useUI = create(set => ({
  // ÉTAT: Liste des notifications
  toasts: [],
  
  // ACTION: Ajouter une notification
  addToast: ({ type = 'success', message }) => set(state => ({
    toasts: [...state.toasts, { id: Date.now(), type, message }]
  })),
  
  // ACTION: Supprimer une notification
  removeToast: id => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
```

### 🎯 Syntaxe Zustand:
```javascript
// Création d'un store
const useStore = create(set => ({
  // État
  value: initialValue,
  
  // Actions (utilisent set pour modifier l'état)
  action: (param) => set(state => ({ value: newValue })),
}));

// Utilisation dans un composant
const { value, action } = useStore();
```

---

## 4. Système de Routage

### 📄 Fichier: `src/App.js` - Configuration des Routes

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Routes Professeur (protégées) */}
        <Route path="/professeur" element={
          <ProtectedRoute allowRole="professeur">
            <ProfesseurLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProfesseurDashboard />} />
          <Route path="etudiants" element={<MesEtudiants />} />
        </Route>
        
        {/* Routes Étudiant (protégées) */}
        <Route path="/etudiant" element={
          <ProtectedRoute allowRole="etudiant">
            <EtudiantLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EtudiantDashboard />} />
        </Route>
        
        {/* Routes Admin (protégées) */}
        <Route path="/admin" element={
          <ProtectedRoute allowRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 📄 Fichier: `src/routes/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function ProtectedRoute({ children, allowRole }) {
  const { token, role } = useAuth();
  
  // Si pas de token → redirection vers accueil
  if (!token) return <Navigate to="/" replace />;
  
  // Si rôle non autorisé → redirection vers accueil
  if (allowRole && role !== allowRole) return <Navigate to="/" replace />;
  
  // Sinon → afficher le contenu protégé
  return children;
}
```

### 🎯 Concepts de Routage:
| Élément | Description |
|---------|-------------|
| `<BrowserRouter>` | Conteneur principal du routage |
| `<Routes>` | Groupe de routes |
| `<Route path="" element={}>` | Définition d'une route |
| `<Navigate to="" replace />` | Redirection |
| `index` | Route par défaut (sans path) |
| Routes imbriquées | Routes enfants avec Outlet |

---

## 5. API - Fonctions d'Authentification

### 📄 Fichier: `src/api/auth.js`

```javascript
import client from './client';

// Connexion Étudiant
export const loginEtudiant = async (email, password) => {
  const { data } = await client.post('/auth/etudiant/login', { email, password });
  return data;
};

// Connexion Professeur
export const loginProfesseur = async (email, password) => {
  const { data } = await client.post('/auth/professeur/login', { email, password });
  return data;
};

// Connexion Admin
export const loginAdmin = async (email, password) => {
  const { data } = await client.post('/auth/admin/login', { email, password });
  return data;
};
```

### 🎯 Endpoints d'Authentification:
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `loginEtudiant` | `/auth/etudiant/login` | POST |
| `loginProfesseur` | `/auth/professeur/login` | POST |
| `loginAdmin` | `/auth/admin/login` | POST |

---

## 6. API - Fonctions Admin

### 📄 Fichier: `src/api/admin.js`

### 📌 CRUD Étudiants
```javascript
// LISTER tous les étudiants
export const adminListEtudiants = async () => {
  const { data } = await client.get('/admin/etudiants');
  return data;
};

// CRÉER un étudiant
export const adminCreateEtudiant = async (payload) => {
  const { data } = await client.post('/admin/etudiants', payload);
  return data;
};

// MODIFIER un étudiant
export const adminUpdateEtudiant = async (etudiantId, payload) => {
  const { data } = await client.put(`/admin/etudiants/${etudiantId}`, payload);
  return data;
};

// SUPPRIMER un étudiant
export const adminDeleteEtudiant = async (etudiantId) => {
  const { data } = await client.delete(`/admin/etudiants/${etudiantId}`);
  return data;
};

// AFFECTER encadrant/rapporteur à un étudiant
export const adminAffectationsEtudiant = async (etudiantId, payload) => {
  const { data } = await client.put(`/admin/etudiants/${etudiantId}/affectations`, payload);
  return data;
};
```

### 📌 CRUD Professeurs
```javascript
// LISTER tous les professeurs
export const adminListProfesseurs = async () => {
  const { data } = await client.get('/admin/professeurs');
  return data;
};

// CRÉER un professeur
export const adminCreateProfesseur = async (payload) => {
  const { data } = await client.post('/admin/professeurs', payload);
  return data;
};

// MODIFIER un professeur
export const adminUpdateProfesseur = async (professeurId, payload) => {
  const { data } = await client.put(`/admin/professeurs/${professeurId}`, payload);
  return data;
};

// SUPPRIMER un professeur
export const adminDeleteProfesseur = async (professeurId) => {
  const { data } = await client.delete(`/admin/professeurs/${professeurId}`);
  return data;
};
```

### 📌 CRUD Juries
```javascript
// LISTER tous les juries
export const adminListJuries = async () => {
  const { data } = await client.get('/admin/juries');
  return data;
};

// CRÉER un jury
export const adminCreateJury = async (payload) => {
  const { data } = await client.post('/admin/juries', payload);
  return data;
};

// AFFICHER un jury
export const adminShowJury = async (juryId) => {
  const { data } = await client.get(`/admin/juries/${juryId}`);
  return data;
};

// MODIFIER un jury
export const adminUpdateJury = async (juryId, payload) => {
  const { data } = await client.put(`/admin/juries/${juryId}`, payload);
  return data;
};

// SUPPRIMER un jury
export const adminDeleteJury = async (juryId) => {
  const { data } = await client.delete(`/admin/juries/${juryId}`);
  return data;
};
```

### 📌 CRUD Soutenances
```javascript
// LISTER toutes les soutenances
export const adminListSoutenances = async (params = {}) => {
  const { data } = await client.get('/admin/soutenances', { params });
  return data;
};

// PLANIFIER une soutenance
export const adminPlanifierSoutenance = async (payload) => {
  const { data } = await client.post('/admin/soutenances', payload);
  return data;
};

// AFFICHER une soutenance
export const adminShowSoutenance = async (soutenanceId) => {
  const { data } = await client.get(`/admin/soutenances/${soutenanceId}`);
  return data;
};

// MODIFIER une soutenance
export const adminUpdateSoutenance = async (soutenanceId, payload) => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}`, payload);
  return data;
};

// SUPPRIMER une soutenance
export const adminDeleteSoutenance = async (soutenanceId) => {
  const { data } = await client.delete(`/admin/soutenances/${soutenanceId}`);
  return data;
};

// METTRE À JOUR la note finale
export const adminUpdateNote = async (soutenanceId, note_finale) => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}/note`, { note_finale });
  return data;
};

// ANNULER une soutenance
export const adminAnnulerSoutenance = async (soutenanceId) => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}/annuler`);
  return data;
};
```

### 🎯 Tableau Récapitulatif API Admin:
| Ressource | GET (Liste) | POST (Créer) | PUT (Modifier) | DELETE (Supprimer) |
|-----------|-------------|--------------|----------------|-------------------|
| Étudiants | `/admin/etudiants` | `/admin/etudiants` | `/admin/etudiants/{id}` | `/admin/etudiants/{id}` |
| Professeurs | `/admin/professeurs` | `/admin/professeurs` | `/admin/professeurs/{id}` | `/admin/professeurs/{id}` |
| Juries | `/admin/juries` | `/admin/juries` | `/admin/juries/{id}` | `/admin/juries/{id}` |
| Soutenances | `/admin/soutenances` | `/admin/soutenances` | `/admin/soutenances/{id}` | `/admin/soutenances/{id}` |

---

## 7. API - Fonctions Étudiant

### 📄 Fichier: `src/api/etudiant.js`

```javascript
import client from './client';

// Récupérer les rapports de l'étudiant
export const getEtudiantRapports = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/rapports`);
  return data.rapports || [];
};

// Déposer un nouveau rapport
export const deposerRapport = async (etudiantId, payload) => {
  const { data } = await client.post(`/etudiants/${etudiantId}/rapports`, payload);
  return data.rapport;
};

// Récupérer les détails de la soutenance
export const getEtudiantSoutenance = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/soutenance`);
  return data.soutenance || null;
};

// Récupérer les remarques sur un rapport
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data.remarques || [];
};
```

### 🎯 Endpoints Étudiant:
| Fonction | Endpoint | Méthode | Description |
|----------|----------|---------|-------------|
| `getEtudiantRapports` | `/etudiants/{id}/rapports` | GET | Liste des rapports |
| `deposerRapport` | `/etudiants/{id}/rapports` | POST | Créer un rapport |
| `getEtudiantSoutenance` | `/etudiants/{id}/soutenance` | GET | Détails soutenance |
| `getRapportRemarques` | `/rapports/{id}/remarques` | GET | Remarques du rapport |

---

## 8. API - Fonctions Professeur

### 📄 Fichier: `src/api/professeur.js`

```javascript
import client from './client';

// Récupérer les rapports assignés au professeur
export const getProfesseurRapports = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/rapports`);
  return data;
};

// Récupérer les soutenances du professeur (membre du jury)
export const getProfesseurSoutenances = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/soutenances`);
  return data;
};

// Ajouter une remarque sur un rapport
export const addRemarque = async (rapportId, payload) => {
  const { data } = await client.post(`/rapports/${rapportId}/remarques`, payload);
  return data;
};

// Récupérer les remarques d'un rapport
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data;
};

// Récupérer les étudiants encadrés (déduits des rapports)
export const getProfesseurEtudiants = async (professeurId) => {
  try {
    const rapports = await getProfesseurRapports(professeurId);
    const etudiantsMap = new Map();
    
    if (Array.isArray(rapports)) {
      rapports.forEach(rapport => {
        if (rapport.etudiant && rapport.etudiant.id) {
          etudiantsMap.set(rapport.etudiant.id, rapport.etudiant);
        }
      });
    }
    
    return Array.from(etudiantsMap.values());
  } catch (error) {
    console.error('Erreur getProfesseurEtudiants:', error);
    return [];
  }
};
```

### 🎯 Endpoints Professeur:
| Fonction | Endpoint | Méthode | Description |
|----------|----------|---------|-------------|
| `getProfesseurRapports` | `/professeurs/{id}/rapports` | GET | Rapports assignés |
| `getProfesseurSoutenances` | `/professeurs/{id}/soutenances` | GET | Soutenances (jury) |
| `addRemarque` | `/rapports/{id}/remarques` | POST | Ajouter remarque |
| `getRapportRemarques` | `/rapports/{id}/remarques` | GET | Lister remarques |

---

## 9. Composants Réutilisables

### 📄 `Button.jsx` - Bouton Stylisé

```javascript
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium focus:outline-none transition-colors';
  
  const variants = {
    primary: 'bg-[#05A66B] hover:bg-[#04905c] text-white',
    secondary: 'bg-white text-gray-800 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```
**Props:** `children`, `variant` (primary/secondary/danger), `className`

---

### 📄 `Modal.jsx` - Fenêtre Modale

```javascript
export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
```
**Props:** `open` (boolean), `onClose` (function), `title` (string), `children`

---

### 📄 `Table.jsx` - Tableau

```javascript
export default function Table({ headers = [], children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 text-sm">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}
```
**Props:** `headers` (array de strings), `children` (lignes `<tr>`)

---

### 📄 `Card.jsx` - Carte

```javascript
export default function Card({ title, actions, children, className = '' }) {
  return (
    <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
```
**Props:** `title`, `actions` (JSX), `children`, `className`

---

### 📄 `Breadcrumbs.jsx` - Fil d'Ariane

```javascript
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="text-sm text-gray-600">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {it.href ? (
              <a href={it.href}>{it.label}</a>
            ) : (
              <span>{it.label}</span>
            )}
            {idx < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```
**Props:** `items` (array de `{ label, href? }`)

---

### 📄 `ConfirmDialog.jsx` - Dialogue de Confirmation

```javascript
export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>{message}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </div>
      </div>
    </Modal>
  );
}
```
**Props:** `open`, `onClose`, `onConfirm`, `title`, `message`

---

## 10. Pages Admin

### 📄 Dashboard Admin
```javascript
// Hooks utilisés
const [juries, setJuries] = useState([]);
const [etudiants, setEtudiants] = useState([]);
const [professeurs, setProfesseurs] = useState([]);
const { addToast } = useUI();

// Chargement des données au montage
useEffect(() => {
  const run = async () => {
    const [jRes, eRes, pRes] = await Promise.all([
      adminListJuries(),
      adminListEtudiants(),
      adminListProfesseurs()
    ]);
    setJuries(jRes?.data || jRes || []);
    // ...
  };
  run();
}, []);

// Métriques calculées avec useMemo
const metrics = useMemo(() => ([
  { value: etudiants.length, label: 'Étudiants Inscrits' },
  { value: professeurs.length, label: 'Professeurs' },
  { value: juries.length, label: 'Jurys Formés' },
]), [etudiants.length, professeurs.length, juries.length]);
```

### 📄 Gestion Étudiants (CRUD Complet)

```javascript
// États du composant
const [items, setItems] = useState([]);           // Liste des étudiants
const [createOpen, setCreateOpen] = useState(false);  // Modal création
const [editOpen, setEditOpen] = useState(false);      // Modal édition
const [current, setCurrent] = useState(null);         // Étudiant en cours d'édition
const [form, setForm] = useState({ nom:'', prenom:'', email:'', ... });
const [confirm, setConfirm] = useState({ open:false, item:null }); // Confirmation suppression

// CRÉER un étudiant
const onCreate = async (e) => {
  e.preventDefault();
  const res = await adminCreateEtudiant(form);
  setItems(prev => [res, ...prev]);  // Ajouter en début de liste
  setCreateOpen(false);
  addToast({ type:'success', message:'Étudiant créé' });
};

// MODIFIER un étudiant
const onUpdate = async (e) => {
  e.preventDefault();
  const res = await adminUpdateEtudiant(current.id, form);
  setItems(prev => prev.map(it => it.id === current.id ? { ...it, ...res } : it));
  setEditOpen(false);
};

// SUPPRIMER un étudiant
const confirmDelete = async () => {
  await adminDeleteEtudiant(confirm.item.id);
  setItems(prev => prev.filter(it => it.id !== confirm.item.id));
  setConfirm({ open:false, item:null });
};

// Filtrage et pagination
const filtered = items.filter(it => {
  const s = `${it.nom} ${it.prenom} ${it.email}`.toLowerCase();
  return query ? s.includes(query.toLowerCase()) : true;
});
const totalPages = Math.ceil(filtered.length / perPage);
const view = filtered.slice((page-1)*perPage, page*perPage);
```

### 📄 Planification Soutenances (Calendrier)

```javascript
// Génération du calendrier
const calendarDays = useMemo(() => {
  const monthStart = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
  const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
  // ... génération des jours
  return days.map(d => ({
    date: d,
    iso: toKey(d),  // Format YYYY-MM-DD
    inMonth: d.getMonth() === calDate.getMonth(),
    weekend: d.getDay() === 0 || d.getDay() === 6,
  }));
}, [calDate]);

// Créneaux horaires disponibles
useEffect(() => {
  const dayEvents = items.filter(it => it.date === selectedDate);
  const slots = [];
  for (let m = 9*60; m <= 17*60 - 90; m += 30) {
    const overlap = intervals.some(([s,e]) => !(end <= s || m >= e));
    slots.push({ time: formatTime(m), available: !overlap });
  }
  setSlots(slots);
}, [items, selectedDate]);
```

---

## 11. Pages Étudiant

### 📄 Dashboard Étudiant
```javascript
// Chargement des données
useEffect(() => {
  const loadData = async () => {
    if (!profile?.id) return;
    const [soutenanceData, rapportsData] = await Promise.all([
      getEtudiantSoutenance(profile.id).catch(() => null),
      getEtudiantRapports(profile.id).catch(() => [])
    ]);
    setSoutenance(soutenanceData);
    setRapports(rapportsData);
  };
  loadData();
}, [profile]);
```

### 📄 Mes Rapports (Dépôt)
```javascript
// Dépôt d'un rapport
const handleSubmitRapport = async (e) => {
  e.preventDefault();
  if (!formData.titre.trim()) {
    addToast({ type: 'error', message: 'Le titre est requis' });
    return;
  }
  
  await deposerRapport(profile.id, formData);
  addToast({ type: 'success', message: 'Rapport déposé avec succès' });
  loadRapports(); // Recharger la liste
};

// Statistiques des rapports
const stats = {
  total: rapports.length,
  valides: rapports.filter(r => r.etat === 'valide').length,
  enCours: rapports.filter(r => r.etat === 'en_attente').length,
};
```

### 📄 Ma Soutenance (Countdown)
```javascript
// Calcul du compte à rebours
const calculateCountdown = () => {
  if (!soutenance?.date || !soutenance?.heure) return null;
  
  const soutenanceDateTime = new Date(`${soutenance.date}T${soutenance.heure}`);
  const now = new Date();
  const diff = soutenanceDateTime - now;
  
  if (diff < 0) return null;
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

// Mise à jour toutes les secondes
useEffect(() => {
  const interval = setInterval(() => setCountdown(calculateCountdown()), 1000);
  return () => clearInterval(interval);
}, [soutenance]);
```

---

## 12. Pages Professeur

### 📄 Dashboard Professeur
```javascript
// Statistiques
useEffect(() => {
  const loadStats = async () => {
    const [rapports, soutenances, etudiants] = await Promise.all([
      getProfesseurRapports(profile.id),
      getProfesseurSoutenances(profile.id),
      getProfesseurEtudiants(profile.id)
    ]);
    
    setStats({
      etudiants: etudiants.length,
      rapportsEnAttente: rapports.filter(r => r.etat === 'en_attente').length,
      soutenances: soutenances.length,
    });
  };
  loadStats();
}, [profile]);
```

### 📄 Gestion des Remarques
```javascript
// Ajouter une remarque
const handleSubmitRemarque = async () => {
  if (!newRemarque.trim() || !selectedRapport) return;
  
  await addRemarque(selectedRapport.id, {
    contenu: newRemarque,
    professeur_id: profile.id
  });
  
  setNewRemarque('');
  await loadRemarques(selectedRapport.id); // Recharger
};
```

---

## 13. Hooks React Utilisés

### 🔹 useState - État Local
```javascript
const [value, setValue] = useState(initialValue);

// Exemples
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [form, setForm] = useState({ nom: '', email: '' });
```

### 🔹 useEffect - Effets de Bord
```javascript
useEffect(() => {
  // Code exécuté après le rendu
  return () => { /* Cleanup */ };
}, [dependencies]); // Tableau de dépendances

// Exemples
useEffect(() => { loadData(); }, []);           // Au montage uniquement
useEffect(() => { loadData(); }, [profile.id]); // Quand profile.id change
```

### 🔹 useMemo - Mémorisation de Valeur
```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Exemple
const filteredItems = useMemo(() => 
  items.filter(it => it.name.includes(query)),
  [items, query]
);
```

### 🔹 useNavigate - Navigation Programmatique
```javascript
const navigate = useNavigate();
navigate('/admin/dashboard');
navigate(-1); // Retour arrière
```

### 🔹 useLocation - Informations URL
```javascript
const location = useLocation();
const params = new URLSearchParams(location.search);
const role = params.get('role'); // ?role=admin
```

### 🔹 useSearchParams - Paramètres URL
```javascript
const [searchParams] = useSearchParams();
const etudiantId = searchParams.get('etudiant');
```

---

## 14. Résumé des Concepts Clés

### 🎯 Pattern de Chargement de Données
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const { addToast } = useUI();

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const result = await apiCall();
      setData(result?.data || result || []);
    } catch (error) {
      addToast({ type: 'error', message: 'Erreur' });
    } finally {
      setLoading(false);
    }
  };
  load();
}, [dependencies]);
```

### 🎯 Pattern CRUD dans un Composant
```javascript
// États
const [items, setItems] = useState([]);
const [modalOpen, setModalOpen] = useState(false);
const [current, setCurrent] = useState(null);

// CREATE
const onCreate = async (data) => {
  const result = await createApi(data);
  setItems([result, ...items]);
};

// UPDATE
const onUpdate = async (id, data) => {
  const result = await updateApi(id, data);
  setItems(items.map(it => it.id === id ? result : it));
};

// DELETE
const onDelete = async (id) => {
  await deleteApi(id);
  setItems(items.filter(it => it.id !== id));
};
```

### 🎯 Pattern de Filtrage et Pagination
```javascript
const filtered = items.filter(it => {
  const matchQuery = query ? it.name.toLowerCase().includes(query.toLowerCase()) : true;
  const matchFilter = filter ? it.category === filter : true;
  return matchQuery && matchFilter;
});

const totalPages = Math.ceil(filtered.length / perPage);
const paginatedItems = filtered.slice((page - 1) * perPage, page * perPage);
```

### 🎯 Méthodes HTTP
| Méthode | Utilisation | Exemple |
|---------|-------------|---------|
| **GET** | Lecture/Liste | `client.get('/users')` |
| **POST** | Création | `client.post('/users', data)` |
| **PUT** | Modification complète | `client.put('/users/1', data)` |
| **DELETE** | Suppression | `client.delete('/users/1')` |

### 🎯 Gestion des Erreurs
```javascript
try {
  const result = await apiCall();
  // Succès
} catch (error) {
  const status = error?.response?.status;
  if (status === 401) { /* Non autorisé */ }
  if (status === 404) { /* Non trouvé */ }
  if (status >= 500) { /* Erreur serveur */ }
}
```

---

## 📌 TABLEAU RÉCAPITULATIF DES FONCTIONS

### API Authentification
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `loginEtudiant` | `/auth/etudiant/login` | POST |
| `loginProfesseur` | `/auth/professeur/login` | POST |
| `loginAdmin` | `/auth/admin/login` | POST |

### API Admin - Étudiants
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `adminListEtudiants` | `/admin/etudiants` | GET |
| `adminCreateEtudiant` | `/admin/etudiants` | POST |
| `adminUpdateEtudiant` | `/admin/etudiants/{id}` | PUT |
| `adminDeleteEtudiant` | `/admin/etudiants/{id}` | DELETE |
| `adminAffectationsEtudiant` | `/admin/etudiants/{id}/affectations` | PUT |

### API Admin - Professeurs
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `adminListProfesseurs` | `/admin/professeurs` | GET |
| `adminCreateProfesseur` | `/admin/professeurs` | POST |
| `adminUpdateProfesseur` | `/admin/professeurs/{id}` | PUT |
| `adminDeleteProfesseur` | `/admin/professeurs/{id}` | DELETE |

### API Admin - Juries
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `adminListJuries` | `/admin/juries` | GET |
| `adminCreateJury` | `/admin/juries` | POST |
| `adminShowJury` | `/admin/juries/{id}` | GET |
| `adminUpdateJury` | `/admin/juries/{id}` | PUT |
| `adminDeleteJury` | `/admin/juries/{id}` | DELETE |

### API Admin - Soutenances
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `adminListSoutenances` | `/admin/soutenances` | GET |
| `adminPlanifierSoutenance` | `/admin/soutenances` | POST |
| `adminShowSoutenance` | `/admin/soutenances/{id}` | GET |
| `adminUpdateSoutenance` | `/admin/soutenances/{id}` | PUT |
| `adminDeleteSoutenance` | `/admin/soutenances/{id}` | DELETE |
| `adminUpdateNote` | `/admin/soutenances/{id}/note` | PUT |
| `adminAnnulerSoutenance` | `/admin/soutenances/{id}/annuler` | PUT |

### API Étudiant
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `getEtudiantRapports` | `/etudiants/{id}/rapports` | GET |
| `deposerRapport` | `/etudiants/{id}/rapports` | POST |
| `getEtudiantSoutenance` | `/etudiants/{id}/soutenance` | GET |
| `getRapportRemarques` | `/rapports/{id}/remarques` | GET |

### API Professeur
| Fonction | Endpoint | Méthode |
|----------|----------|---------|
| `getProfesseurRapports` | `/professeurs/{id}/rapports` | GET |
| `getProfesseurSoutenances` | `/professeurs/{id}/soutenances` | GET |
| `addRemarque` | `/rapports/{id}/remarques` | POST |
| `getRapportRemarques` | `/rapports/{id}/remarques` | GET |
| `getProfesseurEtudiants` | (déduit des rapports) | - |

---

## ✅ CHECKLIST DE RÉVISION

- [ ] Comprendre la configuration Axios (intercepteurs, token)
- [ ] Maîtriser Zustand (create, set, état, actions)
- [ ] Connaître le système de routage (Routes, ProtectedRoute)
- [ ] Savoir appeler les API avec async/await
- [ ] Maîtriser useState, useEffect, useMemo
- [ ] Comprendre le pattern CRUD
- [ ] Savoir filtrer et paginer des données
- [ ] Connaître les composants réutilisables
- [ ] Comprendre la gestion des erreurs

---

**Bonne révision ! 📚🎓**
