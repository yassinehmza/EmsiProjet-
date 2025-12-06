import Breadcrumbs from '../components/Breadcrumbs';

export default function MaSoutenance() {
  const soutenance = {
    date: '2024-12-15',
    heure: '14:00',
    salle: 'C102',
    duree: '45 min',
    sujet: 'Développement d\'une application mobile de gestion de pharmacie',
    jury: [
      { nom: 'Pr. Ahmed El Fassi', role: 'Président', email: 'a.elfassi@emsi.ma' },
      { nom: 'Pr. Sara Benjelloun', role: 'Examinateur', email: 's.benjelloun@emsi.ma' },
      { nom: 'Pr. Mohamed Tazi', role: 'Encadrant', email: 'm.tazi@emsi.ma' }
    ],
    statut: 'Planifiée'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Ma Soutenance'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ma Soutenance</h1>
          <p className="text-gray-600 mt-1">Informations et détails de votre soutenance</p>
        </div>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold">
          {soutenance.statut}
        </span>
      </div>

      {/* Countdown */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="text-lg mb-2">Soutenance dans</div>
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-5xl font-bold">11</div>
              <div className="text-blue-100 mt-1">Jours</div>
            </div>
            <div className="text-4xl">:</div>
            <div>
              <div className="text-5xl font-bold">05</div>
              <div className="text-blue-100 mt-1">Heures</div>
            </div>
            <div className="text-4xl">:</div>
            <div>
              <div className="text-5xl font-bold">23</div>
              <div className="text-blue-100 mt-1">Minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            Date & Heure
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">{new Date(soutenance.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Heure</span>
              <span className="font-semibold text-gray-900">{soutenance.heure}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Durée</span>
              <span className="font-semibold text-gray-900">{soutenance.duree}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Salle</span>
              <span className="font-semibold text-gray-900">{soutenance.salle}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            Localisation
          </h2>
          <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
            <svg className="h-16 w-16 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">EMSI Casablanca</div>
            <div className="text-sm text-gray-600 mt-1">Bâtiment C - 1er étage</div>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
          </svg>
          Sujet de stage
        </h2>
        <p className="text-gray-700 text-lg">{soutenance.sujet}</p>
      </div>

      {/* Jury */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Membres du jury
        </h2>
        <div className="space-y-3">
          {soutenance.jury.map((membre, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {membre.nom.split(' ').filter(n => n.startsWith('Pr.')?false:true).map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{membre.nom}</div>
                <div className="text-sm text-gray-600">{membre.email}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                membre.role === 'Président' ? 'bg-purple-100 text-purple-700' :
                membre.role === 'Encadrant' ? 'bg-blue-100 text-blue-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {membre.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Préparation</h2>
        <div className="space-y-3">
          {[
            { task: 'Préparer la présentation PowerPoint', done: true },
            { task: 'Répéter la présentation', done: true },
            { task: 'Imprimer 3 copies du rapport final', done: false },
            { task: 'Préparer les réponses aux questions potentielles', done: false },
            { task: 'Vérifier le matériel (clé USB, ordinateur)', done: false }
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked={item.done}
                className="h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className={`flex-1 ${item.done ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {item.task}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
