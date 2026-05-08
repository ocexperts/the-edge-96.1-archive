import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import bgPattern from "@/assets/bg-pattern.jpg";
import { Heart, Send } from "lucide-react";

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
  createdAt: number;
  hearts: number;
};

const STORAGE_KEY = "edge961-stories";

const SEED_STORIES: Story[] = [
  {
    id: "seed-1",
    name: "Bec",
    location: "Parramatta",
    title: "Year 11, windows down",
    body: "Doo Wah Ditty was the soundtrack to year 11. We'd cruise around Westmead with the windows down screaming every word. The Edge made us feel like Sydney was the centre of the universe.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    hearts: 41,
  },
  {
    id: "seed-2",
    name: "Daniel",
    location: "Bondi",
    title: "The only thing I've ever won",
    body: "I called in to the request line back in 2013 and somehow won concert tickets. Haven't won a single thing since. Mike E and Emma made my whole year.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    hearts: 27,
  },
  {
    id: "seed-3",
    name: "Anh",
    location: "Cabramatta",
    title: "Mum's Camry, back seat",
    body: "The Edge raised me from the back seat of mum's Camry on the school run. When they renamed it I genuinely cried in the car park at Cabra Westfield.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    hearts: 63,
  },
];

function loadStories(): Story[] {
  if (typeof window === "undefined") return SEED_STORIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_STORIES;
    const parsed = JSON.parse(raw) as Story[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_STORIES;
    return parsed;
  } catch {
    return SEED_STORIES;
  }
}

function saveStories(list: Story[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota / privacy mode
  }
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
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
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    setStories(loadStories());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStories(stories);
  }, [stories, hydrated]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, 60);
    const trimmedTitle = title.trim().slice(0, 100);
    const trimmedBody = body.trim().slice(0, 1500);
    if (!trimmedName || !trimmedTitle || !trimmedBody) return;
    const next: Story = {
      id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      location: location.trim().slice(0, 60),
      title: trimmedTitle,
      body: trimmedBody,
      createdAt: Date.now(),
      hearts: 0,
    };
    setStories((prev) => [next, ...prev]);
    setName("");
    setLocation("");
    setTitle("");
    setBody("");
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  }

  function handleHeart(id: string) {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hearts: s.hearts + 1 } : s)),
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
          {/* Submit form */}
          <section className="rounded-2xl border border-hot-pink/30 bg-card/60 backdrop-blur p-6 h-fit lg:sticky lg:top-6">
            <h2 className="font-display tracking-widest text-xl text-white">SUBMIT A MEMORY</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Stories appear instantly on this device. Keep it kind.
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
                <span className="text-[0.65rem] text-muted-foreground">
                  {body.length}/1500
                </span>
              </label>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-hot-pink hover:bg-hot-pink/90 text-hot-pink-foreground font-display tracking-widest px-6 py-3 rounded-lg shadow-pink"
              >
                <Send className="w-4 h-4" />
                POST MY STORY
              </button>
              {posted && (
                <p className="text-sm text-hot-pink text-center">
                  Thanks — your memory is on the wall.
                </p>
              )}
            </form>
          </section>

          {/* Story feed */}
          <section className="space-y-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display tracking-widest text-xl text-white">
                {stories.length} {stories.length === 1 ? "STORY" : "STORIES"}
              </h2>
              <span className="text-xs tracking-widest text-muted-foreground">
                NEWEST FIRST
              </span>
            </div>
            {stories.map((s) => (
              <article
                key={s.id}
                className="rounded-xl bg-card/60 backdrop-blur border border-hot-pink/30 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-white">{s.title}</h3>
                    <p className="text-xs tracking-widest text-muted-foreground mt-1">
                      {s.name.toUpperCase()}
                      {s.location ? ` · ${s.location.toUpperCase()}` : ""} · {timeAgo(s.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleHeart(s.id)}
                    aria-label="Heart this story"
                    className="shrink-0 inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-hot-pink/40 text-hot-pink hover:bg-hot-pink hover:text-hot-pink-foreground transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {s.hearts}
                  </button>
                </div>
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
