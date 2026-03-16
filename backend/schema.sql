-- Run this in Neon SQL Editor (or any Postgres client) to create tables.

-- Admin users (email + password hash for JWT login)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (matches your frontend Product shape). Use JSONB for arrays for Neon compatibility.
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 0,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  bag TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order id sequence (e.g. RC-00100, RC-00101)
CREATE SEQUENCE IF NOT EXISTS order_id_seq START 100;

-- Index for common lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- First admin: run from backend folder: node scripts/seed-admin.js your@email.com YourPassword
-- Or set ADMIN_EMAIL and ADMIN_PASSWORD in .env and run: npm run seed:admin
