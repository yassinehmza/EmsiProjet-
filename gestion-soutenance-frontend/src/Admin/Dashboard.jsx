import { useEffect, useMemo, useState } from 'react';
import { adminListJuries_742f25f4fe4d930e29cc345de477347e } from '../api/admin';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { useUI } from '../store/ui';

export default function Dashboard() {
  const [juries, setJuries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useUI();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const jRes = await adminListJuries_742f25f4fe4d930e29cc345de477347e();
        const jList = jRes?.data || jRes;
        setJuries(Array.isArray(jList) ? jList : []);
      } catch {
        addToast({ type:'error', message:'Erreur de chargement du dashboard' });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [addToast]);

  const metrics = useMemo(() => ([
    { icon: HeartIcon(), value: 124, label: 'Étudiants Inscrits' },
    { icon: UserIcon(), value: 45, label: 'Professeurs' },
    { icon: HeartIcon(), value: 89, label: 'Affectations Complètes' },
    { icon: HeartIcon(), value: juries.length || 23, label: 'Juris Formés' },
  ]), [juries.length]);

  const students = useMemo(() => {
    const prenoms = ['Adam','Sara','Youssef','Mariam','Amine','Fatima','Omar','Nadia','Rachid','Imane','Hassan','Salma'];
    return prenoms.map((p, i) => ({
      nom: 'Q. Demi',
      prenom: p,
      email: `etudiant${i+1}@exemple.com`,
      filiere: ['Système','Réseau','Cloud','DevOps','IA'][i%5],
      type: ['Juryté','PFE','Stage','Alternance'][i%4],
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight text-gray-900 text-center">Tableau de bord</div>
        <div className="h-1 w-16 bg-[#008D36] mx-auto rounded mt-2"></div>
      </div>

      <section className="soft-section rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white rounded-xl border shadow-sm hover:shadow-md hover-lift animate-step-in" style={{ animationDelay: `${idx*120}ms` }}>
              <div className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#008D36] text-white flex items-center justify-center">{m.icon}</div>
                <div>
                  <div className="text-3xl font-bold text-[#008D36]">{loading ? '…' : m.value}</div>
                  <div className="text-sm text-gray-600">{m.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Card title="Liste des étudiants" actions={<Button variant="secondary">Exporter</Button>}>
        <Table headers={["Nom","Prénom","Email","Filière","Type Stage","Action"]}>
          {students.map((s, i) => (
            <tr key={i} className="hover:bg-emerald-50/50">
              <td className="px-4 py-2">{s.nom}</td>
              <td className="px-4 py-2">{s.prenom}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.filiere}</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center rounded-full bg-[#008D36] text-white px-3 py-1 text-xs">{s.type}</span>
              </td>
              <td className="px-4 py-2">
                <Button variant="secondary" className="px-3 py-1 text-sm">Action</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1.01 4.5 2.5C12.09 5.01 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
  );
}
