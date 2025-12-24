import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getProfesseurRapports, addRemarque } from '../api/professeur';
import { downloadRapport } from '../api/etudiant';

export default function Rapports() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  const loadRapports = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const data = await getProfesseurRapports(profile.id);
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
      addToast({ type: 'error', message: 'Erreur lors du chargement des rapports' });
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRapports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [note, setNote] = useState('');
  const [remarques, setRemarques] = useState('');

  const handleValidate = (report) => {
    setSelectedReport(report);
    setNote(report.note || '');
    setRemarques('');
    setShowModal(true);
  };

  const handleDownload = async (rapport) => {
    if (!rapport.fichier_path) {
      addToast({ type: 'error', message: 'Aucun fichier disponible' });
      return;
    }
    
    try {
      const blob = await downloadRapport(rapport.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_${rapport.etudiant?.nom || 'etudiant'}_${rapport.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast({ type: 'success', message: 'Téléchargement réussi' });
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      addToast({ type: 'error', message: 'Erreur lors du téléchargement' });
    }
  };

  const handleSubmitValidation = async () => {
    if (!selectedReport) return;
    
    if (!remarques.trim()) {
      addToast('Veuillez saisir une remarque', 'error');
      return;
    }

    setValidating(true);
    try {
      // Ajouter une remarque sur le rapport
      let contenuRemarque = remarques;
      
      // Inclure la note dans la remarque si fournie
      if (note && note >= 0 && note <= 20) {
        contenuRemarque = `Note suggérée: ${note}/20\n\n${remarques}`;
      }
      
      await addRemarque(selectedReport.id, {
        contenu: contenuRemarque
      });

      addToast('Remarque ajoutée avec succès', 'success');
      setShowModal(false);
      setNote('');
      setRemarques('');
      
      // Recharger les rapports
      await loadRapports();
    } catch (error) {
      console.error('Erreur ajout remarque:', error);
      addToast('Erreur lors de l\'ajout de la remarque', 'error');
    } finally {
      setValidating(false);
    }
  };

  const columns = [
    {
      key: 'etudiant',
      label: 'Étudiant',
      render: (row) => {
        const nom = row.etudiant?.nom || 'N/A';
        const prenom = row.etudiant?.prenom || '';
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#05A66B] to-[#008D36] flex items-center justify-center text-white font-semibold">
              {nom[0]}{prenom[0]}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{nom} {prenom}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="font-medium text-gray-900">{row.type || `Rapport ${row.id}`}</span>
      )
    },
    {
      key: 'dateDepot',
      label: 'Date de dépôt',
      render: (row) => (
        <span className="text-gray-600">
          {row.date_depot ? new Date(row.date_depot).toLocaleDateString('fr-FR') : 'N/A'}
        </span>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const etat = row.etat || 'en_attente';
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            etat === 'valide' ? 'bg-emerald-100 text-emerald-700' :
            etat === 'en_attente' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {etat === 'valide' ? 'Validé' : etat === 'en_attente' ? 'En attente' : 'Refusé'}
          </span>
        );
      }
    },
    {
      key: 'note',
      label: 'Note',
      render: (row) => (
        row.note ? (
          <span className="font-semibold text-gray-900">{row.note}/20</span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleDownload(row)}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
            title="Télécharger"
            disabled={!row.fichier_path}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button 
            onClick={() => handleValidate(row)}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
            title="Ajouter une remarque"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Professeur', href:'/professeur'},{label:'Rapports'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600 mt-1">Consulter et valider les rapports de stage</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total</div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : reports.length}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">En attente</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : reports.filter(r => r.etat === 'en_attente').length}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Validés</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : reports.filter(r => r.etat === 'valide').length}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Refusés</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : reports.filter(r => r.etat === 'refuse').length}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Liste des rapports</h2>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="valide">Validé</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2">Chargement des rapports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
            </svg>
            <p>Aucun rapport assigné</p>
          </div>
        ) : (
          <Table columns={columns} data={reports} />
        )}
      </div>

      {/* Validation Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Évaluer le rapport">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note suggérée /20 (optionnelle)</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Entrer une note suggérée"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarques <span className="text-red-500">*</span></label>
            <textarea
              value={remarques}
              onChange={(e) => setRemarques(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ajouter des remarques..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmitValidation}
              disabled={validating}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validating ? 'Envoi...' : 'Envoyer la remarque'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
