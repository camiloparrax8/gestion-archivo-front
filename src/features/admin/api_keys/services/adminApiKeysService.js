import { useMemo } from 'react';
import { useAdminClientesService } from '@features/admin/clientes/services/adminClientesService';
export function useAdminApiKeysService() {
    const clientesService = useAdminClientesService();
    return useMemo(
        () => ({
            createLlave: clientesService.createLlave,
            getLlaves: clientesService.getLlaves,
            updateEstadoLlave: clientesService.updateEstadoLlave,
            rotarLlave: clientesService.rotarLlave,
            deleteLlave: clientesService.deleteLlave,
        }),
        [clientesService],
    );
}
