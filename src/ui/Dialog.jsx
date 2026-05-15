import PropTypes from 'prop-types';
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const SIZE_TO_MAX_WIDTH = {
  default: 'sm',
  wide: 'md',
  xl: 'xl',
};

/**
 * Diálogo con MUI. Compatibilidad con la API anterior:
 * `isOpen` → `open`, `footer` → `actions`, `size` → `maxWidth`, `description` en el contenido.
 */
export function Dialog({
  open: openProp,
  isOpen,
  onClose,
  title,
  description,
  children,
  actions: actionsProp,
  footer,
  maxWidth: maxWidthProp,
  size = 'default',
  fullWidth = true,
  showCloseButton = true,
  disableBackdropClose = false,
  panelClassName,
  ...rest
}) {
  const open = openProp ?? Boolean(isOpen);
  const actions = actionsProp ?? footer;
  const maxWidth = maxWidthProp ?? SIZE_TO_MAX_WIDTH[size] ?? SIZE_TO_MAX_WIDTH.default;

  const handleClose = (event, reason) => {
    if (disableBackdropClose && reason === 'backdropClick') {
      return;
    }
    onClose?.(event, reason);
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          className: panelClassName,
          sx: maxWidth === 'xl' ? { maxHeight: 'min(92vh, 900px)' } : undefined,
        },
      }}
      {...rest}
    >
      {title ? (
        <DialogTitle sx={{ pr: showCloseButton ? 6 : 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Typography variant="h6" component="div" id="dialog-title">
              {title}
            </Typography>
            {showCloseButton ? (
              <IconButton
                aria-label="Cerrar"
                onClick={(e) => handleClose(e, 'closeButton')}
                edge="end"
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            ) : null}
          </div>
        </DialogTitle>
      ) : null}
      <DialogContent dividers={false} sx={{ overflow: 'auto', pt: title ? 1 : 3 }}>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        ) : null}
        {children}
      </DialogContent>
      {actions ? <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>{actions}</DialogActions> : null}
    </MuiDialog>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  actions: PropTypes.node,
  footer: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  size: PropTypes.oneOf(['default', 'wide', 'xl']),
  fullWidth: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  disableBackdropClose: PropTypes.bool,
  panelClassName: PropTypes.string,
};
