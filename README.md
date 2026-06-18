# Corina Capital

Plataforma inmobiliaria para el mercado de la Costa del Sol. Catálogo de propiedades con panel de administración, favoritos y búsqueda.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 7 + TailwindCSS 3 |
| Backend | PocketBase (SQLite, auth, file storage) |
| UI | shadcn/ui + Radix + Lucide |
| Validación | Zod 4 |
| Router | React Router DOM 7 |
| Despliegue | Hostinger (frontend) + Tailscale Funnel (API) |

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Landing | Público |
| `/properties` | Catálogo | Público |
| `/properties/:id` | Detalle propiedad | Público |
| `/login` | Login admin | Público |
| `/admin` | Panel administración | Admin/Editor |
| `/profile` | Perfil + favoritos | Usuario autenticado |

## Colecciones PocketBase

### `properties`

| Campo | Tipo | Requerido |
|-------|------|-----------|
| name | text | Sí |
| address | text | Sí |
| location | text | No |
| category | select | No |
| price | number | No |
| description | text | No |
| squareMeters, bedrooms, bathrooms | number | No |
| availability | boolean | No (default true) |
| images | file (max 10) | No |
| features | JSON | No |
| latitude, longitude | number | No |
| youtubeUrl | URL | No |

### `users`

Autenticación con email/contraseña. Campo `role`: `admin`, `editor`, `viewer`.

### `favorites`

Relación usuario → propiedad (`userId` + `propertyId`).

## Reglas de seguridad PocketBase

| Regla | Valor |
|-------|-------|
| listRule (ver) | Público |
| viewRule (detalle) | Público |
| createRule | Admin o Editor |
| updateRule | Admin o Editor |
| deleteRule | Admin o Editor |

## Estructura del proyecto

```
CorinaCapital/
├── apps/web/                        # Frontend React
│   ├── src/
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.jsx                  # Router + layout
│   │   ├── index.css                # Tailwind + variables CSS
│   │   ├── lib/
│   │   │   ├── pocketbaseClient.js  # Cliente PocketBase
│   │   │   ├── constants.js         # Constantes globales
│   │   │   ├── schemas.js           # Validación Zod
│   │   │   ├── utils.js             # Utilidades (cn)
│   │   │   └── logger.js            # Logger centralizado
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Estado de autenticación
│   │   ├── hooks/
│   │   │   ├── usePocketbaseQuery.js # Hooks de datos
│   │   │   ├── useFavorites.js       # Gestión de favoritos
│   │   │   └── use-toast.js
│   │   ├── services/
│   │   │   └── propertyService.js    # CRUD propiedades
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyFilter.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FavoriteButton.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ui/                  # shadcn/ui
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── PropertiesPage.jsx
│   │       ├── PropertyDetailPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── AdminPanel.jsx
│   │       └── UserProfilePage.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── hostinger-build/                # Build listo para subir
├── scripts/
│   ├── build-production.sh          # Build de producción
│   ├── prepare-for-hostinger.sh     # Prepara carpeta para Hostinger
│   └── deploy-to-hostinger.sh       # Deploy automático a VPS
│
└── server/                          # (en servidor externo)
    ├── docker-compose.yml           # PocketBase en Docker
    ├── pocketbase/pb_migrations/    # Migraciones
    └── pocketbase/pb_hooks/         # Hooks del servidor
```

## Desarrollo local

```bash
# 1. Iniciar PocketBase (Docker)
cd server
docker compose up -d

# 2. Iniciar frontend
npm install
npm run dev
# → http://localhost:3000

# Variables de entorno (apps/web/.env.local)
VITE_API_URL=http://localhost:8090
```

## Producción

```bash
# Build
VITE_API_URL=https://corina-server.tail4f61af.ts.net npm run build

# Preparar para Hostinger
./prepare-for-hostinger.sh

# Subir hostinger-build/ a public_html/ en Hostinger
```

### API en producción

La API de PocketBase se sirve a través de **Tailscale Funnel**:

```
https://corina-server.tail4f61af.ts.net
```

CORS configurado para: `corinacapital.com`, `www.corinacapital.com`, Tailscale domain.

### Servidor

PocketBase corre en Docker en `192.168.1.80:8090` con:
- Migraciones automáticas al iniciar
- Persistencia de datos en volumen Docker
- Health check cada 30s

## Chunks del build

| Chunk | Contenido |
|-------|-----------|
| `vendor-react` | React, ReactDOM, scheduler + resto de node_modules |
| `vendor-radix` | @radix-ui/* |
| `vendor-icons` | lucide-react |
| `vendor-pb` | pocketbase SDK |
| `vendor-zod` | zod |

## Licencia

Uso privado — Corina Capital
