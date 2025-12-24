import { useState, useEffect } from 'react';
import { 
  adminListSoutenances_633dad0d19aa2bae61af959c5f87364b,
  adminPlanifierSoutenance_f1c43100c52b779df850cb757bb56d18,
  adminUpdateSoutenance_a0694f3f508d04e1fdc8cb136de39928,
  adminDeleteSoutenance_8ed5d102440291b1ea86f177230df544,
  adminListEtudiants,
  adminListJuries_742f25f4fe4d930e29cc345de477347e
} from '../api/admin';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUI } from '../store/ui';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Planification() {
  const [soutenances, setSoutenances] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [juries, setJuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSoutenance, setCurrentSoutenance] = useState(null);
  const [formData, setFormData] = useState({
    etudiant_id: '',
    jury_id: '',
    date: '',
    heure: '',
    salle: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { addToast } = useUI();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [soutenancesData, etudiantsData, juriesData] = await Promise.all([
        adminListSoutenances_633dad0d19aa2bae61af959c5f87364b(),
        adminListEtudiants(),
        adminListJuries_742f25f4fe4d930e29cc345de477347e()
      ]);
      
      // Handle paginated response from backend
      const soutenancesList = soutenancesData?.data || soutenancesData || [];
      const etudiantsList = Array.isArray(etudiantsData) ? etudiantsData : [];
      const juriesList = Array.isArray(juriesData) ? juriesData : [];
      
      setSoutenances(soutenancesList);
      setEtudiants(etudiantsList);
      setJuries(juriesList.filter(j => j.statut !== 'annule'));
    } catch (error) {
      console.error('Erreur chargement:', error);
      addToast({ type: 'error', message: 'Erreur de chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = (formData, excludeId = null) => {
    const conflicts = [];
    const newDate = formData.date;
    const newHeure = formData.heure;
    const newSalle = formData.salle;

    soutenances.forEach(s => {
      if (s.id === excludeId) return; // Skip the current soutenance being edited
      if (s.statut === 'annulee') return; // Skip cancelled soutenances

      // Check date and time conflict in same room
      if (s.date === newDate && s.heure === newHeure && s.salle === newSalle) {
        conflicts.push({
          type: 'salle',
          message: `Conflit : La salle ${newSalle} est déjà réservée le ${newDate} à ${newHeure}`
        });
      }

      // Check jury availability (same jury at same time)
      if (s.date === newDate && s.heure === newHeure && s.jury_id === parseInt(formData.jury_id)) {
        conflicts.push({
          type: 'jury',
          message: `Conflit : Le jury est déjà affecté à une autre soutenance le ${newDate} à ${newHeure}`
        });
      }

      // Check student (one soutenance per student)
      if (s.etudiant_id === parseInt(formData.etudiant_id) && !excludeId) {
        conflicts.push({
          type: 'etudiant',
          message: `Conflit : Cet étudiant a déjà une soutenance planifiée`
        });
      }
    });

    return conflicts;
  };

  const handleCreate = () => {
    setEditMode(false);
    setCurrentSoutenance(null);
    setFormData({
      etudiant_id: '',
      jury_id: '',
      date: selectedDate,
      heure: '09:00',
      salle: ''
    });
    setShowModal(true);
  };

  const handleEdit = (soutenance) => {
    setEditMode(true);
    setCurrentSoutenance(soutenance);
    setFormData({
      etudiant_id: soutenance.etudiant_id,
      jury_id: soutenance.jury_id,
      date: soutenance.date,
      heure: soutenance.heure,
      salle: soutenance.salle
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for conflicts
    const conflicts = checkConflicts(formData, currentSoutenance?.id);
    if (conflicts.length > 0) {
      conflicts.forEach(c => {
        addToast({ type: 'error', message: c.message });
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editMode && currentSoutenance) {
        const updated = await adminUpdateSoutenance_a0694f3f508d04e1fdc8cb136de39928(
          currentSoutenance.id,
          formData
        );
        const updatedData = updated?.soutenance || updated;
        setSoutenances(prev => prev.map(s => 
          s.id === currentSoutenance.id ? { ...s, ...updatedData } : s
        ));
        addToast({ type: 'success', message: 'Soutenance mise à jour' });
      } else {
        const created = await adminPlanifierSoutenance_f1c43100c52b779df850cb757bb56d18(formData);
        const createdData = created?.soutenance || created;
        setSoutenances(prev => [...prev, createdData]);
        addToast({ type: 'success', message: 'Soutenance créée' });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erreur:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de l\'enregistrement' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm.item) return;

    try {
      await adminDeleteSoutenance_8ed5d102440291b1ea86f177230df544(confirm.item.id);
      setSoutenances(prev => prev.filter(s => s.id !== confirm.item.id));
      addToast({ type: 'success', message: 'Soutenance supprimée' });
    } catch (error) {
      console.error('Erreur suppression:', error);
      addToast({ type: 'error', message: 'Erreur lors de la suppression' });
    } finally {
      setConfirm({ open: false, item: null });
    }
  };

  // Get soutenances for selected date
  const soutenancesForDate = soutenances.filter(s => s.date === selectedDate);

  // Get available etudiants (without soutenance)
  const availableEtudiants = etudiants.filter(e => 
    !soutenances.some(s => s.etudiant_id === e.id && s.statut !== 'annulee')
  );

  // Get available juries (active only)
  const availableJuries = juries.filter(j => j.statut === 'actif');

  // Statistics
  const stats = {
    total: soutenances.filter(s => s.statut !== 'annulee').length,
    aujourdhui: soutenances.filter(s => 
      s.date === new Date().toISOString().split('T')[0] && s.statut !== 'annulee'
    ).length,
    prochaines: soutenances.filter(s => 
      new Date(s.date) > new Date() && s.statut !== 'annulee'
    ).length,
    passees: soutenances.filter(s => 
      new Date(s.date) < new Date() && s.statut !== 'annulee'
    ).length
  };

  // Group soutenances by time for the selected date
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Planification'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planification des Soutenances</h1>
          <p className="text-gray-600 mt-1">Gérer le calendrier et détecter les conflits</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] transition-colors"
        >
          Planifier une soutenance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600 mb-2">Total planifiées</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">Aujourd'hui</div>
          <div className="text-3xl font-bold text-blue-600">{stats.aujourdhui}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">À venir</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.prochaines}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-2">Passées</div>
          <div className="text-3xl font-bold text-gray-400">{stats.passees}</div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            viewMode === 'calendar'
              ? 'bg-[#008D36] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Vue Calendrier
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-[#008D36] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Vue Liste
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Date Selector */}
          <Card>
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-700">Date :</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
              />
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Aujourd'hui
              </button>
            </div>
          </Card>

          {/* Time Slots Grid */}
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Planning du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {timeSlots.map(time => {
                const soutenancesAtTime = soutenancesForDate.filter(s => s.heure === time);
                
                return (
                  <div key={time} className="border border-gray-200 rounded-xl p-4">
                    <div className="font-bold text-gray-900 mb-3">{time}</div>
                    
                    {soutenancesAtTime.length === 0 ? (
                      <div className="text-gray-400 text-sm italic">Aucune soutenance</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {soutenancesAtTime.map(soutenance => {
                          const etudiant = etudiants.find(e => e.id === soutenance.etudiant_id);
                          const jury = juries.find(j => j.id === soutenance.jury_id);
                          
                          return (
                            <div
                              key={soutenance.id}
                              className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium text-gray-900">
                                  Salle {soutenance.salle}
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEdit(soutenance)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title="Modifier"
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => setConfirm({ open: true, item: soutenance })}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Supprimer"
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm text-gray-700">
                                {etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'Étudiant inconnu'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Jury #{jury?.id || 'N/A'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        /* List View */
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Toutes les soutenances</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jury</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {soutenances
                    .filter(s => s.statut !== 'annulee')
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(soutenance => {
                      const etudiant = etudiants.find(e => e.id === soutenance.etudiant_id);
                      
                      return (
                        <tr key={soutenance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(soutenance.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{soutenance.heure}</td>
                          <td className="px-6 py-4">
                            {etudiant ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {etudiant.nom} {etudiant.prenom}
                                </div>
                                <div className="text-gray-500">{etudiant.email}</div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Inconnu</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{soutenance.salle}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">Jury #{soutenance.jury_id}</td>
                          <td className="px-6 py-4">
                            {soutenance.note ? (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
                                {soutenance.note}/20
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(soutenance)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => setConfirm({ open: true, item: soutenance })}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              
              {soutenances.filter(s => s.statut !== 'annulee').length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  Aucune soutenance planifiée
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editMode ? 'Modifier la soutenance' : 'Planifier une soutenance'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Étudiant *</label>
            <select
              value={formData.etudiant_id}
              onChange={(e) => setFormData({...formData, etudiant_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
              required
              disabled={editMode}
            >
              <option value="">-- Sélectionner un étudiant --</option>
              {(editMode ? etudiants : availableEtudiants).map(e => (
                <option key={e.id} value={e.id}>
                  {e.nom} {e.prenom} - {e.filiere}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jury *</label>
            <select
              value={formData.jury_id}
              onChange={(e) => setFormData({...formData, jury_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
              required
            >
              <option value="">-- Sélectionner un jury --</option>
              {availableJuries.map(j => (
                <option key={j.id} value={j.id}>
                  Jury #{j.id} (Président: Prof #{j.president_id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
              <select
                value={formData.heure}
                onChange={(e) => setFormData({...formData, heure: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
                required
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salle *</label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              placeholder="Ex: C102, Amphi A, Salle 301"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008D36]"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : editMode ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer la soutenance"
        message="Êtes-vous sûr de vouloir supprimer cette soutenance ? Cette action est irréversible."
      />
    </div>
  );
}
