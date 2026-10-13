/**
 * Autocomprobación del cliente de datos local.
 * Ejecutar con: npm test
 */

import assert from 'node:assert/strict';
import pb from './pocketbaseClient.js';

const run = async () => {
  const all = await pb.collection('properties').getFullList({ sort: '-created' });
  assert.ok(all.length >= 5, 'la semilla debe tener propiedades');
  assert.ok(all[0].created >= all[1].created, 'el orden -created debe ser descendente');

  const limited = await pb.collection('properties').getFullList({ limit: 2 });
  assert.equal(limited.length, 2, 'limit debe aplicarse');

  const category = await pb.collection('properties').getFullList({ filter: 'category = "Obras"' });
  assert.ok(category.length >= 1 && category.every((p) => p.category === 'Obras'), 'filtro por categoría');

  const search = await pb.collection('properties').getFullList({
    filter: 'name ~ "villa" || location ~ "marbella"'
  });
  assert.ok(search.length >= 1, 'filtro con ~ y ||');

  const two = [all[0].id, all[1].id];
  const byIds = await pb.collection('properties').getFullList({ filter: `id = "${two[0]}" || id = "${two[1]}"` });
  assert.equal(byIds.length, 2, 'filtro por id con ||');

  const created = await pb.collection('properties').create({ name: 'Test', address: 'Calle Falsa 1', price: '100' });
  assert.equal(created.price, 100, 'create coacciona numéricos');
  const fetched = await pb.collection('properties').getOne(created.id);
  assert.equal(fetched.name, 'Test', 'getOne recupera lo creado');
  await pb.collection('properties').delete(created.id);
  await assert.rejects(() => pb.collection('properties').getOne(created.id), 'delete lo elimina');

  const auth = await pb.collection('users').authWithPassword('admin@corinacapital.com', 'x');
  assert.equal(auth.record.role, 'admin', 'email con "admin" ⇒ rol admin');
  assert.ok(pb.authStore.isValid, 'authStore válido tras login');
  pb.authStore.clear();
  assert.equal(pb.authStore.isValid, false, 'authStore limpio tras logout');

  assert.equal(pb.files.getUrl({}, 'https://x.test/a.jpg'), 'https://x.test/a.jpg', 'files.getUrl devuelve URLs absolutas');
  assert.equal(pb.files.getUrl({}, ''), '', 'files.getUrl sin nombre devuelve vacío');

  console.log('OK — cliente de datos local');
};

run().catch((error) => {
  console.error('FALLÓ:', error.message);
  throw error;
});
