import {
  DataTableEmpty,
  DataTableRoot,
  DataTableScroll,
  DataTableTable,
  DataTableToolbar,
} from '../../../../ui/ui-unique/DataTable';

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function nombreArchivo(fila) {
  return fila?.nombre ?? fila?.nombreArchivo ?? '';
}

function nombreOriginal(fila) {
  const valor =
    fila?.nombreOriginal ??
    fila?.nombre_original ??
    fila?.originalName ??
    fila?.originalFilename;
  return typeof valor === 'string' && valor.trim() ? valor.trim() : '—';
}

export function MultimediaFilesTable({ archivos = [], loading = false, disabled = false, onDelete, onRefresh }) {
  const refreshBtn = (
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
  );

  if (!archivos.length && !loading) {
    return (
      <DataTableRoot>
        <DataTableToolbar title="Archivos en carpeta" actions={refreshBtn} />
        <DataTableEmpty>
          <p className="muted" style={{ margin: 0 }}>
            No hay archivos listados. Usa &quot;Actualizar lista&quot; o &quot;Listar activos&quot; en el panel.
          </p>
        </DataTableEmpty>
      </DataTableRoot>
    );
  }

  return (
    <DataTableRoot refreshing={loading && archivos.length > 0}>
      <DataTableToolbar title="Archivos en carpeta" actions={refreshBtn} />
      <DataTableScroll>
        <DataTableTable>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nombre original</th>
              <th>Acceso</th>
              <th className="oui-dt-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && archivos.length === 0 ? (
              <tr>
                <td colSpan={4} className="oui-dt-loading">
                  Cargando…
                </td>
              </tr>
            ) : (
              archivos.map((fila, idx) => {
                const nombre = nombreArchivo(fila);
                const key = fila?.rutaInternaCliente || fila?.rutaRelativa || `${nombre}-${idx}`;
                const url = fila?.url;
                return (
                  <tr key={key}>
                    <td>
                      <code className="oui-dt-code">{nombre || '—'}</code>
                    </td>
                    <td className="oui-dt-muted">{nombreOriginal(fila)}</td>
                    <td>
                      {url ? (
                        <a className="oui-dt-link" href={url} target="_blank" rel="noreferrer">
                          <span className="oui-dt-link-inner">
                            <IconLink /> Abrir
                          </span>
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="oui-dt-actions">
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        disabled={disabled || !nombre}
                        onClick={() => onDelete?.(nombre)}
                        aria-label={`Eliminar ${nombre}`}
                        title="Eliminar"
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </DataTableTable>
      </DataTableScroll>
    </DataTableRoot>
  );
}
