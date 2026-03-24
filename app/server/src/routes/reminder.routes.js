import { Router } from 'express';
import { updateSettings } from '../controllers/reminder.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reminderSchema } from './schemas.js';

const router = Router();

router.use(authMiddleware);
router.put('/reminders', validate(reminderSchema), updateSettings);

export default router;
