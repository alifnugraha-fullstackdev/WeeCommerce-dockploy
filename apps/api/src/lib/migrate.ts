import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '../../db/migrations');

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://weecommerce:dev@localhost:5432/weecommerce',
  });

  // Create migrations tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Get already-applied migrations
  const { rows: applied } = await pool.query('SELECT filename FROM _migrations ORDER BY filename');
  const appliedSet = new Set(applied.map((r: any) => r.filename));

  // Get all migration files
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`[SKIP] ${file} — already applied`);
      continue;
    }

    console.log(`[RUN]  ${file}`);
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      console.log(`[DONE] ${file}`);
    } catch (err) {
      console.error(`[FAIL] ${file}:`, (err as Error).message);
      process.exit(1);
    }
  }

  await pool.end();
  console.log('All migrations applied.');
}

migrate();
