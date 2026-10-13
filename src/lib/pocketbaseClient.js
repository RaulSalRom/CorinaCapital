/**
 * Cliente de datos local (mock).
 *
 * Este proyecto es una plantilla front-end: no hay backend. Este módulo expone
 * la MISMA API que usaba el SDK de PocketBase (collection/authStore/files) pero
 * respaldada por datos en memoria + localStorage, de modo que las páginas,
 * hooks y servicios funcionan sin conexión.
 *
 * Para conectar un backend real, sustituye este archivo por el cliente oficial.
 */

const AUTH_KEY = 'cc_demo_auth';

const uid = () => Math.random().toString(36).slice(2, 15);

const clone = (value) => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// 📦 DATOS SEMILLA
// ---------------------------------------------------------------------------

const SEED_PROPERTIES = [
  {
    name: 'Villa Mediterránea con Vistas al Mar',
    description:
      'Espectacular villa de diseño contemporáneo con vistas panorámicas al Mediterráneo. Amplios espacios, piscina infinity y acabados de primera calidad.',
    price: 2450000,
    address: 'Urbanización Los Monteros, s/n',
    location: 'Marbella, Málaga',
    squareMeters: 420,
    bedrooms: 5,
    bathrooms: 4,
    availability: true,
    category: 'Propiedades en venta',
    features: ['Piscina infinity', 'Vistas al mar', 'Garaje 2 plazas', 'Domótica', 'Jardín privado'],
    latitude: 36.5099,
    longitude: -4.8846,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
    ],
    created: '2026-01-10T10:00:00.000Z'
  },
  {
    name: 'Apartamento de Lujo en Primera Línea',
    description:
      'Apartamento totalmente reformado en primera línea de playa, con terraza de 40 m² y acceso directo al paseo marítimo.',
    price: 895000,
    address: 'Paseo Marítimo, 42',
    location: 'Estepona, Málaga',
    squareMeters: 145,
    bedrooms: 3,
    bathrooms: 2,
    availability: true,
    category: 'Propiedades en venta',
    features: ['Primera línea de playa', 'Terraza', 'Aire acondicionado', 'Gimnasio comunitario'],
    latitude: 36.4268,
    longitude: -5.1468,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'
    ],
    created: '2026-02-02T09:30:00.000Z'
  },
  {
    name: 'Obra Nueva: Residencial Mirador',
    description:
      'Promoción de obra nueva en construcción con entrega prevista para 2027. Diseño sostenible con certificación energética A.',
    price: 480000,
    address: 'Av. del Mirador, 15',
    location: 'Mijas, Málaga',
    squareMeters: 110,
    bedrooms: 3,
    bathrooms: 2,
    availability: true,
    category: 'Obras',
    features: ['Certificado energético A', 'Zonas comunes', 'Plaza de garaje', 'Piscina comunitaria'],
    latitude: 36.5955,
    longitude: -4.6376,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80'
    ],
    created: '2026-02-18T12:15:00.000Z'
  },
  {
    name: 'Inversión: Edificio Multiusos Centro',
    description:
      'Edificio completo en el centro urbano con alto potencial de rentabilidad. Locales comerciales y viviendas en explotación.',
    price: 1900000,
    address: 'Calle Real, 8',
    location: 'Málaga Centro, Málaga',
    squareMeters: 640,
    bedrooms: 0,
    bathrooms: 3,
    availability: true,
    category: 'Inversiones',
    features: ['Alta rentabilidad', 'En explotación', 'Locales comerciales', 'Ascensor'],
    latitude: 36.7213,
    longitude: -4.4214,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'
    ],
    created: '2026-03-01T08:45:00.000Z'
  },
  {
    name: 'Habitación en Atico Compartido',
    description:
      'Habitación exterior en ático luminoso y compartido, ideal para estudiantes o profesionales. Gastos incluidos.',
    price: 650,
    address: 'Calle Galeno, 21',
    location: 'Fuengirola, Málaga',
    squareMeters: 18,
    bedrooms: 1,
    bathrooms: 1,
    availability: true,
    category: 'Habitaciones alquiler',
    features: ['Gastos incluidos', 'Amueblado', 'WiFi', 'Cocina compartida'],
    latitude: 36.5416,
    longitude: -4.6264,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'
    ],
    created: '2026-03-12T16:20:00.000Z'
  },
  {
    name: 'Chalet Adosado con Jardín',
    description:
      'Adosado familiar en zona residencial tranquila, con jardín privado, porche y trastero. Cerca de colegios y servicios.',
    price: 320000,
    address: 'Calle Azahar, 7',
    location: 'Benalmádena, Málaga',
    squareMeters: 165,
    bedrooms: 4,
    bathrooms: 3,
    availability: false,
    category: 'Propiedades en alquiler',
    features: ['Jardín privado', 'Trastero', 'Porche', 'Zona residencial'],
    latitude: 36.5982,
    longitude: -4.5234,
    youtubeUrl: '',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80'
    ],
    created: '2026-03-20T11:05:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 🗃️ ALMACÉN EN MEMORIA
// ---------------------------------------------------------------------------

let sequence = 0;

const withRecordMeta = (data) => {
  sequence += 1;
  const id = data.id || uid();
  return {
    collectionId: 'properties',
    collectionName: 'properties',
    id,
    created: data.created || new Date(Date.now() + sequence).toISOString(),
    updated: new Date(Date.now() + sequence).toISOString(),
    ...data
  };
};

const db = {
  properties: SEED_PROPERTIES.map(withRecordMeta),
  favorites: []
};

