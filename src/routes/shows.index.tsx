import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SHOWS } from "@/lib/shows";

export const Route = createFileRoute("/shows/")({
  head: () => ({
    meta: [
      { title: "Shows — The Edge 96.1 Memorial" },
      { name: "description", content: "The shows that defined The Edge 96.1 — formats, segments and the hosts behind them." },
    ],
  }),
  component: ShowsPage,
});

function ShowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-5xl md:text-6xl text-white text-glow">SHOWS WE LOVED</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          A look back at the lineups that filled Sydney's airwaves on 96.1. Tap a show to dive into the format, segments and what made it stick.
        </p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SHOWS.map((s) => (
            <Link
              key={s.slug}
              to="/shows/$slug"
              params={{ slug: s.slug }}
              className="group rounded-xl overflow-hidden border border-hot-pink/30 bg-card/60 backdrop-blur hover:border-hot-pink hover:shadow-pink transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-xs tracking-widest text-hot-pink font-bold">{s.time}</p>
                <h2 className="font-display text-2xl text-white mt-1 group-hover:text-hot-pink transition-colors">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
                <p className="mt-3 text-xs tracking-widest text-hot-pink/80">READ THE FORMAT →</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
