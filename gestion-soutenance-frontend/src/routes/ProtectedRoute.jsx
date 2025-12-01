import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function ProtectedRoute({ children, allowRole }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  if (allowRole && role !== allowRole) return <Navigate to="/" replace />;
  return children;
}
