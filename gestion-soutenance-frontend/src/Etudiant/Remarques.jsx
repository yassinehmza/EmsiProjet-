import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Remarques() {
  const [remarques] = useState([
    { 
      id: 1, 
      professeur: 'Pr. Mohamed Tazi', 
      type: 'Rapport 2', 
      date: '2024-11-28', 
      contenu: 'Bon travail dans l\'ensemble. Attention à la mise en forme des références bibliographiques. Je recommande d\'utiliser le style APA pour plus de cohérence.',
      statut: 'Lu',
      priorite: 'normal'
    },
    { 
      id: 2, 
      professeur: 'Pr. Sara Benjelloun', 
      type: 'Rapport 3', 
      date: '2024-12-01', 
      contenu: 'La partie technique est bien détaillée. Cependant, il faudrait développer davantage l\'analyse des résultats obtenus et leur comparaison avec les objectifs initiaux.',
      statut: 'Non lu',
      priorite: 'important'
    },
    { 
      id: 3, 
      professeur: 'Pr. Mohamed Tazi', 
      type: 'Rapport 1', 
      date: '2024-11-15', 
      contenu: 'Excellent travail sur la présentation du contexte. La problématique est clairement exposée.',
      statut: 'Lu',
      priorite: 'normal'
    },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredRemarques = remarques.filter(r => {
    if (filter === 'unread') return r.statut === 'Non lu';
    if (filter === 'read') return r.statut === 'Lu';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Remarques'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remarques</h1>
          <p className="text-gray-600 mt-1">Consulter les feedbacks de vos professeurs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{remarques.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Non lues</div>
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{remarques.filter(r => r.statut === 'Non lu').length}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Importantes</div>
            <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{remarques.filter(r => r.priorite === 'important').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'read' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lues
          </button>
        </div>
      </div>

      {/* Remarques List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Mes remarques</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredRemarques.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <p className="text-gray-500">Aucune remarque trouvée</p>
            </div>
          ) : (
            filteredRemarques.map((remarque) => (
              <div 
                key={remarque.id} 
                className={`p-6 transition-colors ${
                  remarque.statut === 'Non lu' ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {remarque.professeur.split(' ').filter(n => !n.startsWith('Pr.')).map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {remarque.professeur}
                        {remarque.statut === 'Non lu' && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{remarque.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {new Date(remarque.date).toLocaleDateString('fr-FR')}
                    </span>
                    {remarque.priorite === 'important' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Important
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      remarque.statut === 'Lu' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {remarque.statut}
                    </span>
                  </div>
                </div>
                <div className="pl-15">
                  <p className="text-gray-700 leading-relaxed">{remarque.contenu}</p>
                  {remarque.statut === 'Non lu' && (
                    <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
