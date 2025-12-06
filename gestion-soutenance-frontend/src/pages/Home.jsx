import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import H1 from '../assets/H1.jpg';
import H2 from '../assets/H2.jpg';
import H3 from '../assets/H3.jpg';
import H4 from '../assets/H4.jpg';
import GC from '../assets/GC.png';
import GE from '../assets/GE.png';
import GEI from '../assets/GEI.PNG';
import GF from '../assets/GF.png';
import IIR from '../assets/IIR.png';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <a href="/"><img src={Logo} alt="Logo" className="h-16 md:h-20 w-auto object-contain" /></a>
          <nav className="hidden md:flex justify-center items-center gap-8 text-gray-700 font-medium">
            <a href="#apropos" className="relative px-2 py-1 hover:text-[#008D36] transition-colors duration-200 group">
              A propos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008D36] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#formations" className="relative px-2 py-1 hover:text-[#008D36] transition-colors duration-200 group">
              Formations
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008D36] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="relative px-2 py-1 hover:text-[#008D36] transition-colors duration-200 group">
              Employabilité
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008D36] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="relative px-2 py-1 hover:text-[#008D36] transition-colors duration-200 group">
              Recherche & innovation
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008D36] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="relative px-2 py-1 hover:text-[#008D36] transition-colors duration-200 group">
              Vie estudiantine
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008D36] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-3 justify-end justify-self-end pr-2 md:pr-4">
            <div className="hidden md:block relative">
              <button onClick={()=>setLoginOpen(o=>!o)} className="px-5 py-2.5 rounded-lg border-2 border-[#008D36] text-[#008D36] font-semibold hover:bg-[#008D36] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">Connexion</button>
              {loginOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-40 animate-fade-in-down">
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
            <a href="#formations" className="block px-2 py-2 rounded hover:bg-gray-100">Formations</a>
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

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="elementor-heading-title elementor-size-default animate-title-in">
            Première <span style={{ color:'#008D36' }}>école d'ingénieurs</span> <br />privée au Maroc
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
            Excellence académique et innovation depuis 39 ans • 19 campus à travers le Maroc
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <Link to="/" className="block">
            <img src={images[idx]} alt="Hero" className="w-full h-[420px] md:h-[560px] object-cover cursor-pointer transition-transform duration-500 hover:scale-105" />
          </Link>
          <button onClick={()=>go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={()=>go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-white w-8' : 'bg-white/60 hover:bg-white/80'}`} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        </div>

        <section className="py-16 bg-gradient-to-b from-white to-gray-50 rounded-3xl">
          <div id="apropos" className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-3">Gérez vos Soutenances de A à Z</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">Une plateforme complète et intuitive pour orchestrer toutes les étapes de vos soutenances académiques</p>
            <div className="h-1 w-20 bg-gradient-to-r from-[#008D36] to-[#05A66B] mx-auto rounded-full my-6"></div>
            <div ref={aboutRef} className="grid md:grid-cols-2 gap-x-10 gap-y-8">
              {[{t:'Dépôt Rapport',d:'Les étudiants déposent leurs rapports de stage sur la plateforme sécurisée.',i:DocIcon},{t:'Validation',d:"L'administration valide les rapports et notifie les rapporteurs.",i:CheckIcon},{t:'Formation Jury',d:'Constitution automatique des jurys avec président, rapporteur, encadrant et examinateur.',i:GroupIcon},{t:'Planification',d:'Programmation des dates, heures et salles de soutenance.',i:CalendarIcon},{t:'Soutenance',d:'Déroulement de la soutenance avec suivi en temps réel.',i:PresentationIcon},{t:'Évaluation',d:'Saisie des notes et génération automatique des résultats.',i:EvalIcon}].map((s, idx) => (
                <div key={s.t} className={`group relative flex items-start gap-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${aboutAnim ? 'animate-step-in' : ''}`} style={{ animationDelay: `${idx*140}ms` }}>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#008D36] to-[#05A66B] text-white shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {s.i()}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">{s.t}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{s.d}</div>
                  </div>
                  {(idx % 2 !== 1) && idx < 5 && (
                    <svg className="hidden md:block absolute -right-12 top-10 h-6 w-12 text-[#008D36]/30 group-hover:text-[#008D36] transition-colors duration-300" viewBox="0 0 48 24" fill="none"><path d="M0 12h36" stroke="currentColor" strokeWidth="2"/><path d="M36 6l10 6-10 6" fill="currentColor"/></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="formations" className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-3">Nos Formations</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">Des programmes d'ingénierie reconnus par l'État pour façonner les leaders de demain</p>
            <div className="h-1 w-20 bg-gradient-to-r from-[#008D36] to-[#05A66B] mx-auto rounded-full my-6"></div>
            <div className="grid md:grid-cols-3 md:grid-rows-3 gap-6">
              <div className="relative rounded-2xl overflow-hidden row-span-3 group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={GC} alt="Centres de carrières" className="w-full h-full max-h-[720px] object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008D36]/80 via-[#008D36]/60 to-[#008D36]/40 group-hover:from-[#008D36]/95 group-hover:via-[#008D36]/85 group-hover:to-[#008D36]/75 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-xl md:text-2xl font-bold transition-opacity duration-300 group-hover:opacity-0 drop-shadow-lg">Génie Civil, Bâtiments et Travaux Publics (BTP)</div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-4 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">Génie Civil, Bâtiments et Travaux Publics (BTP)</h3>
                  <p className="text-white/95 text-center text-sm md:text-base leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    Formez-vous pour concevoir et réaliser des infrastructures durables et intelligentes. Cette filière vous prépare aux métiers du bâtiment, des travaux publics et des grands projets grâce à une maîtrise des techniques du génie civil, du BIM, de la modélisation 3D et de la gestion de chantier. Une formation orientée projets, chantiers-écoles et immersion professionnelle.
                  </p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={GEI} alt="Nos recruteurs" className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008D36]/70 via-[#008D36]/50 to-transparent group-hover:from-[#008D36]/95 group-hover:via-[#008D36]/90 group-hover:to-[#008D36]/75 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold transition-opacity duration-300 group-hover:opacity-0 drop-shadow-lg">Génie Industriel</div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-lg font-bold mb-3 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">Génie Industriel</h3>
                  <p className="text-white/95 text-center text-xs md:text-sm leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-6">
                    Maîtrisez l’automatisation, le contrôle-commande et les systèmes industriels intelligents. Cette filière forme des ingénieurs capables de programmer des automates, concevoir des systèmes embarqués, intégrer l’IoT et superviser des installations connectées pour bâtir l’usine du futur.
                  </p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={GF} alt="Génie Financier" className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008D36]/70 via-[#008D36]/50 to-transparent group-hover:from-[#008D36]/95 group-hover:via-[#008D36]/90 group-hover:to-[#008D36]/75 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold transition-opacity duration-300 group-hover:opacity-0 drop-shadow-lg">Génie Financier</div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-lg font-bold mb-3 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">Génie Financier</h3>
                  <p className="text-white/95 text-center text-xs md:text-sm leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-6">
                    La filière Génie Financier forme des ingénieurs capables d’analyser les données financières, anticiper les risques et piloter la performance économique des entreprises. Elle combine finance quantitative, stratégie, data science et outils numériques avancés (IA, blockchain).
                  </p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={GE} alt="Génie Électrique et Systèmes Intelligents" className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008D36]/70 via-[#008D36]/50 to-transparent group-hover:from-[#008D36]/95 group-hover:via-[#008D36]/90 group-hover:to-[#008D36]/75 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold transition-opacity duration-300 group-hover:opacity-0 drop-shadow-lg">Génie Électrique et Systèmes Intelligents</div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-lg font-bold mb-3 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">Génie Électrique et Systèmes Intelligents</h3>
                  <p className="text-white/95 text-center text-xs md:text-sm leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-6">
                    La filière Génie Électrique & Systèmes Intelligents forme des ingénieurs capables de répondre aux enjeux de la transition énergétique et de l’industrie intelligente. Elle combine technologies électriques, automatisation, IA et systèmes connectés pour concevoir des solutions modernes, durables et performantes.
                  </p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden row-span-3 group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={IIR} alt="Alumni" className="w-full h-full max-h-[720px] object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008D36]/80 via-[#008D36]/60 to-[#008D36]/40 group-hover:from-[#008D36]/95 group-hover:via-[#008D36]/85 group-hover:to-[#008D36]/75 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-xl md:text-2xl font-bold transition-opacity duration-300 group-hover:opacity-0 drop-shadow-lg">Ingénierie Informatique et Réseaux</div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-4 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">Ingénierie Informatique et Réseaux</h3>
                  <p className="text-white/95 text-center text-sm md:text-base leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    Devenez un ingénieur du numérique capable de concevoir, sécuriser et déployer les technologies de demain. Cette filière forme des experts en développement logiciel, intelligence artificielle, cybersécurité, réseaux intelligents et cloud computing, grâce à une pédagogie orientée projets et compétences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-16 bg-gradient-to-br from-[#008D36] to-[#006B2A] text-white rounded-t-3xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="EMSI" className="h-12 w-auto object-contain" />
              <div className="text-sm font-medium">ECOLE MAROCAINE DES SCIENCES DE L'INGENIEUR</div>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold border border-white/30">✓ Ecole Reconnue par l'Etat</div>
            <p className="text-sm opacity-90 leading-relaxed">L'École Marocaine des Sciences de l'Ingénieur, créée il y a plus de 39 ans, est la plus grande école d'ingénieurs privée au Maroc. L'EMSI est reconnue par l'État, délivre une formation d'excellence en ingénierie et dispose de 19 campus à travers le Maroc, à Casablanca, Rabat, Marrakech, Fès et Tanger.</p>
            <button className="px-6 py-3 rounded-lg bg-white text-[#008D36] font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Télécharger la brochure
            </button>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b border-white/20 pb-2">EMSI</div>
            <div className="space-y-2.5 text-sm opacity-90">
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Présentation</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Réseau Honoris</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Nos Actualités</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Campus</a>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Employabilité</div>
            <div className="space-y-2.5 text-sm opacity-90">
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Ressources Carrière</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Centre de carrière</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ 21st century skills</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Alumnis</a>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Formations</div>
            <div className="space-y-2.5 text-sm opacity-90">
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Ingénierie Informatique et Réseaux</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Génie Électrique et Systèmes Intelligents</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Ingénierie Automatisme et Informatique Industrielle</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Génie Civil, Bâtiments et Travaux Publics (BTP)</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Génie Industriel</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Génie Financier</a>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Recherche</div>
            <div className="space-y-2.5 text-sm opacity-90">
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Stratégie</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Partenaires de recherche</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Prix et distinctions</a>
            </div>
            <div className="font-bold text-lg mt-8 mb-4 border-b border-white/20 pb-2">Vie estudiantine</div>
            <div className="space-y-2.5 text-sm opacity-90">
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Présentation</a>
              <a href="#" className="block hover:translate-x-1 hover:opacity-100 transition-all duration-200">→ Clubs et BDE</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="border-t border-white/20 my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-90">
            <div className="font-medium">© 2025 EMSI. Tous droits réservés.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:opacity-100 transition-opacity duration-200">Charte de protection des données à caractère personnel</a>
              <a href="#" className="hover:opacity-100 transition-opacity duration-200">Plan de site</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
