import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { ApiHttpError } from '../../api/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { ColorModeIconDropdown } from '../../mui-theme/ColorModeIconDropdown';

function errorMessage(error) {
  if (error instanceof ApiHttpError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100dvh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: 0,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function BrandMark() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage:
            'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
          color: 'hsla(210, 100%, 98%, 0.95)',
          border: '1px solid',
          borderColor: 'hsl(210, 100%, 55%)',
          boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.25)',
        }}
      >
        <DashboardRoundedIcon sx={{ fontSize: 22 }} />
      </Box>
      <Box>
      
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          Guven
        </Typography>
      </Box>
    </Stack>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const user = await loginWithCredentials(email, password);
      setMessageType('success');
      setMessage('Autenticación correcta. Redirigiendo…');
      const target = user.rol === 'admin' ? '/admin/clientes' : '/client/me/apikeys';
      navigate(target, { replace: true });
    } catch (error) {
      setMessageType('danger');
      setMessage(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const alertSeverity =
    messageType === 'danger' || messageType === 'error'
      ? 'error'
      : messageType === 'success'
        ? 'success'
        : messageType === 'warning'
          ? 'warning'
          : 'info';

  return (
    <SignInContainer direction="column" sx={{ justifyContent: 'center' }}>
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 2 }}>
        <ColorModeIconDropdown />
      </Box>

      <Card variant="outlined">
        <BrandMark />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(1.65rem, 6vw, 2rem)', fontWeight: 600 }}
        >
          Iniciar sesión
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
            mt: 0.5,
          }}
        >
          {message && messageType !== 'success' ? (
            <Alert severity={alertSeverity} variant="outlined" onClose={() => setMessage('')}>
              {message}
            </Alert>
          ) : null}

          <FormControl>
            <FormLabel htmlFor="login-email">Correo</FormLabel>
            <TextField
              id="login-email"
              type="email"
              name="email"
              placeholder="admin@orion.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="login-password">Contraseña</FormLabel>
            <TextField
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} size="large">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
}
