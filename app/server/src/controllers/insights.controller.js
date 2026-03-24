import { getMoodInsights, getTagInsights, getWritingStreak } from '../services/insights.service.js';

export async function streak(req, res, next) {
  try {
    const data = await getWritingStreak(req.user.sub);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function tags(req, res, next) {
  try {
    const data = await getTagInsights(req.user.sub);
    res.json({ tags: data });
  } catch (error) {
    next(error);
  }
}

export async function moods(req, res, next) {
  try {
    const data = await getMoodInsights(req.user.sub);
    res.json({ moods: data });
  } catch (error) {
    next(error);
  }
}
