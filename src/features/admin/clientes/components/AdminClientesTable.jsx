import { Box, Chip, IconButton } from '@mui/material';
import { CheckCircleOutlined, EditOutlined } from '@mui/icons-material';
import {
  DataTableEmpty,
  DataTableRoot,
  DataTableScroll,
  DataTableTable,
  DataTableToolbar,
} from '../../../../ui/ui-unique/DataTable';

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
  selectedId = '',
  onSelectCliente,
  onRefresh,
  onNuevoCliente,
  onEditarCliente,
}) {
  const tieneDatos = clientes.length > 0 || loading;

  const toolbarActions = (
    <>
      <button
        type="button"
        className="icon-btn icon-btn--ghost"
        disabled={loading}
        onClick={onRefresh}
        aria-label="Actualizar listado de clientes"
        title="Actualizar listado"
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
                  const seleccionado = Boolean(selectedId && id && selectedId === id);
                  return (
                    <tr
                      key={id || `cliente-row-${index}`}
                      style={
                        seleccionado
                          ? {
                              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                            }
                          : undefined
                      }
                    >
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
                          color="success"
                          disabled={loading || !id}
                          onClick={() => onSelectCliente?.(id)}
                          aria-label="Seleccionar cliente"
                          title="Seleccionar cliente"
                        >
                          <CheckCircleOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={loading || !id}
                          onClick={() => onEditarCliente?.(row)}
                          aria-label="Editar cliente"
                          title="Editar cliente"
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
