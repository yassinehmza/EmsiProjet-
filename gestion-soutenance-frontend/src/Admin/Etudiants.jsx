import { useEffect, useState } from 'react';
import {
  adminCreateEtudiant_37fc052773dec1eca97dbc3dcd5f5632,
  adminUpdateEtudiant_4d151a44819abf3afb1a1974bad4609e,
  adminDeleteEtudiant_1d5f4c3f66e30726d68fe646c958369b,
  adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026,
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
  const [query, setQuery] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [affectOpen, setAffectOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', mot_de_passe:'', filiere:'', type_stage:'' });
  const [affect, setAffect] = useState({ encadrant_id:'', rapporteur_id:'' });
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
    setAffect({ encadrant_id:'', rapporteur_id:'' });
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
        encadrant_id: affect.encadrant_id ? Number(affect.encadrant_id) : null,
        rapporteur_id: affect.rapporteur_id ? Number(affect.rapporteur_id) : null,
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

  useEffect(() => {}, []);

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
    <div className="space-y-4">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Étudiants'}]} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-700">Étudiants</h2>
      </div>
      <Card title="Liste des étudiants" actions={<div className="flex items-center gap-2"><Button onClick={() => setCreateOpen(true)}>+ Créer</Button><Button variant="secondary" onClick={()=>{ const rows = filtered; const csv = ['Nom;Prénom;Email;Filière;Type'].concat(rows.map(it => [it.nom||'', it.prenom||'', it.email||'', it.filiere||'', it.type_stage||''].map(v => String(v).replaceAll(';', ',')).join(';'))).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'etudiants.csv'; a.click(); URL.revokeObjectURL(url); }}>Exporter CSV</Button></div>}>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Recherche</span>
            <input className="border rounded px-3 py-2" value={query} onChange={e=>{setQuery(e.target.value); setPage(1);}} placeholder="Nom, email…" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Filière</span>
            <input className="border rounded px-3 py-2" value={filterFiliere} onChange={e=>{setFilterFiliere(e.target.value); setPage(1);}} placeholder="Ex: Informatique" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Type de stage</span>
            <input className="border rounded px-3 py-2" value={filterType} onChange={e=>{setFilterType(e.target.value); setPage(1);}} placeholder="Ex: PFE" />
          </label>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {query && (
            <button onClick={()=>{setQuery(''); setPage(1);}} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">Recherche: {query} ×</button>
          )}
          {filterFiliere && (
            <button onClick={()=>{setFilterFiliere(''); setPage(1);}} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">Filière: {filterFiliere} ×</button>
          )}
          {filterType && (
            <button onClick={()=>{setFilterType(''); setPage(1);}} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">Type: {filterType} ×</button>
          )}
          {(query || filterFiliere || filterType) && (
            <Button variant="secondary" className="ml-auto" onClick={()=>{setQuery(''); setFilterFiliere(''); setFilterType(''); setPage(1);}}>Réinitialiser</Button>
          )}
        </div>
        <Table headers={["Nom","Prénom","Email","Filière","Type de stage","Actions"]}>
          {view.length === 0 && (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={6}>Aucun étudiant</td></tr>
          )}
          {view.map(item => (
            <tr key={item.id} className="odd:bg-emerald-50/30 hover:bg-emerald-50/50">
              <td className="px-4 py-2">{item.nom}</td>
              <td className="px-4 py-2">{item.prenom}</td>
              <td className="px-4 py-2">{item.email}</td>
              <td className="px-4 py-2"><span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">{item.filiere || '—'}</span></td>
              <td className="px-4 py-2"><span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">{item.type_stage || '—'}</span></td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(item)} className="px-3 py-1">Modifier</Button>
                  <Button onClick={() => openAffect(item)} className="px-3 py-1">Affecter</Button>
                  <Button variant="danger" onClick={() => onDelete(item)} className="px-3 py-1">Supprimer</Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        <div className="mt-3 flex items-center gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Précédent</button>
          <span className="text-gray-600">Page {page} / {totalPages}</span>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Suivant</button>
          <select value={perPage} onChange={e=>{setPerPage(Number(e.target.value)); setPage(1);}} className="ml-auto border rounded px-2 py-1">
            {[10,20,50].map(n=>(<option key={n} value={n}>{n}/page</option>))}
          </select>
        </div>
      </Card>

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

      <Modal open={affectOpen} onClose={() => setAffectOpen(false)} title="Affecter Encadrant/Rapporteur">
        <form onSubmit={onAffect} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Encadrant ID</span>
              <input className="border rounded px-3 py-2" value={affect.encadrant_id} onChange={e=>setAffect({...affect, encadrant_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Rapporteur ID</span>
              <input className="border rounded px-3 py-2" value={affect.rapporteur_id} onChange={e=>setAffect({...affect, rapporteur_id:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setAffectOpen(false)}>Annuler</Button>
            <Button type="submit">Affecter</Button>
          </div>
          {status==='error' && <div className="text-red-600">Erreur</div>}
        </form>
      </Modal>
      <ConfirmDialog open={confirm.open} onClose={()=>setConfirm({open:false,item:null})} onConfirm={confirmDelete} title="Supprimer" message="Confirmer la suppression de cet étudiant ?" />
    </div>
  );
}
