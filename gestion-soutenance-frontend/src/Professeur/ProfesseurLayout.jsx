import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUI } from '../store/ui';
import { useAuth } from '../store/auth';

export default function ProfesseurLayout() {
  const [open, setOpen] = useState(false);
  const { toasts, removeToast } = useUI();
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      toasts.forEach(t => removeToast(t.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50">
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
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">Espace Professeur</div>
                <div className="text-xs text-gray-500">Encadrement</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Menu Principal</div>
            
            <NavLink to="/professeur/dashboard" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30':'text-gray-700 hover:bg-purple-50/50'}`}>
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
            
            <NavLink to="/professeur/etudiants" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30':'text-gray-700 hover:bg-purple-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span className="font-medium">Mes Étudiants</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/professeur/rapports" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30':'text-gray-700 hover:bg-purple-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span className="font-medium">Rapports</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-6 mb-3">Soutenances</div>
            
            <NavLink to="/professeur/soutenances" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30':'text-gray-700 hover:bg-purple-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                  </svg>
                  <span className="font-medium">Mes Soutenances</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
            
            <NavLink to="/professeur/remarques" className={({isActive})=>`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive?'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30':'text-gray-700 hover:bg-purple-50/50'}`}>
              {({isActive}) => (
                <>
                  <svg className={`h-5 w-5 ${isActive?'':'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                  </svg>
                  <span className="font-medium">Remarques</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"/>}
                </>
              )}
            </NavLink>
          </nav>

          {/* User Profile Section */}
          <div className="px-4 py-4 border-t border-gray-200/50">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                {profile?.nom?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{profile?.nom} {profile?.prenom}</div>
                <div className="text-xs text-gray-500 truncate">{profile?.email}</div>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors group"
            >
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(true)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
              
              <div className="flex-1 flex items-center gap-4 md:gap-6 justify-end">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span className="hidden md:inline font-medium">Professeur</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`animate-slide-in-right px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border min-w-[300px] ${
            toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
            toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
            'bg-blue-500/90 border-blue-400 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                {toast.type === 'success' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>}
                {toast.type === 'error' && <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>}
                {toast.type === 'info' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>}
              </svg>
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
