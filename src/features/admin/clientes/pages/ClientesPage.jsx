import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { AdminClientesTable } from '../components/AdminClientesTable';
import { ClienteLlavesDialog } from '../components/ClienteLlavesDialog';
import { CrearClienteDialog } from '../components/CrearClienteDialog';
import { EditarClienteDialog } from '../components/EditarClienteDialog';
import { useAdminClientesService } from '../services/adminClientesService';
import { Card, Feedback, SectionHeader } from '../../../../shared/ui';

function idClienteRow(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function resolveFeedback(error) {
  if (error instanceof ApiHttpError && /duplicate key|E11000/i.test(error.message)) {
    return { variant: 'warning', message: 'Ya existe un cliente con ese email' };
  }
  if (error instanceof ApiHttpError) {
    return { variant: 'danger', message: error.message || 'Error al procesar la solicitud' };
  }
  if (error instanceof Error) return { variant: 'danger', message: error.message };
  return { variant: 'danger', message: 'Error desconocido' };
}

export function ClientesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clientesService = useAdminClientesService();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [dialogClienteOpen, setDialogClienteOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [clienteLlaves, setClienteLlaves] = useState(null);
  const [dialogLlavesOpen, setDialogLlavesOpen] = useState(false);

  const clienteIdFromUrl = searchParams.get('clienteId') ?? '';

  const abrirDialogLlaves = useCallback((row) => {
    if (!row) return;
    setClienteLlaves(row);
    setDialogLlavesOpen(true);
  }, []);

  const cerrarDialogLlaves = useCallback(() => {
    setDialogLlavesOpen(false);
    setClienteLlaves(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('clienteId');
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const loadClientes = useCallback(async (options = {}) => {
    const { silent = false } = options;
    setLoading(true);
    try {
      const response = await clientesService.getClientes();
      const rows = Array.isArray(response?.data) ? response.data : [];
      setClientes(rows);
      if (!silent) {
        setFeedback({ variant: 'info', message: `Clientes cargados: ${rows.length}` });
      }
      return rows;
    } catch (error) {
      setClientes([]);
      setFeedback(resolveFeedback(error));
      return [];
    } finally {
      setLoading(false);
    }
  }, [clientesService]);

  useEffect(() => {
    void loadClientes({ silent: true });
  }, [loadClientes]);

  useEffect(() => {
    const id = clienteIdFromUrl.trim();
    if (!id || clientes.length === 0) return;
    const row = clientes.find((r) => idClienteRow(r) === id);
    if (row) abrirDialogLlaves(row);
  }, [clienteIdFromUrl, clientes, abrirDialogLlaves]);

  const handleClienteCreado = async ({ publicId }) => {
    setFeedback({
      variant: 'success',
      message: publicId ? `Cliente creado: ${publicId}` : 'Cliente creado.',
    });
    const rows = await loadClientes({ silent: true });
    if (publicId) {
      const row = rows.find((r) => idClienteRow(r) === String(publicId).trim());
      if (row) abrirDialogLlaves(row);
    }
  };

  const handleVerLlavesCliente = (publicId) => {
    const id = String(publicId ?? '').trim();
    if (!id) return;
    const row = clientes.find((r) => idClienteRow(r) === id);
    if (row) {
      abrirDialogLlaves(row);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('clienteId', id);
          return next;
        },
        { replace: true },
      );
    }
  };

  return (
    <Card>
      <SectionHeader eyebrow="Administracion" title="Clientes" />

      <Card className="feature-panel">
        <AdminClientesTable
          clientes={clientes}
          loading={loading}
          onVerLlaves={handleVerLlavesCliente}
          onRefresh={() => void loadClientes({ silent: true })}
          onNuevoCliente={() => setDialogClienteOpen(true)}
          onEditarCliente={(row) => setClienteAEditar(row)}
        />
      </Card>

      <ClienteLlavesDialog
        open={dialogLlavesOpen}
        cliente={clienteLlaves}
        onClose={cerrarDialogLlaves}
        onFeedback={setFeedback}
      />

      <CrearClienteDialog
        isOpen={dialogClienteOpen}
        onClose={() => setDialogClienteOpen(false)}
        onCreated={handleClienteCreado}
      />

      <EditarClienteDialog
        isOpen={Boolean(clienteAEditar)}
        cliente={clienteAEditar}
        onClose={() => setClienteAEditar(null)}
        onUpdated={() => {
          setFeedback({ variant: 'success', message: 'Cliente actualizado.' });
          void loadClientes({ silent: true });
        }}
      />

      <Feedback
        open={Boolean(feedback)}
        onClose={() => setFeedback(null)}
        message={feedback?.message || ''}
        variant={feedback?.variant || 'info'}
        title="Clientes"
        position="bottom-right"
        autoHideDuration={5000}
      />
    </Card>
  );
}
