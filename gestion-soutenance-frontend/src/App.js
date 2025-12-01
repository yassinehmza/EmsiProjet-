import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Dashboard';
import Etudiants from './Admin/Etudiants';
import Professeurs from './Admin/Professeurs';
import Soutenances from './Admin/Soutenances';
import Juries from './Admin/Juries';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="etudiants" element={<div className="text-gray-700"><Etudiants /></div>} />
          <Route path="professeurs" element={<div className="text-gray-700"><Professeurs /></div>} />
          <Route path="soutenances" element={<div className="text-gray-700"><Soutenances /></div>} />
          <Route path="juries" element={<div className="text-gray-700"><Juries /></div>} />
          <Route path="afietations" element={<div className="text-gray-700">Afiétations — à implémenter</div>} />
          <Route path="affectations" element={<div className="text-gray-700">Affectations — à implémenter</div>} />
          <Route path="planifiction" element={<div className="text-gray-700">Planifiction — à implémenter</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
