# Orion Marketplace — Panel de gestión de archivos

Aplicación **React** del ecosistema **Orion Marketplace** para administrar **archivos multimedia**, **clientes y API keys** (rol admin), y **API keys propias** (rol cliente). Consume la API REST del backend de gestión de archivos.

Arquitectura **por features** (`features/<dominio>/` con `pages`, `components`, `services`, `hooks`) más capa compartida (`api`, `shared`, `ui`, `mui-theme`). Los **nombres** de carpetas y código van en **inglés**; la **documentación** de este README y los comentarios orientativos al equipo van en **español**.

**Referencia de la API consumida:** [gestion-archivo-backend/docs/API-ENDPOINTS.md](../gestion-archivo-backend/docs/API-ENDPOINTS.md).

## Requisitos previos

- **Node.js** >= 18.x  
- **npm** >= 9.x  
- **Backend** Orion Marketplace en ejecución (por defecto `http://localhost:3001`) con MongoDB y usuario admin creado (`npm run migrate:admin` en el repo del backend)

## Instalación

```bash
git clone <url-del-repositorio>
cd orion-marketplace-front
npm install
cp .env.example .env
# Editar .env: URL del backend y, si aplica, VITE_MASTER_KEY
```

## Variables de entorno

Copia `.env.example` a `.env`. En Vite solo se exponen variables con prefijo `VITE_`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend (sin barra final) | `http://localhost:3001` |
| `VITE_MASTER_KEY` | Cabecera `X-Master-Key` para registro bootstrap (opcional en UI; útil en demos) | *(cadena larga, igual que `MASTER_API_KEY` del backend)* |
| `VITE_MULTIMEDIA_CONTEXTO` | Slug de contexto por defecto en rutas de multimedia | `orion` |

La configuración centralizada está en `src/config/env.js`.

**CORS:** el backend debe permitir el origen del front (por ejemplo `http://localhost:5173` en desarrollo con Vite).

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm run dev` | Servidor Vite con HMR |
| Build | `npm run build` | Compila a `dist/` para producción |
| Preview | `npm run preview` | Sirve el build localmente |
| Lint | `npm run lint` | ESLint sobre el proyecto |

## Desarrollo

```bash
npm run dev
```

Pasos recomendados:

1. Arranca el backend (`gestion-archivo-backend`) con `MONGODB_URI`, `JWT_AUTH_SECRET` y admin seed.
2. Configura `VITE_API_URL` apuntando al puerto del backend (típicamente `3001`).
3. Abre la app, inicia sesión en `/login` con el usuario admin o cliente.
4. Comprueba que las peticiones llegan al backend (pestaña Red del navegador o Swagger en el servidor).

### URLs útiles (desarrollo)

| URL | Descripción |
|-----|-------------|
| `http://localhost:5173/` | App (redirige según rol o a login) |
| `http://localhost:5173/login` | Inicio de sesión |
| `http://localhost:5173/multimedia` | Explorador de archivos (autenticado) |
| `http://localhost:5173/admin/clientes` | Gestión de clientes (**rol `admin`**) |
| `http://localhost:5173/admin/clientes/:clienteId/llaves` | API keys de un cliente (**admin**) |
| `http://localhost:5173/client/me/apikeys` | Mis API keys (**rol `cliente`**) |
| `http://localhost:<PORT_BACKEND>/api/docs` | Swagger del backend |

El puerto de Vite puede variar si `5173` está ocupado; revisa la salida de `npm run dev`.

## Despliegue estático (Vercel, Netlify, etc.)

El front es una **SPA** generada con `vite build`. No incluye `vercel.json` en el repo; en la plataforma:

| Ajuste | Valor |
|--------|--------|
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Framework preset** | Vite (o Other) |

### Variables en producción

| Variable | Notas |
|----------|--------|
| `VITE_API_URL` | URL pública del backend desplegado (HTTPS) |
| `VITE_MASTER_KEY` | Solo si la UI o scripts de demo usan registro bootstrap |
| `VITE_MULTIMEDIA_CONTEXTO` | Debe coincidir con los prefijos permitidos de las API keys |

**SPA y rutas:** configura rewrites para que todas las rutas sirvan `index.html` (en Vercel: `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`).

### Pasos (Vercel)

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Añade las variables `VITE_*` en **Settings → Environment Variables**.
3. Deploy.

CLI:

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

### Comprobar

- La app carga en la URL del proyecto.
- Login contra el backend de producción.
- Listado en `/multimedia` o `/admin/clientes` según el rol.

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| React 19 | UI y componentes |
| Vite 8 | Bundler y dev server |
| React Router 7 | Rutas y navegación |
| MUI (Material UI) 9 | Componentes y tema (modo claro/oscuro) |
| Emotion | Estilos de MUI |
| JavaScript (JSX) | Código de la aplicación |
| ESLint | Calidad de código |

## Estructura del proyecto

```txt
orion-marketplace-front/
├── public/                    # Estáticos (favicon, etc.)
├── src/
│   ├── main.jsx               # Entrada: Router, AuthProvider, tema MUI
│   ├── App.jsx                # Monta AppRouter
│   ├── app/
│   │   └── routes/
│   │       └── AppRouter.jsx  # Definición de rutas SPA
│   ├── routes/                # ProtectedRoute, RequireRoleRoute, RootRedirect
│   ├── pages/
│   │   └── auth/
│   │       └── LoginPage.jsx
│   ├── components/
│   │   └── layout/
│   │       └── MainLayout.jsx # Shell: drawer, navegación por rol
│   ├── api/
│   │   ├── apiClient.js       # fetch + JWT / X-API-Key
│   │   ├── authApi.js
│   │   └── adminApi.js
│   ├── config/
│   │   └── env.js             # VITE_* centralizadas
│   ├── context/
│   │   └── AuthContext.jsx    # Token y usuario en localStorage
│   ├── features/
│   │   ├── admin/
│   │   │   ├── clientes/      # CRUD clientes
│   │   │   └── api_keys/      # Llaves por cliente
│   │   ├── client/
│   │   │   └── api_keys/      # Mis API keys
│   │   ├── multimedia/
│   │   │   └── files/         # Listado y gestión de archivos
│   │   └── integration/
│   │       └── demo/          # Componentes de prueba (no montados en router)
│   ├── shared/                # Reexports auth, tema CSS, tokens
│   ├── ui/                    # Botones, tablas, diálogos reutilizables
│   └── mui-theme/             # AppTheme y personalizaciones MUI
├── .env.example
├── vite.config.js             # Alias @shared → src/shared
├── eslint.config.js
├── index.html
├── package.json
└── README.md
```

