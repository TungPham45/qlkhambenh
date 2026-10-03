import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'clinic_admin',
    password: process.env.DB_PASSWORD || 'clinic_secure_password',
    database: process.env.DB_NAME || 'clinic_master',
  });
  const schemaPath = resolve(__dirname, '../../database/init-postgres.sql');
  const schema = readFileSync(schemaPath, 'utf8');

  await client.connect();
  try {
    await client.query(schema);
    console.log('Database schema and sample data created successfully.');
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
