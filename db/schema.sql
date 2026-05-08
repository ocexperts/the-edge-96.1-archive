-- Self-hosted Postgres schema for The Edge 96.1 tribute site.
-- Run once against your database:
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

CREATE INDEX IF NOT EXISTS stories_created_idx ON stories (created_at DESC);
