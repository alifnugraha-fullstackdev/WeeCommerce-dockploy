import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
});

export const db = {
  async query(text: string, params: (string | number | null | boolean)[] = []) {
    return pool.query(text, params);
  },

  async queryOne<T = any>(
    text: string,
    params: (string | number | null | boolean)[] = [],
  ): Promise<T | null> {
    const res = await pool.query(text, params);
    return res.rows[0] || null;
  },
};

export async function dbHealth() {
  try {
    await pool.query('SELECT 1');
    return { ok: true, status: 'connected' };
  } catch {
    return { ok: false, status: 'disconnected' };
  }
}

export default pool;
