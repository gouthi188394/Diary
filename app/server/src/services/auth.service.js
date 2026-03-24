import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { AppError } from '../utils/errors.js';
import { signToken } from '../utils/jwt.js';

function sanitizeUser(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    reminderEnabled: row.reminder_enabled,
    reminderTime: row.reminder_time,
    createdAt: row.created_at
  };
}

export async function registerUser({ email, password, fullName, pin }) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw new AppError(409, 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const pinHash = pin ? await bcrypt.hash(pin, 10) : null;
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, pin_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, reminder_enabled, reminder_time, created_at`,
    [email, passwordHash, fullName, pinHash]
  );

  const user = sanitizeUser(result.rows[0]);
  return {
    user,
    token: signToken({ sub: user.id, email: user.email })
  };
}

export async function loginUser({ email, password }) {
  const result = await query(
    `SELECT id, email, full_name, password_hash, reminder_enabled, reminder_time, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppError(401, 'Invalid email or password');
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  return {
    user: sanitizeUser(user),
    token: signToken({ sub: user.id, email: user.email })
  };
}

export async function getCurrentUser(userId) {
  const result = await query(
    `SELECT id, email, full_name, reminder_enabled, reminder_time, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new AppError(404, 'User not found');
  }

  return sanitizeUser(result.rows[0]);
}
