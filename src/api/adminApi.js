import { apiRequest } from './apiClient';
export const adminApi = {
    crearCliente: (token, payload) => apiRequest('/api/v1/admin/clientes', {
        method: 'POST',
        token,
        body: payload,
    }),
    crearLlave: (token, clienteId, payload) => apiRequest(`/api/v1/admin/clientes/${clienteId}/llaves`, {
        method: 'POST',
        token,
        body: payload,
    }),
    listarLlaves: (token, clienteId) => apiRequest(`/api/v1/admin/clientes/${clienteId}/llaves`, {
        token,
    }),
    cambiarEstadoLlave: (token, clienteId, llaveId, activo) => apiRequest(`/api/v1/admin/clientes/${clienteId}/llaves/${llaveId}/estado`, {
        method: 'PATCH',
        token,
        body: { activo },
    }),
    eliminarLlave: (token, clienteId, llaveId) => apiRequest(
        `/api/v1/admin/clientes/${encodeURIComponent(String(clienteId).trim())}/llaves/${encodeURIComponent(String(llaveId).trim())}`,
        { method: 'DELETE', token },
    ),
};
