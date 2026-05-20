import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PermMediaRoundedIcon from '@mui/icons-material/PermMediaRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { useAuth } from '@hooks/useAuth';
import { ColorModeIconDropdown } from '@mui-theme/ColorModeIconDropdown';

const drawerWidth = 256;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

function routeSelected(pathname, to, { end = false } = {}) {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

function BrandIcon() {
  return (
    <Box
      sx={{
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '999px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundImage:
          'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
        color: 'hsla(210, 100%, 95%, 0.9)',
        border: '1px solid',
        borderColor: 'hsl(210, 100%, 55%)',
        boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: '1rem' }} />
    </Box>
  );
}

function NavList({ onNavigate }) {
  const { pathname } = useLocation();
  const { isAdmin, isCliente } = useAuth();

  const item = (to, label, icon, { end = false } = {}) => (
    <ListItem key={to} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={NavLink}
        to={to}
        end={end}
        selected={routeSelected(pathname, to, { end })}
        onClick={onNavigate}
        sx={{ gap: 1 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <List dense sx={{ px: 1, py: 1 }}>
      {item('/multimedia', 'Multimedia', <PermMediaRoundedIcon fontSize="small" />, { end: true })}
      {isAdmin ? item('/admin/clientes', 'Clientes', <PeopleRoundedIcon fontSize="small" />) : null}
      {isCliente ? item('/client/me/apikeys', 'Mis API keys', <VpnKeyRoundedIcon fontSize="small" />) : null}
    </List>
  );
}

export function MainLayout() {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const displayName = user?.nombre?.trim() || user?.email || 'Usuario';
  const subtitle = user?.email && user?.nombre?.trim() ? user.email : user?.rol || '';

  const drawerContent = (onNavigate) => (
    <>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', p: 2 }}>
        <BrandIcon />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            Guven
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <NavList onNavigate={onNavigate} />
      </Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {displayName}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <ColorModeIconDropdown />
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutRoundedIcon />}
          onClick={() => {
            logout();
            onNavigate?.();
          }}
        >
          Salir
        </Button>
      </Stack>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'auto', md: 'none' },
          boxShadow: 0,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar variant="dense" sx={{ gap: 1, minHeight: 56 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="abrir menú"
            onClick={() => setMobileOpen(true)}
            sx={{ color: 'text.primary' }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
            <BrandIcon />
            <Typography variant="h6" component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Panel
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          [`& .${drawerClasses.paper}`]: {
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        open
      >
        {drawerContent()}
      </Drawer>

      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {drawerContent(() => setMobileOpen(false))}
      </MuiDrawer>

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          pt: { xs: 8, md: 0 },
          px: { xs: 2, sm: 3 },
          pb: 4,
        })}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: { md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
