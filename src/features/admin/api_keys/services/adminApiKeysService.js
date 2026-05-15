import { useMemo } from 'react';
import { useAdminClientesService } from '../../clientes/services/adminClientesService';
export function useAdminApiKeysService() {
    const clientesService = useAdminClientesService();
    return useMemo(
        () => ({
            createLlave: clientesService.createLlave,
            getLlaves: clientesService.getLlaves,
            updateEstadoLlave: clientesService.updateEstadoLlave,
            rotarLlave: clientesService.rotarLlave,
        }),
        [clientesService],
    );
}
