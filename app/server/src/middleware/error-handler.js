import { ZodError } from 'zod';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      issues: error.flatten()
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  if (error.code === '28P01') {
    return res.status(503).json({
      message: 'Database authentication failed',
      details: {
        message: 'Check DATABASE_URL in app/server/.env and confirm the Postgres username/password are correct.'
      }
    });
  }

  if (error.code === '3D000') {
    return res.status(503).json({
      message: 'Database does not exist',
      details: {
        message: 'Create the Postgres database from DATABASE_URL, then run app/server/migrations/001_init.sql.'
      }
    });
  }

  if (error.code === '42P01') {
    return res.status(503).json({
      message: 'Database schema is missing',
      details: {
        message: 'Run app/server/migrations/001_init.sql against your Postgres database.'
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Internal server error'
  });
}
