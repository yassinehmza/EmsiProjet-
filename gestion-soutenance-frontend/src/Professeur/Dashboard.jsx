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
      <div className="bg-[#008D36] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Bienvenue, Prof. {profile?.nom}</h1>
        <p className="text-emerald-100">Gérez vos étudiants et soutenances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Étudiants encadrés</div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.etudiants}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Rapports à valider</div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.rapportsEnAttente}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Soutenances prévues</div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.soutenances}</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Remarques en attente</div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.remarques}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/professeur/etudiants" className="p-4 rounded-lg border border-gray-200 hover:border-[#008D36] hover:bg-emerald-50">
            <div className="font-semibold text-gray-900 mb-1">Mes Étudiants</div>
            <div className="text-sm text-gray-600">Gérer les étudiants</div>
          </a>

          <a href="/professeur/rapports" className="p-4 rounded-lg border border-gray-200 hover:border-[#008D36] hover:bg-emerald-50">
            <div className="font-semibold text-gray-900 mb-1">Rapports</div>
            <div className="text-sm text-gray-600">Consulter les rapports</div>
          </a>

          <a href="/professeur/soutenances" className="p-4 rounded-lg border border-gray-200 hover:border-[#008D36] hover:bg-emerald-50">
            <div className="font-semibold text-gray-900 mb-1">Soutenances</div>
            <div className="text-sm text-gray-600">Voir les soutenances</div>
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
                activity.type === 'rapport' ? 'bg-emerald-100 text-emerald-600' :
                activity.type === 'soutenance' ? 'bg-emerald-100 text-emerald-600' :
                'bg-emerald-100 text-emerald-600'
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
