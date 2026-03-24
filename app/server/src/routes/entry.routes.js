import { Router } from 'express';
import { getEntries, getMoods, getTags, removeEntry, replaceEntry, saveEntry } from '../controllers/entry.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { entrySchema } from './schemas.js';

const router = Router();

router.use(authMiddleware);
router.get('/entries', getEntries);
router.post('/entries', validate(entrySchema), saveEntry);
router.put('/entries/:id', validate(entrySchema), replaceEntry);
router.delete('/entries/:id', removeEntry);
router.get('/tags', getTags);
router.get('/moods', getMoods);

export default router;
