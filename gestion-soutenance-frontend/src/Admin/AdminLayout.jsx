import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUI } from '../store/ui';
import { useAuth } from '../store/auth';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { toasts, removeToast } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className={`${open?'translate-x-0':'-translate-x-full'} md:translate-x-0 fixed md:static top-0 left-0 h-full md:h-auto w-[260px] bg-white text-gray-900 flex-shrink-0 transition-transform duration-200 md:flex md:flex-col z-40`}
        >
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[#05A66B] text-white flex items-center justify-center">❤</div>
            <div className="text-lg font-semibold">Dashboard</div>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <NavLink to="/admin/dashboard" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-md ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1.01 4.5 2.5C12.09 5.01 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/etudiants" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  </div>
                  <span>Étudiants</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/professeurs" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  </div>
                  <span>Professeurs</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/afietations" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-md ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                  </div>
                  <span>Afiétations</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/affectations" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                  </div>
                  <span>Affectations</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/juries" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                  </div>
                  <span>Juries</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/soutenances" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 5h12v2H3V9zm0 5h18v2H3v-2z"/></svg>
                  </div>
                  <span>Soutenances</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin/planifiction" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded ${isActive?'bg-[#04905c]/10 border-l-4 border-[#05A66B]':'hover:bg-gray-100'}`}>
              {({isActive}) => (
                <>
                  <div className={`h-5 w-5 rounded-full ${isActive?'bg-[#05A66B] text-white':'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                  </div>
                  <span>Planifiction</span>
                </>
              )}
            </NavLink>
          </nav>
          <div className="px-2 py-3 border-t">
            <button onClick={()=>{ logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#04905c]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5v10zM3 19h6v-2H5V7h4V5H3v14z"/></svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 md:ml-72">
          <header className="sticky top-0 z-30 bg-white border-b">
            <div className="px-4 py-3 flex items-center gap-3">
              <button className="md:hidden p-2 rounded bg-[#05A66B] text-white" onClick={()=>setOpen(o=>!o)}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
              </button>
              {location.pathname.includes('/admin/soutenances') ? (
                <div className="flex-1" />
              ) : (
                <div className="flex-1">
                  <input className="w-full md:w-96 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05A66B]" placeholder="Recherche" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#05A66B]/10 text-[#05A66B]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
                  <span>Administrateur</span>
                </div>
                <div className="h-8 w-8 rounded-full border border-[#05A66B]" />
              </div>
            </div>
          </header>
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(t => (
              <div key={t.id} className={`px-4 py-2 rounded-lg shadow ${t.type==='success'?'bg-[#05A66B] text-white':'bg-red-600 text-white'}`}>
                <div className="flex items-center gap-2">
                  <span>{t.message}</span>
                  <button onClick={()=>removeToast(t.id)} className="ml-2">✕</button>
                </div>
              </div>
            ))}
          </div>
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
