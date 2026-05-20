import { useEffect, useState } from 'react';
import { ApiHttpError } from '@core/api/apiClient';
import { useAdminClientesService } from '../services/adminClientesService';
import { buildClienteCreatePayload } from '../utils/buildClienteCreatePayload';
import { Button, Dialog, Input, Select } from '@shared/ui';

const TIPOS_DOCUMENTO = [
  { value: '', label: 'Seleccione tipo' },
  { value: 'CC', label: 'CC — Cédula de ciudadanía' },
  { value: 'CE', label: 'CE — Cédula de extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'OTRO', label: 'Otro' },
];

function idClienteRow(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function resolveFeedback(error) {
  if (error instanceof ApiHttpError && /duplicate key|E11000/i.test(error.message)) {
    return 'Ya existe un cliente con ese email';
  }
  if (error instanceof ApiHttpError) {
    return error.message || 'Error al procesar la solicitud';
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

export function EditarClienteDialog({ isOpen = false, cliente, onClose, onUpdated }) {
  const clientesService = useAdminClientesService();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [activo, setActivo] = useState(true);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const clienteId = idClienteRow(cliente ?? {});

  useEffect(() => {
    if (!isOpen || !cliente) return;
    setEmail(cliente.email ?? '');
    setNombre(cliente.nombre ?? '');
    setTelefono(cliente.telefono ?? cliente.phone ?? '');
    setActivo(cliente.activo !== false && cliente.activo !== 0);
    setTipoDocumento(cliente.tipoDocumento ?? cliente.documentType ?? '');
    setNumeroDocumento(cliente.numeroDocumento ?? '');
    setLocalError('');
  }, [isOpen, cliente]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId) {
      setLocalError('Cliente sin identificador.');
      return;
    }
    setLoading(true);
    setLocalError('');
    try {
      await clientesService.updateCliente(
        clienteId,
        buildClienteCreatePayload({
          email,
          nombre,
          telefono,
          activo,
          tipoDocumento,
          numeroDocumento,
        }),
      );
      await onUpdated?.();
      onClose?.();
    } catch (error) {
      setLocalError(resolveFeedback(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Editar cliente"
      onClose={handleClose}
      size="form"
      disableBackdropClose={loading}
      footer={
        <div className="row actions-row dialog-footer-actions">
          <Button type="button" variant="secondary" disabled={loading} onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="form-editar-cliente" disabled={loading || !clienteId}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      }
    >
      <form id="form-editar-cliente" className="dialog-form grid" onSubmit={handleSubmit}>
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
