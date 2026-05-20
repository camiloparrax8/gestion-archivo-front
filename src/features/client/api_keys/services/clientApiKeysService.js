import { useMemo } from 'react';
import { useAuth } from '@shared/auth/useAuth';
import { apiRequest } from '@core/api/apiClient';
export function useClientApiKeysService() {
    const { token } = useAuth();
    const base = '/api/v1/client/me/apikeys';
    return useMemo(
        () => ({
            getMisLlaves: async () => apiRequest(base, { token }),
            createLlave: async (payload) =>
                apiRequest(base, {
                    method: 'POST',
                    token,
                    body: payload,
                }),
            deleteLlave: async (llaveId) =>
                apiRequest(`${base}/${encodeURIComponent(String(llaveId).trim())}`, {
                    method: 'DELETE',
                    token,
                }),
        }),
        [token],
    );
}
