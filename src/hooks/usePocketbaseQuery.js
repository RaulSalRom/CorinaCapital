/**
 * 🪝 USE POCKETBASE QUERY HOOK
 * 
 * Hook personalizado que ELIMINA la duplicación de lógica de fetching.
 * 
 * PROBLEMA QUE RESUELVE:
 * Antes, cada página tenía esto:
 * ```
 * const [data, setData] = useState([]);
 * const [loading, setLoading] = useState(true);
 * const [error, setError] = useState(null);
 * 
 * useEffect(() => {
 *   const fetch = async () => {
 *     try {
 *       const data = await pb.collection('...').getFullList();
 *       setData(data);
 *     } catch (err) {
 *       setError(err);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *   fetch();
 * }, [dependencies...]);
 * ```
 * 
 * SOLUCIÓN:
 * ```
 * const { data, loading, error } = usePocketbaseQuery('properties', {
 *   filter: 'availability = true',
 *   sort: '-price'
 * });
 * ```
 * 
 * VENTAJAS:
 * ✅ DRY - No repetir código en cada componente
 * ✅ Manejo de errores centralizado
 * ✅ Estado consistente en toda la app
 * ✅ Cambios futuros en lógica de fetch afectan todo automáticamente
 */

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { logError } from '@/lib/logger';

/**
 * Hook para obtener datos de PocketBase con estado automático
 * 
 * PARÁMETROS:
 * @param {string} collection - Nombre de la colección PocketBase
 * @param {Object} options - Opciones de búsqueda
 *   @param {string} options.filter - Filtro PocketBase (ej: "price > 100000")
 *   @param {string} options.sort - Campo para ordenar (ej: "-created")
 *   @param {number} options.limit - Máximo de registros
 *   @param {number} options.offset - Para paginación
 *   @param {string} options.expand - Expandir relaciones
 * @param {Array} dependencies - Array de dependencias (cuándo re-ejecutar)
 * 
 * RETORNA:
 * @returns {Object} Estado del fetch
 *   @returns {Array} data - Datos obtenidos
 *   @returns {boolean} loading - ¿Está cargando?
 *   @returns {Error|null} error - Error si ocurrió
 *   @returns {Function} refetch - Función para re-obtener datos
 * 
 * EJEMPLOS:
 * 
 * 1️⃣ Obtener todas las propiedades
 * ────────────────────────────────
 * const { data: properties, loading } = usePocketbaseQuery('properties');
 * 
 * if (loading) return <LoadingSpinner />;
 * return properties.map(prop => <PropertyCard key={prop.id} property={prop} />);
 * 
 * ─────────────────────────────────
 * 
 * 2️⃣ Con filtros y BÚSQUEDA dinámica
 * ────────────────────────────────
 * const [searchTerm, setSearchTerm] = useState('');
 * 
 * const { data: results } = usePocketbaseQuery('properties', {
 *   filter: searchTerm ? `name ~ "${searchTerm}"` : ''
 * }, [searchTerm]); // Re-ejecutar cuando searchTerm cambie
 * 
 * ─────────────────────────────────
 * 
 * 3️⃣ Con paginación
 * ────────────────────────────────
 * const [page, setPage] = useState(1);
 * const pageSize = 20;
 * 
 * const { data: properties } = usePocketbaseQuery('properties', {
 *   limit: pageSize,
 *   offset: (page - 1) * pageSize
 * }, [page]);
 * 
 * ─────────────────────────────────
 * 
 * 4️⃣ Con expansión de relaciones
 * ────────────────────────────────
 * const { data: favorites } = usePocketbaseQuery('favorites', {
 *   filter: `userId = "${currentUser.id}"`,
 *   expand: 'propertyId' // Trae los datos completos de la propiedad
 * });
 * 
 * // Ahora puede acceder a: favorites[0].expand.propertyId
 * 
 * ─────────────────────────────────
 */
