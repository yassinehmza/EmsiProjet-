import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';

// Admin
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/Dashboard';
import Etudiants from './Admin/Etudiants';
import Professeurs from './Admin/Professeurs';
import Soutenances from './Admin/Soutenances';
import Juries from './Admin/Juries';
import Affectations from './Admin/Affectations';
import Planification from './Admin/Planification';

// Professeur
import ProfesseurLayout from './Professeur/ProfesseurLayout';
import ProfesseurDashboard from './Professeur/Dashboard';
import MesEtudiants from './Professeur/MesEtudiants';
import Rapports from './Professeur/Rapports';
import MesSoutenances from './Professeur/MesSoutenances';
import ProfesseurRemarques from './Professeur/Remarques';

// Etudiant
import EtudiantLayout from './Etudiant/EtudiantLayout';
import EtudiantDashboard from './Etudiant/Dashboard';
import MesRapports from './Etudiant/MesRapports';
import MaSoutenance from './Etudiant/MaSoutenance';
import EtudiantRemarques from './Etudiant/Remarques';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Routes Professeur */}
        <Route
          path="/professeur"
          element={
            <ProtectedRoute allowRole="professeur">
              <ProfesseurLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProfesseurDashboard />} />
          <Route path="etudiants" element={<MesEtudiants />} />
          <Route path="rapports" element={<Rapports />} />
          <Route path="soutenances" element={<MesSoutenances />} />
          <Route path="remarques" element={<ProfesseurRemarques />} />
        </Route>

        {/* Routes Étudiant */}
        <Route
          path="/etudiant"
          element={
            <ProtectedRoute allowRole="etudiant">
              <EtudiantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EtudiantDashboard />} />
          <Route path="rapports" element={<MesRapports />} />
          <Route path="soutenance" element={<MaSoutenance />} />
          <Route path="remarques" element={<EtudiantRemarques />} />
        </Route>

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
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="etudiants" element={<div className="text-gray-700"><Etudiants /></div>} />
          <Route path="professeurs" element={<div className="text-gray-700"><Professeurs /></div>} />
          <Route path="soutenances" element={<div className="text-gray-700"><Soutenances /></div>} />
          <Route path="juries" element={<div className="text-gray-700"><Juries /></div>} />
          <Route path="affectations" element={<div className="text-gray-700"><Affectations /></div>} />
          <Route path="planification" element={<div className="text-gray-700"><Planification /></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
