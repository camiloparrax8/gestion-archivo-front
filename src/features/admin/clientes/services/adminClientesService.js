import { useMemo } from 'react';
import { useAuth } from '@shared/auth/useAuth';
import { apiRequest } from '@core/api/apiClient';
export function useAdminClientesService() {
    const { token } = useAuth();
    return useMemo(() => {
        const base = '/api/v1/admin/clientes';
        const getClientes = async (params) => {
            const query = params
                ? new URLSearchParams(Object.entries(params)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])).toString()
                : '';
            return apiRequest(`${base}${query ? `?${query}` : ''}`, { token });
        };
        const createCliente = async (payload) => apiRequest(base, {
            method: 'POST',
            token,
            body: payload,
        });
        const updateCliente = async (clienteId, payload) => apiRequest(`${base}/${encodeURIComponent(String(clienteId).trim())}`, {
            method: 'PUT',
            token,
            body: payload,
        });
        const createLlave = async (clienteId, payload) => apiRequest(`${base}/${clienteId}/llaves`, {
            method: 'POST',
            token,
            body: payload,
        });
        const getLlaves = async (clienteId) => apiRequest(`${base}/${clienteId}/llaves`, { token });
        const updateEstadoLlave = async (clienteId, llaveId, activo) => apiRequest(`${base}/${clienteId}/llaves/${llaveId}/estado`, {
            method: 'PATCH',
            token,
            body: { activo },
        });
        const rotarLlave = async (clienteId, llaveId) => apiRequest(`${base}/${clienteId}/llaves/${llaveId}/rotar`, {
            method: 'POST',
            token,
        });
        const deleteLlave = async (clienteId, llaveId) => apiRequest(
            `${base}/${encodeURIComponent(String(clienteId).trim())}/llaves/${encodeURIComponent(String(llaveId).trim())}`,
            { method: 'DELETE', token },
        );
        return {
            getClientes,
            createCliente,
            updateCliente,
            createLlave,
            getLlaves,
            updateEstadoLlave,
            rotarLlave,
            deleteLlave,
        };
    }, [token]);
}
