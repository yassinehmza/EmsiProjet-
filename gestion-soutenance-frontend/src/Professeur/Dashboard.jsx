import { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import Breadcrumbs from '../components/Breadcrumbs';
import { getProfesseurRapports, getProfesseurSoutenances, getProfesseurEtudiants } from '../api/professeur';

export default function Dashboard() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [stats, setStats] = useState({
    etudiants: 0,
    rapportsEnAttente: 0,
    soutenances: 0,
    remarques: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!profile?.id) return;
      
      try {
        const [rapports, soutenances, etudiants] = await Promise.all([
          getProfesseurRapports(profile.id).catch(() => []),
          getProfesseurSoutenances(profile.id).catch(() => []),
          getProfesseurEtudiants(profile.id).catch(() => [])
        ]);

        // S'assurer que ce sont des tableaux
        const rapportsArray = Array.isArray(rapports) ? rapports : [];
        const soutenancesArray = Array.isArray(soutenances) ? soutenances : [];
        const etudiantsArray = Array.isArray(etudiants) ? etudiants : [];

        setStats({
          etudiants: etudiantsArray.length,
          rapportsEnAttente: rapportsArray.filter(r => r.etat === 'en_attente').length,
          soutenances: soutenancesArray.length,
          remarques: 0 // À calculer depuis les remarques
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
        addToast({ type: 'error', message: 'Erreur de chargement des statistiques' });
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [profile, addToast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Professeur', href:'/professeur'},{label:'Dashboard'}]} />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue, Prof. {profile?.nom}</h1>
            <p className="text-purple-100">Gérez vos étudiants et soutenances</p>
          </div>
          <svg className="h-20 w-20 opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.etudiants}</div>
          <div className="text-sm text-gray-600">Étudiants encadrés</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.rapportsEnAttente}</div>
          <div className="text-sm text-gray-600">Rapports à valider</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.soutenances}</div>
          <div className="text-sm text-gray-600">Soutenances prévues</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.remarques}</div>
          <div className="text-sm text-gray-600">Remarques en attente</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/professeur/etudiants" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Mes Étudiants</div>
              <div className="text-sm text-gray-500">Gérer les étudiants</div>
            </div>
          </a>

          <a href="/professeur/rapports" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Rapports</div>
              <div className="text-sm text-gray-500">Consulter les rapports</div>
            </div>
          </a>

          <a href="/professeur/soutenances" className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Soutenances</div>
              <div className="text-sm text-gray-500">Planifier et évaluer</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activités récentes</h2>
        <div className="space-y-4">
          {[
            { type: 'rapport', title: 'Nouveau rapport déposé', student: 'Ahmed Benali', time: 'Il y a 2h' },
            { type: 'soutenance', title: 'Soutenance confirmée', student: 'Sara Alami', time: 'Il y a 5h' },
            { type: 'remarque', title: 'Remarque ajoutée', student: 'Mohamed Tazi', time: 'Hier' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                activity.type === 'rapport' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'soutenance' ? 'bg-emerald-100 text-emerald-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.student}</div>
              </div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
