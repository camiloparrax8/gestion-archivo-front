import { useMemo, useState } from 'react';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { adminApi } from '../../../../api/adminApi';
import { authApi } from '../../../../api/authApi';
import { buildClienteCreatePayload } from '../../../admin/clientes/utils/buildClienteCreatePayload';
import { ENTIDAD_MULTIMEDIA_SEGMENTO, rutaMultimediaPath, useMultimediaService, } from '../../../multimedia/files/services/multimediaService';
function getErrorMessage(error) {
    if (error instanceof ApiHttpError)
        return `${error.message} (HTTP ${error.status})`;
    if (error instanceof Error)
        return error.message;
    return 'Error desconocido';
}
const initialState = {
    email: '',
    password: '',
    token: '',
    user: null,
    clienteEmail: '',
    clienteNombre: '',
    clienteId: '',
    keyName: 'llave multimedia',
    keyPrefixes: 'orion/productos',
    apiKey: null,
    contexto: 'orion',
    entidadId: '1',
    tipo: 'galeria',
    archivo: null,
    archivoEliminar: '',
    resultado: '',
    isLoading: false,
};
export function useIntegrationDemo() {
    const [state, setState] = useState(initialState);
    const multimediaService = useMultimediaService();
    const setField = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };
    const rutaMultimedia = useMemo(() => ({
        contexto: state.contexto,
        entidad: ENTIDAD_MULTIMEDIA_SEGMENTO,
        id: state.entidadId,
        tipo: state.tipo,
    }), [state.contexto, state.entidadId, state.tipo]);
    const rutasPreview = useMemo(() => rutaMultimediaPath(rutaMultimedia), [rutaMultimedia]);
    const run = async (fn) => {
        setField('isLoading', true);
        try {
            await fn();
        }
        finally {
            setField('isLoading', false);
        }
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        await run(async () => {
            try {
                const response = await authApi.login({ email: state.email, password: state.password });
                const loggedUser = response.data.user;
                setState((prev) => ({
                    ...prev,
                    token: response.data.token,
                    user: loggedUser,
                    ...(loggedUser.rol === 'cliente' ? { entidadId: loggedUser.id } : {}),
                    resultado: `Login exitoso para ${loggedUser.email}`,
                }));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleMe = async () => {
        if (!state.token) {
            setField('resultado', 'Primero haz login para consultar /auth/me');
            return;
        }
        await run(async () => {
            try {
                const response = await authApi.me(state.token);
                const user = response.data;
                setState((prev) => ({
                    ...prev,
                    user,
                    ...(user.rol === 'cliente' ? { entidadId: user.id } : {}),
                    resultado: `Perfil cargado: ${user.nombre} (${user.rol})`,
                }));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleCrearCliente = async (event) => {
        event.preventDefault();
        if (!state.token) {
            setField('resultado', 'Necesitas JWT admin para crear cliente');
            return;
        }
        await run(async () => {
            try {
                const response = await adminApi.crearCliente(state.token, buildClienteCreatePayload({
                    email: state.clienteEmail,
                    nombre: state.clienteNombre,
                    telefono: '',
                    activo: true,
                    tipoDocumento: '',
                    numeroDocumento: '',
                }));
                setState((prev) => ({
                    ...prev,
                    clienteId: response.data.publicId,
                    resultado: `Cliente creado: ${response.data.publicId}`,
                }));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleCrearLlave = async (event) => {
        event.preventDefault();
        if (!state.token || !state.clienteId) {
            setField('resultado', 'Necesitas token admin y clienteId para crear la llave');
            return;
        }
        const prefijos = state.keyPrefixes
            .split(',')
            .map((segment) => segment.trim())
            .filter(Boolean);
        await run(async () => {
            try {
                const response = await adminApi.crearLlave(state.token, state.clienteId, {
                    nombre: state.keyName,
                    prefijos,
                    permisos: { read: true, write: true, delete: true },
                });
                setState((prev) => ({
                    ...prev,
                    apiKey: { publicId: response.data.id, value: response.data.apiKey },
                    resultado: `API key creada: ${response.data.id}. Guarda la llave en un lugar seguro.`,
                }));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleListar = async () => {
        const apiKey = state.apiKey?.value;
        if (!apiKey) {
            setField('resultado', 'Primero crea una API key de cliente');
            return;
        }
        await run(async () => {
            try {
                const response = await multimediaService.listar(apiKey, rutaMultimedia);
                setField('resultado', JSON.stringify(response, null, 2));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleSubir = async (event) => {
        event.preventDefault();
        const apiKey = state.apiKey?.value;
        const archivo = state.archivo;
        if (!apiKey) {
            setField('resultado', 'Primero crea una API key de cliente');
            return;
        }
        if (!archivo) {
            setField('resultado', 'Selecciona un archivo antes de subir');
            return;
        }
        await run(async () => {
            try {
                const response = await multimediaService.subir(apiKey, rutaMultimedia, archivo);
                setState((prev) => ({
                    ...prev,
                    archivoEliminar: response.data.nombre,
                    resultado: JSON.stringify(response, null, 2),
                }));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    const handleEliminar = async () => {
        const apiKey = state.apiKey?.value;
        if (!apiKey || !state.archivoEliminar) {
            setField('resultado', 'Debes tener API key y nombre de archivo para eliminar');
            return;
        }
        await run(async () => {
            try {
                const response = await multimediaService.eliminar(apiKey, rutaMultimedia, state.archivoEliminar);
                setField('resultado', JSON.stringify(response, null, 2));
            }
            catch (error) {
                setField('resultado', getErrorMessage(error));
            }
        });
    };
    return {
        state,
        rutasPreview,
        setField,
        setTipo: (value) => setField('tipo', value),
        handleLogin,
        handleMe,
        handleCrearCliente,
        handleCrearLlave,
        handleListar,
        handleSubir,
        handleEliminar,
    };
}
