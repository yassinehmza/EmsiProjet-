import { useState, useEffect } from 'react';
import {
  adminListProfesseurs,
  adminCreateProfesseur_cf1e2c50cb63465e820288676b2ddcf8,
  adminUpdateProfesseur_1634138ac10fda83bf891647626ec898,
  adminDeleteProfesseur_ec02677e5ec717ba072a6bce027fa0e9,
} from '../api/admin';
import Modal from '../components/Modal';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import ConfirmDialog from '../components/ConfirmDialog';
import { useUI } from '../store/ui';

export default function Professeurs() {
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', mot_de_passe:'', role_soutenance:'' });
  const [status, setStatus] = useState(null);
  const { addToast } = useUI();
  const [confirm, setConfirm] = useState({ open:false, item:null });

  const openEdit = (item) => {
    setCurrent(item);
    setForm({ nom:item.nom||'', prenom:item.prenom||'', email:item.email||'', mot_de_passe:'', role_soutenance:item.role_soutenance||'' });
    setEditOpen(true);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await adminCreateProfesseur_cf1e2c50cb63465e820288676b2ddcf8(form);
      const created = res?.data || res;
      setItems(prev => [created, ...prev]);
      setCreateOpen(false);
      setForm({ nom:'', prenom:'', email:'', mot_de_passe:'', role_soutenance:'' });
      setStatus('success');
      addToast({ type:'success', message:'Professeur créé' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur de création' });
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await adminUpdateProfesseur_1634138ac10fda83bf891647626ec898(current.id, { ...form });
      const updated = res?.data || res;
      setItems(prev => prev.map(it => it.id === current.id ? { ...it, ...updated } : it));
      setEditOpen(false);
      setStatus('success');
      addToast({ type:'success', message:'Professeur mis à jour' });
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
      await adminDeleteProfesseur_ec02677e5ec717ba072a6bce027fa0e9(item.id);
      setItems(prev => prev.filter(it => it.id !== item.id));
      setStatus('success');
      addToast({ type:'success', message:'Professeur supprimé' });
    } catch {
      setStatus('error');
      addToast({ type:'error', message:'Erreur de suppression' });
    } finally {
      setConfirm({ open:false, item:null });
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminListProfesseurs();
        setItems(res?.data || res || []);
      } catch (err) {
        console.error('Erreur chargement professeurs:', err);
        addToast({ type:'error', message:'Erreur de chargement des professeurs' });
      }
    };
    load();
  }, [addToast]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Professeurs'}]} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-700">Professeurs</h2>
      </div>
      <Card title="Liste des professeurs" actions={<Button onClick={() => setCreateOpen(true)}>+ Créer</Button>}>
        <Table headers={["Nom","Prénom","Email","Rôle","Actions"]}>
          {items.length === 0 && (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Aucun professeur</td></tr>
          )}
          {items.map(item => (
            <tr key={item.id} className="hover:bg-emerald-50/50">
              <td className="px-4 py-2">{item.nom}</td>
              <td className="px-4 py-2">{item.prenom}</td>
              <td className="px-4 py-2">{item.email}</td>
              <td className="px-4 py-2">{item.role_soutenance}</td>
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Créer un professeur">
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
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm text-gray-700">Rôle soutenance (optionnel)</span>
              <input className="border rounded px-3 py-2" value={form.role_soutenance} onChange={e=>setForm({...form, role_soutenance:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setCreateOpen(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
          {status==='error' && <div className="text-red-600">Erreur</div>}
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier le professeur">
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
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm text-gray-700">Rôle soutenance (optionnel)</span>
              <input className="border rounded px-3 py-2" value={form.role_soutenance} onChange={e=>setForm({...form, role_soutenance:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setEditOpen(false)}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
          {status==='error' && <div className="text-red-600">Erreur</div>}
        </form>
      </Modal>
      <ConfirmDialog open={confirm.open} onClose={()=>setConfirm({open:false,item:null})} onConfirm={confirmDelete} title="Supprimer" message="Confirmer la suppression de ce professeur ?" />
    </div>
  );
}
