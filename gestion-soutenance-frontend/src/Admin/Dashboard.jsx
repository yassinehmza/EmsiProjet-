import { useEffect, useMemo, useState } from 'react';
import { adminListJuries_742f25f4fe4d930e29cc345de477347e, adminListEtudiants, adminListProfesseurs } from '../api/admin';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { useUI } from '../store/ui';

export default function Dashboard() {
  const [juries, setJuries] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useUI();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [jRes, eRes, pRes] = await Promise.all([
          adminListJuries_742f25f4fe4d930e29cc345de477347e(),
          adminListEtudiants(),
          adminListProfesseurs()
        ]);
        setJuries(Array.isArray(jRes?.data || jRes) ? (jRes?.data || jRes) : []);
        setEtudiants(Array.isArray(eRes?.data || eRes) ? (eRes?.data || eRes) : []);
        setProfesseurs(Array.isArray(pRes?.data || pRes) ? (pRes?.data || pRes) : []);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        addToast({ type:'error', message:'Erreur de chargement du dashboard' });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [addToast]);

  const metrics = useMemo(() => ([
    { value: etudiants.length, label: 'Étudiants Inscrits' },
    { value: professeurs.length, label: 'Professeurs' },
    { value: 0, label: 'Affectations Complètes' },
    { value: juries.length, label: 'Jurys Formés' },
  ]), [etudiants.length, professeurs.length, juries.length]);

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Nom', 'Prénom', 'Email', 'Filière', 'Type Stage'];
      const rows = etudiants.map(s => [
        s.nom,
        s.prenom,
        s.email,
        s.filiere,
        s.type_stage
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `etudiants_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast({ type: 'success', message: 'Export réussi' });
    } catch (error) {
      console.error('Erreur export:', error);
      addToast({ type: 'error', message: 'Erreur lors de l\'export' });
    }
  };

  const students = useMemo(() => etudiants.slice(0, 10), [etudiants]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 text-sm mt-1">Vue d'ensemble des données</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">{m.label}</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Liste des étudiants</h2>
          <Button variant="secondary" onClick={handleExport}>Exporter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nom","Prénom","Email","Filière","Type Stage","Action"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
              {!loading && students.map((s, i) => (
                <tr key={s.id || i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{s.nom}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{s.prenom}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{s.filiere}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded bg-emerald-50 text-[#008D36] px-2 py-1 text-xs font-medium">{s.type_stage}</span>
                  </td>
                  <td className="px-6 py-3">
                    <Button variant="secondary" className="px-3 py-1 text-sm">Voir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
