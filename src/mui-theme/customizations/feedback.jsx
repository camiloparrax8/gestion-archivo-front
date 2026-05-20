import { alpha } from '@mui/material/styles';
import { gray, green, orange, red } from '../themePrimitives';

const severitySurface = {
  success: {
    bg: green[100],
    border: alpha(green[400], 0.45),
    text: green[800],
    icon: green[600],
    dark: {
      bg: alpha(green[900], 0.45),
      border: alpha(green[700], 0.5),
      text: green[200],
      icon: green[400],
    },
  },
  error: {
    bg: red[100],
    border: alpha(red[400], 0.45),
    text: red[800],
    icon: red[600],
    dark: {
      bg: alpha(red[900], 0.45),
      border: alpha(red[700], 0.5),
      text: red[200],
      icon: red[400],
    },
  },
  warning: {
    bg: orange[100],
    border: alpha(orange[400], 0.45),
    text: orange[900],
    icon: orange[600],
    dark: {
      bg: alpha(orange[900], 0.45),
      border: alpha(orange[700], 0.5),
      text: orange[200],
      icon: orange[400],
    },
  },
  info: {
    bg: gray[100],
    border: alpha(gray[400], 0.35),
    text: gray[800],
    icon: gray[600],
    dark: {
      bg: alpha(gray[800], 0.6),
      border: alpha(gray[600], 0.4),
      text: gray[200],
      icon: gray[400],
    },
  },
};

const filledSeverity = {
  success: { bg: green[600], icon: '#fff' },
  error: { bg: red[600], icon: '#fff' },
  warning: { bg: orange[600], icon: '#fff' },
  info: { bg: gray[700], icon: '#fff' },
};

const filledVariantStyles = Object.entries(filledSeverity).map(([severity, colors]) => ({
  props: { severity, variant: 'filled' },
  style: {
    backgroundColor: colors.bg,
    color: '#fff',
    '& .MuiAlert-icon': { color: colors.icon },
    '& .MuiAlert-action .MuiIconButton-root': { color: '#fff' },
  },
}));

export const feedbackCustomizations = {
  MuiSnackbar: {
    defaultProps: {
      disableWindowBlurListener: true,
    },
    styleOverrides: {
      root: {
        zIndex: 2000,
      },
    },
  },
  MuiAlert: {
    variants: filledVariantStyles,
    styleOverrides: {
      root: ({ theme, ownerState }) => {
        const base = { borderRadius: 10 };
        const severity = ownerState.severity ?? 'info';
        const variant = ownerState.variant ?? 'standard';
        const surface = severitySurface[severity] ?? severitySurface.info;

        if (variant === 'filled') {
          return base;
        }

        return {
          ...base,
          backgroundColor: surface.bg,
          color: surface.text,
          border: `1px solid ${surface.border}`,
          '& .MuiAlert-icon': {
            color: surface.icon,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: surface.dark.bg,
            color: surface.dark.text,
            border: `1px solid ${surface.dark.border}`,
            '& .MuiAlert-icon': {
              color: surface.dark.icon,
            },
          }),
        };
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};
