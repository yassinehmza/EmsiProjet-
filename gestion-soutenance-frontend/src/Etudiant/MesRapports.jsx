import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getEtudiantRapports, deposerRapport } from '../api/etudiant';

export default function MesRapports() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    date_depot: new Date().toISOString().split('T')[0],
    commentaire: '',
    fichier: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRapports();
  }, [profile]);

  const loadRapports = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const data = await getEtudiantRapports(profile.id);
      setRapports(data);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
      addToast({ type: 'error', message: 'Erreur lors du chargement des rapports' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRapport = async (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) {
      addToast({ type: 'error', message: 'Le titre est requis' });
      return;
    }

    if (!formData.fichier) {
      addToast({ type: 'error', message: 'Veuillez sélectionner un fichier' });
      return;
    }

    setSubmitting(true);
    try {
      // Créer FormData pour envoyer le fichier
      const formPayload = new FormData();
      formPayload.append('titre', formData.titre);
      formPayload.append('date_depot', formData.date_depot);
      formPayload.append('commentaire', formData.commentaire);
      formPayload.append('fichier', formData.fichier);

      await deposerRapport(profile.id, formPayload);
      addToast({ type: 'success', message: 'Rapport déposé avec succès' });
      setShowUpload(false);
      setFormData({ titre: '', date_depot: new Date().toISOString().split('T')[0], commentaire: '', fichier: null });
      loadRapports();
    } catch (error) {
      console.error('Erreur dépôt rapport:', error);
      addToast({ type: 'error', message: error.response?.data?.message || 'Erreur lors du dépôt du rapport' });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculer les stats
  const stats = {
    total: rapports.length,
    valides: rapports.filter(r => r.etat === 'valide').length,
    enCours: rapports.filter(r => r.etat === 'en_attente').length,
    noteMoyenne: rapports.filter(r => r.note).length > 0 
      ? (rapports.reduce((sum, r) => sum + (r.note || 0), 0) / rapports.filter(r => r.note).length).toFixed(1)
      : 'N/A'
  };

  const mapEtatToStatut = (etat) => {
    const mapping = {
      'en_attente': 'En cours',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };
    return mapping[etat] || etat;
  };

  const getStatutColor = (etat) => {
    switch(etat) {
      case 'valide': return 'bg-emerald-100 text-emerald-700';
      case 'en_attente': return 'bg-amber-100 text-amber-700';
      case 'rejete': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIconColor = (etat) => {
    switch(etat) {
      case 'valide': return 'bg-emerald-100 text-emerald-600';
      case 'en_attente': return 'bg-amber-100 text-amber-600';
      case 'rejete': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Mes Rapports'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rapports</h1>
          <p className="text-gray-600 mt-1">Gérer et soumettre vos rapports de stage</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] transition-colors"
        >
          Nouveau rapport
        </button>
      </div>

      {/* Progress Overview */}
      {stats.total > 0 && (
        <div className="bg-[#008D36] rounded-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold mb-1">Progression des rapports</h2>
              <p className="text-emerald-100 text-sm">{stats.valides} rapports sur {stats.total} validés</p>
            </div>
            <div className="text-3xl font-bold">{Math.round((stats.valides / stats.total) * 100)}%</div>
          </div>
          <div className="h-2 bg-emerald-400/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{width: `${(stats.valides / stats.total) * 100}%`}}></div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Déposés</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Validés</div>
          <div className="text-3xl font-bold text-gray-900">{stats.valides}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">En cours</div>
          <div className="text-3xl font-bold text-gray-900">{stats.enCours}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Note moyenne</div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.noteMoyenne}</div>
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Déposer un rapport</h2>
          <form onSubmit={handleSubmitRapport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre du rapport</label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                placeholder="Ex: Rapport mensuel - Décembre 2024"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de dépôt</label>
              <input
                type="date"
                value={formData.date_depot}
                onChange={(e) => setFormData({...formData, date_depot: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier du rapport (PDF, DOC, DOCX) *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData({...formData, fichier: e.target.files[0]})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#008D36] file:text-white file:cursor-pointer hover:file:bg-[#05A66B] file:text-sm file:font-medium"
                required
              />
              {formData.fichier && (
                <p className="mt-2 text-sm text-emerald-600 flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Fichier sélectionné : {formData.fichier.name} ({(formData.fichier.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
              <textarea
                rows={3}
                value={formData.commentaire}
                onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                placeholder="Ajouter un commentaire..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setFormData({ titre: '', date_depot: new Date().toISOString().split('T')[0], commentaire: '', fichier: null });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] transition-colors disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? 'Dépôt en cours...' : 'Déposer le rapport'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Tous les rapports</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#008D36] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des rapports...</p>
          </div>
        ) : rapports.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
            </svg>
            <p className="text-gray-500 mb-4">Aucun rapport déposé</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] transition-colors"
            >
              Déposer votre premier rapport
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {rapports.map((rapport) => (
              <div key={rapport.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${getIconColor(rapport.etat)}`}>
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{rapport.titre}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Déposé le {new Date(rapport.date_depot).toLocaleDateString('fr-FR')}
                        </span>
                        {rapport.note && (
                          <span className="text-sm font-semibold text-[#008D36]">
                            Note: {rapport.note}/20
                          </span>
                        )}
                      </div>
                      {rapport.commentaire && (
                        <p className="text-sm text-gray-600 mt-1">{rapport.commentaire}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(rapport.etat)}`}>
                      {mapEtatToStatut(rapport.etat)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
