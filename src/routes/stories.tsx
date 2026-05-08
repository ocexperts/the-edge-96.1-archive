import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import bgPattern from "@/assets/bg-pattern.jpg";
import { Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories — Share Your Edge 96.1 Memory" },
      {
        name: "description",
        content:
          "Share your favourite memory of The Edge 96.1 and read stories from fellow Sydney listeners.",
      },
      { property: "og:title", content: "Stories — The Edge 96.1 Memorial" },
      {
        property: "og:description",
        content: "Share your story. Read other listeners' memories of The Edge 96.1.",
      },
    ],
  }),
  component: StoriesPage,
});

type Story = {
  id: string;
  name: string;
  location: string;
  title: string;
  body: string;
  created_at: string;
  hearts: number;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("stories")
      .select("id, name, location, title, body, created_at, hearts")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      setError(error.message);
    } else {
      setStories(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim().slice(0, 60);
    const trimmedTitle = title.trim().slice(0, 100);
    const trimmedBody = body.trim().slice(0, 1500);
    const trimmedLocation = location.trim().slice(0, 60);
    if (!trimmedName || !trimmedTitle || !trimmedBody) return;
    setSubmitting(true);
    const { error } = await supabase.from("stories").insert({
      name: trimmedName,
      location: trimmedLocation,
      title: trimmedTitle,
      body: trimmedBody,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    setLocation("");
    setTitle("");
    setBody("");
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
    load();
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
        <header className="mb-8 max-w-2xl">
          <span className="font-display tracking-[0.3em] text-xs text-hot-pink">MEMORY WALL</span>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-white text-glow">
            Share your story.
          </h1>
          <p className="mt-3 text-muted-foreground">
            What does The Edge 96.1 mean to you? Drop a memory — a song, a school run, a Friday
            night, a request line moment. Sydney is listening.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <section className="rounded-2xl border border-hot-pink/30 bg-card/60 backdrop-blur p-6 h-fit lg:sticky lg:top-6">
            <h2 className="font-display tracking-widest text-xl text-white">SUBMIT A MEMORY</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Stories appear instantly. Keep it kind — moderators may remove anything rude.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs tracking-widest text-hot-pink">YOUR NAME</span>
                  <input
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
                    placeholder="Bec"
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-widest text-hot-pink">SUBURB</span>
                  <input
                    maxLength={60}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
                    placeholder="Parramatta"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs tracking-widest text-hot-pink">TITLE</span>
                <input
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
                  placeholder="The night I called in"
                />
              </label>
              <label className="block">
                <span className="text-xs tracking-widest text-hot-pink">YOUR STORY</span>
                <textarea
                  required
                  maxLength={1500}
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink resize-y"
                  placeholder="Tell us about the song, the moment, the show…"
                />
                <span className="text-[0.65rem] text-muted-foreground">{body.length}/1500</span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-hot-pink hover:bg-hot-pink/90 disabled:opacity-60 text-hot-pink-foreground font-display tracking-widest px-6 py-3 rounded-lg shadow-pink"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "POSTING…" : "POST MY STORY"}
              </button>
              {posted && (
                <p className="text-sm text-hot-pink text-center">
                  Thanks — your memory is on the wall.
                </p>
              )}
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            </form>
          </section>

          <section className="space-y-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display tracking-widest text-xl text-white">
                {loading ? "LOADING…" : `${stories.length} ${stories.length === 1 ? "STORY" : "STORIES"}`}
              </h2>
              <span className="text-xs tracking-widest text-muted-foreground">NEWEST FIRST</span>
            </div>
            {!loading && stories.length === 0 && (
              <p className="text-muted-foreground">Be the first to share a memory.</p>
            )}
            {stories.map((s) => (
              <article
                key={s.id}
                className="rounded-xl bg-card/60 backdrop-blur border border-hot-pink/30 p-5"
              >
                <h3 className="font-display text-2xl text-white">{s.title}</h3>
                <p className="text-xs tracking-widest text-muted-foreground mt-1">
                  {s.name.toUpperCase()}
                  {s.location ? ` · ${s.location.toUpperCase()}` : ""} · {timeAgo(s.created_at)}
                </p>
                <p className="mt-3 text-white/90 whitespace-pre-line leading-relaxed">{s.body}</p>
              </article>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
