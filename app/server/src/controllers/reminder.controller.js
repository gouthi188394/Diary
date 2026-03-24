import { updateReminderSettings } from '../services/reminder.service.js';

export async function updateSettings(req, res, next) {
  try {
    const reminder = await updateReminderSettings(req.user.sub, req.body);
    res.json({ reminder });
  } catch (error) {
    next(error);
  }
}
