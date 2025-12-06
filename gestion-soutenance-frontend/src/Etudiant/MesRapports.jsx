import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getEtudiantRapports } from '../api/etudiant';

export default function MesRapports() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedRapport, setSelectedRapport] = useState(null);

  useEffect(() => {
    const loadRapports = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        const data = await getEtudiantRapports(profile.id);
        setRapports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur chargement rapports:', error);
        addToast({ type: 'error', message: 'Erreur lors du chargement des rapports' });
      } finally {
        setLoading(false);
      }
    };
    
    loadRapports();
  }, [profile, addToast]);

  const handleUpload = (rapport) => {
    setSelectedRapport(rapport);
    setShowUpload(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Mes Rapports'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Rapports</h1>
          <p className="text-gray-600 mt-1">Gérer et soumettre vos rapports de stage</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Progression des rapports</h2>
            <p className="text-blue-100">3 rapports sur 4 validés</p>
          </div>
          <div className="text-4xl font-bold">75%</div>
        </div>
        <div className="h-3 bg-blue-400/30 rounded-full overflow-hidden">
          <div className="h-full bg-white" style={{width: '75%'}}></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Déposés</div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
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
          <div className="text-3xl font-bold text-gray-900">2</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">En cours</div>
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">1</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Note moyenne</div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">15.5</div>
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Déposer un rapport</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de rapport</label>
              <input
                type="text"
                value={selectedRapport?.type || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-1">Cliquer pour sélectionner ou glisser-déposer</p>
                <p className="text-sm text-gray-400">PDF uniquement (max 10MB)</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ajouter un commentaire..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Déposer le rapport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Tous les rapports</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {rapports.map((rapport) => (
            <div key={rapport.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    rapport.statut === 'Validé' ? 'bg-emerald-100 text-emerald-600' :
                    rapport.statut === 'En cours' ? 'bg-amber-100 text-amber-600' :
                    rapport.statut === 'À déposer' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{rapport.type}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      {rapport.dateDepot && (
                        <span className="text-sm text-gray-500">
                          Déposé le {new Date(rapport.dateDepot).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {rapport.note && (
                        <span className="text-sm font-semibold text-purple-600">
                          Note: {rapport.note}/20
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rapport.statut === 'Validé' ? 'bg-emerald-100 text-emerald-700' :
                    rapport.statut === 'En cours' ? 'bg-amber-100 text-amber-700' :
                    rapport.statut === 'À déposer' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {rapport.statut}
                  </span>
                  {rapport.statut === 'À déposer' ? (
                    <button
                      onClick={() => handleUpload(rapport)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Déposer
                    </button>
                  ) : (
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Télécharger">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
