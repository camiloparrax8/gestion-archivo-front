import { env } from '../config/env';
export class ApiHttpError extends Error {
    status;
    payload;
    constructor(status, message, payload) {
        super(message);
        this.name = 'ApiHttpError';
        this.status = status;
        this.payload = payload;
    }
}
export async function apiRequest(path, options = {}) {
    const { method = 'GET', body, token, apiKey, headers = {} } = options;
    const finalHeaders = { ...headers };
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (!isFormData) {
        finalHeaders['Content-Type'] = 'application/json';
    }
    if (token) {
        finalHeaders.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
        finalHeaders['X-API-Key'] = apiKey;
    }
    const response = await fetch(`${env.apiUrl}${path}`, {
        method,
        headers: finalHeaders,
        body: body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : undefined,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
        const payload = (data || {});
        const message = payload.error?.message || `HTTP ${response.status}`;
        throw new ApiHttpError(response.status, message, data);
    }
    return data;
}
