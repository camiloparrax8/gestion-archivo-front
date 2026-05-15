import { Box, Chip, IconButton } from '@mui/material';
import { ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import {
  DataTableEmpty,
  DataTableRoot,
  DataTableScroll,
  DataTableTable,
  DataTableToolbar,
} from '../../../../ui/ui-unique/DataTable';

export function permisosEnEspanol(permisos) {
  if (!permisos || typeof permisos !== 'object') return '—';
  const partes = [];
  if (permisos.read) partes.push('Leer');
  if (permisos.write) partes.push('Escribir');
  if (permisos.delete) partes.push('Eliminar');
  return partes.length ? partes.join(', ') : 'Ninguno';
}

export function prefijosTexto(prefijos) {
  if (!Array.isArray(prefijos) || prefijos.length === 0) return '—';
  return prefijos.join(', ');
}

function rowId(llave) {
  return llave?.publicId ?? llave?.id ?? '';
}


export function AdminLlavesTable({
  llaves = [],
  loading = false,
  disabled = false,
  listaSincronizada = true,
  soloLectura = false,
  /** Con `soloLectura`, permite mostrar solo el botón «Nueva llave» (p. ej. vista cliente). */
  permitirNuevaLlave = false,
  textoInstruccionCarga,
  textoSinLlaves,
  onRefresh,
  onNuevaLlave,
  onToggleEstado,
}) {
  const muestraColumnaAcciones = !soloLectura;
  const colCount = muestraColumnaAcciones ? 4 : 3;
  const muestraBotonNuevaLlave = Boolean(onNuevaLlave) && (!soloLectura || permitirNuevaLlave);

  const toolbarActions = (
    <>
      <button
        type="button"
        className="icon-btn icon-btn--ghost"
        disabled={disabled || loading}
        onClick={onRefresh}
        aria-label="Actualizar lista"
        title="Actualizar lista"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" />
          <path
            d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {muestraBotonNuevaLlave ? (
        <button type="button" className="btn btn-primary" disabled={disabled || loading} onClick={onNuevaLlave}>
          Nueva llave
        </button>
      ) : null}
    </>
  );

  return (
    <DataTableRoot refreshing={loading && llaves.length > 0}>
      <DataTableToolbar title="API keys" actions={toolbarActions} />

      {llaves.length === 0 && !loading && !listaSincronizada ? (
        <DataTableEmpty>
          <p className="muted" style={{ margin: 0 }}>
            {textoInstruccionCarga ?? (
              <>
                Pulsa <strong>Buscar llaves</strong> (arriba) o el icono de actualizar para cargar las API keys de este
                cliente.
              </>
            )}
          </p>
        </DataTableEmpty>
      ) : null}

      {llaves.length === 0 && !loading && listaSincronizada ? (
        <DataTableEmpty>
          <p className="muted" style={{ margin: 0 }}>
            {textoSinLlaves ?? 'No hay llaves. Crea una con "Nueva llave".'}
          </p>
        </DataTableEmpty>
      ) : null}

      {llaves.length > 0 || loading ? (
        <DataTableScroll>
          <DataTableTable>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Entidad</th>
                <th>Permisos</th>
                {muestraColumnaAcciones ? <th className="oui-dt-actions">Acciones</th> : null}
              </tr>
            </thead>
            <tbody>
              {loading && llaves.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="oui-dt-loading">
                    Cargando…
                  </td>
                </tr>
              ) : (
                llaves.map((llave) => {
                  const id = rowId(llave);
                  const activo = Boolean(llave.activo);
                  return (
                    <tr key={id}>
                      <td>
                        <div className="llave-nombre-cell">
                          <span className="oui-dt-code">{llave.nombre || '—'}</span>
                          <Chip
                            label={activo ? 'Activa' : 'Inactiva'}
                            size="small"
                            color={activo ? 'success' : 'default'}
                            variant={activo ? 'filled' : 'outlined'}
                          />
                        </div>
                      </td>
                      <td className="oui-dt-muted">{prefijosTexto(llave.prefijos)}</td>
                      <td className="oui-dt-muted">{permisosEnEspanol(llave.permisos)}</td>
                      {muestraColumnaAcciones ? (
                        <td className="oui-dt-actions">
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.25 }}>
                          <IconButton
                            size="small"
                            color={activo ? 'warning' : 'success'}
                            disabled={disabled || loading || !id}
                            onClick={() => onToggleEstado?.(id, activo)}
                            aria-label={activo ? 'Desactivar llave' : 'Activar llave'}
                            title={activo ? 'Desactivar' : 'Activar'}
                          >
                            {activo ? <ToggleOffOutlined fontSize="small" /> : <ToggleOnOutlined fontSize="small" />}
                          </IconButton>
                        </Box>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </DataTableTable>
        </DataTableScroll>
      ) : null}
    </DataTableRoot>
  );
}
