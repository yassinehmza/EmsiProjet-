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
import ProfesseurDashboard from './pages/ProfesseurDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Route Professeur */}
        <Route
          path="/professeur"
          element={
            <ProtectedRoute allowRole="professeur">
              <ProfesseurDashboard />
            </ProtectedRoute>
          }
        />

        {/* Route Étudiant */}
        <Route
          path="/etudiant"
          element={
            <ProtectedRoute allowRole="etudiant">
              <EtudiantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Routes Admin */}
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
          <Route path="affectations" element={<div className="text-gray-700">Affectations — à implémenter</div>} />
          <Route path="planification" element={<div className="text-gray-700">Planification — à implémenter</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
