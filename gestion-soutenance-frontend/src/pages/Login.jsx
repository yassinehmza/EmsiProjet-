import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import EmsiLoginLogo from '../assets/emsi_login_logo.png';
import { useAuth } from '../store/auth';
import { loginEtudiant, loginProfesseur, loginAdmin } from '../api/auth';

export default function Login() {
  const [role, setRole] = useState('etudiant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const onSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      let res;
      if (role === 'etudiant') res = await loginEtudiant(email, password);
      else if (role === 'professeur') res = await loginProfesseur(email, password);
      else res = await loginAdmin(email, password);
      const token = res?.token || res?.access_token || res?.data?.token;
      if (token) {
        setAuth({ token, role, profile: res?.user || null });
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'professeur') navigate('/professeur');
        else navigate('/etudiant');
        setStatus('connected');
      } else {
        setStatus('no_token');
      }
    } catch (err) {
      const code = err?.response?.status;
      if (code === 401) setStatus('invalid');
      else if (code >= 500) setStatus('server_error');
      else setStatus('error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get('role');
    if (r && ['etudiant','professeur','admin'].includes(r)) setRole(r);
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Link to="/"><img src={EmsiLoginLogo} alt="EMSI" className="h-16 md:h-20 object-contain cursor-pointer" /></Link>
          </div>
          <h1 className="text-center text-2xl font-medium text-gray-900 mb-6">Connexion</h1>
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">Type d'utilisateur*</label>
            <div className="relative">
              <select value={role} onChange={e=>setRole(e.target.value)} className="w-full appearance-none border rounded-lg px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                <option value="etudiant">Étudiant</option>
                <option value="professeur">Professeur</option>
                <option value="admin">Administrateur</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full border rounded-lg py-2 font-medium text-gray-800 bg-white hover:bg-gray-50 disabled:opacity-70">
              {status === 'loading' ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <div className="mt-3 text-center text-sm">
            {status === 'connected' && <p className="text-emerald-700">Connecté</p>}
            {status === 'invalid' && <p className="text-red-600">Identifiants invalides</p>}
            {status === 'server_error' && <p className="text-red-600">Erreur serveur (500). Vérifier le backend.</p>}
            {status === 'error' && <p className="text-red-600">Erreur lors de la connexion</p>}
            {status === 'no_token' && <p className="text-red-600">Token manquant dans la réponse</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
