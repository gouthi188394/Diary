import { Router } from 'express';
import { moods, streak, tags } from '../controllers/insights.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/insights/streak', streak);
router.get('/insights/tags', tags);
router.get('/insights/moods', moods);

export default router;