export const usePocketbaseQuery = (collection, options = {}, dependencies = []) => {
  // ESTADO DEL HOOK
  const [data, setData] = useState([]);          // Array de registros
  const [loading, setLoading] = useState(true);  // Si está cargando
  const [error, setError] = useState(null);      // Error si ocurre

  // FUNCIÓN PARA HACER EL FETCH
  const fetchData = async () => {
    try {
      // Resetear error
      setError(null);
      
      // Comenzar carga
      setLoading(true);

      // Hacer la query a PocketBase
      const records = await pb.collection(collection).getFullList({
        sort: options.sort || '-created',
        limit: options.limit || 500,
        offset: options.offset || 0,
        ...(options.filter && { filter: options.filter }),
        ...(options.expand && { expand: options.expand })
      });

      // Guardar datos
      setData(records);
    } catch (err) {
      // Capturar y loguear el error
      logError(err, `usePocketbaseQuery(${collection})`);
      setError(err);
      setData([]); // Vaciar datos si hay error
    } finally {
      // Terminar carga (siempre)
      setLoading(false);
    }
  };

  // EJECUTAR FETCH AL MONTAR O CUANDO CAMBIEN DEPENDENCIAS
  useEffect(() => {
    fetchData();
  }, [
    collection,
    options.filter,
    options.sort,
    options.limit,
    options.offset,
    options.expand,
    ...dependencies // Dependencias personalizadas
  ]);

  // RETORNAR ESTADO Y FUNCIÓN PARA RE-EJECUTAR
  return {
    data,      // Los datos obtenidos
    loading,   // Si está cargando
    error,     // Error si ocurrió
    refetch: fetchData // Función para manuellement hacer fetch de nuevo
  };
};

/**
 * Hook simplificado para una PROPIEDAD INDIVIDUAL
 * 
 * DIFERENCIA con usePocketbaseQuery:
 * - Esta es para obtener UN registro por ID
 * - Más eficiente que filtrar por ID
 * 
 * @param {string} collection - Nombre de la colección
 * @param {string} id - ID del registro a obtener
 * @param {Array} dependencies - Dependencias adicionales
 * 
 * @example
 * const { data: property, loading } = usePocketbaseGetOne('properties', propertyId);
 */
export const usePocketbaseGetOne = (collection, id, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      if (!id) {
        setData(null);
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);

      const record = await pb.collection(collection).getOne(id);
      setData(record);
    } catch (err) {
      logError(err, `usePocketbaseGetOne(${collection}, ${id})`);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collection, id, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook para UNA BÚSQUEDA de texto
 * Debounced automáticamente para no hacer requests cada keystroke
 * 
 * @param {string} collection - Colección
 * @param {string} searchTerm - Término a buscar
 * @param {Array<string>} searchFields - Campos donde buscar
 * @param {number} debounceMs - Milisegundos para debounce (default 300)
 * 
 * @example
 * const { data: results, loading } = usePocketbaseSearch(
 *   'properties',
 *   searchTerm,
 *   ['name', 'description', 'location'],
 *   300
 * );
 */
export const usePocketbaseSearch = (
  collection,
  searchTerm,
  searchFields = ['name'],
  debounceMs = 300
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const isSearching = searchTerm && searchTerm.trim() !== '';

    const timeoutId = setTimeout(async () => {

      try {
        setError(null);
        setLoading(true);

        let records;
        if (isSearching) {
          const filters = searchFields
            .map(field => `${field} ~ "${searchTerm.toLowerCase()}"`)
            .join(' || ');

          records = await pb.collection(collection).getFullList({
            filter: filters,
            limit: 50,
            $cancelKey: collection + '-search'
          });
        } else {
          records = await pb.collection(collection).getFullList({
            sort: '-created',
            limit: 500,
            $cancelKey: collection + '-search'
          });
        }

        if (!abortController.signal.aborted) {
          setData(records);
        }
      } catch (err) {
        if (err?.name === 'CancelError' || abortController.signal.aborted) return;
        logError(err, `usePocketbaseSearch(${collection})`);
        setError(err);
        setData([]);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, isSearching ? debounceMs : 0);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [searchTerm, collection, searchFields.join(','), debounceMs]);

  return { data, loading, error };
};

export default usePocketbaseQuery;
