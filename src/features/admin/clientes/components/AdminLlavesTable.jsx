import { alpha } from '@mui/material/styles';
import { Box, Chip, IconButton } from '@mui/material';
import { DeleteOutlined, ToggleOffOutlined, ToggleOnOutlined } from '@mui/icons-material';
import {
  DataTableEmpty,
  DataTableRoot,
  DataTableScroll,
  DataTableTable,
  DataTableToolbar,
  RefreshIconButton,
} from '@shared/ui';

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
  onEliminar,
  tableScrollable = false,
}) {
  const muestraToggle = Boolean(onToggleEstado) && !soloLectura;
  const muestraEliminar = Boolean(onEliminar);
  const muestraColumnaAcciones = muestraToggle || muestraEliminar;
  const colCount = muestraColumnaAcciones ? 4 : 3;
  const muestraBotonNuevaLlave = Boolean(onNuevaLlave) && (!soloLectura || permitirNuevaLlave);

  const toolbarActions = (
    <>
      <RefreshIconButton
        loading={loading}
        disabled={disabled}
        onClick={onRefresh}
      />
      {muestraBotonNuevaLlave ? (
        <button type="button" className="btn btn-primary" disabled={disabled || loading} onClick={onNuevaLlave}>
          Nueva llave
        </button>
      ) : null}
    </>
  );

  return (
    <DataTableRoot refreshing={loading && llaves.length > 0}>
      <DataTableToolbar  actions={toolbarActions} />

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
        <DataTableScroll className={tableScrollable ? 'oui-dt-scroll--body' : undefined}>
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
                            {muestraToggle ? (
                              <IconButton
                                size="small"
                                disabled={disabled || loading || !id}
                                onClick={() => onToggleEstado(id, activo)}
                                aria-label={activo ? 'Desactivar llave' : 'Activar llave'}
                                title={activo ? 'Desactivar' : 'Activar'}
                                sx={(theme) =>
                                  activo
                                    ? {
                                        color: theme.palette.warning.main,
                                        backgroundColor: alpha(theme.palette.warning.main, 0.12),
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.warning.main, 0.22),
                                        },
                                      }
                                    : {
                                        color: theme.palette.success.main,
                                        backgroundColor: alpha(theme.palette.success.main, 0.12),
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.success.main, 0.22),
                                        },
                                      }
                                }
                              >
                                {activo ? (
                                  <ToggleOffOutlined fontSize="small" />
                                ) : (
                                  <ToggleOnOutlined fontSize="small" />
                                )}
                              </IconButton>
                            ) : null}
                            {muestraEliminar ? (
                              <IconButton
                                size="small"
                                disabled={disabled || loading || !id}
                                onClick={() => onEliminar(id)}
                                aria-label="Eliminar llave"
                                title="Eliminar"
                                sx={(theme) => ({
                                  color: theme.palette.error.main,
                                  backgroundColor: alpha(theme.palette.error.main, 0.12),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.22),
                                  },
                                })}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            ) : null}
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
