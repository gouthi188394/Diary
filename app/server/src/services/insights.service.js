import { query } from '../db/pool.js';

export async function getWritingStreak(userId) {
  const result = await query(
    `SELECT entry_date
     FROM entries
     WHERE user_id = $1
     ORDER BY entry_date DESC`,
    [userId]
  );

  const dates = result.rows.map((row) => row.entry_date);
  if (!dates.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const latest = new Date(dates[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  latest.setHours(0, 0, 0, 0);

  const latestGap = Math.round((today - latest) / (1000 * 60 * 60 * 24));

  let longest = 1;
  let current = latestGap <= 1 ? 1 : 0;
  let rolling = 1;

  for (let i = 1; i < dates.length && current > 0; i += 1) {
    const previous = new Date(dates[i - 1]);
    const currentDate = new Date(dates[i]);
    const diff = Math.round((previous - currentDate) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      rolling += 1;
      longest = Math.max(longest, rolling);
    } else {
      rolling = 1;
    }
  }

  for (let i = 1; i < dates.length; i += 1) {
    const previous = new Date(dates[i - 1]);
    const currentDate = new Date(dates[i]);
    const diff = Math.round((previous - currentDate) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      current += 1;
    } else {
      break;
    }
  }

  return { currentStreak: current, longestStreak: longest };
}

export async function getTagInsights(userId) {
  const result = await query(
    `SELECT t.name, COUNT(et.entry_id)::int AS usage_count
     FROM tags t
     JOIN entry_tags et ON et.tag_id = t.id
     WHERE t.user_id = $1
     GROUP BY t.name
     ORDER BY usage_count DESC, t.name ASC
     LIMIT 8`,
    [userId]
  );

  return result.rows.map((row) => ({
    tag: row.name,
    usageCount: row.usage_count
  }));
}

export async function getMoodInsights(userId) {
  const result = await query(
    `SELECT m.name, m.emoji, COUNT(e.id)::int AS total
     FROM moods m
     LEFT JOIN entries e ON e.mood_id = m.id AND e.user_id = $1
     GROUP BY m.id
     ORDER BY m.id ASC`,
    [userId]
  );

  return result.rows.map((row) => ({
    mood: row.name,
    emoji: row.emoji,
    total: row.total
  }));
}
