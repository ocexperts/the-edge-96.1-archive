-- Self-hosted Postgres schema for The Edge 96.1 tribute site.
-- Run against your database (idempotent — safe to re-run):
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  title text NOT NULL,
  body text NOT NULL,
  hearts integer NOT NULL DEFAULT 0,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Backfill columns on older deployments where stories was created with a
-- different shape. Each ADD COLUMN IF NOT EXISTS is a no-op if already there.
ALTER TABLE stories ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '';
ALTER TABLE stories ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS body text;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS hearts integer NOT NULL DEFAULT 0;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

UPDATE stories SET name = 'Anonymous' WHERE name IS NULL;
UPDATE stories SET title = '(untitled)' WHERE title IS NULL;
UPDATE stories SET body = '' WHERE body IS NULL;

ALTER TABLE stories ALTER COLUMN name SET NOT NULL;
ALTER TABLE stories ALTER COLUMN title SET NOT NULL;
ALTER TABLE stories ALTER COLUMN body SET NOT NULL;

CREATE INDEX IF NOT EXISTS stories_created_idx ON stories (created_at DESC);
