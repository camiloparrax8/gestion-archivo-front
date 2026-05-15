export const env = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    masterKey: import.meta.env.VITE_MASTER_KEY || '',
    /** Segmento de contexto en la URL de multimedia (GET storage). Por defecto `orion`. */
    multimediaContexto: (import.meta.env.VITE_MULTIMEDIA_CONTEXTO || 'orion').trim(),
};
