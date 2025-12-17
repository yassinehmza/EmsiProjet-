import { useEffect, useState } from 'react';
import {
  adminListJuries_742f25f4fe4d930e29cc345de477347e,
  adminCreateJury_a82970fa5418f991fc2b0e697cf4cdf6,
  adminUpdateJury_6eade27ab0d6a937d07b83fb5d86ef63,
  adminDeleteJury_ba624e52e82d529369f939cb85fce50e,
  adminListProfesseurs,
} from '../api/admin';
import Modal from '../components/Modal';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import ConfirmDialog from '../components/ConfirmDialog';
import { useUI } from '../store/ui';

export default function Juries() {
  const [items, setItems] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ president_id:'', rapporteur_id:'', encadrant_id:'', examinateur_id:'' });
  const { addToast } = useUI();
  const [confirm, setConfirm] = useState({ open:false, item:null });
  const [search, setSearch] = useState({ president:'', rapporteur:'', encadrant:'', examinateur:'' });

  const load = async () => {
    const [juriesRes, profsRes] = await Promise.all([
      adminListJuries_742f25f4fe4d930e29cc345de477347e(),
      adminListProfesseurs()
    ]);
    const list = juriesRes?.data || juriesRes;
    setItems(Array.isArray(list) ? list : []);
    const profs = profsRes?.data || profsRes;
    setProfesseurs(Array.isArray(profs) ? profs : []);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.president_id || !form.rapporteur_id || !form.encadrant_id || !form.examinateur_id) {
      addToast({ type:'error', message:'Veuillez sélectionner tous les membres du jury' });
      return;
    }
    const payload = {
      president_id: Number(form.president_id),
      rapporteur_id: Number(form.rapporteur_id),
      encadrant_id: Number(form.encadrant_id),
      examinateur_id: Number(form.examinateur_id),
    };
    await adminCreateJury_a82970fa5418f991fc2b0e697cf4cdf6(payload);
    setCreateOpen(false);
    setForm({ president_id:'', rapporteur_id:'', encadrant_id:'', examinateur_id:'' });
    setSearch({ president:'', rapporteur:'', encadrant:'', examinateur:'' });
    load();
    addToast({ type:'success', message:'Jury créé' });
  };

  const openEdit = (item) => {
    setCurrent(item);
    setForm({
      president_id: item.president_id || '',
      rapporteur_id: item.rapporteur_id || '',
      encadrant_id: item.encadrant_id || '',
      examinateur_id: item.examinateur_id || '',
    });
    // Pre-fill search with current professor names
    const president = professeurs.find(p => p.id === item.president_id);
    const rapporteur = professeurs.find(p => p.id === item.rapporteur_id);
    const encadrant = professeurs.find(p => p.id === item.encadrant_id);
    const examinateur = professeurs.find(p => p.id === item.examinateur_id);
    setSearch({
      president: president ? `${president.nom} ${president.prenom}` : '',
      rapporteur: rapporteur ? `${rapporteur.nom} ${rapporteur.prenom}` : '',
      encadrant: encadrant ? `${encadrant.nom} ${encadrant.prenom}` : '',
      examinateur: examinateur ? `${examinateur.nom} ${examinateur.prenom}` : '',
    });
    setEditOpen(true);
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    if (!form.president_id || !form.rapporteur_id || !form.encadrant_id || !form.examinateur_id) {
      addToast({ type:'error', message:'Veuillez sélectionner tous les membres du jury' });
      return;
    }
    const payload = {
      president_id: Number(form.president_id),
      rapporteur_id: Number(form.rapporteur_id),
      encadrant_id: Number(form.encadrant_id),
      examinateur_id: Number(form.examinateur_id),
    };
    await adminUpdateJury_6eade27ab0d6a937d07b83fb5d86ef63(current.id, payload);
    setEditOpen(false);
    setSearch({ president:'', rapporteur:'', encadrant:'', examinateur:'' });
    load();
    addToast({ type:'success', message:'Jury mis à jour' });
  };

  // Helper to filter professors by search
  const filterProfs = (searchTerm, excludeIds = []) => {
    if (!searchTerm) return professeurs.filter(p => !excludeIds.includes(p.id));
    const term = searchTerm.toLowerCase();
    return professeurs.filter(p => 
      !excludeIds.includes(p.id) &&
      (`${p.nom} ${p.prenom}`.toLowerCase().includes(term) || 
       `${p.prenom} ${p.nom}`.toLowerCase().includes(term) ||
       p.email.toLowerCase().includes(term))
    );
  };

  // Helper to select a professor
  const selectProf = (role, prof) => {
    setForm({...form, [`${role}_id`]: prof.id});
    setSearch({...search, [role]: `${prof.nom} ${prof.prenom}`});
  };

  const onDelete = async (item) => {
    setConfirm({ open:true, item });
  };
  const confirmDelete = async () => {
    const item = confirm.item;
    await adminDeleteJury_ba624e52e82d529369f939cb85fce50e(item.id);
    load();
    addToast({ type:'success', message:'Jury supprimé' });
    setConfirm({ open:false, item:null });
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Juries'}]} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-700">Juries</h2>
      </div>
      <Card title="Liste des jurys" actions={<Button onClick={() => setCreateOpen(true)}>+ Créer</Button>}>
        <Table headers={["Président","Rapporteur","Encadrant","Examinateur","Actions"]}>
          {items.length === 0 && (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Aucun jury</td></tr>
          )}
          {items.map(item => (
            <tr key={item.id} className="hover:bg-emerald-50/50">
              <td className="px-4 py-2">
                {item.president ? `${item.president.nom} ${item.president.prenom}` : `ID ${item.president_id}`}
              </td>
              <td className="px-4 py-2">
                {item.rapporteur ? `${item.rapporteur.nom} ${item.rapporteur.prenom}` : `ID ${item.rapporteur_id}`}
              </td>
              <td className="px-4 py-2">
                {item.encadrant ? `${item.encadrant.nom} ${item.encadrant.prenom}` : `ID ${item.encadrant_id}`}
              </td>
              <td className="px-4 py-2">
                {item.examinateur ? `${item.examinateur.nom} ${item.examinateur.prenom}` : `ID ${item.examinateur_id}`}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(item)} className="px-3 py-1">Modifier</Button>
                  <Button variant="danger" onClick={() => onDelete(item)} className="px-3 py-1">Supprimer</Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Créer un jury">
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Président */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Président</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.president}
                onChange={e => {
                  setSearch({...search, president: e.target.value});
                  if (!e.target.value) setForm({...form, president_id: ''});
                }}
              />
              {search.president && !form.president_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.president, [form.rapporteur_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('president', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.president, [form.rapporteur_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.president_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.president}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, president_id: ''});
                      setSearch({...search, president: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Rapporteur */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Rapporteur</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.rapporteur}
                onChange={e => {
                  setSearch({...search, rapporteur: e.target.value});
                  if (!e.target.value) setForm({...form, rapporteur_id: ''});
                }}
              />
              {search.rapporteur && !form.rapporteur_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.rapporteur, [form.president_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('rapporteur', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.rapporteur, [form.president_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.rapporteur_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.rapporteur}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, rapporteur_id: ''});
                      setSearch({...search, rapporteur: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Encadrant */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Encadrant</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.encadrant}
                onChange={e => {
                  setSearch({...search, encadrant: e.target.value});
                  if (!e.target.value) setForm({...form, encadrant_id: ''});
                }}
              />
              {search.encadrant && !form.encadrant_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.encadrant, [form.president_id, form.rapporteur_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('encadrant', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.encadrant, [form.president_id, form.rapporteur_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.encadrant_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.encadrant}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, encadrant_id: ''});
                      setSearch({...search, encadrant: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Examinateur */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Examinateur</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.examinateur}
                onChange={e => {
                  setSearch({...search, examinateur: e.target.value});
                  if (!e.target.value) setForm({...form, examinateur_id: ''});
                }}
              />
              {search.examinateur && !form.examinateur_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.examinateur, [form.president_id, form.rapporteur_id, form.encadrant_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('examinateur', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.examinateur, [form.president_id, form.rapporteur_id, form.encadrant_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.examinateur_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.examinateur}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, examinateur_id: ''});
                      setSearch({...search, examinateur: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={()=>{setCreateOpen(false); setSearch({ president:'', rapporteur:'', encadrant:'', examinateur:'' });}}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier le jury">
        <form onSubmit={onUpdate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Président */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Président</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.president}
                onChange={e => {
                  setSearch({...search, president: e.target.value});
                  if (!e.target.value) setForm({...form, president_id: ''});
                }}
              />
              {search.president && !form.president_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.president, [form.rapporteur_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('president', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.president, [form.rapporteur_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.president_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.president}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, president_id: ''});
                      setSearch({...search, president: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Rapporteur */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Rapporteur</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.rapporteur}
                onChange={e => {
                  setSearch({...search, rapporteur: e.target.value});
                  if (!e.target.value) setForm({...form, rapporteur_id: ''});
                }}
              />
              {search.rapporteur && !form.rapporteur_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.rapporteur, [form.president_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('rapporteur', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.rapporteur, [form.president_id, form.encadrant_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.rapporteur_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.rapporteur}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, rapporteur_id: ''});
                      setSearch({...search, rapporteur: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Encadrant */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Encadrant</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.encadrant}
                onChange={e => {
                  setSearch({...search, encadrant: e.target.value});
                  if (!e.target.value) setForm({...form, encadrant_id: ''});
                }}
              />
              {search.encadrant && !form.encadrant_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.encadrant, [form.president_id, form.rapporteur_id, form.examinateur_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('encadrant', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.encadrant, [form.president_id, form.rapporteur_id, form.examinateur_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.encadrant_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.encadrant}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, encadrant_id: ''});
                      setSearch({...search, encadrant: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>

            {/* Examinateur */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Examinateur</label>
              <input 
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008D36] focus:border-transparent"
                placeholder="Rechercher un professeur..."
                value={search.examinateur}
                onChange={e => {
                  setSearch({...search, examinateur: e.target.value});
                  if (!e.target.value) setForm({...form, examinateur_id: ''});
                }}
              />
              {search.examinateur && !form.examinateur_id && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                  {filterProfs(search.examinateur, [form.president_id, form.rapporteur_id, form.encadrant_id].filter(Boolean)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => selectProf('examinateur', p)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{p.nom} {p.prenom}</div>
                      <div className="text-xs text-gray-500">{p.email} - {p.role_soutenance}</div>
                    </div>
                  ))}
                  {filterProfs(search.examinateur, [form.president_id, form.rapporteur_id, form.encadrant_id].filter(Boolean)).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">Aucun professeur trouvé</div>
                  )}
                </div>
              )}
              {form.examinateur_id && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-gray-900">{search.examinateur}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setForm({...form, examinateur_id: ''});
                      setSearch({...search, examinateur: ''});
                    }}
                    className="ml-auto text-gray-500 hover:text-red-600"
                  >×</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={()=>{setEditOpen(false); setSearch({ president:'', rapporteur:'', encadrant:'', examinateur:'' });}}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirm.open} onClose={()=>setConfirm({open:false,item:null})} onConfirm={confirmDelete} title="Supprimer" message="Confirmer la suppression de ce jury ?" />
    </div>
  );
}
