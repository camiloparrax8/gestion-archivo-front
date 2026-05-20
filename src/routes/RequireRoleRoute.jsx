import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';


export function RequireRoleRoute({ requiredRole }) {
  const { isAuthenticated, isAdmin, isCliente } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin') {
    if (!isAdmin) {
      return <Navigate to={isCliente ? '/client/me/apikeys' : '/multimedia'} replace />;
    }
    return <Outlet />;
  }

  if (requiredRole === 'cliente') {
    if (!isCliente) {
      return <Navigate to={isAdmin ? '/admin/clientes' : '/multimedia'} replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/multimedia" replace />;
}
