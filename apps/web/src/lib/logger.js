/**
 * 📟 LOGGER CENTRALIZADO
 * 
 * Maneja TODOS los logs y errores de la app en un solo lugar.
 * 
 * VENTAJAS:
 * ✅ Cambiar estrategia de logging (console → file → API) en un lugar
 * ✅ Formato consistente en toda la app
 * ✅ Fácil integración con Sentry, LogRocket, etc.
 * ✅ Niveles de logging (DEBUG, INFO, WARN, ERROR)
 * ✅ Contexto automático (URL, usuario, etc.)
 * 
 * NIVELES:
 * DEBUG: Información de desarrollo (verbose)
 * INFO: Información general de la app
 * WARN: Advertencias (cosas que funcionan pero podrían mejorar)
 * ERROR: Errores críticos
 */

// ============================================================================
// ⚙️ CONFIGURACIÓN
// ============================================================================

/**
 * Niveles de logging disponibles
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * Nivel de logging actual
 * En desarrollo: DEBUG (muestra todo)
 * En producción: WARN (solo warnings y errores)
 */
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'development' 
  ? LOG_LEVELS.DEBUG 
  : LOG_LEVELS.WARN;

/**
 * Colores para consola (desarrollo)
 * Usados para diferenciar tipos de mensajes
 */
const COLORS = {
  DEBUG: 'color: #7c7c7c',   // Gris
  INFO: 'color: #0ea5e9',    // Azul
  WARN: 'color: #f59e0b',    // Ámbar
  ERROR: 'color: #ef4444'    // Rojo
};

// ============================================================================
// 🔧 FUNCIONES INTERNAS
// ============================================================================

/**
 * Obtiene información del contexto actual
 * (URL, usuario, timestamp, etc.)
 * 
 * @returns {Object} Contexto actual
 */
const getContext = async () => {
  try {
    // Obtener usuario del auth store si existe
    let userId = null;
    try {
      const { default: pb } = await import('@/lib/pocketbaseClient');
      userId = pb.authStore.model?.id || null;
    } catch (e) {
      // Si PocketBase no está disponible, ignorar
    }

    return {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
    };
  } catch (error) {
    return { timestamp: new Date().toISOString() };
  }
};

/**
 * Formatea un objeto de error para logging
 * 
 * @param {Error} error - Objeto de error
 * @returns {Object} Error formateado
 */
const formatError = (error) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
  }
  return {
    message: String(error),
    type: typeof error
  };
};

/**
 * Imprime en consola con estilos
 * 
 * @param {string} level - Nivel (DEBUG, INFO, WARN, ERROR)
 * @param {string} prefix - Prefijo del mensaje
 * @param {string} message - Mensaje principal
 * @param {*} data - Datos adicionales
 */
const printConsole = (level, prefix, message, data) => {
  if (typeof window === 'undefined') return; // No es navegador

  const color = COLORS[level] || COLORS.INFO;
  const timestamp = new Date().toLocaleTimeString();

  if (data !== undefined) {
    console.log(
      `%c[${timestamp}] ${level} [${prefix}]: ${message}`,
      color,
      data
    );
  } else {
    console.log(
      `%c[${timestamp}] ${level} [${prefix}]: ${message}`,
      color
    );
  }
};

// ============================================================================
// 📝 FUNCIONES DE LOGGING PÚBLICAS
// ============================================================================

/**
 * Registra a información de DEBUG
 * Usado solo en desarrollo para información detallada
 * 
 * @param {string} message - Mensaje
 * @param {*} data - Datos adicionales (opcional)
 * 
 * @example
 * logger.debug('Iniciando fetch', { collection: 'properties' });
 */
export const logDebug = (message, data) => {
  if (CURRENT_LOG_LEVEL > LOG_LEVELS.DEBUG) return;
  printConsole('DEBUG', 'DEBUG', message, data);
};

/**
 * Registra información general
 * Usado para eventos importantes pero normales
 * 
 * @param {string} message - Mensaje
 * @param {*} data - Datos adicionales (opcional)
 * 
 * @example
 * logger.info('Usuario logueado', { email: 'user@example.com' });
 */
export const logInfo = (message, data) => {
  if (CURRENT_LOG_LEVEL > LOG_LEVELS.INFO) return;
  printConsole('INFO', 'INFO', message, data);
};

/**
 * Registra advertencias
 * Algo que funciona pero debería ser revisado
 * 
 * @param {string} message - Mensaje
 * @param {*} data - Datos adicionales (opcional)
 * 
 * @example
 * logger.warn('Componente re-renderizado 5 veces', { component: 'PropertyCard' });
 */
export const logWarn = (message, data) => {
  if (CURRENT_LOG_LEVEL > LOG_LEVELS.WARN) return;
  printConsole('WARN', 'WARN', message, data);
};

/**
 * Registra errores
 * SIEMPRE debe ser registrado, incluso en producción
 * 
 * @param {Error|string} error - Error del usuario o string
 * @param {string} context - Contexto dónde ocurrió (ej: 'propertyService.getAll')
 * @param {*} additionalData - Datos adicionales para debugging
 * 
 * @example
 * logger.error(error, 'HomePage.fetchProperties', { filter: 'sold' });
 */
export const logError = async (error, context = 'Unknown', additionalData) => {
  if (CURRENT_LOG_LEVEL > LOG_LEVELS.ERROR) return;

  const formattedError = formatError(error);
  const ctx = await getContext();

  const errorLog = {
    error: formattedError,
    context,
    ...ctx,
    ...(additionalData && { additionalData })
  };

  // Imprimir en consola
  printConsole('ERROR', context, formattedError.message, errorLog);

  // AQUÍ INTEGRAR con Sentry u otro servicio similar
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { tags: { context }, extra: additionalData });
  // }

  // AQUÍ INTEGRAR con servicio de logs remoto
  // sendErrorToServer(errorLog);

  return errorLog;
};

/**
 * Registra sucesos de usuario (analytics)
 * Útil para rastrear lo que hace el usuario
 * 
 * @param {string} eventName - Nombre del evento
 * @param {Object} properties - Propiedades del evento
 * 
 * @example
 * logger.track('view_property', { propertyId: 'prop123', category: 'Venta' });
 */
export const logTrack = async (eventName, properties = {}) => {
  if (typeof window === 'undefined') return;

  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    context: await getContext(),
    properties
  };

  // Log en consola si es desarrollo
  if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
    console.log('%cTRACK:', 'color: #8b5cf6', event);
  }

  // AQUÍ INTEGRAR con analytics (Google Analytics, Mixpanel, etc.)
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }
};

/**
 * Inicia un timer para medir duración
 * Útil para medir performance
 * 
 * @param {string} label - Nombre del timer
 * @returns {Function} Función para terminar el timer
 * 
 * @example
 * const endTimer = logger.startTimer('fetch_properties');
 * // ... hacer algo ...
 * endTimer(); // Imprime el tiempo transcurrido
 */
export const startTimer = (label) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    logDebug(`${label} completed in ${duration}ms`);
  };
};

// ============================================================================
// 📦 EXPORTAR COMO OBJETO
// ============================================================================

const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  track: logTrack,
  startTimer
};

export default logger;

// ============================================================================
// 🌍 GLOBAL - Agregar al window en desarrollo
// ============================================================================

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.__logger = logger;
  console.log('%cLogger disponible como window.__logger', 'color: #10b981');
}