## Estructura interna de un feature

Cada dominio sigue esta plantilla (nombres en inglés en código):

```txt
src/features/<dominio>/
├── pages/              # Pantallas enlazadas en AppRouter
├── components/         # UI específica del dominio
├── services/           # Llamadas HTTP (usan apiClient)
├── hooks/              # Estado y efectos (useAdminClientes, useMultimedia, …)
├── utils/              # Helpers puros (opcional)
└── index.js            # Barrel exports
```

Flujo típico **pantalla → API**:

```txt
Page / component
  → hook (useMultimedia, useAdminClientes, …)
  → service (*Service.js)
  → apiRequest (apiClient.js) + token del AuthContext
  → Backend /api/v1/...
```

## Rutas de la aplicación (SPA)

Definidas en `src/app/routes/AppRouter.jsx`. Tabla orientativa:

| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/login` | Público | Email y contraseña → JWT en `localStorage` |
| `/` | Autenticado | Redirige: admin → clientes, cliente → mis API keys, otro → multimedia |
| `/multimedia` | Autenticado | Archivos del contexto configurado |
| `/admin/clientes` | `admin` | Listado y alta/edición de clientes |
| `/admin/clientes/:clienteId/llaves` | `admin` | API keys del cliente (crear, rotar, activar) |
| `/client/me/apikeys` | `cliente` | API keys del usuario cliente |

Rutas protegidas: `ProtectedRoute` (JWT). Rutas por rol: `RequireRoleRoute`.

### Auth en el cliente

| Acción | Implementación |
|--------|----------------|
| Login | `POST /api/v1/auth/login` → guarda `token` y `user` (`orion_auth` en `localStorage`) |
| Perfil | `GET /api/v1/auth/me` con `Authorization: Bearer` |
| Logout | Limpia `localStorage` y estado |
| Registro bootstrap | `authApi.register` con `X-Master-Key` si `VITE_MASTER_KEY` está definida (no expuesta en la UI principal) |

### Endpoints del backend usados por el front

| Área | Prefijo API | Uso en UI |
|------|-------------|-----------|
| Auth | `/api/v1/auth/*` | Login y sesión |
| Admin clientes | `/api/v1/admin/clientes` | `ClientesPage`, diálogos |
| Admin API keys | `/api/v1/admin/clientes/:id/llaves` | `ApiKeysPage`, tablas de llaves |
| Cliente | `/api/v1/client/me/apikeys` | `MisApiKeysPage` |
| Multimedia | `/api/v1/multimedia/...` | `MultimediaPage` (listar, subir, borrar) |

Detalle de contratos, MIME y parámetros de ruta: documentación del backend en `docs/API-ENDPOINTS.md`.

## Alias y tema

- **Alias Vite:** `@shared` → `src/shared` (ver `vite.config.js`).
- **Tema:** MUI en `src/mui-theme/`; tokens CSS adicionales en `src/shared/config/` y `src/ui/ui-unique/`.
- **Modo claro/oscuro:** `ColorModeIconDropdown` en el layout principal.

## Módulo de integración (demo)

`src/features/integration/demo/` contiene secciones de prueba (auth, admin, multimedia) para validar la API manualmente. **No está registrado** en `AppRouter`; sirve como referencia o para montar una ruta de desarrollo si se necesita.

## Despliegue en producción

```bash
npm run build
npm run preview   # opcional: revisar dist/ en local
```

Sirve el contenido de `dist/` con cualquier hosting estático o CDN. Variables `VITE_*` se **incrustan en el build**: cámbialas y vuelve a desplegar si cambia la URL del backend.

## Documentación adicional

Orden de lectura recomendado (repositorio backend):

1. [gestion-archivo-backend/docs/API-ENDPOINTS.md](../gestion-archivo-backend/docs/API-ENDPOINTS.md) — Contrato HTTP  
2. [gestion-archivo-backend/docs/ESPECIFICACION-REQUERIMIENTOS.md](../gestion-archivo-backend/docs/ESPECIFICACION-REQUERIMIENTOS.md) — Multi-cliente y API keys  
3. [gestion-archivo-backend/README.md](../gestion-archivo-backend/README.md) — Arranque del servicio, variables y despliegue

Diseño de componentes UI propios: `src/ui/ui-unique/DESIGN.md`.

## Errores

Las respuestas de error del backend suelen seguir:

```json
{ "error": { "message": "..." } }
```

`apiClient.js` las convierte en `ApiHttpError` con `status` y `payload`. La UI muestra mensajes vía componentes de feedback (`ui/Feedback.jsx`, alertas MUI). Errores frecuentes: credenciales inválidas (`401`), rol insuficiente (redirección o pantalla vacía), backend inalcanzable (red / CORS).

---

**Convención resumida:** código y nombres de archivo en **inglés**; comentarios, commits y PRs en **español**; documentación del proyecto en **español** con términos técnicos en inglés alineados al repo.
