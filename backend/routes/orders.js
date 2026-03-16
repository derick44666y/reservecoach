const express = require('express');
const { sql } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

function formatOrderDate() {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

router.get('/', authMiddleware, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  try {
    const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    res.json(rows.map((r) => ({
      id: r.id,
      date: r.date,
      customerName: r.customer_name,
      phone: r.phone,
      email: r.email,
      bag: r.bag,
      qty: Number(r.qty),
      price: Number(r.price),
      total: Number(r.total),
      status: r.status,
      street: r.street,
      city: r.city,
      state: r.state,
      zip: r.zip,
      notes: r.notes,
    })));
  } catch (e) {
    console.error('Orders list error:', e?.message || e);
    if (e?.code === 'ECONNREFUSED' || e?.message?.includes('connection')) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    if (e?.code === '42P01' || e?.message?.includes('does not exist')) {
      return res.status(503).json({ error: 'Database schema not run. Create orders table in Neon.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  try {
    const [r] = await sql`SELECT * FROM orders WHERE id = ${req.params.id} LIMIT 1`;
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: r.id,
      date: r.date,
      customerName: r.customer_name,
      phone: r.phone,
      email: r.email,
      bag: r.bag,
      qty: Number(r.qty),
      price: Number(r.price),
      total: Number(r.total),
      status: r.status,
      street: r.street,
      city: r.city,
      state: r.state,
      zip: r.zip,
      notes: r.notes,
    });
  } catch (e) {
    console.error('Order by id error:', e?.message || e);
    if (e?.code === 'ECONNREFUSED' || e?.message?.includes('connection')) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    if (e?.code === '42P01' || e?.message?.includes('does not exist')) {
      return res.status(503).json({ error: 'Database schema not run.' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  const body = req.body || {};
  const { customerName, phone, email, bag, qty, price, total, street, city, state, zip, notes } = body;
  if (!customerName || !email || !phone || !bag || qty == null || price == null || total == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [seq] = await sql`SELECT nextval('order_id_seq') as n`;
    const orderId = 'RC-' + String(seq.n).padStart(5, '0');
    const date = formatOrderDate();
    await sql`
      INSERT INTO orders (id, date, customer_name, phone, email, bag, qty, price, total, status, street, city, state, zip, notes)
      VALUES (${orderId}, ${date}, ${customerName}, ${phone}, ${email}, ${bag}, ${Number(qty)}, ${Number(price)}, ${Number(total)}, 'pending', ${street || null}, ${city || null}, ${state || null}, ${zip || null}, ${notes || null})
    `;
    res.status(201).json({ id: orderId, date });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database not configured' });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status required' });
  const allowed = ['pending', 'contacted', 'awaiting_payment', 'payment_received', 'confirmed_paid', 'packaging', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    await sql`UPDATE orders SET status = ${status} WHERE id = ${req.params.id}`;
    const [r] = await sql`SELECT * FROM orders WHERE id = ${req.params.id} LIMIT 1`;
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: r.id,
      date: r.date,
      customerName: r.customer_name,
      phone: r.phone,
      email: r.email,
      bag: r.bag,
      qty: Number(r.qty),
      price: Number(r.price),
      total: Number(r.total),
      status: r.status,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
