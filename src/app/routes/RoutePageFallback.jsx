import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export function RoutePageFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        width: '100%',
      }}
    >
      <CircularProgress aria-label="Cargando página" />
    </Box>
  );
}
