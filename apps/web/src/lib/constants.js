/**
 * 📌 CONSTANTES GLOBALES
 * 
 * Centraliza todos los valores hardcoded para fácil mantenimiento.
 * 
 * VENTAJAS:
 * ✅ Cambiar categorías en un solo lugar
 * ✅ No repetir strings por toda la app
 * ✅ Fácil de localizar/traducir
 * ✅ Fuente única para opciones de formularios
 */

// ============================================================================
// 🏗️ API / POCKETBASE
// ============================================================================

/**
 * URL base de PocketBase
 * En desarrollo: http://localhost:8090
 * En producción: se configuraría desde .env
 */
export const POCKETBASE_API_URL = process.env.VITE_API_URL || '/hcgi/platform';

/**
 * Nombre de colecciones PocketBase
 */
export const POCKETBASE_COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  FAVORITES: 'favorites'
};

// ============================================================================
// 🏠 PROPIEDADES - CATEGORÍAS
// ============================================================================

/**
 * Categorías de propiedades disponibles
 * Debe coincidir con los valores del campo "category" en PocketBase
 */
export const PROPERTY_CATEGORIES = [
  {
    value: 'Habitaciones alquiler',
    label: 'Habitaciones Alquiler',
    icon: 'DoorOpen', // Lucide icon name
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'Inversiones',
    label: 'Inversiones',
    icon: 'TrendingUp',
    color: 'bg-green-100 text-green-800'
  },
  {
    value: 'Propiedades en venta',
    label: 'Propiedades en Venta',
    icon: 'Home',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    value: 'Propiedades en alquiler',
    label: 'Propiedades en Alquiler',
    icon: 'Building',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'Obras',
    label: 'Obras en Construcción',
    icon: 'Hammer',
    color: 'bg-orange-100 text-orange-800'
  }
];

/**
 * Mapeo de categoría a color (para badges/tags)
 */
export const CATEGORY_COLORS = Object.fromEntries(
  PROPERTY_CATEGORIES.map(cat => [cat.value, cat.color])
);

/**
 * Mapa de categoría a icono (para Lucide)
 */
export const CATEGORY_ICONS = Object.fromEntries(
  PROPERTY_CATEGORIES.map(cat => [cat.value, cat.icon])
);

// ============================================================================
// 👤 ROLES DE USUARIO
// ============================================================================

/**
 * Roles disponibles en el sistema
 */
export const USER_ROLES = {
  ADMIN: 'admin',      // Acceso total
  EDITOR: 'editor',    // Puede crear/editar propiedades
  VIEWER: 'viewer'     // Solo lectura
};

/**
 * Permisos por rol
 */
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateProperty: true,
    canEditProperty: true,
    canDeleteProperty: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canEditSettings: true
  },
  editor: {
    canCreateProperty: true,
    canEditProperty: true,
    canDeleteProperty: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canEditSettings: false
  },
  viewer: {
    canCreateProperty: false,
    canEditProperty: false,
    canDeleteProperty: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canEditSettings: false
  }
};

/**
 * Función para verificar permiso
 * @param {string} role - Rol del usuario
 * @param {string} permission - Permiso a verificar
 * @returns {boolean}
 * 
 * @example
 * if (hasPermission(user.role, 'canCreateProperty')) {
 *   // Mostrar botón crear
 * }
 */
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
};

// ============================================================================
// 🎨 TEMAS / COLORES
// ============================================================================

/**
 * Paleta de colores predefinida
 */
export const COLORS = {
  primary: '#3b82f6',      // Azul
  secondary: '#8b5cf6',    // Púrpura
  success: '#10b981',      // Verde
  warning: '#f59e0b',      // Ámbar
  danger: '#ef4444',       // Rojo
  light: '#f3f4f6',        // Gris claro
  dark: '#1f2937'          // Gris oscuro
};

// ============================================================================
// 📏 VALIDACIÓN - LÍMITES
// ============================================================================

/**
 * Valores máximos/mínimos para validación
 */
export const VALIDATION_LIMITS = {
  NAME_MIN: 3,
  NAME_MAX: 255,
  DESCRIPTION_MAX: 5000,
  LOCATION_MIN: 5,
  LOCATION_MAX: 255,
  PRICE_MIN: 0,
  PASSWORD_MIN: 8,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SEARCH_MIN: 2,
  SEARCH_MAX: 100
};

