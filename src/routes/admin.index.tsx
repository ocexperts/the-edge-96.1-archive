import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import {
  listAllStories,
  setStoryHidden,
  deleteStory,
  type Story,
} from "@/lib/stories.functions";
import bgPattern from "@/assets/bg-pattern.jpg";
import { Trash2, EyeOff, Eye, LogOut, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin — Moderate Stories" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const list = useServerFn(listAllStories);
  const toggle = useServerFn(setStoryHidden);
  const remove = useServerFn(deleteStory);

  const [stories, setStories] = useState<Story[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, isAdmin, navigate]);

  async function load() {
    setFetching(true);
    try {
      const r = await list();
      setStories(r.stories);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function toggleHidden(s: Story) {
    setBusy(s.id);
    await toggle({ data: { id: s.id, hidden: !s.hidden } });
    setBusy(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this story permanently?")) return;
    setBusy(id);
    await remove({ data: { id } });
    setBusy(null);
    load();
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/admin/login" });
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundImage: `linear-gradient(180deg, oklch(0.18 0.12 320 / 0.85), oklch(0.14 0.10 310 / 0.95)), url(${bgPattern})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="font-display tracking-[0.3em] text-xs text-hot-pink">ADMIN</span>
            <h1 className="font-display text-4xl md:text-5xl text-white mt-1">Moderate Stories</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Hide rude stories or delete them entirely. Hidden stories disappear from the public wall.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/stories" className="underline text-muted-foreground hover:text-white">
              View public wall
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 border border-hot-pink/40 text-hot-pink hover:bg-hot-pink hover:text-hot-pink-foreground rounded-md px-3 py-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        {fetching ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : stories.length === 0 ? (
          <p className="text-muted-foreground">No stories yet.</p>
        ) : (
          <div className="space-y-4">
            {stories.map((s) => (
              <article
                key={s.id}
                className={`rounded-xl border p-5 backdrop-blur ${
                  s.hidden
                    ? "bg-red-950/40 border-red-500/40"
                    : "bg-card/60 border-hot-pink/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-2xl text-white">{s.title}</h3>
                      {s.hidden && (
                        <span className="text-[0.65rem] uppercase tracking-widest bg-red-500/30 text-red-200 px-2 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs tracking-widest text-muted-foreground mt-1">
                      {s.name.toUpperCase()}
                      {s.location ? ` · ${s.location.toUpperCase()}` : ""} ·{" "}
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleHidden(s)}
                      disabled={busy === s.id}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-hot-pink/40 text-hot-pink hover:bg-hot-pink hover:text-hot-pink-foreground transition-colors disabled:opacity-50"
                    >
                      {s.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {s.hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={busy === s.id}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-white/90 whitespace-pre-line leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
