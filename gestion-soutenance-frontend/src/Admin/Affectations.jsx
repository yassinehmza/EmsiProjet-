import { useState, useEffect } from 'react';
import { adminListEtudiants, adminListProfesseurs, adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026 } from '../api/admin';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUI } from '../store/ui';
import Card from '../components/Card';

export default function Affectations() {
  const [etudiants, setEtudiants] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [affectationForm, setAffectationForm] = useState({
    encadrant_id: null,
    rapporteur_id: null
  });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useUI();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [etudiantsData, professeursData] = await Promise.all([
        adminListEtudiants(),
        adminListProfesseurs()
      ]);
      setEtudiants(etudiantsData);
      setProfesseurs(professeursData);
    } catch (error) {
      console.error('Erreur chargement:', error);
      addToast({ type: 'error', message: 'Erreur de chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleAffectation = async (etudiant) => {
    setSelectedEtudiant(etudiant);
    setAffectationForm({
      encadrant_id: etudiant.encadrant_id || null,
      rapporteur_id: etudiant.rapporteur_id || null
    });
  };

  const handleSaveAffectation = async () => {
    if (!selectedEtudiant) return;

    setSubmitting(true);
    try {
      await adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026(
        selectedEtudiant.id,
        affectationForm
      );
      
      // Update local state
      setEtudiants(prev => prev.map(e => 
        e.id === selectedEtudiant.id 
          ? { 
              ...e, 
              encadrant_id: affectationForm.encadrant_id,
              rapporteur_id: affectationForm.rapporteur_id,
              encadrant: professeurs.find(p => p.id === affectationForm.encadrant_id),
              rapporteur: professeurs.find(p => p.id === affectationForm.rapporteur_id)
            }
          : e
      ));

      addToast({ type: 'success', message: 'Affectations enregistrées avec succès' });
      setSelectedEtudiant(null);
    } catch (error) {
      console.error('Erreur affectation:', error);
      addToast({ type: 'error', message: 'Erreur lors de l\'enregistrement' });
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique filieres for filter
  const filieres = [...new Set(etudiants.map(e => e.filiere))].filter(Boolean);

  // Filter etudiants
  const filteredEtudiants = etudiants.filter(e => {
    const matchQuery = !searchQuery || 
      `${e.nom} ${e.prenom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFiliere = !filterFiliere || e.filiere === filterFiliere;
    return matchQuery && matchFiliere;
  });

  // Statistics
  const stats = {
    total: etudiants.length,
    affectes: etudiants.filter(e => e.encadrant_id && e.rapporteur_id).length,
    partiel: etudiants.filter(e => (e.encadrant_id || e.rapporteur_id) && !(e.encadrant_id && e.rapporteur_id)).length,
    nonAffectes: etudiants.filter(e => !e.encadrant_id && !e.rapporteur_id).length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Affectations'}]} />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Affectations</h1>
        <p className="text-gray-600 mt-1">Affecter les encadrants et rapporteurs aux étudiants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600 mb-2">Total étudiants</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">Complètement affectés</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.affectes}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.affectes / stats.total) * 100) : 0}%
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">Partiellement affectés</div>
          <div className="text-3xl font-bold text-amber-600">{stats.partiel}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">Non affectés</div>
          <div className="text-3xl font-bold text-red-600">{stats.nonAffectes}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              type="text"
              placeholder="Nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
            <select
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
            >
              <option value="">Toutes les filières</option>
              {filieres.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Etudiants List */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Liste des étudiants</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#008D36] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filière</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Encadrant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rapporteur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEtudiants.map(etudiant => {
                  const hasEncadrant = !!etudiant.encadrant_id;
                  const hasRapporteur = !!etudiant.rapporteur_id;
                  const isComplete = hasEncadrant && hasRapporteur;
                  const isPartial = (hasEncadrant || hasRapporteur) && !isComplete;
                  
                  return (
                    <tr key={etudiant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{etudiant.nom} {etudiant.prenom}</div>
                          <div className="text-sm text-gray-500">{etudiant.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {etudiant.filiere}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {etudiant.encadrant ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {etudiant.encadrant.nom} {etudiant.encadrant.prenom}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Non affecté</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {etudiant.rapporteur ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {etudiant.rapporteur.nom} {etudiant.rapporteur.prenom}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Non affecté</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isComplete ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            Complet
                          </span>
                        ) : isPartial ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                            Partiel
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Vide
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAffectation(etudiant)}
                          className="text-[#008D36] hover:text-[#05A66B] font-medium text-sm"
                        >
                          {isComplete ? 'Modifier' : 'Affecter'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredEtudiants.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                Aucun étudiant trouvé
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Affectation Modal */}
      {selectedEtudiant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Affecter - {selectedEtudiant.nom} {selectedEtudiant.prenom}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encadrant
                </label>
                <select
                  value={affectationForm.encadrant_id || ''}
                  onChange={(e) => setAffectationForm({
                    ...affectationForm,
                    encadrant_id: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                >
                  <option value="">-- Sélectionner un encadrant --</option>
                  {professeurs.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nom} {prof.prenom} {prof.role_soutenance ? `(${prof.role_soutenance})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rapporteur
                </label>
                <select
                  value={affectationForm.rapporteur_id || ''}
                  onChange={(e) => setAffectationForm({
                    ...affectationForm,
                    rapporteur_id: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                >
                  <option value="">-- Sélectionner un rapporteur --</option>
                  {professeurs.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nom} {prof.prenom} {prof.role_soutenance ? `(${prof.role_soutenance})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {affectationForm.encadrant_id && affectationForm.rapporteur_id && 
               affectationForm.encadrant_id === affectationForm.rapporteur_id && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    ⚠️ L'encadrant et le rapporteur sont la même personne
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedEtudiant(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveAffectation}
                className="flex-1 px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
