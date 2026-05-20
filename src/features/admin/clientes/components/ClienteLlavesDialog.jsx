import { useCallback, useEffect, useState } from 'react';
import { ApiHttpError } from '@core/api/apiClient';
import { useAdminClientesService } from '../services/adminClientesService';
import { Button, Dialog } from '@shared/ui';
import { AdminLlavesTable } from './AdminLlavesTable';
import { CrearLlaveDialog } from './CrearLlaveDialog';

function idClienteRow(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function etiquetaCliente(row) {
  const titulo = [row?.nombre, row?.numeroDocumento].filter(Boolean).join(' · ');
  if (titulo) return titulo;
  return idClienteRow(row) || 'Cliente';
}

function llaveErrorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

export function ClienteLlavesDialog({ open = false, cliente = null, onClose, onFeedback }) {
  const clientesService = useAdminClientesService();
  const [llaves, setLlaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogLlaveOpen, setDialogLlaveOpen] = useState(false);
  const [llaveAEliminar, setLlaveAEliminar] = useState(null);

  const clienteId = idClienteRow(cliente);
  const clienteNombre = etiquetaCliente(cliente);

  const loadLlaves = useCallback(async () => {
    if (!clienteId) {
      setLlaves([]);
      return;
    }
    setLoading(true);
    try {
      const response = await clientesService.getLlaves(clienteId);
      const rows = Array.isArray(response?.data) ? response.data : [];
      setLlaves(rows);
    } catch (error) {
      setLlaves([]);
      onFeedback?.({ variant: 'danger', message: llaveErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, [clienteId, clientesService, onFeedback]);

  useEffect(() => {
    if (open && clienteId) {
      void loadLlaves();
    }
    if (!open) {
      setLlaves([]);
      setDialogLlaveOpen(false);
      setLlaveAEliminar(null);
    }
  }, [open, clienteId, loadLlaves]);

  const toggleEstadoLlave = async (llaveId, activoActual) => {
    if (!clienteId) return;
    setLoading(true);
    try {
      await clientesService.updateEstadoLlave(clienteId, llaveId, !activoActual);
      onFeedback?.({ variant: 'success', message: `Estado actualizado correctamente` });
      await loadLlaves();
    } catch (error) {
      onFeedback?.({ variant: 'danger', message: llaveErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarLlave = async () => {
    if (!clienteId || !llaveAEliminar?.id) return;
    setLoading(true);
    try {
      await clientesService.deleteLlave(clienteId, llaveAEliminar.id);
      setLlaveAEliminar(null);
      onFeedback?.({ variant: 'success', message: 'Llave eliminada correctamente.' });
      await loadLlaves();
    } catch (error) {
      onFeedback?.({ variant: 'danger', message: llaveErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const solicitarEliminarLlave = (llaveId) => {
    const llave = llaves.find((l) => (l.publicId ?? l.id) === llaveId);
    const nombre = llave?.nombre?.trim() || 'esta llave';
    setLlaveAEliminar({ id: llaveId, nombre });
  };

  const handleLlaveCreada = async ({ apiKey }) => {
    onFeedback?.({
      variant: 'success',
      message: apiKey
        ? 'Llave creada. Guárdala ahora; solo se muestra una vez.'
        : 'Llave creada correctamente.',
      copyText: apiKey || undefined,
    });
    await loadLlaves();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="API keys"
        size="apiKeys"
        fullWidth
      >
        <AdminLlavesTable
          llaves={llaves}
          loading={loading}
          disabled={!clienteId}
          listaSincronizada={Boolean(open && clienteId)}
          tableScrollable
          textoSinLlaves='No hay llaves. Crea una con "Nueva llave".'
          onRefresh={() => void loadLlaves()}
          onNuevaLlave={() => setDialogLlaveOpen(true)}
          onToggleEstado={(llaveId, activoActual) => void toggleEstadoLlave(llaveId, activoActual)}
          onEliminar={solicitarEliminarLlave}
        />
      </Dialog>

      <Dialog
        isOpen={Boolean(llaveAEliminar)}
        title="Eliminar API key"
        description={
          llaveAEliminar
            ? `¿Seguro que deseas eliminar permanentemente «${llaveAEliminar.nombre}»? Esta acción no se puede deshacer.`
            : ''
        }
        onClose={() => !loading && setLlaveAEliminar(null)}
        disableBackdropClose={loading}
        footer={
          <div className="row actions-row dialog-footer-actions">
            <Button type="button" variant="secondary" disabled={loading} onClick={() => setLlaveAEliminar(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" disabled={loading} onClick={() => void confirmarEliminarLlave()}>
              {loading ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        }
      />

      <CrearLlaveDialog
        clienteId={clienteId}
        clienteNombre={clienteNombre}
        isOpen={dialogLlaveOpen}
        onClose={() => setDialogLlaveOpen(false)}
        onCreated={handleLlaveCreada}
      />
    </>
  );
}
