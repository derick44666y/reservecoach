const express = require('express');
const { sql } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.get('/', async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  try {
    const rows = await sql`SELECT id, slug, name, price, description, features, images, stock, tag FROM products ORDER BY created_at DESC`;
    const products = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      price: Number(r.price),
      description: r.description || '',
      features: Array.isArray(r.features) ? r.features : [],
      images: Array.isArray(r.images) ? r.images : [],
      stock: Number(r.stock || 0),
      tag: r.tag || undefined,
    }));
    return res.json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  try {
    const [row] = await sql`SELECT id, slug, name, price, description, features, images, stock, tag FROM products WHERE slug = ${req.params.slug} LIMIT 1`;
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: row.id,
      slug: row.slug,
      name: row.name,
      price: Number(row.price),
      description: row.description || '',
      features: Array.isArray(row.features) ? row.features : [],
      images: Array.isArray(row.images) ? row.images : [],
      stock: Number(row.stock || 0),
      tag: row.tag || undefined,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  const { slug, name, price, description, features, images, stock, tag } = req.body || {};
  if (!name || price == null) return res.status(400).json({ error: 'name and price required' });
  const slugVal = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  try {
    const [row] = await sql`
      INSERT INTO products (slug, name, price, description, features, images, stock, tag)
      VALUES (${slugVal}, ${name}, ${Number(price)}, ${description || ''}, ${JSON.stringify(features || [])}, ${JSON.stringify(images || [])}, ${Number(stock) || 0}, ${tag || null})
      RETURNING id, slug, name, price, description, features, images, stock, tag
    `;
    res.status(201).json({
      id: row.id,
      slug: row.slug,
      name: row.name,
      price: Number(row.price),
      description: row.description || '',
      features: Array.isArray(row.features) ? row.features : [],
      images: Array.isArray(row.images) ? row.images : [],
      stock: Number(row.stock || 0),
      tag: row.tag || undefined,
    });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  const id = req.params.id;
  const body = req.body || {};
  try {
    const [existing] = await sql`SELECT * FROM products WHERE id = ${id}::uuid LIMIT 1`;
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const slug = body.slug !== undefined ? body.slug : existing.slug;
    const name = body.name !== undefined ? body.name : existing.name;
    const price = body.price !== undefined ? Number(body.price) : Number(existing.price);
    const description = body.description !== undefined ? body.description : (existing.description || '');
    const features = body.features !== undefined ? body.features : (existing.features || []);
    const images = body.images !== undefined ? body.images : (existing.images || []);
    const stock = body.stock !== undefined ? Number(body.stock) : Number(existing.stock || 0);
    const tag = body.tag !== undefined ? body.tag : existing.tag;
    await sql`
      UPDATE products SET slug = ${slug}, name = ${name}, price = ${price}, description = ${description},
        features = ${features}, images = ${images}, stock = ${stock}, tag = ${tag}, updated_at = NOW()
      WHERE id = ${id}::uuid
    `;
    const [row] = await sql`SELECT id, slug, name, price, description, features, images, stock, tag FROM products WHERE id = ${id}::uuid LIMIT 1`;
    res.json({
      id: row.id,
      slug: row.slug,
      name: row.name,
      price: Number(row.price),
      description: row.description || '',
      features: Array.isArray(row.features) ? row.features : [],
      images: Array.isArray(row.images) ? row.images : [],
      stock: Number(row.stock || 0),
      tag: row.tag || undefined,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  try {
    const deleted = await sql`DELETE FROM products WHERE id = ${req.params.id}::uuid RETURNING id`;
    if (!deleted || deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
