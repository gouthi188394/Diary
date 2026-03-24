import cron from 'node-cron';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';

export function startReminderJob() {
  if (env.nodeEnv === 'test') {
    return null;
  }

  return cron.schedule(env.reminderCron, async () => {
    const result = await query(
      `SELECT id, email, full_name, reminder_time
       FROM users
       WHERE reminder_enabled = TRUE`
    );

    if (result.rowCount > 0) {
      console.log(`Reminder job scanned ${result.rowCount} user(s) for diary notifications`);
    }
  });
}

export async function updateReminderSettings(userId, { reminderEnabled, reminderTime }) {
  const result = await query(
    `UPDATE users
     SET reminder_enabled = $2,
         reminder_time = $3,
         updated_at = NOW()
     WHERE id = $1
     RETURNING reminder_enabled, reminder_time`,
    [userId, reminderEnabled, reminderTime || null]
  );

  return {
    reminderEnabled: result.rows[0].reminder_enabled,
    reminderTime: result.rows[0].reminder_time
  };
}
