import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { AdminClientesTable } from '../components/AdminClientesTable';
import { AdminLlavesTable } from '../components/AdminLlavesTable';
import { CrearClienteDialog } from '../components/CrearClienteDialog';
import { CrearLlaveDialog } from '../components/CrearLlaveDialog';
import { EditarClienteDialog } from '../components/EditarClienteDialog';
import { useAdminClientesService } from '../services/adminClientesService';
import { Button, Card, Feedback, SectionHeader, Select } from '../../../../shared/ui';

function idClienteRow(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function etiquetaClienteSelect(row) {
  const id = idClienteRow(row);
  const titulo = [row?.nombre, row?.numeroDocumento].filter(Boolean).join(' · ');
  if (titulo) return `${titulo}`;
  return id || 'Cliente';
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

function llaveErrorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

export function ClientesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clientesService = useAdminClientesService();

  const [clienteId, setClienteId] = useState('');
  const [clientes, setClientes] = useState([]);
  const [totalClientes, setTotalClientes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [llaves, setLlaves] = useState([]);
  const [loadingLlaves, setLoadingLlaves] = useState(false);
  const [llavesClienteCargado, setLlavesClienteCargado] = useState(null);
  const [dialogLlaveOpen, setDialogLlaveOpen] = useState(false);
  const [dialogClienteOpen, setDialogClienteOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);

  const clienteIdFromUrl = searchParams.get('clienteId') ?? '';

  useEffect(() => {
    if (clienteIdFromUrl) setClienteId(clienteIdFromUrl);
  }, [clienteIdFromUrl]);

  const fetchLlavesPorId = useCallback(
    async (clienteRefId) => {
      const id = String(clienteRefId ?? '').trim();
      if (!id) {
        setLlaves([]);
        setLlavesClienteCargado(null);
        return;
      }
      setLoadingLlaves(true);
      try {
        const response = await clientesService.getLlaves(id);
        const rows = Array.isArray(response?.data) ? response.data : [];
        setLlaves(rows);
        setLlavesClienteCargado(id);
      } catch (error) {
        setLlaves([]);
        setLlavesClienteCargado(null);
        setFeedback({ variant: 'danger', message: llaveErrorMessage(error) });
      } finally {
        setLoadingLlaves(false);
      }
    },
    [clientesService],
  );

  const clienteIdTrim = clienteId.trim();

  const clienteNombreParaLlave = useMemo(() => {
    if (!clienteIdTrim) return '';
    const row = clientes.find((r) => idClienteRow(r) === clienteIdTrim);
    if (row) return etiquetaClienteSelect(row);
    return `${clienteIdTrim}`;
  }, [clientes, clienteIdTrim]);

  const opcionesCliente = useMemo(() => {
    const head = [{ value: '', label: 'Selecciona un cliente' }];
    const fromApi = clientes
      .map((row) => {
        const value = idClienteRow(row);
        if (!value) return null;
        return { value, label: etiquetaClienteSelect(row) };
      })
      .filter(Boolean);
    const ids = new Set(fromApi.map((o) => o.value));
    if (clienteIdTrim && !ids.has(clienteIdTrim)) {
      return [...head, { value: clienteIdTrim, label: `${clienteIdTrim} (URL / no listado)` }, ...fromApi];
    }
    return [...head, ...fromApi];
  }, [clientes, clienteIdTrim]);

  const loadClientes = useCallback(async (options = {}) => {
    const { silent = false } = options;
    setLoading(true);
    try {
      const response = await clientesService.getClientes();
      const rows = Array.isArray(response?.data) ? response.data : [];
      setClientes(rows);
      setTotalClientes(rows.length);
      if (!silent) {
        setFeedback({ variant: 'info', message: `Clientes cargados: ${rows.length}` });
      }
    } catch (error) {
      setClientes([]);
      setTotalClientes(null);
      setFeedback(resolveFeedback(error));
    } finally {
      setLoading(false);
    }
  }, [clientesService]);

  useEffect(() => {
    void loadClientes({ silent: true });
  }, [loadClientes]);

  useEffect(() => {
    if (!clienteIdTrim) {
      setLlaves([]);
      setLlavesClienteCargado(null);
      return;
    }
    if (llavesClienteCargado && llavesClienteCargado !== clienteIdTrim) {
      setLlaves([]);
      setLlavesClienteCargado(null);
    }
  }, [clienteIdTrim, llavesClienteCargado]);

  const handleClienteCreado = ({ publicId }) => {
    if (publicId) {
      setClienteId(publicId);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('clienteId', publicId);
        return next;
      });
    }
    setFeedback({ variant: 'success', message: publicId ? `Cliente creado: ${publicId}` : 'Cliente creado.' });
    void loadClientes({ silent: true });
  };

  const handleClienteSelect = (e) => {
    const next = e.target.value;
    setClienteId(next);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (next.trim()) nextParams.set('clienteId', next.trim());
      else nextParams.delete('clienteId');
      return nextParams;
    });
  };

  const handleSeleccionarClienteTabla = (publicId) => {
    const id = String(publicId ?? '').trim();
    setClienteId(id);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (id) nextParams.set('clienteId', id);
      else nextParams.delete('clienteId');
      return nextParams;
    });
  };

  const toggleEstadoLlave = async (llaveId, activoActual) => {
    if (!clienteIdTrim) return;
    setLoadingLlaves(true);
    try {
      await clientesService.updateEstadoLlave(clienteIdTrim, llaveId, !activoActual);
      setFeedback({ variant: 'success', message: `Estado actualizado: ${llaveId}` });
      await fetchLlavesPorId(clienteIdTrim);
    } catch (error) {
      setFeedback({ variant: 'danger', message: llaveErrorMessage(error) });
    } finally {
      setLoadingLlaves(false);
    }
  };

  const handleLlaveCreada = async ({ apiKey }) => {
    setFeedback({
      variant: 'success',
      message: apiKey
        ? `Llave creada. Copia la API key ahora: ${apiKey}`
        : 'Llave creada correctamente.',
    });
    await fetchLlavesPorId(clienteIdTrim);
  };

  return (
    <Card>
      <SectionHeader eyebrow="Administracion" title="Clientes" />

      <Card className="feature-panel">
        <AdminClientesTable
          clientes={clientes}
          loading={loading}
          selectedId={clienteIdTrim}
          onSelectCliente={handleSeleccionarClienteTabla}
          onRefresh={() => void loadClientes({ silent: true })}
          onNuevoCliente={() => setDialogClienteOpen(true)}
          onEditarCliente={(row) => setClienteAEditar(row)}
        />
      </Card>

      <Card className="feature-panel">
        <div className="row card-between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Cliente seleccionado</h3>
        </div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <div className="field-grow" style={{ flex: '1 1 220px', minWidth: 0 }}>
            <Select
              label="Cliente"
              value={clienteId}
              onChange={handleClienteSelect}
              options={opcionesCliente}
              disabled={loading}
              widthVariant="full"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!clienteIdTrim || loadingLlaves}
            onClick={() => fetchLlavesPorId(clienteIdTrim)}
          >
            {loadingLlaves ? 'Cargando…' : 'Cargar llaves'}
          </Button>
        </div>
        <div className="quick-stats">
          <div className="stat-chip">
            <span>Estado</span>
            <strong>{clienteIdTrim ? 'Listo' : 'Pendiente'}</strong>
          </div>
          <div className="stat-chip">
            <span>Llaves cargadas</span>
            <strong>
              {clienteIdTrim && llavesClienteCargado === clienteIdTrim ? llaves.length : '-'}
            </strong>
          </div>
          <div className="stat-chip">
            <span>Total clientes</span>
            <strong>{totalClientes ?? '-'}</strong>
          </div>
        </div>
        
      </Card>

      {clienteIdTrim && (loadingLlaves || llavesClienteCargado === clienteIdTrim) ? (
        <Card className="feature-panel llaves-panel">
          <div className="llaves-panel-intro">
          </div>
          <AdminLlavesTable
            llaves={llaves}
            loading={loadingLlaves}
            disabled={!clienteIdTrim}
            listaSincronizada={Boolean(llavesClienteCargado && llavesClienteCargado === clienteIdTrim)}
            onRefresh={() => fetchLlavesPorId(clienteIdTrim)}
            onNuevaLlave={() => setDialogLlaveOpen(true)}
            onToggleEstado={(llaveId, activoActual) => toggleEstadoLlave(llaveId, activoActual)}
          />
        </Card>
      ) : null}

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

      <CrearLlaveDialog
        clienteId={clienteIdTrim}
        clienteNombre={clienteNombreParaLlave}
        isOpen={dialogLlaveOpen}
        onClose={() => setDialogLlaveOpen(false)}
        onCreated={handleLlaveCreada}
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
