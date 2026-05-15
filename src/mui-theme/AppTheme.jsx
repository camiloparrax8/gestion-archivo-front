import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';
import {
  inputsCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
} from './customizations';

export function AppTheme({ children }) {
  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: 'template',
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme} defaultMode="system" disableTransitionOnChange>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
