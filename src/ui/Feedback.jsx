import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Check,
  CheckCircle,
  Close,
  ContentCopy,
  Error as ErrorIcon,
  ExpandLess,
  ExpandMore,
  Info,
  Warning,
} from '@mui/icons-material';

const MUI_ALERT_VARIANTS = new Set(['filled', 'outlined', 'standard']);

const DEFAULT_ALERT_VARIANT = 'standard';

function resolveSeverityAndAlertVariant({ severity, variant, alertVariant }) {
  if (severity) {
    return { severity, alertVariant: alertVariant ?? DEFAULT_ALERT_VARIANT };
  }
  if (variant != null && MUI_ALERT_VARIANTS.has(variant)) {
    return { severity: 'info', alertVariant: variant };
  }
  const legacy = variant ?? 'info';
  const map = {
    danger: 'error',
    error: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info',
  };
  return {
    severity: map[legacy] || 'info',
    alertVariant: alertVariant ?? DEFAULT_ALERT_VARIANT,
  };
}

function CopyableSecret({ text, copyLabel = 'Copiar' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        mt: 1,
        p: 0.75,
        borderRadius: 1,
        bgcolor: 'rgba(0, 0, 0, 0.06)',
        maxWidth: '100%',
      }}
    >
      <Typography
        component="code"
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.8rem',
        }}
      >
        {text}
      </Typography>
      <Tooltip title={copied ? 'Copiado' : copyLabel}>
        <IconButton
          type="button"
          size="small"
          onClick={() => void handleCopy()}
          aria-label={copyLabel}
          sx={{ flexShrink: 0 }}
        >
          {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/**
 * Notificación tipo snackbar. Con `copyText` muestra la llave y un botón para copiarla.
 */
const Feedback = ({
  open = true,
  onClose,
  message = '',
  copyText,
  copyLabel,
  title,
  severity: severityProp,
  variant = 'info',
  alertVariant: alertVariantProp,
  autoHideDuration = 6000,
  showCloseButton = true,
  showExpandButton = false,
  expandedContent,
  isExpanded = false,
  onToggleExpand,
  position = 'bottom-right',
  maxWidth = '400px',
  ...props
}) => {
  const { severity, alertVariant } = resolveSeverityAndAlertVariant({
    severity: severityProp,
    variant,
    alertVariant: alertVariantProp,
  });

  const getPosition = () => {
    const positions = {
      'top-left': { vertical: 'top', horizontal: 'left' },
      'top-center': { vertical: 'top', horizontal: 'center' },
      'top-right': { vertical: 'top', horizontal: 'right' },
      'bottom-left': { vertical: 'bottom', horizontal: 'left' },
      'bottom-center': { vertical: 'bottom', horizontal: 'center' },
      'bottom-right': { vertical: 'bottom', horizontal: 'right' },
    };
    return positions[position] || positions['bottom-right'];
  };

  const getSeverityIcon = () => {
    const icons = {
      success: <CheckCircle />,
      error: <ErrorIcon />,
      warning: <Warning />,
      info: <Info />,
    };
    return icons[severity] || icons.info;
  };

  const getSeverityColor = () => {
    const colors = {
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#ed6c02',
      info: '#0288d1',
    };
    return colors[severity] || colors.info;
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose?.();
  };

  const canClose = Boolean(onClose);
  const showClose = showCloseButton && canClose;
  const resolvedAutoHide =
    copyText && autoHideDuration > 0 ? Math.max(autoHideDuration, 12000) : autoHideDuration;
  const snackbarAutoHide = canClose && resolvedAutoHide > 0 ? resolvedAutoHide : null;
  const snackbarMaxWidth = copyText ? 'min(480px, 96vw)' : maxWidth;

  const showExpand = Boolean(showExpandButton && expandedContent && onToggleExpand);
  const actionSlot =
    showExpand || showClose ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showExpand ? (
          <IconButton
            type="button"
            size="small"
            onClick={onToggleExpand}
            sx={{ color: 'inherit', mr: 0.5 }}
            aria-label={isExpanded ? 'Contraer detalle' : 'Expandir detalle'}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        ) : null}
        {showClose ? (
          <IconButton
            type="button"
            size="small"
            onClick={(e) => handleClose(e, 'closeButton')}
            sx={{ color: 'inherit' }}
            aria-label="Cerrar"
          >
            <Close />
          </IconButton>
        ) : null}
      </div>
    ) : undefined;

  return (
    <Snackbar
      open={open}
      autoHideDuration={snackbarAutoHide}
      onClose={handleClose}
      anchorOrigin={getPosition()}
      sx={(theme) => ({
        zIndex: theme.zIndex.modal + 700,
        maxWidth: snackbarMaxWidth,
        '& .MuiAlert-root': {
          width: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          border: `1px solid ${getSeverityColor()}33`,
        },
      })}
      {...props}
    >
      <Alert
        severity={severity}
        variant={alertVariant}
        icon={getSeverityIcon()}
        action={actionSlot}
        sx={{
          width: '100%',
          '& .MuiAlert-icon': {
            fontSize: '24px',
          },
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {title ? (
          <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>
        ) : null}

        <div>
          <div style={{ marginBottom: expandedContent && isExpanded ? '8px' : '0' }}>{message}</div>

          {copyText ? <CopyableSecret text={copyText} copyLabel={copyLabel} /> : null}

          {expandedContent ? (
            <Collapse in={isExpanded} timeout="auto">
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
              >
                {expandedContent}
              </div>
            </Collapse>
          ) : null}
        </div>
      </Alert>
    </Snackbar>
  );
};

Feedback.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  copyText: PropTypes.string,
  copyLabel: PropTypes.string,
  title: PropTypes.string,
  severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  variant: PropTypes.oneOf([
    'success',
    'error',
    'warning',
    'info',
    'danger',
    'filled',
    'outlined',
    'standard',
  ]),
  alertVariant: PropTypes.oneOf(['filled', 'outlined', 'standard']),
  autoHideDuration: PropTypes.number,
  showCloseButton: PropTypes.bool,
  showExpandButton: PropTypes.bool,
  expandedContent: PropTypes.node,
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func,
  position: PropTypes.oneOf([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]),
  maxWidth: PropTypes.string,
};

export default Feedback;
