import { alpha } from '@mui/material/styles';
import { Box, Chip, IconButton } from '@mui/material';
import { EditOutlined, VpnKeyOutlined } from '@mui/icons-material';
import {
  DataTableEmpty,
  DataTableRoot,
  DataTableScroll,
  DataTableTable,
  DataTableToolbar,
  RefreshIconButton,
} from '@shared/ui';

function rowPublicId(row) {
  const v = row?.publicId ?? row?.id;
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function documentoTexto(row) {
  const tipo = row?.tipoDocumento || row?.documentType || '';
  const num = row?.numeroDocumento || '';
  if (tipo && num) return `${tipo} ${num}`;
  if (num) return String(num);
  if (tipo) return String(tipo);
  return '—';
}

function telefonoTexto(row) {
  const t = row?.telefono ?? row?.phone;
  return t != null && String(t).trim() !== '' ? String(t).trim() : '—';
}

export function AdminClientesTable({
  clientes = [],
  loading = false,
  onVerLlaves,
  onRefresh,
  onNuevoCliente,
  onEditarCliente,
}) {
  const tieneDatos = clientes.length > 0 || loading;

  const toolbarActions = (
    <>
      <RefreshIconButton
        loading={loading}
        onClick={onRefresh}
        label="Actualizar listado de clientes"
        title="Actualizar listado"
      />
      <button type="button" className="btn btn-primary" disabled={loading} onClick={() => onNuevoCliente?.()}>
        Nuevo cliente
      </button>
    </>
  );

  return (
    <DataTableRoot refreshing={loading && clientes.length > 0}>
      <DataTableToolbar actions={toolbarActions} />

      {!tieneDatos && !loading ? (
        <DataTableEmpty>
          <p className="muted" style={{ margin: 0 }}>
            No hay clientes. Pulsa <strong>Nuevo cliente</strong> o el icono de actualizar.
          </p>
        </DataTableEmpty>
      ) : null}

      {tieneDatos ? (
        <DataTableScroll>
          <DataTableTable>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th className="oui-dt-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="oui-dt-loading">
                    Cargando…
                  </td>
                </tr>
              ) : (
                clientes.map((row, index) => {
                  const id = rowPublicId(row);
                  const activo = row?.activo !== false && row?.activo !== 0;
                  return (
                    <tr key={id || `cliente-row-${index}`}>
                      <td>{row?.nombre || '—'}</td>
                      <td className="oui-dt-muted">{row?.email || '—'}</td>
                      <td className="oui-dt-muted">{documentoTexto(row)}</td>
                      <td className="oui-dt-muted">{telefonoTexto(row)}</td>
                      <td>
                        <Chip
                          label={activo ? 'Activo' : 'Inactivo'}
                          size="small"
                          color={activo ? 'success' : 'default'}
                          variant={activo ? 'filled' : 'outlined'}
                        />
                      </td>
                      <td className="oui-dt-actions">
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.25 }}>
                        <IconButton
                          size="small"
                          disabled={loading || !id}
                          onClick={() => onVerLlaves?.(id)}
                          aria-label="Ver API keys del cliente"
                          title="Ver API keys"
                          sx={(theme) => ({
                            color: theme.palette.info.main,
                            backgroundColor: alpha(theme.palette.info.main, 0.12),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.info.main, 0.22),
                            },
                          })}
                        >
                          <VpnKeyOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={loading || !id}
                          onClick={() => onEditarCliente?.(row)}
                          aria-label="Editar cliente"
                          title="Editar cliente"
                          sx={(theme) => ({
                            color: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.22),
                            },
                          })}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Box>
                    </td>
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
