import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import H1 from '../assets/H1.jpg';
import H2 from '../assets/H2.jpg';
import H3 from '../assets/H3.jpg';
import H4 from '../assets/H4.jpg';

function DocIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1v5h5"/><path d="M8 12h8" stroke="#fff" strokeWidth="2"/><path d="M8 16h6" stroke="#fff" strokeWidth="2"/></svg>
  );
}
function CheckIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none"/></svg>
  );
}
function GroupIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/><path d="M2 20c0-3.3 6-5 10-5s10 1.7 10 5v2H2v-2z"/></svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v3H7V2zm8 0h2v3h-2V2z"/><path d="M3 7h18v14H3V7z"/><path d="M7 11h3v3H7v-3zM12 11h3v3h-3v-3z"/></svg>
  );
}
function PresentationIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v10H4z"/><path d="M12 14l-4 6h2l2-3 2 3h2l-4-6z"/></svg>
  );
}
function EvalIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#fff" strokeWidth="2"/></svg>
  );
}

export default function Home() {
  const images = useMemo(() => [H1, H2, H3, H4], []);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const aboutRef = useRef(null);
  const [aboutAnim, setAboutAnim] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images, paused]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setAboutAnim(true); });
    }, { threshold: 0.15 });
    if (aboutRef.current) obs.observe(aboutRef.current);
    return () => obs.disconnect();
  }, []);

  const go = d => setIdx(i => (i + d + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <a href="/"><img src={Logo} alt="Logo" className="h-16 md:h-20 w-auto object-contain" /></a>
          <nav className="hidden md:flex justify-center items-center gap-10 text-gray-800">
            <a href="#apropos" className="px-2 hover:text-[#05A66B]">A propos</a>
            <a href="#" className="px-2 hover:text-[#05A66B]">Formations</a>
            <a href="#" className="px-2 hover:text-[#05A66B]">Employabilité</a>
            <a href="#" className="px-2 hover:text-[#05A66B]">Recherche & innovation</a>
            <a href="#" className="px-2 hover:text-[#05A66B]">Vie estudiantine</a>
          </nav>
          <div className="ml-auto flex items-center gap-3 justify-end justify-self-end pr-2 md:pr-4">
            <div className="hidden md:block relative">
              <button onClick={()=>setLoginOpen(o=>!o)} className="px-3 py-2 rounded-lg border border-[#008D36] text-[#008D36] hover:bg-[#008D36]/10">Connexion</button>
              {loginOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow z-40">
                  <Link to="/login?role=admin" className="block px-3 py-2 hover:bg-gray-100">Administrateur</Link>
                  <Link to="/login?role=professeur" className="block px-3 py-2 hover:bg-gray-100">Professeur</Link>
                  <Link to="/login?role=etudiant" className="block px-3 py-2 hover:bg-gray-100">Étudiant</Link>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <button aria-label="Ouvrir le menu" onClick={()=>setMobileOpen(o=>!o)} className="p-2 rounded-lg border text-gray-800">
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
              </button>
            </div>
          </div>
        </div>
        <div className={`md:hidden ${mobileOpen?'block':'hidden'} border-t bg-white`}>
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-2">
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100">A propos</a>
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100">Formations</a>
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100">Employabilité</a>
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100">Recherche & innovation</a>
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100">Vie estudiantine</a>
            <div className="border-t pt-2">
              <div className="text-sm text-gray-600 mb-1">Connexion</div>
              <Link to="/login?role=admin" className="block px-2 py-2 rounded hover:bg-gray-100">Administrateur</Link>
              <Link to="/login?role=professeur" className="block px-2 py-2 rounded hover:bg-gray-100">Professeur</Link>
              <Link to="/login?role=etudiant" className="block px-2 py-2 rounded hover:bg-gray-100">Étudiant</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="elementor-heading-title elementor-size-default animate-title-in">
          Première <span style={{ color:'#008D36' }}>école d’ingénieurs</span> <br />privée au Maroc
        </h1>

        <div className="relative rounded-2xl overflow-hidden shadow" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <Link to="/" className="block">
            <img src={images[idx]} alt="Hero" className="w-full h-[420px] md:h-[560px] object-cover cursor-pointer" />
          </Link>
          <button onClick={()=>go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-900">◀</button>
          <button onClick={()=>go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-900">▶</button>
          
        </div>

        <section className="py-12 soft-section">
          <div id="apropos" className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900">Gérez vos Soutenances de A à Z</h2>
            <div className="h-1 w-16 bg-[#008D36] mx-auto rounded my-6"></div>
            <div ref={aboutRef} className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {[{t:'Dépôt Rapport',d:'Les étudiants déposent leurs rapports de stage sur la plateforme sécurisée.',i:DocIcon},{t:'Validation',d:"L'administration valide les rapports et notifie les rapporteurs.",i:CheckIcon},{t:'Formation Jury',d:'Constitution automatique des jurys avec président, rapporteur, encadrant et examinateur.',i:GroupIcon},{t:'Planification',d:'Programmation des dates, heures et salles de soutenance.',i:CalendarIcon},{t:'Soutenance',d:'Déroulement de la soutenance avec suivi en temps réel.',i:PresentationIcon},{t:'Évaluation',d:'Saisie des notes et génération automatique des résultats.',i:EvalIcon}].map((s, idx) => (
                <div key={s.t} className={`group relative flex items-start gap-4 p-5 rounded-xl bg-white border shadow-sm hover:shadow-md hover-lift ${aboutAnim ? 'animate-step-in' : ''}`} style={{ animationDelay: `${idx*140}ms` }}>
                  <div className="h-12 w-12 rounded-full bg-[#008D36] text-white shadow-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105 hover-pulse">
                    {s.i()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{s.t}</div>
                    <div className="text-sm text-gray-600">{s.d}</div>
                  </div>
                  {(idx % 2 !== 1) && (
                    <svg className="hidden md:block absolute -right-12 top-6 h-6 w-12 text-gray-300" viewBox="0 0 48 24" fill="none"><path d="M0 12h36" stroke="currentColor" strokeWidth="2"/><path d="M36 6l10 6-10 6" fill="currentColor"/></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
