import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { RequireRoleRoute } from '../../routes/RequireRoleRoute';
import { RootRedirect } from '../../routes/RootRedirect';
import { RoutePageFallback } from './RoutePageFallback';

const LoginPage = lazy(() =>
  import('../../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const MultimediaPage = lazy(() =>
  import('../../features/multimedia/files/pages/MultimediaPage').then((m) => ({
    default: m.MultimediaPage,
  })),
);
const ClientesPage = lazy(() =>
  import('../../features/admin/clientes/pages/ClientesPage').then((m) => ({
    default: m.ClientesPage,
  })),
);
const ApiKeysPage = lazy(() =>
  import('../../features/admin/api_keys/pages/ApiKeysPage').then((m) => ({
    default: m.ApiKeysPage,
  })),
);
const MisApiKeysPage = lazy(() =>
  import('../../features/client/api_keys/pages/MisApiKeysPage').then((m) => ({
    default: m.MisApiKeysPage,
  })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<RoutePageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/multimedia" element={<MultimediaPage />} />
            <Route element={<RequireRoleRoute requiredRole="admin" />}>
              <Route path="/admin/clientes" element={<ClientesPage />} />
              <Route path="/admin/clientes/:clienteId/llaves" element={<ApiKeysPage />} />
            </Route>
            <Route element={<RequireRoleRoute requiredRole="cliente" />}>
              <Route path="/client/me/apikeys" element={<MisApiKeysPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Suspense>
  );
}
