import './DataTable.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function DataTableRoot({
  refreshing = false,
  className = '',
  variant = 'embedded',
  children,
}) {
  return (
    <div
      className={cx(
        'oui-dt',
        variant === 'panel' && 'oui-dt--panel',
        variant === 'embedded' && 'oui-dt--embedded',
        refreshing && 'oui-dt--refreshing',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Barra superior: título + acciones (slot derecho). */
export function DataTableToolbar({ title, titleAs: TitleTag = 'h3', actions = null }) {
  const showTitle = title != null && String(title).trim() !== '';
  return (
    <div className="oui-dt-toolbar">
      {showTitle ? (
        <TitleTag className="oui-dt-title">{title}</TitleTag>
      ) : (
        <div className="oui-dt-title-spacer" aria-hidden />
      )}
      {actions ? <div className="oui-dt-toolbar-actions">{actions}</div> : null}
    </div>
  );
}

/** Mensaje vacío / instrucción bajo la barra. */
export function DataTableEmpty({ children, className = '' }) {
  return <div className={cx('oui-dt-empty', className)}>{children}</div>;
}

/** Área con scroll horizontal para la tabla. */
export function DataTableScroll({ children, className = '', style }) {
  return (
    <div className={cx('oui-dt-scroll', className)} style={style}>
      {children}
    </div>
  );
}

/** Tabla con estilos Orion UI. */
export function DataTableTable({ children, ...rest }) {
  return (
    <table className="oui-dt-table" {...rest}>
      {children}
    </table>
  );
}
