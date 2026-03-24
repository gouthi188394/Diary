import { createApp } from './app.js';
import { env } from './config/env.js';
import { verifyDatabaseConnection } from './db/pool.js';
import { startReminderJob } from './services/reminder.service.js';

const app = createApp();

try {
  await verifyDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`Diary SaaS API listening on http://localhost:${env.port}`);
  });

  startReminderJob();
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  if (error.details?.message) {
    console.error(error.details.message);
  }
  process.exit(1);
}
