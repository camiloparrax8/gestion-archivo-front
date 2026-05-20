import { useCallback, useEffect, useState } from 'react';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { AdminLlavesTable } from '../../../admin/clientes/components/AdminLlavesTable';
import { CrearLlaveDialog } from '../../../admin/clientes/components/CrearLlaveDialog';
import { useClientApiKeysService } from '../services/clientApiKeysService';
import { Button, Card, Dialog, Feedback, SectionHeader } from '../../../../shared/ui';

function errorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

function normalizarLlaves(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

export function MisApiKeysPage() {
  const clientApiKeysService = useClientApiKeysService();
  const [llaves, setLlaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargaInicialLista, setCargaInicialLista] = useState(false);
  const [cargaFallida, setCargaFallida] = useState(false);
  const [message, setMessage] = useState('');
  const [copyText, setCopyText] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [dialogLlaveOpen, setDialogLlaveOpen] = useState(false);
  const [llaveAEliminar, setLlaveAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarLlaves = useCallback(async () => {
    setLoading(true);
    setMessage('');
    setCopyText('');
    setCargaFallida(false);
    try {
      const response = await clientApiKeysService.getMisLlaves();
      const rows = normalizarLlaves(response);
      setLlaves(rows);
    } catch (error) {
      setCargaFallida(true);
      setMessageType('danger');
      setMessage(errorMessage(error));
      setLlaves([]);
    } finally {
      setLoading(false);
      setCargaInicialLista(true);
    }
  }, [clientApiKeysService]);

  const submitMiLlave = useCallback(
    (payload) => clientApiKeysService.createLlave(payload),
    [clientApiKeysService],
  );

  const solicitarEliminarLlave = useCallback((llaveId) => {
    const llave = llaves.find((l) => (l.publicId ?? l.id) === llaveId);
    const nombre = llave?.nombre?.trim() || 'esta llave';
    setLlaveAEliminar({ id: llaveId, nombre });
  }, [llaves]);

  const confirmarEliminarLlave = useCallback(async () => {
    if (!llaveAEliminar?.id) return;
    setEliminando(true);
    try {
      await clientApiKeysService.deleteLlave(llaveAEliminar.id);
      setLlaveAEliminar(null);
      await cargarLlaves();
      setMessageType('success');
      setMessage('Llave eliminada correctamente.');
      setCopyText('');
    } catch (error) {
      setMessageType('danger');
      setMessage(errorMessage(error));
    } finally {
      setEliminando(false);
    }
  }, [llaveAEliminar, clientApiKeysService, cargarLlaves]);

  const handleLlaveCreada = useCallback(
    async ({ apiKey }) => {
      await cargarLlaves();
      setMessageType('success');
      setMessage(
        apiKey
          ? 'Llave creada. Guárdala ahora; solo se muestra una vez.'
          : 'Llave creada correctamente.',
      );
      setCopyText(apiKey || '');
    },
    [cargarLlaves],
  );

  useEffect(() => {
    void cargarLlaves();
  }, [cargarLlaves]);

  return (
    <Card>
      <SectionHeader
        eyebrow="Seguridad"
        title="Mis API Keys"
        description="Crea nuevas llaves o actualiza el listado con el icono de refrescar."
      />

      <Card className="feature-panel llaves-panel">
        <AdminLlavesTable
          llaves={llaves}
          loading={loading}
          disabled={false}
          listaSincronizada={cargaInicialLista}
          soloLectura
          permitirNuevaLlave
          textoSinLlaves={
            cargaFallida
              ? 'No se pudo cargar el listado. Pulsa actualizar para reintentar.'
              : 'No tienes API keys registradas.'
          }
          onRefresh={() => void cargarLlaves()}
          onNuevaLlave={() => setDialogLlaveOpen(true)}
          onEliminar={solicitarEliminarLlave}
        />
      </Card>

      <Dialog
        isOpen={Boolean(llaveAEliminar)}
        title="Eliminar API key"
        description={
          llaveAEliminar
            ? `¿Seguro que deseas eliminar permanentemente «${llaveAEliminar.nombre}»? Esta acción no se puede deshacer.`
            : ''
        }
        onClose={() => !eliminando && setLlaveAEliminar(null)}
        disableBackdropClose={eliminando}
        footer={
          <div className="row actions-row dialog-footer-actions">
            <Button type="button" variant="secondary" disabled={eliminando} onClick={() => setLlaveAEliminar(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" disabled={eliminando} onClick={() => void confirmarEliminarLlave()}>
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        }
      />

      <CrearLlaveDialog
        isOpen={dialogLlaveOpen}
        onClose={() => setDialogLlaveOpen(false)}
        submitLlave={submitMiLlave}
        onCreated={handleLlaveCreada}
        formId="form-crear-mi-llave"
      />

      {message ? (
        <Feedback
          open={Boolean(message)}
          onClose={() => {
            setMessage('');
            setCopyText('');
          }}
          message={message}
          copyText={copyText || undefined}
          variant={messageType}
          title="Mis API Keys"
          position="bottom-right"
          autoHideDuration={copyText ? 12000 : messageType === 'danger' ? 8000 : 5000}
        />
      ) : null}
    </Card>
  );
}
