import { useMemo } from 'react';
import { apiRequest } from '../../../../core/api/apiClient';
export const MULTIMEDIA_V1_PREFIX = '/api/v1/multimedia';
export const ENTIDAD_MULTIMEDIA_SEGMENTO = 'usuarios';
const enc = (value) => encodeURIComponent(value.trim());
export function rutaMultimediaPath(ruta) {
    return `${MULTIMEDIA_V1_PREFIX}/${enc(ruta.contexto)}/${enc(ruta.entidad)}/${enc(ruta.id)}/${enc(ruta.tipo)}`;
}
export function rutaMultimediaEliminarArchivo(ruta, nombreArchivo) {
    return `${rutaMultimediaPath(ruta)}/${encodeURIComponent(nombreArchivo.trim())}`;
}
export function useMultimediaService() {
    return useMemo(() => {
        const listar = (apiKey, ruta) => apiRequest(rutaMultimediaPath(ruta), { apiKey });
        const subir = (apiKey, ruta, archivo) => {
            const formData = new FormData();
            formData.append('archivo', archivo);
            return apiRequest(rutaMultimediaPath(ruta), {
                method: 'POST',
                apiKey,
                body: formData,
            });
        };
        const eliminar = (apiKey, ruta, nombreArchivo) => apiRequest(rutaMultimediaEliminarArchivo(ruta, nombreArchivo), {
            method: 'DELETE',
            apiKey,
        });
        return {
            listar,
            subir,
            eliminar,
        };
    }, []);
}
