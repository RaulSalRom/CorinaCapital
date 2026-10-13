/**
 * 📋 VALIDACIÓN CON ZOD
 * Schemas sincronizados con el schema real de PocketBase en el servidor
 *
 * Colección `properties`:
 *   name (text, required), description (text), price (number, required),
 *   address (text, required), location (text, required),
 *   squareMeters (number), bedrooms (number), bathrooms (number),
 *   availability (bool), images (file, max 10),
 *   features (JSON), latitude (number), longitude (number),
 *   youtubeUrl (url), category (select)
 */

import { z } from 'zod';

// ============================================================================
// 🏠 PROPIEDADES
// ============================================================================

export const propertyCreateSchema = z.object({
  name: z
    .string('Nombre requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),

  address: z
    .string('Dirección requerida')
    .min(5, 'Mínimo 5 caracteres')
    .max(255, 'Máximo 255 caracteres'),

  location: z
    .string('Ubicación requerida')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),

  category: z
    .enum(
      [
        'Habitaciones alquiler',
        'Inversiones',
        'Propiedades en venta',
        'Propiedades en alquiler',
        'Obras'
      ],
      { errorMap: () => ({ message: 'Categoría inválida' }) }
    )
    .optional(),

  price: z
    .number('Precio debe ser un número')
    .min(0, 'Precio no puede ser negativo')
    .optional(),

  description: z
    .string()
    .max(5000, 'Descripción muy larga')
    .optional(),

  availability: z
    .boolean()
    .optional()
    .default(true),

  squareMeters: z
    .number()
    .positive('Debe ser un número positivo')
    .optional(),

  bedrooms: z
    .number()
    .int('Debe ser un número entero')
    .min(0)
    .optional(),

  bathrooms: z
    .number()
    .int('Debe ser un número entero')
    .min(0)
    .optional(),

  features: z
    .string()
    .optional(),

  latitude: z
    .number()
    .min(-90).max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180).max(180)
    .optional(),

  youtubeUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
});

/**
 * Schema para ACTUALIZAR (todos opcionales)
 */
export const propertyUpdateSchema = propertyCreateSchema.partial();

/**
 * Schema para filtrar/buscar
 */
export const propertyFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'created']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// ============================================================================
// 👤 USUARIOS / AUTENTICACIÓN
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string('Email requerido')
    .email('Email inválido'),

  password: z
    .string('Contraseña requerida')
    .min(6, 'Contraseña muy corta')
});

export const signupSchema = z
  .object({
    name: z
      .string('Nombre requerido')
      .min(2, 'Mínimo 2 caracteres')
      .max(100, 'Máximo 100 caracteres'),

    email: z
      .string('Email requerido')
      .email('Email inválido'),

    password: z
      .string('Contraseña requerida')
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe incluir mayúscula')
      .regex(/[0-9]/, 'Debe incluir número'),

    passwordConfirm: z
      .string('Confirmar contraseña requerida')
  })
  .refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: 'Las contraseñas no coinciden',
      path: ['passwordConfirm']
    }
  );

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .optional(),

  email: z
    .string()
    .email('Email inválido')
    .optional(),

  emailVisibility: z.boolean().optional()
});

// ============================================================================
// ⭐ FAVORITOS
// ============================================================================

export const favoriteCreateSchema = z.object({
  propertyId: z
    .string('ID de propiedad requerido')
    .min(1, 'ID inválido')
});

// ============================================================================
// 🔍 BÚSQUEDA
// ============================================================================

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20)
});

// ============================================================================
// 🛠️ UTILIDADES
// ============================================================================

export const validateSchema = (data, schema) => {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated,
      errors: {}
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach(err => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      return {
        success: false,
        data: null,
        errors
      };
    }
    throw error;
  }
};

export const safeParse = (data, schema) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.errors.forEach(err => {
      const field = err.path.join('.');
      errors[field] = err.message;
    });
    return {
      success: false,
      data: null,
      errors
    };
  }
  return {
    success: true,
    data: result.data,
    errors: {}
  };
};

export const getErrorMessages = (errors) => {
  return Object.values(errors).join('\n');
};

// ============================================================================
// Exportar todo
// ============================================================================

export const validationSchemas = {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyFilterSchema,
  loginSchema,
  signupSchema,
  userUpdateSchema,
  favoriteCreateSchema,
  searchParamsSchema
};

export default validationSchemas;