// ---------------------------------------------------------------------------
// 🔎 FILTROS / ORDENACIÓN (subconjunto del DSL de PocketBase)
// ---------------------------------------------------------------------------

const matchesFilter = (record, filter) => {
  if (!filter || !filter.trim()) return true;

  return filter
    .split('||')
    .map((clause) => clause.trim())
    .filter(Boolean)
    .some((clause) => {
      const match = clause.match(/^(\w+)\s*(~|=)\s*"([^"]*)"$/);
      if (!match) return false;

      const [, field, operator, value] = match;
      const recordValue = record[field];

      if (operator === '~') {
        return String(recordValue ?? '').toLowerCase().includes(value.toLowerCase());
      }
      return String(recordValue ?? '') === value;
    });
};

const sortRecords = (records, sort) => {
  if (!sort) return records;

  const [field, direction] = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1];

  return [...records].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
    return String(av).localeCompare(String(bv)) * direction;
  });
};

// ---------------------------------------------------------------------------
// 📝 FORM DATA → OBJETO
// ---------------------------------------------------------------------------

const NUMERIC_FIELDS = ['price', 'squareMeters', 'bedrooms', 'bathrooms', 'latitude', 'longitude'];

const toPlainRecord = (payload) => {
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    const record = {};
    const images = [];

    for (const [key, value] of payload.entries()) {
      if (typeof File !== 'undefined' && value instanceof File) {
        images.push(URL.createObjectURL(value));
        continue;
      }
      record[key] = value;
    }

    if (images.length) record.images = images;
    return record;
  }

  return { ...payload };
};

const coerceRecord = (record) => {
  const result = { ...record };
  NUMERIC_FIELDS.forEach((field) => {
    if (result[field] !== undefined && result[field] !== '') result[field] = Number(result[field]);
  });
  if (result.availability !== undefined) result.availability = result.availability === true || result.availability === 'true';
  if (typeof result.features === 'string') {
    try {
      result.features = JSON.parse(result.features);
    } catch {
      result.features = result.features.split('\n').map((f) => f.trim()).filter(Boolean);
    }
  }
  return result;
};

// ---------------------------------------------------------------------------
// 🔐 AUTH STORE
// ---------------------------------------------------------------------------

const listeners = new Set();

const authStore = {
  token: '',
  model: null,
  load() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.token = parsed.token || '';
      this.model = parsed.model || null;
    } catch {
      this.token = '';
      this.model = null;
    }
  },
  get isValid() {
    return Boolean(this.token);
  },
  get record() {
    return this.model;
  },
  save(token, model) {
    this.token = token;
    this.model = model;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token, model }));
    }
    this.emit();
  },
  clear() {
    this.token = '';
    this.model = null;
    if (typeof localStorage !== 'undefined') localStorage.removeItem(AUTH_KEY);
    this.emit();
  },
  onChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  emit() {
    listeners.forEach((callback) => callback(this.token, this.model));
  }
};

authStore.load();

const roleForEmail = (email) => {
  const normalized = String(email).toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('editor')) return 'editor';
  return 'viewer';
};

// ---------------------------------------------------------------------------
// 🧩 COLECCIONES
// ---------------------------------------------------------------------------

const fakeId = () => uid();

const createCollection = (name) => {
  const rows = db[name] || (db[name] = []);

  return {
    async getFullList(options = {}) {
      const { filter, sort, limit = 500, offset = 0 } = options;
      const filtered = rows.filter((record) => matchesFilter(record, filter));
      const sorted = sortRecords(filtered, sort);
      return clone(sorted.slice(offset, offset + limit));
    },

    async getOne(id) {
      const record = rows.find((row) => row.id === id);
      if (!record) throw new Error(`Registro ${id} no encontrado en "${name}"`);
      return clone(record);
    },

    async create(payload) {
      const record = { ...coerceRecord(toPlainRecord(payload)) };
      record.collectionId = name;
      record.collectionName = name;
      record.id = fakeId();
      record.created = new Date().toISOString();
      record.updated = record.created;
      rows.push(record);
      return clone(record);
    },

    async update(id, payload) {
      const index = rows.findIndex((row) => row.id === id);
      if (index === -1) throw new Error(`Registro ${id} no encontrado en "${name}"`);
      const patch = coerceRecord(toPlainRecord(payload));
      const current = rows[index];
      const nextImages = patch.images ? [...(current.images || []), ...patch.images] : current.images;
      rows[index] = { ...current, ...patch, images: nextImages, updated: new Date().toISOString() };
      return clone(rows[index]);
    },

    async delete(id) {
      const index = rows.findIndex((row) => row.id === id);
      if (index !== -1) rows.splice(index, 1);
      return true;
    },

    async authWithPassword(email, password) {
      if (!email || !password) throw new Error('Credenciales requeridas');
      const model = {
        id: fakeId(),
        collectionId: 'users',
        collectionName: 'users',
        email,
        name: email.split('@')[0],
        role: roleForEmail(email),
        verified: true,
        created: new Date().toISOString()
      };
      authStore.save(`demo-${model.id}`, model);
      return { token: authStore.token, record: clone(model) };
    }
  };
};

const files = {
  getUrl(record, filename) {
    if (!filename) return '';
    if (/^(https?:|blob:|data:)/.test(filename)) return filename;
    return '/images/placeholder-property.jpg';
  }
};

const pocketbaseClient = {
  collection: createCollection,
  authStore,
  files
};

export default pocketbaseClient;
export { pocketbaseClient };
