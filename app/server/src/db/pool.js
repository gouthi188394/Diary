import pg from 'pg';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);

function redactConnectionString(connectionString) {
  try {
    const url = new URL(connectionString);
    if (url.password) {
      url.password = '***';
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

export async function verifyDatabaseConnection() {
  try {
    await query('SELECT 1');

    const result = await query("SELECT to_regclass('public.users') AS users_table");
    if (!result.rows[0]?.users_table) {
      throw new AppError(500, 'Database schema is missing', {
        message: 'The `users` table was not found. Run `app/server/migrations/001_init.sql` against your database.'
      });
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === '28P01') {
      throw new AppError(503, 'Database authentication failed', {
        message: `Postgres rejected the username/password in DATABASE_URL: ${redactConnectionString(env.databaseUrl)}`
      });
    }

    if (error.code === '3D000') {
      throw new AppError(503, 'Database does not exist', {
        message: `The database in DATABASE_URL was not found: ${redactConnectionString(env.databaseUrl)}`
      });
    }

    throw new AppError(503, 'Database connection failed', {
      code: error.code,
      message: error.message
    });
  }
}
