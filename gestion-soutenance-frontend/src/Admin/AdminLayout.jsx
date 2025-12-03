import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUI } from '../store/ui';
import { useAuth } from '../store/auth';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toasts, removeToast } = useUI();
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      toasts.forEach(t => removeToast(t.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-gray-50">
      <div className="flex min-h-screen">
        {/* Backdrop pour mobile */}
        {open && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" 
            onClick={() => setOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white/80 backdrop-blur-xl border-r border-gray-200/50 text-gray-900 flex-shrink-0 transition-all duration-300 ease-out md:flex md:flex-col z-50 shadow-xl md:shadow-none`}>
          {/* Logo et titre */}
          <div className="px-6 py-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#05A66B] to-[#04905c] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-[#05A66B] to-[#04905c] bg-clip-text text-transparent">EMSI Admin</div>
                <div className="text-xs text-gray-500">Gestion Soutenances</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Menu Principal</div>
            
            <NavLink to="/admin/dashboard" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  <span className="font-medium">Dashboard</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/admin/etudiants" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span className="font-medium">Étudiants</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/admin/professeurs" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    <path d="M20 10h-2V7h-2v3h-2v2h2v3h2v-3h2z" opacity="0.7"/>
                  </svg>
                  <span className="font-medium">Professeurs</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-6 mb-3">Gestion</div>
            
            <NavLink to="/admin/affectations" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                  <span className="font-medium">Affectations</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/admin/juries" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    <circle cx="18" cy="8" r="3" opacity="0.5"/>
                    <circle cx="6" cy="8" r="3" opacity="0.5"/>
                  </svg>
                  <span className="font-medium">Juries</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/admin/soutenances" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                  </svg>
                  <span className="font-medium">Soutenances</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/admin/planification" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-[#05A66B] to-[#04905c] text-white shadow-lg shadow-emerald-500/30':'text-gray-700 hover:bg-emerald-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                  <span className="font-medium">Planification</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
          </nav>
          
          {/* Profil et déconnexion */}
          <div className="px-4 py-4 border-t border-gray-200/50 mt-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#05A66B] to-[#04905c] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {profile?.nom?.[0] || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{profile?.nom || 'Administrateur'}</div>
                  <div className="text-xs text-gray-500 truncate">{profile?.email || 'admin@emsi.ma'}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={()=>{ logout(); navigate('/'); }} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium group"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header moderne */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="px-6 py-4 flex items-center gap-4">
              {/* Menu burger mobile */}
              <button 
                className="md:hidden p-2 rounded-xl bg-gradient-to-br from-[#05A66B] to-[#04905c] text-white hover:shadow-lg transition-all" 
                onClick={()=>setOpen(o=>!o)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
              
              {/* Breadcrumb / Titre de page */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {location.pathname.includes('dashboard') && 'Tableau de bord'}
                  {location.pathname.includes('etudiants') && 'Gestion des étudiants'}
                  {location.pathname.includes('professeurs') && 'Gestion des professeurs'}
                  {location.pathname.includes('juries') && 'Gestion des jurys'}
                  {location.pathname.includes('soutenances') && 'Planning des soutenances'}
                  {location.pathname.includes('affectations') && 'Affectations'}
                  {location.pathname.includes('planification') && 'Planification'}
                </h1>
                <p className="text-sm text-gray-500">Bienvenue dans l'espace administrateur</p>
              </div>
              
              {/* Actions header */}
              <div className="flex items-center gap-3">
                {/* Recherche */}
                {!location.pathname.includes('/admin/soutenances') && (
                  <div className="relative hidden lg:block">
                    <input 
                      type="search"
                      placeholder="Rechercher..."
                      className="w-80 px-4 py-2.5 pl-11 rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#05A66B]/20 focus:border-[#05A66B] transition-all"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                
                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                  </svg>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                
                {/* Avatar et menu */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#05A66B] to-[#04905c] text-white flex items-center justify-center font-bold shadow-lg">
                    {profile?.nom?.[0] || 'A'}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{profile?.nom || 'Admin'}</div>
                    <div className="text-xs text-gray-500">Administrateur</div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* Toasts modernes */}
          <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
            {toasts.map(t => (
              <div 
                key={t.id} 
                className={`animate-slide-in-right flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                  t.type==='success'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {t.type === 'success' ? (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t.message}</p>
                </div>
                <button 
                  onClick={()=>removeToast(t.id)} 
                  className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Main content area */}
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
