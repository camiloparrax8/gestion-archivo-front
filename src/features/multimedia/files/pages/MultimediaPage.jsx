import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiHttpError } from '../../../../core/api/apiClient';
import { useAdminClientesService } from '../../../admin/clientes/services/adminClientesService';
import { useAuth } from '../../../../shared/auth/useAuth';
import { Button, Card, Dialog, Feedback, Input, SectionHeader, Select } from '../../../../shared/ui';
import { MultimediaFilesTable } from '../components/MultimediaFilesTable';
import { ENTIDAD_MULTIMEDIA_SEGMENTO, useMultimediaService } from '../services/multimediaService';

const TIPO_MULTIMEDIA = 'perfil';

function errorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

function normalizarListado(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

function idClienteRow(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function etiquetaClienteSelect(row) {
  const id = idClienteRow(row);
  const titulo = [row?.nombre].filter(Boolean).join(' · ');
  if (titulo) return `${titulo}`;
  return id || 'Cliente';
}

export function MultimediaPage() {
  const { user, isCliente } = useAuth();
  const multimediaService = useMultimediaService();
  const adminClientesService = useAdminClientesService();
  const [panelOpen, setPanelOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [contexto, setContexto] = useState('');
  const [entidadId, setEntidadId] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [archivoAEliminar, setArchivoAEliminar] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  useEffect(() => {
    if (isCliente && user?.id) setEntidadId(user.id);
  }, [isCliente, user?.id]);

  useEffect(() => {
    if (!panelOpen || isCliente) return undefined;
    let cancelado = false;
    setLoadingClientes(true);
    (async () => {
      try {
        const res = await adminClientesService.getClientes();
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (!cancelado) setClientes(rows);
      } catch (error) {
        if (!cancelado) {
          setClientes([]);
          setMensaje({ variant: 'danger', text: errorMessage(error) });
        }
      } finally {
        if (!cancelado) setLoadingClientes(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [panelOpen, isCliente, adminClientesService]);

  const ruta = {
    contexto: contexto.trim(),
    entidad: ENTIDAD_MULTIMEDIA_SEGMENTO,
    id: entidadId.trim(),
    tipo: TIPO_MULTIMEDIA,
  };

  const puedeOperar = Boolean(apiKey.trim() && ruta.contexto && ruta.id);

  const validarCamposBase = (key) => {
    if (!key) {
      setMensaje({ variant: 'warning', text: 'Ingresa una API key' });
      return false;
    }
    if (!ruta.contexto) {
      setMensaje({ variant: 'warning', text: 'Completa el contexto (ej. orion)' });
      return false;
    }
    if (!ruta.id) {
      setMensaje({ variant: 'warning', text: 'Completa el ID' });
      return false;
    }
    return true;
  };

  const fetchArchivos = useCallback(
    async (options = {}) => {
      const { silent = false } = options;
      const key = apiKey.trim();
      if (!validarCamposBase(key)) return;
      setLoadingLista(true);
      try {
        const res = await multimediaService.listar(key, ruta);
        const rows = normalizarListado(res);
        setArchivos(rows);
        if (!silent) {
          setMensaje({ variant: 'success', text: `Listado OK: ${rows.length} archivo(s).` });
        }
      } catch (error) {
        setMensaje({ variant: 'danger', text: errorMessage(error) });
      } finally {
        setLoadingLista(false);
      }
    },
    [apiKey, ruta.contexto, ruta.id, multimediaService],
  );

  useEffect(() => {
    if (!puedeOperar) setArchivos([]);
  }, [puedeOperar]);

  const listar = () => fetchArchivos({ silent: false });

  const subir = async (event) => {
    event.preventDefault();
    const key = apiKey.trim();
    if (!validarCamposBase(key)) return;
    if (!archivo) {
      setMensaje({ variant: 'warning', text: 'Selecciona un archivo' });
      return;
    }
    setMensaje(null);
    setLoading(true);
    try {
      const response = await multimediaService.subir(key, ruta, archivo);
      const nombreGuardado = response?.data?.nombre ?? archivo.name;
      setMensaje({
        variant: 'success',
        title: 'Archivo subido',
        text: `"${nombreGuardado}" se subió correctamente.`,
      });
      await fetchArchivos({ silent: true });
    } catch (error) {
      setMensaje({ variant: 'danger', text: errorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!archivoAEliminar) return;
    const key = apiKey.trim();
    if (!validarCamposBase(key)) return;
    setLoadingLista(true);
    try {
      await multimediaService.eliminar(key, ruta, archivoAEliminar);
      const eliminado = archivoAEliminar;
      setArchivoAEliminar(null);
      setMensaje({ variant: 'success', text: `Archivo eliminado: ${eliminado}` });
      await fetchArchivos({ silent: true });
    } catch (error) {
      setMensaje({ variant: 'danger', text: errorMessage(error) });
    } finally {
      setLoadingLista(false);
    }
  };

  const cerrarPanel = () => {
    if (loading || loadingLista) return;
    setPanelOpen(false);
  };

  const busy = loading || loadingLista;

  const opcionesUsuarioCliente = useMemo(() => {
    const placeholder = loadingClientes ? 'Cargando clientes…' : 'Selecciona un cliente';
    const head = [{ value: '', label: placeholder }];
    const rest = clientes
      .map((row) => {
        const v = idClienteRow(row);
        if (!v) return null;
        return { value: v, label: etiquetaClienteSelect(row) };
      })
      .filter(Boolean);
    return [...head, ...rest];
  }, [clientes, loadingClientes]);

  return (
    <Card>
      <SectionHeader eyebrow="Gestor de archivos" title="Multimedia" />

      <Card className="feature-panel multimedia-landing">
        
        <div className="row actions-row" style={{ marginTop: 12 }}>
          <Button type="button" onClick={() => setPanelOpen(true)}>
            Abrir formulario de multimedia
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!puedeOperar || loadingLista}
            onClick={() => fetchArchivos({ silent: false })}
          >
            {loadingLista ? 'Actualizando…' : 'Actualizar lista'}
          </Button>
        </div>
      </Card>

      <Card className="feature-panel multimedia-table-card">
        <MultimediaFilesTable
          archivos={archivos}
          loading={loadingLista}
          disabled={!puedeOperar}
          onDelete={(nombre) => setArchivoAEliminar(nombre)}
          onRefresh={() => fetchArchivos({ silent: false })}
        />
      </Card>

      <Dialog
        isOpen={panelOpen}
        title="Multimedia"
        onClose={cerrarPanel}
        disableBackdropClose={busy}
        size="xl"
        footer={
          <div className="row actions-row dialog-footer-actions">
            <Button type="button" variant="secondary" disabled={busy} onClick={cerrarPanel}>
              Cerrar
            </Button>
          </div>
        }
      >
        <div className="multimedia-dialog-stack">
          <Card className="feature-panel">
            <h3>Consulta</h3>
            <Input
              label="Llave"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk_xxx..."
              widthVariant="full"
              
            />
            <div className="form-grid">
              <Input
                label="Contexto"
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="orion"
                widthVariant="full"
              />
              {!isCliente ? (
                <Select
                  label="Usuario"
                  value={entidadId}
                  onChange={(e) => setEntidadId(e.target.value)}
                  disabled={busy || loadingClientes}
                  options={opcionesUsuarioCliente}
                  widthVariant="full"
                />
              ) : null}
            </div>
            <div className="row actions-row">
              <Button disabled={busy || !puedeOperar} type="button" onClick={listar}>
                Listar activos
              </Button>
            </div>
          </Card>

          <Card className="feature-panel" as="div">
            <form className="grid" onSubmit={subir} noValidate>
              <h3>Subida de archivo</h3>
              <label className="file-picker" htmlFor="archivo-subida-dialog">
                <input
                  id="archivo-subida-dialog"
                  className="file-input-hidden"
                  type="file"
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                />
                <span className="file-picker-title">Seleccionar archivo</span>
                <span className="file-picker-subtitle">
                  {archivo ? archivo.name : 'Ningun archivo seleccionado'}
                </span>
              </label>
              <div className="row actions-row">
                <Button disabled={busy || !puedeOperar || !archivo} type="submit">
                  Subir archivo
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Dialog>

      <Dialog
        isOpen={Boolean(archivoAEliminar)}
        title="Eliminar archivo"
        description={
          archivoAEliminar
            ? `¿Seguro que deseas eliminar permanentemente «${archivoAEliminar}»? Esta acción no se puede deshacer.`
            : ''
        }
        onClose={() => !loadingLista && setArchivoAEliminar(null)}
        disableBackdropClose={loadingLista}
        footer={
          <div className="row actions-row dialog-footer-actions">
            <Button type="button" variant="secondary" disabled={loadingLista} onClick={() => setArchivoAEliminar(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" disabled={loadingLista} onClick={confirmarEliminar}>
              {loadingLista ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        }
      >
        <p className="muted" style={{ margin: 0 }}>
          Se usará la misma API key y ruta configuradas en el panel de multimedia.
        </p>
      </Dialog>

      <Feedback
        open={Boolean(mensaje)}
        onClose={() => setMensaje(null)}
        message={mensaje?.text ?? ''}
        variant={mensaje?.variant ?? 'info'}
        title={mensaje?.title ?? 'Multimedia'}
        position="bottom-right"
        autoHideDuration={mensaje?.variant === 'danger' ? 8000 : 5000}
      />
    </Card>
  );
}
