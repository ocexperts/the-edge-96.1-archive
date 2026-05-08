import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool =
  globalThis.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalThis.__pgPool = pool;

export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[] }> {
  const res = await pool.query(text, params as never);
  return { rows: res.rows as T[] };
}
