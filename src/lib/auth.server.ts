import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "@tanstack/react-start/server";
import { query } from "./db.server";

const COOKIE = "edge_session";
const ALG = "HS256";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set to a random string of at least 32 chars",
    );
  }
  return new TextEncoder().encode(s);
}

export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function issueSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    admin: user.isAdmin,
  })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession() {
  deleteCookie(COOKIE, { path: "/" });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    // Re-check admin flag from DB so role revocation takes effect.
    const { rows } = await query<{
      id: string;
      email: string;
      is_admin: boolean;
    }>("SELECT id, email, is_admin FROM users WHERE id = $1", [payload.sub]);
    const u = rows[0];
    if (!u) return null;
    return { id: u.id, email: u.email, isAdmin: u.is_admin };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u || !u.isAdmin) throw new Error("Forbidden");
  return u;
}
