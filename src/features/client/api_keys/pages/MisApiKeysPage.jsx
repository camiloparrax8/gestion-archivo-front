import { useCallback, useEffect, useState } from 'react';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { AdminLlavesTable } from '../../../admin/clientes/components/AdminLlavesTable';
import { CrearLlaveDialog } from '../../../admin/clientes/components/CrearLlaveDialog';
import { useClientApiKeysService } from '../services/clientApiKeysService';
import { Card, Feedback, SectionHeader } from '../../../../shared/ui';

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
  const [messageType, setMessageType] = useState('info');
  const [dialogLlaveOpen, setDialogLlaveOpen] = useState(false);

  const cargarLlaves = useCallback(async () => {
    setLoading(true);
    setMessage('');
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

  const handleLlaveCreada = useCallback(
    async ({ apiKey }) => {
      await cargarLlaves();
      setMessageType('success');
      setMessage(
        apiKey
          ? `Llave creada. Copia la API key ahora: ${apiKey}`
          : 'Llave creada correctamente.',
      );
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
        />
      </Card>

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
          onClose={() => setMessage('')}
          message={message}
          variant={messageType}
          title="Mis API Keys"
          position="bottom-right"
          autoHideDuration={messageType === 'danger' ? 8000 : 5000}
        />
      ) : null}
    </Card>
  );
}
