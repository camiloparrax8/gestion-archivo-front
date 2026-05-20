import { env } from '@config/env';
import { apiRequest } from './apiClient';
export const authApi = {
    register: (payload) => apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: payload,
        headers: env.masterKey ? { 'X-Master-Key': env.masterKey } : {},
    }),
    login: (payload) => apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: payload,
    }),
    me: (token) => apiRequest('/api/v1/auth/me', {
        token,
    }),
};
