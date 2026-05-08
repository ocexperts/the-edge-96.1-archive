import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { query } from "./db.server";
import { requireAdmin } from "./auth.server";

export type Story = {
  id: string;
  name: string;
  location: string;
  title: string;
  body: string;
  created_at: string;
  hearts: number;
  hidden: boolean;
};

export const listStories = createServerFn({ method: "GET" }).handler(
  async () => {
    const { rows } = await query<Story>(
      `SELECT id, name, location, title, body, created_at, hearts, hidden
       FROM stories WHERE hidden = false
       ORDER BY created_at DESC LIMIT 200`,
    );
    return { stories: rows };
  },
);

const postSchema = z.object({
  name: z.string().trim().min(1).max(60),
  location: z.string().trim().max(60).default(""),
  title: z.string().trim().min(1).max(100),
  body: z.string().trim().min(1).max(1500),
});

export const postStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ data }) => {
    const { rows } = await query<Story>(
      `INSERT INTO stories (name, location, title, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, location, title, body, created_at, hearts, hidden`,
      [data.name, data.location, data.title, data.body],
    );
    return { story: rows[0] };
  });

export const listAllStories = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { rows } = await query<Story>(
      `SELECT id, name, location, title, body, created_at, hearts, hidden
       FROM stories ORDER BY created_at DESC`,
    );
    return { stories: rows };
  },
);

export const setStoryHidden = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), hidden: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("UPDATE stories SET hidden = $1 WHERE id = $2", [
      data.hidden,
      data.id,
    ]);
    return { ok: true };
  });

export const deleteStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("DELETE FROM stories WHERE id = $1", [data.id]);
    return { ok: true };
  });
