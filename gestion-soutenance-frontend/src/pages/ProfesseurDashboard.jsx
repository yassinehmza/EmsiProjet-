import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function ProfesseurDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Espace Professeur</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bienvenue, Professeur {profile?.prenom} {profile?.nom}
          </h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Rôle:</strong> {profile?.role_soutenance}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Rapports Assignés</h3>
            <p className="text-gray-600 mb-4">Consulter et commenter les rapports de vos étudiants</p>
            <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Voir les rapports
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📅 Mes Soutenances</h3>
            <p className="text-gray-600 mb-4">Planning des jurys auxquels vous participez</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Voir mon planning
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 Mes Remarques</h3>
            <p className="text-gray-600 mb-4">Gérer vos remarques sur les rapports</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Gérer les remarques
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">👥 Mes Étudiants</h3>
            <p className="text-gray-600 mb-4">Liste des étudiants dont vous êtes responsable</p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Voir mes étudiants
            </button>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            🚧 <strong>En développement:</strong> Les fonctionnalités complètes seront bientôt disponibles.
          </p>
        </div>
      </main>
    </div>
  );
}
