const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL not set; DB calls will fail.');
}

const sql = connectionString ? neon(connectionString) : null;

module.exports = { sql };
