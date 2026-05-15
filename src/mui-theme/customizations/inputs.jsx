import { alpha } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { svgIconClasses } from '@mui/material/SvgIcon';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { gray, brand } from '../themePrimitives';

export const inputsCustomizations = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: 'border-box',
        transition: 'all 100ms ease-in',
        '&:focus-visible': {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: '2px',
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: 9999,
        textTransform: 'none',
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              height: '2.25rem',
              padding: '8px 12px',
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              height: '2.5rem', // 40px
            },
          },
          {
            props: {
              color: 'primary',
              variant: 'contained',
            },
            style: {
              color: '#fafeff',
              backgroundColor: 'var(--color-deep-cosmos)',
              backgroundImage:
                'linear-gradient(180deg, var(--color-hero-gradient) 0%, var(--color-deep-cosmos) 100%)',
              border: '1px solid color-mix(in srgb, var(--color-hero-gradient) 68%, var(--color-deep-cosmos) 32%)',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 1px 0 rgba(0, 16, 51, 0.12)',
              '&:hover': {
                backgroundImage:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-hero-gradient) 88%, #fff 12%) 0%, color-mix(in srgb, var(--color-deep-cosmos) 85%, var(--color-hero-gradient) 15%) 100%)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 12px 28px color-mix(in srgb, var(--color-hero-gradient) 42%, transparent)',
              },
              '&:active': {
                backgroundImage: 'none',
                backgroundColor: 'var(--color-deep-cosmos)',
                boxShadow: 'inset 0 2px 6px rgba(0, 24, 66, 0.45)',
              },
              ...theme.applyStyles('dark', {
                color: '#fafeff',
                '&:hover': {
                  backgroundImage:
                    'linear-gradient(180deg, color-mix(in srgb, var(--color-hero-gradient) 75%, #0b1220 25%) 0%, var(--color-deep-cosmos) 100%)',
                },
              }),
            },
          },
          {
            props: {
              color: 'secondary',
              variant: 'contained',
            },
            style: {
              color: 'white',
              backgroundColor: brand[300],
              backgroundImage: `linear-gradient(to bottom, ${alpha(brand[400], 0.8)}, ${brand[500]})`,
              boxShadow: `inset 0 2px 0 ${alpha(brand[200], 0.2)}, inset 0 -2px 0 ${alpha(brand[700], 0.4)}`,
              border: `1px solid ${brand[500]}`,
              '&:hover': {
                backgroundColor: brand[700],
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: brand[700],
                backgroundImage: 'none',
              },
            },
          },
          {
            props: {
              variant: 'outlined',
            },
            style: {
              color: gray[600],
              border: '1px solid',
              borderColor: gray[200],
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: gray[50],
                borderColor: gray[300],
                color: gray[800],
              },
              '&:active': {
                backgroundColor: gray[100],
              },
              ...theme.applyStyles('dark', {
                color: gray[300],
                backgroundColor: gray[900],
                borderColor: gray[700],
                '&:hover': {
                  backgroundColor: gray[800],
                  borderColor: gray[600],
                },
                '&:active': {
                  backgroundColor: gray[900],
                },
              }),
            },
          },
          {
            props: {
              color: 'secondary',
              variant: 'outlined',
            },
            style: {
              color: brand[700],
              border: '1px solid',
              borderColor: brand[200],
              backgroundColor: brand[50],
              '&:hover': {
                backgroundColor: brand[100],
                borderColor: brand[400],
              },
              '&:active': {
                backgroundColor: alpha(brand[200], 0.7),
              },
              ...theme.applyStyles('dark', {
                color: brand[50],
                border: '1px solid',
                borderColor: brand[900],
                backgroundColor: alpha(brand[900], 0.3),
                '&:hover': {
                  borderColor: brand[700],
                  backgroundColor: alpha(brand[900], 0.6),
                },
                '&:active': {
                  backgroundColor: alpha(brand[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              variant: 'text',
            },
            style: {
              color: gray[600],
              '&:hover': {
                backgroundColor: gray[100],
              },
              '&:active': {
                backgroundColor: gray[200],
              },
              ...theme.applyStyles('dark', {
                color: gray[50],
                '&:hover': {
                  backgroundColor: gray[700],
                },
                '&:active': {
                  backgroundColor: alpha(gray[700], 0.7),
                },
              }),
            },
          },
          {
            props: {
              color: 'secondary',
              variant: 'text',
            },
            style: {
              color: brand[700],
              '&:hover': {
                backgroundColor: alpha(brand[100], 0.5),
              },
              '&:active': {
                backgroundColor: alpha(brand[200], 0.7),
              },
              ...theme.applyStyles('dark', {
                color: brand[100],
                '&:hover': {
                  backgroundColor: alpha(brand[900], 0.5),
                },
                '&:active': {
                  backgroundColor: alpha(brand[900], 0.3),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightMedium,
        letterSpacing: 0,
        color: (theme.vars || theme).palette.text.primary,
        border: '1px solid ',
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.3),
        '&:hover': {
          backgroundColor: gray[100],
          borderColor: gray[300],
        },
        '&:active': {
          backgroundColor: gray[200],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
          borderColor: gray[700],
          '&:hover': {
            backgroundColor: gray[900],
            borderColor: gray[600],
          },
          '&:active': {
            backgroundColor: gray[900],
          },
        }),
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              width: '2.25rem',
              height: '2.25rem',
              padding: '0.25rem',
              [`& .${svgIconClasses.root}`]: { fontSize: '1rem' },
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              width: '2.5rem',
              height: '2.5rem',
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '10px',
        boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: brand[500],
        },
        ...theme.applyStyles('dark', {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: '#fff',
          },
          boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '12px 16px',
        textTransform: 'none',
        borderRadius: '10px',
        fontWeight: 500,
        ...theme.applyStyles('dark', {
          color: gray[400],
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          [`&.${toggleButtonClasses.selected}`]: {
            color: brand[300],
          },
        }),
      }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: (
        <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'hsla(210, 0%, 0%, 0.0)' }} />
      ),
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: '1px solid ',
        borderColor: alpha(gray[300], 0.8),
        boxShadow: '0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset',
        backgroundColor: alpha(gray[100], 0.4),
        transition: 'border-color, background-color, 120ms ease-in',
        '&:hover': {
          borderColor: brand[300],
        },
        '&.Mui-focusVisible': {
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          outlineOffset: '2px',
          borderColor: brand[400],
        },
        '&.Mui-checked': {
          color: 'white',
          backgroundColor: brand[500],
          borderColor: brand[500],
          boxShadow: `none`,
          '&:hover': {
            backgroundColor: brand[600],
          },
        },
        ...theme.applyStyles('dark', {
          borderColor: alpha(gray[700], 0.8),
          boxShadow: '0 0 0 1.5px hsl(210, 0%, 0%) inset',
          backgroundColor: alpha(gray[900], 0.8),
          '&:hover': {
            borderColor: brand[300],
          },
          '&.Mui-focusVisible': {
            borderColor: brand[400],
            outline: `3px solid ${alpha(brand[500], 0.5)}`,
            outlineOffset: '2px',
          },
        }),
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: 'none',
      },
      input: {
        '&::placeholder': {
          opacity: 0.7,
          color: gray[500],
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: 0,
      },
      root: ({ theme }) => ({
        padding: '8px 12px',
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: 'border 120ms ease-in',
        '&:hover': {
          borderColor: gray[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          borderColor: brand[400],
        },
        ...theme.applyStyles('dark', {
          '&:hover': {
            borderColor: gray[500],
          },
        }),
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              height: '2.25rem',
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              height: '2.5rem',
            },
          },
        ],
      }),
      notchedOutline: {
        border: 'none',
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles('dark', {
          color: (theme.vars || theme).palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
};