/**
 * Tipos MIME permitidos
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

// ============================================================================
// 📋 PAGINACIÓN
// ============================================================================

/**
 * Configuración de paginación por defecto
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

/**
 * Opciones de items por página
 */
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// ============================================================================
// ⏱️ TIMING / DELAYS
// ============================================================================

/**
 * Tiempos para debounce y throttle
 */
export const TIMING = {
  DEBOUNCE_SEARCH: 300,      // 300ms para buscar mientras escribes
  DEBOUNCE_RESIZE: 250,      // Para eventos de resize
  TOAST_DURATION: 3000,      // Toast message dura 3s
  LOADING_TIMEOUT: 30000     // Timeout global de 30s
};

// ============================================================================
// 🏷️ MENSAJES DE ERROR COMUNES
// ============================================================================

/**
 * Mensajes de error estandarizados
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado. Por favor inicia sesión.',
  FORBIDDEN: 'No tienes permiso para esta acción.',
  NOT_FOUND: 'El recurso no fue encontrado.',
  NETWORK_ERROR: 'Error de conexión. Intenta nuevamente.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  DUPLICATE: 'Este elemento ya existe.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.'
};

/**
 * Mensajes de éxito comunes
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Creado exitosamente.',
  UPDATED: 'Actualizado exitosamente.',
  DELETED: 'Eliminado exitosamente.',
  SAVED: 'Guardado exitosamente.',
  ADDED_FAVORITE: 'Agregado a favoritos.',
  REMOVED_FAVORITE: 'Removido de favoritos.',
  LOGGED_IN: 'Inicio de sesión exitoso.',
  LOGGED_OUT: 'Sesión cerrada.'
};

// ============================================================================
// 🔗 RUTAS DE LA APP
// ============================================================================

/**
 * Rutas principales de la aplicación
 * Úsalas con useNavigate() para evitar strings duplicados
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  ADMIN: '/admin',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  NOT_FOUND: '/404'
};

/**
 * Función helper para generar rutas dinámicas
 * @param {string} route - Ruta con placeholder (ej: '/properties/:id')
 * @param {Object} params - Parámetros (ej: { id: '123' })
 * @returns {string} Ruta con valores reales
 * 
 * @example
 * const url = getRoute(ROUTES.PROPERTY_DETAIL, { id: 'prop123' });
 * // Retorna: '/properties/prop123'
 */
export const getRoute = (route, params = {}) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    route
  );
};

// ============================================================================
// 📋 OPCIONES DE FORMULARIOS
// ============================================================================

/**
 * Opciones para campo de ordenamiento
 */
export const SORT_OPTIONS = [
  { value: '-created', label: 'Más recientes' },
  { value: 'created', label: 'Más antiguos' },
  { value: '-price', label: 'Precio mayor' },
  { value: 'price', label: 'Precio menor' },
  { value: 'name', label: 'Nombre A-Z' }
];

/**
 * Opciones de vista/grid
 */
export const VIEW_OPTIONS = [
  { value: 'grid', label: 'Grid', icon: 'LayoutGrid' },
  { value: 'list', label: 'Lista', icon: 'LayoutList' }
];

// ============================================================================
// 📞 CONTACTO
// ============================================================================

export const CONTACT_INFO = {
  EMAIL: 'gestion@corinacapital.com',
  PHONE: '+34 644 11 01 59',
  ADDRESS: 'Marbella, Costa del Sol, España'
};

// ============================================================================
// 🔗 LINKS EXTERNOS
// ============================================================================

export const EXTERNAL_LINKS = {
  // GitHub repo
  GITHUB: 'https://github.com/tuespacioperfecto',
  // Documentación
  DOCS: 'https://docs.example.com',
  // Soporte
  SUPPORT: 'mailto:support@example.com',
  // Redes sociales
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com'
};

// ============================================================================
// Exportar como objeto para fácil importación
// ============================================================================

const constants = {
  CONTACT_INFO,
  POCKETBASE_API_URL,
  POCKETBASE_COLLECTIONS,
  PROPERTY_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  USER_ROLES,
  ROLE_PERMISSIONS,
  COLORS,
  VALIDATION_LIMITS,
  ALLOWED_IMAGE_TYPES,
  PAGINATION,
  ITEMS_PER_PAGE_OPTIONS,
  TIMING,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  SORT_OPTIONS,
  VIEW_OPTIONS,
  EXTERNAL_LINKS,
  hasPermission,
  getRoute
};

export default constants;
