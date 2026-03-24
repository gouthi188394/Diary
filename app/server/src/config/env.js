import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL ||= 'postgresql://postgres:postgres@localhost:5432/diary_saas_test';
  process.env.JWT_SECRET ||= 'test-secret';
}

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  reminderCron: process.env.REMINDER_CRON || '0 20 * * *'
};
