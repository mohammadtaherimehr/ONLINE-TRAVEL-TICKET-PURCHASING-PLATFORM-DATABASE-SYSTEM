import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { config } from 'dotenv';

config({
  path: '.env',
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 3002,
});

async function executeMigration() {
  try {
    const migrationFilePath = path.join(__dirname, 'migrate.sql');
    const migrationQuery = fs.readFileSync(migrationFilePath, 'utf8');

    const client = await pool.connect();
    try {
      await client.query(migrationQuery);
      console.log('Migration executed successfully.');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    await pool.end();
  }
}

executeMigration();
