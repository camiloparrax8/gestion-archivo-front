import { Navigate, useParams } from 'react-router-dom';

/**
 * Compatibilidad: la gestión de llaves vive en la vista principal de clientes (diálogo + lista).
 */
export function ApiKeysPage() {
  const { clienteId = '' } = useParams();
  const q = clienteId ? `?clienteId=${encodeURIComponent(clienteId)}` : '';
  return <Navigate to={`/admin/clientes${q}`} replace />;
}
