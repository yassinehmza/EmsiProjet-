import { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import Breadcrumbs from '../components/Breadcrumbs';
import { getEtudiantSoutenance, getEtudiantRapports } from '../api/etudiant';

export default function Dashboard() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [soutenance, setSoutenance] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;
      
      try {
        const [soutenanceData, rapportsData] = await Promise.all([
          getEtudiantSoutenance(profile.id).catch(() => null),
          getEtudiantRapports(profile.id).catch(() => [])
        ]);

        setSoutenance(soutenanceData);
        setRapports(Array.isArray(rapportsData) ? rapportsData : []);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        addToast({ type: 'error', message: 'Erreur de chargement' });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [profile, addToast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Dashboard'}]} />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue, {profile?.prenom} {profile?.nom}</h1>
            <p className="text-blue-100">Suivez votre progression et vos échéances</p>
          </div>
          <svg className="h-20 w-20 opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Progression du stage</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Avancement</span>
                <span className="text-sm font-bold text-blue-600">75%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-xs text-gray-600">Jours restants</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">3/4</div>
                <div className="text-xs text-gray-600">Rapports déposés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ma Soutenance</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">15 Juillet 2024</div>
                <div className="text-sm text-gray-500">14h00 - Salle C102</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Jury :</div>
              <div className="space-y-1">
                <div className="text-sm">• <span className="font-medium">Pr. Ahmed El Fassi</span> (Président)</div>
                <div className="text-sm">• <span className="font-medium">Pr. Sara Benjelloun</span> (Examinateur)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Rapports déposés</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Soutenance planifiée</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
          <div className="text-sm text-gray-600">Rapports validés</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
          <div className="text-sm text-gray-600">Remarques reçues</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/etudiant/rapports" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Mes Rapports</div>
              <div className="text-sm text-gray-500">Gérer mes rapports</div>
            </div>
          </a>

          <a href="/etudiant/soutenance" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Ma Soutenance</div>
              <div className="text-sm text-gray-500">Consulter les détails</div>
            </div>
          </a>

          <a href="/etudiant/remarques" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Remarques</div>
              <div className="text-sm text-gray-500">Voir les feedbacks</div>
            </div>
          </a>
        </div>
      </div>

      {/* Tasks/Reminders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tâches à faire</h2>
        <div className="space-y-3">
          {[
            { task: 'Déposer le rapport final', priority: 'high', deadline: 'Dans 7 jours' },
            { task: 'Préparer la présentation', priority: 'medium', deadline: 'Dans 14 jours' },
            { task: 'Répondre aux remarques', priority: 'low', deadline: 'Dans 21 jours' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <input type="checkbox" className="h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.task}</div>
                <div className="text-sm text-gray-500">{item.deadline}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Important' : 'Normal'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
