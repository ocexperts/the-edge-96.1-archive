import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { query } from "./db.server";
import {
  clearSession,
  getCurrentUser,
  hashPassword,
  issueSession,
  verifyPassword,
  type SessionUser,
} from "./auth.server";

const credsSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
});

export const me = createServerFn({ method: "GET" }).handler(async () => {
  return { user: await getCurrentUser() };
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => credsSchema.parse(d))
  .handler(async ({ data }) => {
    const { rows } = await query<{
      id: string;
      email: string;
      password_hash: string;
      is_admin: boolean;
    }>(
      "SELECT id, email, password_hash, is_admin FROM users WHERE email = $1",
      [data.email.toLowerCase()],
    );
    const u = rows[0];
    if (!u || !(await verifyPassword(data.password, u.password_hash))) {
      throw new Error("Invalid email or password");
    }
    const user: SessionUser = {
      id: u.id,
      email: u.email,
      isAdmin: u.is_admin,
    };
    await issueSession(user);
    return { user };
  });

export const signup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => credsSchema.parse(d))
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase();
    const existing = await query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length) throw new Error("Email already registered");

    // First user becomes admin automatically.
    const count = await query<{ c: string }>("SELECT COUNT(*)::text as c FROM users");
    const isFirst = count.rows[0].c === "0";

    const hash = await hashPassword(data.password);
    const { rows } = await query<{
      id: string;
      email: string;
      is_admin: boolean;
    }>(
      "INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING id, email, is_admin",
      [email, hash, isFirst],
    );
    const u = rows[0];
    const user: SessionUser = {
      id: u.id,
      email: u.email,
      isAdmin: u.is_admin,
    };
    await issueSession(user);
    return { user };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  clearSession();
  return { ok: true };
});
