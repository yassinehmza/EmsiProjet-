import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getEtudiantRapports, getRapportRemarques } from '../api/etudiant';

export default function Remarques() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [remarques, setRemarques] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      // Charger tous les rapports de l'étudiant
      const rapportsData = await getEtudiantRapports(profile.id);
      setRapports(rapportsData);

      // Charger les remarques pour chaque rapport
      const allRemarques = [];
      for (const rapport of rapportsData) {
        try {
          const remarquesData = await getRapportRemarques(rapport.id);
          // Ajouter le titre du rapport à chaque remarque
          const remarquesAvecRapport = remarquesData.map(rem => ({
            ...rem,
            rapportTitre: rapport.titre,
            rapportId: rapport.id
          }));
          allRemarques.push(...remarquesAvecRapport);
        } catch (error) {
          console.error(`Erreur chargement remarques pour rapport ${rapport.id}:`, error);
        }
      }
      
      setRemarques(allRemarques);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      addToast({ type: 'error', message: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const filteredRemarques = remarques.filter(r => {
    if (filter === 'all') return true;
    // On peut ajouter des filtres si le backend retourne un champ statut
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Remarques'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Remarques</h1>
          <p className="text-gray-600 mt-1">Consulter les feedbacks de vos professeurs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total</div>
          <div className="text-3xl font-bold text-gray-900">{remarques.length}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Rapports commentés</div>
          <div className="text-3xl font-bold text-gray-900">{new Set(remarques.map(r => r.rapportId)).size}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Professeurs</div>
          <div className="text-3xl font-bold text-gray-900">
            {new Set(remarques.map(r => r.professeur?.id || r.professeur_id)).size}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-[#008D36] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({remarques.length})
          </button>
        </div>
      </div>

      {/* Remarques List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Mes remarques</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#008D36] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des remarques...</p>
          </div>
        ) : filteredRemarques.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <p className="text-gray-500">Aucune remarque trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRemarques.map((remarque) => (
              <div key={remarque.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#05A66B] to-[#008D36] flex items-center justify-center text-white font-semibold">
                      {remarque.professeur?.nom?.charAt(0) || 'P'}{remarque.professeur?.prenom?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {remarque.professeur?.nom && remarque.professeur?.prenom 
                          ? `${remarque.professeur.nom} ${remarque.professeur.prenom}`
                          : 'Professeur'}
                      </div>
                      <div className="text-sm text-gray-500">{remarque.rapportTitre || `Rapport #${remarque.rapportId}`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {remarque.date_creation && (
                      <span className="text-sm text-gray-500">
                        {new Date(remarque.date_creation).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pl-15">
                  <p className="text-gray-700 leading-relaxed">{remarque.contenu}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
