const express = require('express');
const bcrypt = require('bcryptjs');
const { sql } = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  if (!sql) return res.status(503).json({ error: 'Database not configured' });

  try {
    const rows = await sql`SELECT id, email, password_hash FROM admins WHERE email = ${email} LIMIT 1`;
    const admin = rows[0];
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken({ id: admin.id, email: admin.email });
    return res.json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
