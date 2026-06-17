/**
 * 🏠 PROPERTY SERVICE
 * Centraliza toda la lógica con la colección "properties" en PocketBase.
 *
 * Schema real del servidor:
 *   name, description, price, address, location, squareMeters,
 *   bedrooms, bathrooms, availability, images (File, max 10),
 *   features (JSON), latitude, longitude, youtubeUrl, category
 */

import pb from '@/lib/pocketbaseClient';
import { logError } from '@/lib/logger';

// ============================================================================
// 🔍 LECTURA
// ============================================================================

export const getAll = async (options = {}) => {
  try {
    const {
      filter = '',
      sort = '-created',
      limit = 500,
      offset = 0,
      expand = undefined
    } = options;

    const dbOptions = { sort, limit, offset };

    if (filter) dbOptions.filter = filter;
    if (expand) dbOptions.expand = expand;

    const records = await pb.collection('properties').getFullList(dbOptions);
    return records;
  } catch (error) {
    logError(error, 'propertyService.getAll');
    throw error;
  }
};

export const getById = async (id) => {
  try {
    if (!id) throw new Error('ID de propiedad requerido');
    const record = await pb.collection('properties').getOne(id);
    return record;
  } catch (error) {
    logError(error, `propertyService.getById(${id})`);
    throw error;
  }
};

export const search = async (searchTerm, options = {}) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();
    const filter = `
      name ~ "${searchLower}" ||
      description ~ "${searchLower}" ||
      location ~ "${searchLower}" ||
      address ~ "${searchLower}"
    `;

    return await getAll({ ...options, filter });
  } catch (error) {
    logError(error, `propertyService.search(${searchTerm})`);
    throw error;
  }
};

export const getByCategory = async (category) => {
  try {
    if (!category) throw new Error('Categoría requerida');
    return await getAll({ filter: `category = "${category}"` });
  } catch (error) {
    logError(error, `propertyService.getByCategory(${category})`);
    throw error;
  }
};

// ============================================================================
// ➕ CREAR
// ============================================================================

export const create = async (data, imageFiles = []) => {
  try {
    if (!data.name || !data.address) {
      throw new Error('Nombre y dirección son requeridos');
    }

    const formData = new FormData();

    // Campos de texto
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('location', data.location || '');

    if (data.category) formData.append('category', data.category);
    if (data.price !== undefined) formData.append('price', data.price);
    if (data.description) formData.append('description', data.description);
    if (data.availability !== undefined) formData.append('availability', data.availability);
    if (data.squareMeters !== undefined) formData.append('squareMeters', data.squareMeters);
    if (data.bedrooms !== undefined) formData.append('bedrooms', data.bedrooms);
    if (data.bathrooms !== undefined) formData.append('bathrooms', data.bathrooms);
    if (data.latitude !== undefined) formData.append('latitude', data.latitude);
    if (data.longitude !== undefined) formData.append('longitude', data.longitude);
    if (data.youtubeUrl) formData.append('youtubeUrl', data.youtubeUrl);

    // features como JSON string o array
    if (data.features) {
      let featuresValue = data.features;
      if (typeof featuresValue === 'string') {
        featuresValue = featuresValue.split('\n').map(f => f.trim()).filter(Boolean);
      }
      formData.append('features', JSON.stringify(featuresValue));
    }

    // Imágenes
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const record = await pb.collection('properties').create(formData);
    return record;
  } catch (error) {
    logError(error, 'propertyService.create');
    throw error;
  }
};

// ============================================================================
// ✏️ ACTUALIZAR
// ============================================================================

export const update = async (id, data, imageFiles = []) => {
  try {
    if (!id) throw new Error('ID de propiedad requerido');

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === 'features') {
          let featuresValue = data[key];
          if (typeof featuresValue === 'string') {
            featuresValue = featuresValue.split('\n').map(f => f.trim()).filter(Boolean);
          }
          formData.append(key, JSON.stringify(featuresValue));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const record = await pb.collection('properties').update(id, formData);
    return record;
  } catch (error) {
    logError(error, `propertyService.update(${id})`);
    throw error;
  }
};

// ============================================================================
// 🗑️ ELIMINAR
// ============================================================================

export const deleteProperty = async (id) => {
  try {
    if (!id) throw new Error('ID de propiedad requerido');
    await pb.collection('properties').delete(id);
    return true;
  } catch (error) {
    logError(error, `propertyService.delete(${id})`);
    throw error;
  }
};

// ============================================================================
// 📊 ESTADÍSTICAS
// ============================================================================

export const getStats = async () => {
  try {
    const all = await getAll({ limit: 500 });

    const stats = {
      total: all.length,
      byCategory: {},
      avgPrice: 0,
      priceRange: { min: 0, max: 0 }
    };

    all.forEach(prop => {
      if (prop.category) {
        stats.byCategory[prop.category] = (stats.byCategory[prop.category] || 0) + 1;
      }
    });

    const withPrice = all.filter(p => p.price);
    if (withPrice.length > 0) {
      stats.avgPrice = Math.round(
        withPrice.reduce((sum, p) => sum + p.price, 0) / withPrice.length
      );
      stats.priceRange.min = Math.min(...withPrice.map(p => p.price));
      stats.priceRange.max = Math.max(...withPrice.map(p => p.price));
    }

    return stats;
  } catch (error) {
    logError(error, 'propertyService.getStats');
    throw error;
  }
};

// ============================================================================
// Exportar
// ============================================================================

const propertyService = {
  getAll,
  getById,
  search,
  getByCategory,
  create,
  update,
  deleteProperty,
  getStats
};

export default propertyService;
