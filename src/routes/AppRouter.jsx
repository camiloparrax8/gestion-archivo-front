import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RequireRoleRoute } from './RequireRoleRoute';
import { RootRedirect } from './RootRedirect';
import { ClientesPage } from '../features/admin/clientes';
import { ApiKeysPage } from '../features/admin/api_keys';
import { MultimediaPage } from '../features/multimedia/files';
import { MisApiKeysPage } from '../features/client/api_keys';
export function AppRouter() {
    return (<Routes>
      <Route path="/login" element={<LoginPage />}/>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/multimedia" element={<MultimediaPage />}/>
          <Route element={<RequireRoleRoute requiredRole="admin" />}>
            <Route path="/admin/clientes" element={<ClientesPage />}/>
            <Route path="/admin/clientes/:clienteId/llaves" element={<ApiKeysPage />}/>
          </Route>
          <Route element={<RequireRoleRoute requiredRole="cliente" />}>
            <Route path="/client/me/apikeys" element={<MisApiKeysPage />}/>
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />}/>
      <Route path="*" element={<RootRedirect />}/>
    </Routes>);
}
