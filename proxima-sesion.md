# Próxima Sesión

## 🐛 1. Arreglar error `createContext` en producción

**Problema:** El build optimizado con chunk splitting causa dependencia circular:
- `vendor-react` (react + react-dom) importa el scheduler desde `vendor-other`
- `vendor-other` importa React desde `vendor-react`
- El navegador no resuelve bien el orden y React llega como `undefined`

**Fix en `apps/web/vite.config.js` línea 316:**
```
// Antes (solo react + react-dom):
if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {

// Después (incluir scheduler que react-dom necesita):
if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
```

**Luego:**
```bash
npm run build
bash prepare-for-hostinger.sh
```
Subir `hostinger-build/` a `public_html/` en Hostinger.

---

## ✅ 2. Verificar que el catálogo cargue en producción

Después del deploy:
- Abrir la web
- Abrir consola del navegador (F12) y verificar que no hay errores
- Comprobar que las propiedades de PocketBase se muestran
- Probar búsqueda, detalle de propiedad, login, admin

---

## 🚀 3. Optimizaciones adicionales (post-fix)

### Fase A — Alto impacto / bajo riesgo
| # | Acción | Archivo |
|---|---|---|
| 1 | `React.lazy` en rutas (AdminPanel, UserProfilePage, LoginPage) | `App.jsx` |
| 2 | Eliminar `next-themes` (~15KB), no hay theme toggle | `sonner.jsx`, `package.json` |
| 3 | Mover `zod` (~40KB) a chunk separado (solo AdminPanel) | `vite.config.js` |
| 4 | `loading="lazy"` en imágenes de PropertyCard y galería | `PropertyCard.jsx`, `PropertyDetailPage.jsx` |
| 5 | `React.memo` en PropertyCard, Header, Footer | varios |
| 6 | Eliminar `use-mobile.jsx` (código muerto) | Delete file |
| 7 | Limpiar Tailwind content paths | `tailwind.config.js` |

### Fase B — Medio impacto
| # | Acción | Archivo |
|---|---|---|
| 8 | Hostear imágenes fallback localmente (eliminar Unsplash) | `public/` + varios |
| 9 | Activar CSP en `.htaccess` | `public/.htaccess` |
| 10 | Arreglar gzip (incluir `.gz` en deploy o eliminar step) | `build-production.sh`, `deploy-to-hostinger.sh` |

### Fase C — Nice to have
| # | Acción |
|---|---|
| 11 | Self-hostear Google Fonts (Outfit) |
| 12 | PWA manifest + service worker |
| 13 | Reducir default limit de 500 en queries PocketBase |
| 14 | `fetchpriority="high"` en hero image |

---

## 📊 Estado actual del proyecto

| Métrica | Antes de optimizar | Ahora |
|---|---|---|
| Bundle total | ~2.8 MB | ~588 KB (162 KB gzip) |
| Dependencias producción | ~55 | 20 |
| Componentes shadcn/ui | 55 | 12 |
| Componentes React sin memo | 6+ | 6+ (pendiente) |
| Lazy loading rutas | ❌ | ❌ (pendiente) |
| Lazy loading imágenes | ❌ | ❌ (pendiente) |
| CSP activado | ❌ | ❌ (pendiente) |
| PWA | ❌ | ❌ (pendiente) |
| PocketBase API | ✅ healthy | ✅ healthy |
| Props en DB | ✅ 8 propiedades | ✅ 8 propiedades |
