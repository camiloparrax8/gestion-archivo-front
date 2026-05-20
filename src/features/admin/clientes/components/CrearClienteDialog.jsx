import { useState } from 'react';
import { ApiHttpError } from '@core/api/apiClient';
import { useAdminClientesService } from '../services/adminClientesService';
import { Button, Dialog, Input, Select } from '@shared/ui';
import { buildClienteCreatePayload } from '../utils/buildClienteCreatePayload';

const TIPOS_DOCUMENTO = [
  { value: '', label: 'Seleccione tipo' },
  { value: 'CC', label: 'CC — Cédula de ciudadanía' },
  { value: 'CE', label: 'CE — Cédula de extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'OTRO', label: 'Otro' },
];

function resolveCreateFeedback(error) {
  if (error instanceof ApiHttpError && /duplicate key|E11000/i.test(error.message)) {
    return 'Ya existe un cliente con ese email';
  }
  if (error instanceof ApiHttpError) {
    return error.message || 'Error al procesar la solicitud';
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}


export function CrearClienteDialog({ isOpen = false, onClose, onCreated }) {
  const clientesService = useAdminClientesService();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [activo, setActivo] = useState(true);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const reset = () => {
    setEmail('');
    setNombre('');
    setTelefono('');
    setActivo(true);
    setTipoDocumento('');
    setNumeroDocumento('');
    setLocalError('');
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    try {
      const response = await clientesService.createCliente(
        buildClienteCreatePayload({
          email,
          nombre,
          telefono,
          activo,
          tipoDocumento,
          numeroDocumento,
        }),
      );
      const publicId = response.data?.publicId;
      await onCreated?.({ publicId });
      reset();
      onClose?.();
    } catch (error) {
      setLocalError(resolveCreateFeedback(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Nuevo cliente"
      onClose={handleClose}
      size="form"
      disableBackdropClose={loading}
      footer={
        <div className="row actions-row dialog-footer-actions">
          <Button type="button" variant="secondary" disabled={loading} onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="form-crear-cliente" disabled={loading}>
            {loading ? 'Creando…' : 'Crear cliente'}
          </Button>
        </div>
      }
    >
      <form id="form-crear-cliente" className="dialog-form grid" onSubmit={handleSubmit}>
        <div className="form-grid form-grid--dialog">
          <Select
            label="Tipo de documento"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            options={TIPOS_DOCUMENTO}
            widthVariant="full"
          />
          <Input
            label="Número de documento"
            autoComplete="off"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            widthVariant="full"
          />
          <Input
            label="Nombre cliente"
            autoComplete="off"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            widthVariant="full"
          />
          <Input
            label="Email cliente"
            autoComplete="off"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            widthVariant="full"
          />
          <Input
            label="Teléfono"
            autoComplete="off"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            widthVariant="full"
          />
          <div className="dialog-form__meta">
            <label className="checkbox-label">
              <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
              Cliente activo
            </label>
          </div>
        </div>
        {localError ? (
          <p className="dialog-inline-error" role="alert">
            {localError}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
