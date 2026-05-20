import { useState } from 'react';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { useAdminClientesService } from '../services/adminClientesService';
import { Button, Dialog, Input } from '../../../../shared/ui';

function errorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}


export function CrearLlaveDialog({
  clienteId = '',
  clienteNombre = '',
  isOpen = false,
  onClose,
  onCreated,
  submitLlave = null,
  description: descriptionProp,
  formId = 'form-crear-llave',
}) {
  const clientesService = useAdminClientesService();
  const [nombre, setNombre] = useState('');
  const [prefijos, setPrefijos] = useState('');
  const [permRead, setPermRead] = useState(true);
  const [permWrite, setPermWrite] = useState(true);
  const [permDelete, setPermDelete] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const reset = () => {
    setNombre('');
    setPrefijos('');
    setPermRead(true);
    setPermWrite(true);
    setPermDelete(true);
    setLocalError('');
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const listaPrefijos = prefijos
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      nombre,
      prefijos: listaPrefijos,
      permisos: { read: permRead, write: permWrite, delete: permDelete },
    };

    if (!submitLlave && !clienteId) {
      setLocalError('Selecciona un cliente (publicId).');
      return;
    }

    setLoading(true);
    try {
      if (submitLlave) {
        const response = await submitLlave(payload);
        await onCreated?.({
          id: response.data?.id,
          apiKey: response.data?.apiKey,
        });
        reset();
        onClose?.();
        return;
      }

      const response = await clientesService.createLlave(clienteId, payload);
      await onCreated?.({
        id: response.data?.id,
        apiKey: response.data?.apiKey,
      });
      reset();
      onClose?.();
    } catch (error) {
      setLocalError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const description =
    descriptionProp ??
    (submitLlave
      ? 'La API key completa solo se muestra una vez al crearla. Guárdala en un lugar seguro.'
      : `Cliente: ${clienteNombre || clienteId || '(sin seleccionar)'}`);

  return (
    <Dialog
      isOpen={isOpen}
      title="Nueva API key"
      onClose={handleClose}
      size="form"
      disableBackdropClose={loading}
      
      footer={
        <div className="row actions-row dialog-footer-actions">
          <Button type="button" variant="secondary" disabled={loading} onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} disabled={loading}>
            {loading ? 'Creando…' : 'Crear llave'}
          </Button>
        </div>
      }
    >
      <form id={formId} className="dialog-form grid" onSubmit={handleSubmit}>
        <div className="form-grid form-grid--dialog">
          <Input
            label="Nombre llave"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="postman-key"
            required
            widthVariant="full"
          />
          <Input
            label="Entidad"
            value={prefijos}
            onChange={(e) => setPrefijos(e.target.value)}
            placeholder="guven, otro/prefijo"
            required
            widthVariant="full"
          />
        </div>
        <fieldset className="permisos-fieldset">
          <legend>Permisos</legend>
          <div className="row permisos-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={permRead} onChange={(e) => setPermRead(e.target.checked)} />
              Lectura
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={permWrite} onChange={(e) => setPermWrite(e.target.checked)} />
              Escritura
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={permDelete} onChange={(e) => setPermDelete(e.target.checked)} />
              Borrado
            </label>
          </div>
        </fieldset>
        {localError ? (
          <p className="dialog-inline-error" role="alert">
            {localError}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
