import { query } from '../db/pool.js';
import { AppError } from '../utils/errors.js';
import { toISODate } from '../utils/date.js';

async function resolveTagIds(userId, tags = []) {
  if (!tags.length) {
    return [];
  }

  const ids = [];
  for (const tag of tags) {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) {
      continue;
    }
    const result = await query(
      `INSERT INTO tags (user_id, name)
       VALUES ($1, $2)
       ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [userId, trimmed]
    );
    ids.push(result.rows[0].id);
  }

  return ids;
}

async function replaceEntryTags(entryId, tagIds) {
  await query('DELETE FROM entry_tags WHERE entry_id = $1', [entryId]);
  for (const tagId of tagIds) {
    await query('INSERT INTO entry_tags (entry_id, tag_id) VALUES ($1, $2)', [entryId, tagId]);
  }
}

function mapEntry(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    entryDate: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isLocked: row.is_locked,
    mood: row.mood_id
      ? {
          id: row.mood_id,
          name: row.mood_name,
          emoji: row.mood_emoji,
          color: row.mood_color
        }
      : null,
    tags: row.tags || []
  };
}

async function getEntryById(userId, entryId) {
  const result = await query(
    `SELECT
      e.id,
      e.title,
      e.content,
      e.entry_date,
      e.created_at,
      e.updated_at,
      e.is_locked,
      m.id AS mood_id,
      m.name AS mood_name,
      m.emoji AS mood_emoji,
      m.color AS mood_color,
      COALESCE(ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
    FROM entries e
    LEFT JOIN moods m ON m.id = e.mood_id
    LEFT JOIN entry_tags et ON et.entry_id = e.id
    LEFT JOIN tags t ON t.id = et.tag_id
    WHERE e.user_id = $1 AND e.id = $2
    GROUP BY e.id, m.id`,
    [userId, entryId]
  );

  return result.rows[0] ? mapEntry(result.rows[0]) : null;
}

export async function listEntries(userId, filters = {}) {
  const params = [userId];
  let where = 'WHERE e.user_id = $1';

  if (filters.date) {
    params.push(filters.date);
    where += ` AND e.entry_date = $${params.length}`;
  }

  if (filters.tag) {
    params.push(filters.tag.toLowerCase());
    where += ` AND EXISTS (
      SELECT 1
      FROM entry_tags et
      JOIN tags t ON t.id = et.tag_id
      WHERE et.entry_id = e.id AND t.name = $${params.length}
    )`;
  }

  const result = await query(
    `SELECT
      e.id,
      e.title,
      e.content,
      e.entry_date,
      e.created_at,
      e.updated_at,
      e.is_locked,
      m.id AS mood_id,
      m.name AS mood_name,
      m.emoji AS mood_emoji,
      m.color AS mood_color,
      COALESCE(ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
    FROM entries e
    LEFT JOIN moods m ON m.id = e.mood_id
    LEFT JOIN entry_tags et ON et.entry_id = e.id
    LEFT JOIN tags t ON t.id = et.tag_id
    ${where}
    GROUP BY e.id, m.id
    ORDER BY e.entry_date DESC`,
    params
  );

  return result.rows.map(mapEntry);
}

export async function upsertEntry(userId, payload) {
  const entryDate = payload.entryDate || toISODate();
  const result = await query(
    `INSERT INTO entries (user_id, title, content, entry_date, mood_id, is_locked)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, payload.title || '', payload.content, entryDate, payload.moodId || null, Boolean(payload.isLocked)]
  );

  const entry = result.rows[0];
  const tagIds = await resolveTagIds(userId, payload.tags);
  await replaceEntryTags(entry.id, tagIds);
  return getEntryById(userId, entry.id);
}

export async function updateEntry(userId, entryId, payload) {
  const existing = await query('SELECT id, entry_date FROM entries WHERE id = $1 AND user_id = $2', [entryId, userId]);
  if (existing.rowCount === 0) {
    throw new AppError(404, 'Entry not found');
  }

  await query(
    `UPDATE entries
     SET title = $3,
         content = $4,
         mood_id = $5,
         is_locked = $6,
         updated_at = NOW()
     WHERE id = $1 AND user_id = $2`,
    [entryId, userId, payload.title || '', payload.content, payload.moodId || null, Boolean(payload.isLocked)]
  );

  const tagIds = await resolveTagIds(userId, payload.tags);
  await replaceEntryTags(entryId, tagIds);
  return getEntryById(userId, entryId);
}

export async function deleteEntry(userId, entryId) {
  const result = await query('DELETE FROM entries WHERE id = $1 AND user_id = $2 RETURNING id', [entryId, userId]);
  if (result.rowCount === 0) {
    throw new AppError(404, 'Entry not found');
  }
}

export async function listTags(userId) {
  const result = await query(
    `SELECT t.id, t.name, COUNT(et.entry_id)::int AS usage_count
     FROM tags t
     LEFT JOIN entry_tags et ON et.tag_id = t.id
     WHERE t.user_id = $1
     GROUP BY t.id
     ORDER BY usage_count DESC, t.name ASC`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    usageCount: row.usage_count
  }));
}

export async function listMoods() {
  const result = await query('SELECT id, name, emoji, color FROM moods ORDER BY id ASC');
  return result.rows;
}
