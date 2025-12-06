import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getProfesseurSoutenances } from '../api/professeur';

export default function MesSoutenances() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSoutenances = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        const data = await getProfesseurSoutenances(profile.id);
        setSoutenances(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur chargement soutenances:', error);
        addToast({ type: 'error', message: 'Erreur lors du chargement des soutenances' });
      } finally {
        setLoading(false);
      }
    };
    
    loadSoutenances();
  }, [profile, addToast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Professeur', href:'/professeur'},{label:'Mes Soutenances'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Soutenances</h1>
          <p className="text-gray-600 mt-1">Calendrier et planning des soutenances</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '...' : soutenances.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">À venir</div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : soutenances.filter(s => new Date(s.date_soutenance) > new Date()).length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Passées</div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '...' : soutenances.filter(s => new Date(s.date_soutenance) <= new Date()).length}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Planning des soutenances</h2>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2">Chargement des soutenances...</p>
          </div>
        ) : soutenances.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <p>Aucune soutenance planifiée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {soutenances.map((soutenance) => {
              const etudiantNom = soutenance.etudiant?.nom || 'N/A';
              const etudiantPrenom = soutenance.etudiant?.prenom || '';
              const roleProf = soutenance.jury?.president_id === profile?.id ? 'Président' :
                              soutenance.jury?.rapporteur_id === profile?.id ? 'Rapporteur' :
                              soutenance.jury?.examinateur_id === profile?.id ? 'Examinateur' :
                              soutenance.etudiant?.encadrant_id === profile?.id ? 'Encadrant' : 'Membre';
              
              return (
                <div key={soutenance.id} className="group border-l-4 border-purple-500 bg-purple-50/50 hover:bg-purple-50 rounded-r-xl p-4 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {etudiantNom[0]}{etudiantPrenom[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{etudiantNom} {etudiantPrenom}</h3>
                          <p className="text-sm text-gray-600">Rôle: <span className="font-medium">{roleProf}</span></p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                          </svg>
                          <span className="text-gray-700">
                            {soutenance.date_soutenance ? new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                          </svg>
                          <span className="text-gray-700">{soutenance.heure_soutenance || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          </svg>
                          <span className="text-gray-700">Salle {soutenance.salle || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        new Date(soutenance.date_soutenance) > new Date() ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {new Date(soutenance.date_soutenance) > new Date() ? 'À venir' : 'Passée'}
                      </span>
                      {soutenance.note && (
                        <div className="text-center">
                          <span className="text-lg font-bold text-purple-600">{soutenance.note}/20</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
