CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  pin_hash TEXT,
  reminder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  entry_date DATE NOT NULL,
  mood_id INTEGER REFERENCES moods(id) ON DELETE SET NULL,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS entry_tags (
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_tags_user_name ON tags(user_id, name);

INSERT INTO moods (name, emoji, color)
VALUES
  ('Happy', '😄', '#ffb703'),
  ('Calm', '😌', '#8ecae6'),
  ('Productive', '💪', '#219ebc'),
  ('Reflective', '🤔', '#6d597a'),
  ('Sad', '😢', '#577590')
ON CONFLICT (name) DO NOTHING;
