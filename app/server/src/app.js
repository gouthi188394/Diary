import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import entryRoutes from './routes/entry.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import reminderRoutes from './routes/reminder.routes.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(',').map((item) => item.trim()),
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 200,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', entryRoutes);
  app.use('/api', insightsRoutes);
  app.use('/api', reminderRoutes);
  app.use(errorHandler);

  return app;
}
