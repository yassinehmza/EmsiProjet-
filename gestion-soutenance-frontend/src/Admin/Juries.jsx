import { useEffect, useState } from 'react';
import {
  adminListJuries_742f25f4fe4d930e29cc345de477347e,
  adminCreateJury_a82970fa5418f991fc2b0e697cf4cdf6,
  adminUpdateJury_6eade27ab0d6a937d07b83fb5d86ef63,
  adminDeleteJury_ba624e52e82d529369f939cb85fce50e,
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
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ president_id:'', rapporteur_id:'', encadrant_id:'', examinateur_id:'' });
  const { addToast } = useUI();
  const [confirm, setConfirm] = useState({ open:false, item:null });

  const load = async () => {
    const res = await adminListJuries_742f25f4fe4d930e29cc345de477347e();
    const list = res?.data || res;
    setItems(Array.isArray(list) ? list : []);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    const payload = {
      president_id: Number(form.president_id),
      rapporteur_id: Number(form.rapporteur_id),
      encadrant_id: Number(form.encadrant_id),
      examinateur_id: Number(form.examinateur_id),
    };
    await adminCreateJury_a82970fa5418f991fc2b0e697cf4cdf6(payload);
    setCreateOpen(false);
    setForm({ president_id:'', rapporteur_id:'', encadrant_id:'', examinateur_id:'' });
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
    setEditOpen(true);
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      president_id: Number(form.president_id),
      rapporteur_id: Number(form.rapporteur_id),
      encadrant_id: Number(form.encadrant_id),
      examinateur_id: Number(form.examinateur_id),
    };
    await adminUpdateJury_6eade27ab0d6a937d07b83fb5d86ef63(current.id, payload);
    setEditOpen(false);
    load();
    addToast({ type:'success', message:'Jury mis à jour' });
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
        <form onSubmit={onCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Président ID</span>
              <input className="border rounded px-3 py-2" value={form.president_id} onChange={e=>setForm({...form, president_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Rapporteur ID</span>
              <input className="border rounded px-3 py-2" value={form.rapporteur_id} onChange={e=>setForm({...form, rapporteur_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Encadrant ID</span>
              <input className="border rounded px-3 py-2" value={form.encadrant_id} onChange={e=>setForm({...form, encadrant_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Examinateur ID</span>
              <input className="border rounded px-3 py-2" value={form.examinateur_id} onChange={e=>setForm({...form, examinateur_id:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setCreateOpen(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier le jury">
        <form onSubmit={onUpdate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Président ID</span>
              <input className="border rounded px-3 py-2" value={form.president_id} onChange={e=>setForm({...form, president_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Rapporteur ID</span>
              <input className="border rounded px-3 py-2" value={form.rapporteur_id} onChange={e=>setForm({...form, rapporteur_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Encadrant ID</span>
              <input className="border rounded px-3 py-2" value={form.encadrant_id} onChange={e=>setForm({...form, encadrant_id:e.target.value})} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Examinateur ID</span>
              <input className="border rounded px-3 py-2" value={form.examinateur_id} onChange={e=>setForm({...form, examinateur_id:e.target.value})} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={()=>setEditOpen(false)}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirm.open} onClose={()=>setConfirm({open:false,item:null})} onConfirm={confirmDelete} title="Supprimer" message="Confirmer la suppression de ce jury ?" />
    </div>
  );
}
