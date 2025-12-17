import { useEffect, useState, useMemo } from 'react';
import {
  adminListEtudiants,
  adminCreateEtudiant_37fc052773dec1eca97dbc3dcd5f5632,
  adminUpdateEtudiant_4d151a44819abf3afb1a1974bad4609e,
  adminDeleteEtudiant_1d5f4c3f66e30726d68fe646c958369b,
  adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026,
  adminListProfesseurs,
} from '../api/admin';
import Modal from '../components/Modal';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import ConfirmDialog from '../components/ConfirmDialog';
import { useUI } from '../store/ui';

export default function Etudiants() {
  const [items, setItems] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [query, setQuery] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [affectOpen, setAffectOpen] = useState(false);
  const [affectMode, setAffectMode] = useState('view'); // 'view', 'edit', 'create'
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', mot_de_passe:'', filiere:'', type_stage:'' });
  const [selectedEncadrant, setSelectedEncadrant] = useState(null);
  const [selectedRapporteur, setSelectedRapporteur] = useState(null);
  const [searchEncadrant, setSearchEncadrant] = useState('');
  const [searchRapporteur, setSearchRapporteur] = useState('');
  const [showEncadrantDropdown, setShowEncadrantDropdown] = useState(false);
  const [showRapporteurDropdown, setShowRapporteurDropdown] = useState(false);
  const [status, setStatus] = useState(null);
  const { addToast } = useUI();
  const [confirm, setConfirm] = useState({ open:false, item:null });

  const openEdit = (item) => {
    setCurrent(item);
    setForm({ nom:item.nom||'', prenom:item.prenom||'', email:item.email||'', mot_de_passe:'', filiere:item.filiere||'', type_stage:item.type_stage||'' });
    setEditOpen(true);
  };

  const openAffect = (item) => {
    setCurrent(item);
    
    // Déterminer le mode: view si déjà affecté, create sinon
    const hasAffectations = item.encadrant_id || item.rapporteur_id;
    setAffectMode(hasAffectations ? 'view' : 'create');
    
    // Si déjà affecté, charger les données existantes
    if (hasAffectations) {
      setSelectedEncadrant(item.encadrant || null);
      setSelectedRapporteur(item.rapporteur || null);
    } else {
      setSelectedEncadrant(null);
      setSelectedRapporteur(null);
    }
    
    setSearchEncadrant('');
    setSearchRapporteur('');
    setAffectOpen(true);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await adminCreateEtudiant_37fc052773dec1eca97dbc3dcd5f5632(form);
      const created = res?.data || res;
      setItems(prev => [created, ...prev]);
      setCreateOpen(false);
      setForm({ nom:'', prenom:'', email:'', mot_de_passe:'', filiere:'', type_stage:'' });
      setStatus('success');
      addToast({ type:'success', message:'Étudiant créé' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur de création' });
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await adminUpdateEtudiant_4d151a44819abf3afb1a1974bad4609e(current.id, { ...form });
      const updated = res?.data || res;
      setItems(prev => prev.map(it => it.id === current.id ? { ...it, ...updated } : it));
      setEditOpen(false);
      setStatus('success');
      addToast({ type:'success', message:'Étudiant mis à jour' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur de mise à jour' });
    }
  };

  const onDelete = async (item) => {
    setConfirm({ open:true, item });
  };
  const confirmDelete = async () => {
    const item = confirm.item;
    setStatus('loading');
    try {
      await adminDeleteEtudiant_1d5f4c3f66e30726d68fe646c958369b(item.id);
      setItems(prev => prev.filter(it => it.id !== item.id));
      setStatus('success');
      addToast({ type:'success', message:'Étudiant supprimé' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur de suppression' });
    } finally {
      setConfirm({ open:false, item:null });
    }
  };

  const onAffect = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const payload = {
        encadrant_id: selectedEncadrant ? selectedEncadrant.id : null,
        rapporteur_id: selectedRapporteur ? selectedRapporteur.id : null,
      };
      await adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026(current.id, payload);
      setAffectOpen(false);
      setStatus('success');
      addToast({ type:'success', message:'Affectations enregistrées' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur d\'affectation' });
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [etudRes, profRes] = await Promise.all([
          adminListEtudiants(),
          adminListProfesseurs()
        ]);
        setItems(etudRes?.data || etudRes || []);
        setProfesseurs(profRes?.data || profRes || []);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        addToast({ type:'error', message:'Erreur de chargement des étudiants' });
      }
    };
    load();
  }, [addToast]);

  // Filtrage professeurs pour encadrant
  const filteredEncadrants = useMemo(() => {
    if (!searchEncadrant.trim()) return professeurs;
    const term = searchEncadrant.toLowerCase();
    return professeurs.filter(p => 
      `${p.nom} ${p.prenom}`.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  }, [professeurs, searchEncadrant]);

  // Filtrage professeurs pour rapporteur
  const filteredRapporteurs = useMemo(() => {
    if (!searchRapporteur.trim()) return professeurs;
    const term = searchRapporteur.toLowerCase();
    return professeurs.filter(p => 
      `${p.nom} ${p.prenom}`.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  }, [professeurs, searchRapporteur]);

  const filtered = items.filter(it => {
    const s = `${it.nom||''} ${it.prenom||''} ${it.email||''}`.toLowerCase();
    const okQ = query ? s.includes(query.toLowerCase()) : true;
    const okF = filterFiliere ? String(it.filiere||'').toLowerCase().includes(filterFiliere.toLowerCase()) : true;
    const okT = filterType ? String(it.type_stage||'').toLowerCase().includes(filterType.toLowerCase()) : true;
    return okQ && okF && okT;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const view = filtered.slice(start, start + perPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec stats */}
      <div>
        <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Étudiants'}]} />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <span className="text-gray-600 text-sm">Total</span>
            <div className="text-3xl font-bold text-gray-900 mt-1">{items.length}</div>
            <div className="text-gray-500 text-sm mt-1">Étudiants inscrits</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <span className="text-gray-600 text-sm">Résultats</span>
            <div className="text-3xl font-bold text-gray-900 mt-1">{filtered.length}</div>
            <div className="text-gray-500 text-sm mt-1">Trouvés</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <span className="text-gray-600 text-sm">Page</span>
            <div className="text-3xl font-bold text-gray-900 mt-1">{page}/{totalPages}</div>
            <div className="text-gray-500 text-sm mt-1">Pagination</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <span className="text-gray-600 text-sm">Par page</span>
            <div className="text-3xl font-bold text-gray-900 mt-1">{perPage}</div>
            <div className="text-gray-500 text-sm mt-1">Affichés</div>
          </div>
        </div>
      </div>

      {/* Carte principale avec design moderne */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header de la carte */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Gestion des étudiants</h2>
              <p className="text-sm text-gray-600 mt-1">Gérer les inscriptions et affectations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={()=>{ 
                  const rows = filtered;
                  // En-têtes avec guillemets pour éviter les problèmes
                  const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Filière', 'Type de Stage'];
                  
                  // Fonction pour échapper les valeurs CSV correctement
                  const escapeCSV = (value) => {
                    if (value == null) return '';
                    const str = String(value);
                    // Si contient guillemets, virgules ou sauts de ligne, on encadre avec guillemets
                    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
                      return '"' + str.replaceAll('"', '""') + '"';
                    }
                    return str;
                  };
                  
                  // Construction du CSV avec virgule comme séparateur (standard)
                  const csvContent = [
                    headers.join(','),
                    ...rows.map(it => [
                      it.id || '',
                      escapeCSV(it.nom),
                      escapeCSV(it.prenom),
                      escapeCSV(it.email),
                      escapeCSV(it.filiere),
                      escapeCSV(it.type_stage)
                    ].join(','))
                  ].join('\n');
                  
                  // Ajout du BOM UTF-8 pour Excel
                  const BOM = '\uFEFF';
                  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  
                  // Nom de fichier avec date
                  const date = new Date().toISOString().split('T')[0];
                  a.download = `etudiants_${date}.csv`;
                  
                  a.click();
                  URL.revokeObjectURL(url);
                  
                  addToast({ type: 'success', message: `${rows.length} étudiant(s) exporté(s)` });
                }}
                variant="secondary"
              >
                Exporter CSV
              </Button>
              <Button onClick={() => setCreateOpen(true)}>
                Nouvel étudiant
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres améliorés */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche globale</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                value={query} 
                onChange={e=>{setQuery(e.target.value); setPage(1);}} 
                placeholder="Rechercher par nom, email..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                value={filterFiliere} 
                onChange={e=>{setFilterFiliere(e.target.value); setPage(1);}} 
                placeholder="Filtrer par filière"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de stage</label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                value={filterType} 
                onChange={e=>{setFilterType(e.target.value); setPage(1);}} 
                placeholder="Filtrer par type"
              />
            </div>
          </div>
          {(query || filterFiliere || filterType) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
              {query && (
                <button 
                  onClick={()=>{setQuery(''); setPage(1);}} 
                  className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm"
                >
                  Recherche: {query} ×
                </button>
              )}
              {filterFiliere && (
                <button 
                  onClick={()=>{setFilterFiliere(''); setPage(1);}} 
                  className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm"
                >
                  Filière: {filterFiliere} ×
                </button>
              )}
              {filterType && (
                <button 
                  onClick={()=>{setFilterType(''); setPage(1);}} 
                  className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm"
                >
                  Type: {filterType} ×
                </button>
              )}
              <button 
                onClick={()=>{setQuery(''); setFilterFiliere(''); setFilterType(''); setPage(1);}} 
                className="ml-auto px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
              >
                Réinitialiser tout
              </button>
            </div>
          )}
        </div>

        {/* Table améliorée */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {["Nom","Prénom","Email","Filière","Type de stage","Actions"].map(header => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {view.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-16 w-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      <p className="text-lg font-medium">Aucun étudiant trouvé</p>
                      <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres ou ajoutez un nouvel étudiant</p>
                    </div>
                  </td>
                </tr>
              )}
              {view.map((item, idx) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-emerald-50/30 transition-colors group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#008D36] to-[#05A66B] text-white flex items-center justify-center font-bold shadow-lg">
                        {item.nom?.[0]?.toUpperCase() || 'E'}
                      </div>
                      <span className="font-semibold text-gray-900">{item.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{item.prenom}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span className="text-sm">{item.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                      {item.filiere || 'Non défini'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                      </svg>
                      {item.type_stage || 'Non défini'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(item)} 
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Modifier"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => openAffect(item)} 
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Affecter"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => onDelete(item)} 
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Supprimer"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination moderne */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Affichage de <span className="font-semibold text-gray-900">{start + 1}</span> à <span className="font-semibold text-gray-900">{Math.min(start + perPage, filtered.length)}</span> sur <span className="font-semibold text-gray-900">{filtered.length}</span> résultats
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                disabled={page<=1} 
                onClick={()=>setPage(p=>p-1)} 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-10 w-10 rounded-lg font-medium transition-all ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </div>
              
              <button 
                disabled={page>=totalPages} 
                onClick={()=>setPage(p=>p+1)} 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lignes par page:</span>
              <select 
                value={perPage} 
                onChange={e=>{setPerPage(Number(e.target.value)); setPage(1);}} 
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-gray-700"
              >
                {[10,20,50].map(n=>(<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Créer un étudiant">
        <form onSubmit={onCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Nom</span>
              <input className="border rounded px-3 py-2" value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Prénom</span>
              <input className="border rounded px-3 py-2" value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Email</span>
              <input className="border rounded px-3 py-2" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Mot de passe</span>
              <input className="border rounded px-3 py-2" type="password" value={form.mot_de_passe} onChange={e=>setForm({...form, mot_de_passe:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Filière</span>
              <input className="border rounded px-3 py-2" value={form.filiere} onChange={e=>setForm({...form, filiere:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Type de stage</span>
              <input className="border rounded px-3 py-2" value={form.type_stage} onChange={e=>setForm({...form, type_stage:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setCreateOpen(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
          {status==='error' && <div className="text-red-600">Erreur</div>}
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier l'étudiant">
        <form onSubmit={onUpdate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Nom</span>
              <input className="border rounded px-3 py-2" value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Prénom</span>
              <input className="border rounded px-3 py-2" value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Email</span>
              <input className="border rounded px-3 py-2" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Mot de passe (optionnel)</span>
              <input className="border rounded px-3 py-2" type="password" value={form.mot_de_passe} onChange={e=>setForm({...form, mot_de_passe:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Filière</span>
              <input className="border rounded px-3 py-2" value={form.filiere} onChange={e=>setForm({...form, filiere:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Type de stage</span>
              <input className="border rounded px-3 py-2" value={form.type_stage} onChange={e=>setForm({...form, type_stage:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setEditOpen(false)}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
          {status==='error' && <div className="text-red-600">Erreur</div>}
        </form>
      </Modal>

      <Modal open={affectOpen} onClose={() => setAffectOpen(false)} title={
        <div className="flex items-center justify-between">
          <span>{affectMode === 'view' ? '👀 Affectations' : affectMode === 'edit' ? '✏️ Modifier' : '➕ Affecter'} - {current?.nom} {current?.prenom}</span>
          {affectMode === 'view' && (
            <Button variant="secondary" onClick={() => setAffectMode('edit')} className="text-sm">
              ✏️ Modifier
            </Button>
          )}
        </div>
      }>
        <form onSubmit={onAffect} className="space-y-4">
          {affectMode === 'view' ? (
            /* MODE LECTURE */
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-gray-600 uppercase mb-3">Affectations actuelles</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">👨‍🏫 Encadrant</div>
                    {selectedEncadrant ? (
                      <div className="bg-white border rounded p-3">
                        <div className="font-semibold text-emerald-700">{selectedEncadrant.nom} {selectedEncadrant.prenom}</div>
                        <div className="text-xs text-gray-500 mt-1">{selectedEncadrant.email}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Aucun encadrant affecté</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">📝 Rapporteur</div>
                    {selectedRapporteur ? (
                      <div className="bg-white border rounded p-3">
                        <div className="font-semibold text-emerald-700">{selectedRapporteur.nom} {selectedRapporteur.prenom}</div>
                        <div className="text-xs text-gray-500 mt-1">{selectedRapporteur.email}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Aucun rapporteur affecté</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={()=>setAffectOpen(false)}>Fermer</Button>
              </div>
            </div>
          ) : (
            /* MODE CRÉATION / ÉDITION */
            <div className="space-y-3">
              {/* Encadrant */}
              <div className="relative">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">👨‍🏫 Encadrant</span>
                  <input 
                    className="border rounded px-3 py-2" 
                    value={selectedEncadrant ? `${selectedEncadrant.nom} ${selectedEncadrant.prenom}` : searchEncadrant}
                    onChange={e => {
                      setSearchEncadrant(e.target.value);
                      setSelectedEncadrant(null);
                      setShowEncadrantDropdown(true);
                    }}
                    onFocus={() => setShowEncadrantDropdown(true)}
                    placeholder="🔍 Rechercher un encadrant..." 
                  />
                </label>
                {showEncadrantDropdown && !selectedEncadrant && affectMode !== 'view' && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredEncadrants.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Aucun professeur trouvé</div>
                  ) : (
                    filteredEncadrants.map(p => (
                      <div 
                        key={p.id} 
                        className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedEncadrant(p);
                          setSearchEncadrant('');
                          setShowEncadrantDropdown(false);
                        }}
                      >
                        <div className="font-medium text-sm">{p.nom} {p.prenom}</div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedEncadrant && (
                <div className="mt-1 text-xs text-emerald-600">
                  ✓ Sélectionné: {selectedEncadrant.nom} {selectedEncadrant.prenom}
                </div>
              )}
            </div>

            {/* Rapporteur */}
            <div className="relative">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">📝 Rapporteur</span>
                <input 
                  className="border rounded px-3 py-2" 
                  value={selectedRapporteur ? `${selectedRapporteur.nom} ${selectedRapporteur.prenom}` : searchRapporteur}
                  onChange={e => {
                    setSearchRapporteur(e.target.value);
                    setSelectedRapporteur(null);
                    setShowRapporteurDropdown(true);
                  }}
                  onFocus={() => setShowRapporteurDropdown(true)}
                  placeholder="🔍 Rechercher un rapporteur..."
                />
              </label>
              {showRapporteurDropdown && !selectedRapporteur && affectMode !== 'view' && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredRapporteurs.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Aucun professeur trouvé</div>
                  ) : (
                    filteredRapporteurs.map(p => (
                      <div 
                        key={p.id} 
                        className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedRapporteur(p);
                          setSearchRapporteur('');
                          setShowRapporteurDropdown(false);
                        }}
                      >
                        <div className="font-medium text-sm">{p.nom} {p.prenom}</div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedRapporteur && (
                <div className="mt-1 text-xs text-emerald-600">
                  ✓ Sélectionné: {selectedRapporteur.nom} {selectedRapporteur.prenom}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={()=>{setAffectOpen(false); setAffectMode('view');}}>Annuler</Button>
              <Button type="submit">💾 Enregistrer</Button>
            </div>
            {status==='error' && <div className="text-red-600 text-sm">Erreur lors de l'affectation</div>}
          </div>
          )}
        </form>
      </Modal>
      <ConfirmDialog open={confirm.open} onClose={()=>setConfirm({open:false,item:null})} onConfirm={confirmDelete} title="Supprimer" message="Confirmer la suppression de cet étudiant ?" />
    </div>
  );
}
