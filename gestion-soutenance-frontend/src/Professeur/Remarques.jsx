import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getProfesseurRapports, addRemarque, getRapportRemarques } from '../api/professeur';

export default function Remarques() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [searchParams] = useSearchParams();
  const etudiantId = searchParams.get('etudiant');

  const [rapports, setRapports] = useState([]);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [remarques, setRemarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewRemarque, setShowNewRemarque] = useState(false);
  const [newRemarque, setNewRemarque] = useState('');

  const loadRapports = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const data = await getProfesseurRapports(profile.id);
      let filtered = Array.isArray(data) ? data : [];
      
      if (etudiantId) {
        filtered = filtered.filter(r => r.etudiant_id === parseInt(etudiantId));
      }
      
      setRapports(filtered);
      
      if (filtered.length > 0) {
        await loadRemarques(filtered[0].id);
        setSelectedRapport(filtered[0]);
      }
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
      addToast({ type: 'error', message: 'Erreur lors du chargement des rapports' });
    } finally {
      setLoading(false);
    }
  };

  const loadRemarques = async (rapportId) => {
    try {
      const data = await getRapportRemarques(rapportId);
      setRemarques(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement remarques:', error);
      setRemarques([]);
    }
  };

  const handleSelectRapport = async (rapport) => {
    setSelectedRapport(rapport);
    await loadRemarques(rapport.id);
  };

  useEffect(() => {
    loadRapports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, etudiantId]);

  const handleSubmitRemarque = async () => {
    if (!newRemarque.trim() || !selectedRapport) {
      addToast({ type: 'error', message: 'Veuillez saisir une remarque' });
      return;
    }

    try {
      await addRemarque(selectedRapport.id, {
        contenu: newRemarque,
        professeur_id: profile.id
      });
      
      addToast({ type: 'success', message: 'Remarque ajoutée avec succès' });
      setNewRemarque('');
      setShowNewRemarque(false);
      
      await loadRemarques(selectedRapport.id);
    } catch (error) {
      console.error('Erreur ajout remarque:', error);
      addToast({ type: 'error', message: 'Erreur lors de l\'ajout de la remarque' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Professeur', href:'/professeur'},{label:'Remarques'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remarques</h1>
          <p className="text-gray-600 mt-1">Gérer les remarques et feedbacks</p>
        </div>
        <button
          onClick={() => setShowNewRemarque(!showNewRemarque)}
          disabled={!selectedRapport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nouvelle remarque
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-500">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rapports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Rapports</h2>
                <p className="text-sm text-gray-500 mt-1">{rapports.length} rapport(s)</p>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {rapports.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
                    </svg>
                    <p className="text-sm">Aucun rapport</p>
                  </div>
                ) : (
                  rapports.map((rapport) => (
                    <button
                      key={rapport.id}
                      onClick={() => handleSelectRapport(rapport)}
                      className={`w-full p-4 text-left hover:bg-purple-50 transition-colors ${
                        selectedRapport?.id === rapport.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{rapport.type || `Rapport ${rapport.id}`}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {rapport.etudiant?.nom} {rapport.etudiant?.prenom}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {rapport.date_depot ? new Date(rapport.date_depot).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Remarques List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  {selectedRapport ? `Remarques - ${selectedRapport.type || `Rapport ${selectedRapport.id}`}` : 'Remarques'}
                </h2>
                {selectedRapport && (
                  <p className="text-sm text-gray-500 mt-1">
                    {remarques.length} remarque(s)
                  </p>
                )}
              </div>

              {/* New Remarque Form */}
              {showNewRemarque && selectedRapport && (
                <div className="p-4 border-b border-gray-100 bg-purple-50/50 animate-slide-up">
                  <h3 className="font-medium text-gray-900 mb-3">Nouvelle remarque</h3>
                  <textarea
                    value={newRemarque}
                    onChange={(e) => setNewRemarque(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Entrer votre remarque..."
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setShowNewRemarque(false);
                        setNewRemarque('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitRemarque}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {!selectedRapport ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <p>Sélectionnez un rapport pour voir les remarques</p>
                  </div>
                ) : remarques.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <p>Aucune remarque pour ce rapport</p>
                    <button
                      onClick={() => setShowNewRemarque(true)}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Ajouter une remarque
                    </button>
                  </div>
                ) : (
                  remarques.map((remarque) => (
                    <div key={remarque.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {remarque.professeur?.nom?.[0]}{remarque.professeur?.prenom?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {remarque.professeur?.nom} {remarque.professeur?.prenom}
                            </div>
                            <div className="text-xs text-gray-500">
                              {remarque.created_at ? new Date(remarque.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 pl-13 whitespace-pre-wrap">{remarque.contenu}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
