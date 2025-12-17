import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store/auth';
import { useUI } from '../store/ui';
import { getEtudiantSoutenance } from '../api/etudiant';

export default function MaSoutenance() {
  const { profile } = useAuth();
  const { addToast } = useUI();
  const [soutenance, setSoutenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);

  // Calculer le temps restant jusqu'à la soutenance
  const calculateCountdown = () => {
    if (!soutenance?.date || !soutenance?.heure) return null;
    
    const soutenanceDateTime = new Date(`${soutenance.date}T${soutenance.heure}`);
    const now = new Date();
    const diff = soutenanceDateTime - now;
    
    if (diff < 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    loadSoutenance();
  }, [profile]);

  // Mettre à jour le countdown toutes les secondes
  useEffect(() => {
    if (!soutenance?.date || !soutenance?.heure) return;

    console.log('Soutenance data:', {
      date: soutenance.date,
      heure: soutenance.heure,
      combinedDateTime: `${soutenance.date}T${soutenance.heure}`
    });

    const updateCountdown = () => {
      const calculated = calculateCountdown();
      console.log('Countdown calculated:', calculated);
      setCountdown(calculated);
    };

    // Mise à jour initiale
    updateCountdown();

    // Mise à jour toutes les secondes
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [soutenance]);

  const loadSoutenance = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const data = await getEtudiantSoutenance(profile.id);
      setSoutenance(data);
    } catch (error) {
      console.error('Erreur chargement soutenance:', error);
      if (error.response?.status !== 404) {
        addToast({ type: 'error', message: 'Erreur lors du chargement de la soutenance' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Ma Soutenance'}]} />
        <div className="p-12 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#008D36] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de votre soutenance...</p>
        </div>
      </div>
    );
  }

  if (!soutenance) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Ma Soutenance'}]} />
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune soutenance planifiée</h3>
          <p className="text-gray-500">Votre soutenance n'a pas encore été programmée. Veuillez contacter l'administration.</p>
        </div>
      </div>
    );
  }

  const juryData = soutenance?.jury || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{label:'Étudiant', href:'/etudiant'},{label:'Ma Soutenance'}]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ma Soutenance</h1>
          <p className="text-gray-600 mt-1">Informations et détails de votre soutenance</p>
        </div>
        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">
          {soutenance.etat === 'annulee' ? 'Annulée' : 'Planifiée'}
        </span>
      </div>

      {/* Countdown */}
      {countdown && (
        <div className="bg-[#008D36] rounded-lg p-6 text-white">
          <div className="text-center">
            <div className="text-sm mb-3">Soutenance dans</div>
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-3xl font-bold">{countdown.days}</div>
                <div className="text-emerald-100 text-xs mt-1">Jours</div>
              </div>
              <div className="text-2xl">:</div>
              <div>
                <div className="text-3xl font-bold">{countdown.hours}</div>
                <div className="text-emerald-100 text-xs mt-1">Heures</div>
              </div>
              <div className="text-2xl">:</div>
              <div>
                <div className="text-3xl font-bold">{countdown.minutes}</div>
                <div className="text-emerald-100 text-xs mt-1">Minutes</div>
              </div>
              <div className="text-2xl">:</div>
              <div>
                <div className="text-3xl font-bold">{countdown.seconds}</div>
                <div className="text-emerald-100 text-xs mt-1">Secondes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Heure</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(soutenance.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Heure</span>
              <span className="font-semibold text-gray-900">{soutenance.heure}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Salle</span>
              <span className="font-semibold text-gray-900">{soutenance.salle}</span>
            </div>
            {soutenance.note && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded">
                <span className="text-gray-600">Note finale</span>
                <span className="font-bold text-[#008D36] text-xl">{soutenance.note}/20</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h2>
          <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Plan de localisation</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">EMSI Casablanca</div>
            <div className="text-sm text-gray-600 mt-1">Salle: {soutenance.salle}</div>
          </div>
        </div>
      </div>

      {/* Jury */}
      {juryData.professeurs && juryData.professeurs.length > 0 && (
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Membres du jury</h2>
          <div className="space-y-3">
            {juryData.professeurs.map((professeur, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded hover:bg-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
                  {professeur.nom?.charAt(0)}{professeur.prenom?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{professeur.nom} {professeur.prenom}</div>
                  <div className="text-sm text-gray-600">{professeur.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Préparation</h2>
        <div className="space-y-2">
          {[
            { task: 'Préparer la présentation PowerPoint', done: false },
            { task: 'Répéter la présentation', done: false },
            { task: 'Imprimer 3 copies du rapport final', done: false },
            { task: 'Préparer les réponses aux questions potentielles', done: false },
            { task: 'Vérifier le matériel (clé USB, ordinateur)', done: false }
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked={item.done}
                className="h-4 w-4 rounded text-emerald-600"
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
