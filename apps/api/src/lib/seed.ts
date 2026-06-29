import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_FILE = join(__dirname, '../../db/migrations/0002_seed.sql');

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://weecommerce:dev@localhost:5432/weecommerce',
  });

  console.log('[SEED] Running seed...');
  const sql = readFileSync(SEED_FILE, 'utf-8');
  
  try {
    await pool.query(sql);
    console.log('[SEED] Done.');
  } catch (err) {
    console.error('[SEED] FAIL:', (err as Error).message);
    process.exit(1);
  }

  await pool.end();
}

seed();
