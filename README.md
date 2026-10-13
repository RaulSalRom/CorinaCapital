# Corina Capital

Plantilla front-end de plataforma inmobiliaria: catálogo de propiedades, panel de
administración, favoritos, autenticación simulada y búsqueda.

Funciona **100% en local sin backend**: los datos se sirven desde un cliente mock
(`src/lib/pocketbaseClient.js`) con una semilla de propiedades en memoria y
favoritos/sesión persistidos en `localStorage`.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 7 + TailwindCSS 3 |
| UI | shadcn/ui + Radix + Lucide |
| Validación | Zod 4 |
| Router | React Router DOM 7 |
| Datos | Mock local en memoria (sin backend) |

## Requisitos

- Node.js 18+
- npm

## Puesta en marcha

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Build de producción en `dist/` |
| `npm run start` | Previsualiza el build |
| `npm run lint` | ESLint (solo errores) |
| `npm run lint:warn` | ESLint (incluye warnings) |

## Acceso demo

Cualquier email y contraseña inician sesión. El rol se deduce del email:

| Email | Rol |
|-------|-----|
| `admin@corinacapital.com` | admin (accede al panel) |
| `editor@corinacapital.com` | editor (accede al panel) |
| cualquier otro | viewer |

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Landing | Público |
| `/properties` | Catálogo | Público |
| `/properties/:id` | Detalle propiedad | Público |
| `/login` | Login | Público |
| `/admin` | Panel de administración | Admin/Editor |
| `/profile` | Perfil + favoritos | Autenticado |

## Estructura

```
.
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── plugins/                  # Plugins de Vite (editor/selección, solo dev)
├── tools/                    # Scripts de build/utilidades
├── public/                   # Assets estáticos
└── src/
    ├── main.jsx
    ├── App.jsx               # Router + layout
    ├── index.css
    ├── lib/
    │   ├── pocketbaseClient.js  # Cliente de datos local (mock)
    │   ├── constants.js         # Constantes globales
    │   ├── schemas.js           # Validación Zod
    │   ├── utils.js
    │   └── logger.js
    ├── contexts/AuthContext.jsx
    ├── hooks/
    │   ├── usePocketbaseQuery.js # Hooks de datos
    │   ├── useFavorites.js
    │   └── use-toast.js
    ├── services/propertyService.js
    ├── components/
    └── pages/
```

## Datos: cómo conectar un backend real

`src/lib/pocketbaseClient.js` expone la misma API que el SDK de PocketBase
(`collection(...).getFullList/getOne/create/update/delete`, `authStore`,
`files.getUrl`). Las páginas, hooks y servicios consumen esa API sin saber de
dónde vienen los datos.

Para usar un backend real, sustituye ese archivo por el cliente oficial
`pocketbase` y reconfigura la URL del servidor. La semilla de ejemplo está en
`SEED_PROPERTIES`.

## Licencia

MIT — ver [LICENSE](LICENSE).
