import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';


export function RootRedirect() {
  const { isAuthenticated, isAdmin, isCliente } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin/clientes" replace />;
  }
  if (isCliente) {
    return <Navigate to="/client/me/apikeys" replace />;
  }
  return <Navigate to="/multimedia" replace />;
}
