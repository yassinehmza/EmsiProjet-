import { useEffect, useState } from 'react';
import { adminListSoutenances_633dad0d19aa2bae61af959c5f87364b, adminPlanifierSoutenance_f1c43100c52b779df850cb757bb56d18 } from '../api/admin';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Card from '../components/Card';
import { useUI } from '../store/ui';

export default function Soutenances() {
  const [calDate, setCalDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [salle, setSalle] = useState('');
  const [etudiantId, setEtudiantId] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [listMode, setListMode] = useState(false);
  const { addToast } = useUI();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await adminListSoutenances_633dad0d19aa2bae61af959c5f87364b({ per_page: 500 });
        const list = res?.data || res?.items || res;
        setItems(Array.isArray(list) ? list : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [calDate]);

  useEffect(() => {
    const toMin = (t) => {
      const [h, m] = String(t||'').split(':');
      const hh = Number(h||0), mm = Number(m||0);
      return hh*60 + mm;
    };
    const fmt = (m) => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
    const dayEvents = items.filter(it => it.date === selectedDate && (!salle || (it.salle||'') === salle));
    const intervals = dayEvents.filter(it => it.heure).map(it => {
      const s = toMin(it.heure);
      return [s, s + 90];
    });
    const res = [];
    for (let m = 9*60; m <= (17*60 - 90); m += 30) {
      const end = m + 90;
      const overlap = intervals.some(([s,e]) => !(end <= s || m >= e));
      res.push({ time: fmt(m), available: !overlap });
    }
    setSlots(res);
    setSelectedSlot('');
  }, [items, selectedDate, salle]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !salle || !etudiantId) return;
    setSubmitting(true);
    try {
      const heure = selectedSlot.slice(0,5);
      await adminPlanifierSoutenance_f1c43100c52b779df850cb757bb56d18({
        date: selectedDate,
        heure,
        salle,
        etudiant_id: Number(etudiantId),
      });
      addToast({ type:'success', message:'Soutenance planifiée' });
      setSelectedSlot('');
    } catch (err) {
      const msg = (err?.response?.data?.message) || (err?.response?.data?.error) || 'Validation échouée';
      addToast({ type:'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const toKey = (dt) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth()+1).padStart(2,'0');
    const d = String(dt.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const todayIso = toKey(new Date());
  const monthStart = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
  const monthEnd = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const mondayIndex = (monthStart.getDay() + 6) % 7; // Lundi = 0
  const prevDays = Array.from({ length: mondayIndex }).map((_, i) => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - (mondayIndex - i));
    return d;
  });
  const currentDays = Array.from({ length: daysInMonth }).map((_, i) => new Date(calDate.getFullYear(), calDate.getMonth(), i + 1));
  const totalCells = Math.ceil((prevDays.length + currentDays.length) / 7) * 7;
  const nextFill = totalCells - (prevDays.length + currentDays.length);
  const nextDays = Array.from({ length: nextFill }).map((_, i) => {
    const d = new Date(monthEnd);
    d.setDate(d.getDate() + (i + 1));
    return d;
  });
  const calendarDays = [...prevDays, ...currentDays, ...nextDays].map(d => ({
    date: d,
    iso: toKey(d),
    inMonth: d.getMonth() === calDate.getMonth(),
    weekend: d.getDay() === 0 || d.getDay() === 6,
    past: toKey(d) < todayIso,
  }));
  const eventsByDate = items.reduce((acc, it) => {
    const k = it.date || '';
    if (!k) return acc;
    acc[k] = acc[k] || [];
    acc[k].push(it);
    return acc;
  }, {});

  

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{label:'Admin', href:'/admin'},{label:'Soutenances'}]} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-700">Planifier une soutenance</h2>
      </div>
      
      <Card title="Calendrier">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-700">{calDate.toLocaleString(undefined, { month:'long', year:'numeric' })}</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={()=>setCalDate(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))}>Précédent</Button>
            <Button variant="secondary" onClick={()=>setCalDate(new Date())}>Aujourd'hui</Button>
            <Button variant="secondary" onClick={()=>setCalDate(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))}>Suivant</Button>
            <Button variant="secondary" onClick={()=>setListMode(v=>!v)}>{listMode ? 'Compacte' : 'Lister'}</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-600">
          {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d=>(<div key={d} className="px-2 py-1">{d}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((d, idx) => (
            <div
              key={idx}
              onClick={() => { if (d.past && d.iso!==todayIso) return; setSelectedDate(d.iso); }}
              className={`cursor-pointer border rounded p-2 min-h-[112px] ${d.inMonth?'bg-white':'bg-gray-50'} ${selectedDate===d.iso?'ring-2 ring-[#05A66B]':''} ${d.weekend?'bg-gray-50':''} ${d.past && d.iso!==todayIso?'opacity-60 cursor-not-allowed':''}`}
            >
              <div className="flex items-center justify-between">
                <div className={`text-sm ${d.inMonth?'text-gray-800':'text-gray-400'}`}>{d.date.getDate()}</div>
                <div className="text-xs text-gray-500">{(eventsByDate[d.iso]?.length||0)} evt</div>
              </div>
              <div className="mt-2 space-y-1">
                {(!listMode ? (eventsByDate[d.iso]||[]).slice(0,2) : (eventsByDate[d.iso]||[])).map(ev => (
                  <div key={ev.id} className={`${listMode ? 'border border-[#05A66B] bg-white text-gray-700' : 'bg-[#05A66B]/10 text-[#05A66B]'} text-[11px] px-2 py-1 rounded`}>
                    {listMode ? (
                      <div className="space-y-0.5">
                        <div className="font-medium text-[#05A66B]">{ev.heure || '—'}</div>
                        <div>Étudiant {ev.etudiant_id || '—'}</div>
                        <div>Salle {ev.salle || '—'}</div>
                        <div>Jury {ev.jury_id || '—'}</div>
                      </div>
                    ) : (
                      <div className="truncate">{ev.heure} · {ev.salle || 'Salle'}</div>
                    )}
                  </div>
                ))}
                {!listMode && ((eventsByDate[d.iso]||[]).length>2) && (
                  <div className="text-[11px] text-gray-500">+{(eventsByDate[d.iso].length-2)} autres</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-[#05A66B]"></span> Sélectionné</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-gray-200"></span> Week‑end</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded bg-gray-400"></span> Passé</div>
        </div>
      </Card>
      {selectedDate && (
        <Card title="Planification">
          <div className="space-y-4">
            <div className="text-sm text-gray-700">Date sélectionnée: <span className="font-medium text-[#05A66B]">{selectedDate}</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">Étudiant ID</span>
                <input className="border rounded px-3 py-2" value={etudiantId} onChange={e=>setEtudiantId(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">Salle</span>
                <input className="border rounded px-3 py-2" value={salle} onChange={e=>setSalle(e.target.value)} />
              </label>
              <div className="flex items-end gap-2">
                <Button variant="secondary" onClick={()=>{ setSelectedDate(''); setSelectedSlot(''); }}>Réinitialiser</Button>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-700 mb-2">Heures disponibles</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {slots.map(s => (
                  <button key={s.time} disabled={!s.available} onClick={()=>setSelectedSlot(s.time)} className={`px-3 py-2 rounded border ${selectedSlot===s.time?'bg-[#05A66B] text-white border-[#05A66B]':''} ${s.available?'hover:border-[#05A66B]':'opacity-50 cursor-not-allowed'}`}>{s.time}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={()=>{ setSelectedDate(''); setSelectedSlot(''); }}>Annuler</Button>
              <Button disabled={!selectedDate || !selectedSlot || !salle || !etudiantId || submitting} onClick={onSubmit}>Planifier</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
