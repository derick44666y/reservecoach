require('dotenv').config();
const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');

const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'changeme123';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const hash = bcrypt.hashSync(password, 10);
  await sql`INSERT INTO admins (email, password_hash) VALUES (${email}, ${hash}) ON CONFLICT (email) DO NOTHING`;
  console.log('Admin created (or already exists):', email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
