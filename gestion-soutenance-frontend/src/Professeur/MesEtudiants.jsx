import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Table from '../components/Table';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getProfesseurEtudiants, getProfesseurRapports } from '../api/professeur';

export default function MesEtudiants() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rapportsData, setRapportsData] = useState({});

  const loadEtudiants = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const [rapports, etudiants] = await Promise.all([
        getProfesseurRapports(profile.id),
        getProfesseurEtudiants(profile.id)
      ]);

      // Les étudiants sont déjà filtrés par le backend
      setStudents(Array.isArray(etudiants) ? etudiants : []);

      // Compter les rapports par étudiant
      const rapportsCount = {};
      const rapportsArray = Array.isArray(rapports) ? rapports : [];
      rapportsArray.forEach(r => {
        rapportsCount[r.etudiant_id] = (rapportsCount[r.etudiant_id] || 0) + 1;
      });

      setRapportsData(rapportsCount);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
      addToast({ type: 'error', message: 'Erreur lors du chargement des étudiants' });
    } finally {
      setLoading(false);
    }
  };

  // Charger les étudiants au montage du composant
  useEffect(() => {
    loadEtudiants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const columns = [
    {
      key: 'etudiant',
      label: 'Étudiant',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
            {row.nom?.[0]}{row.prenom?.[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.nom} {row.prenom}</div>
            <div className="text-sm text-gray-500">{row.email || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'filiere',
      label: 'Filière',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.filiere || 'N/A'}</div>
          <div className="text-sm text-gray-500">{row.type_stage || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'rapports',
      label: 'Rapports',
      render: (row) => {
        const count = rapportsData[row.id] || 0;
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{count}/4</span>
            <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600" 
                style={{ width: `${(count / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.encadrant_id === profile?.id ? 'bg-purple-100 text-purple-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {row.encadrant_id === profile?.id ? 'Encadrant' : 'Rapporteur'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/professeur/rapports?etudiant=${row.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            title="Voir rapports"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
            </svg>
          </button>
          <button 
            onClick={() => navigate(`/professeur/remarques?etudiant=${row.id}`)}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
            title="Ajouter remarque"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Professeur', href:'/professeur'},{label:'Mes Étudiants'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Étudiants</h1>
          <p className="text-gray-600 mt-1">Gérer et suivre vos étudiants encadrés</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total Étudiants</div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">12</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">En cours</div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">8</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Validés</div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">4</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Taux de réussite</div>
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">92%</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Liste des étudiants</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2">Chargement des étudiants...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <p>Aucun étudiant encadré</p>
          </div>
        ) : (
          <Table columns={columns} data={students} />
        )}
      </div>
    </div>
  );
}
