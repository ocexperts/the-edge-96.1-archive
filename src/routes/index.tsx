import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStreamPlayer } from "@/components/StreamPlayer";
import bgPattern from "@/assets/bg-pattern.jpg";
import heroPop from "@/assets/hero-pop.jpg";
import breakfastShow from "@/assets/breakfast-show.jpg";
import { Heart, Radio, Mic2, Disc3, Play, Pause, Loader2 } from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Edge 96.1 — Remembered | cada.au" },
      {
        name: "description",
        content:
          "A loving tribute to The Edge 96.1, Sydney's pop powerhouse before it became CADA. Memories, shows and the songs we danced to.",
      },
      { property: "og:title", content: "The Edge 96.1 — Remembered" },
      {
        property: "og:description",
        content: "Remembering Sydney's pop powerhouse. Long live The Edge.",
      },
    ],
  }),
  component: Home,
});

const FEATURE_TILES = [
  { title: "Mike E & Emma's Breakfast", tag: "ICONIC SHOW", img: breakfastShow },
  { title: "The Friday Night Party Mix", tag: "WEEKEND ANTHEM" },
  { title: "Pop Hits of the 2010s", tag: "MUSIC" },
  { title: "Send-Offs From Listeners", tag: "TRIBUTES" },
];

function Home() {
  const { playing, loading, toggle } = useStreamPlayer();
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

      <main className="container mx-auto px-4">
        {/* Hero */}
        <section className="relative mt-8 rounded-2xl overflow-hidden bg-hero-gradient shadow-pink">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <span className="inline-block font-display tracking-[0.3em] text-xs text-white/80 bg-black/30 px-3 py-1 rounded">
                IN MEMORY · 1995–2024
              </span>
              <h1 className="mt-4 font-display text-5xl md:text-7xl text-white text-glow leading-none">
                The Edge<br />
                <span className="text-hot-pink">never fades.</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/90 max-w-md">
                96.1 was renamed to CADA — but the bangers, the voices and the late-night
                drives stay with us. This is a fan-made memorial to Sydney's loudest pop home.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={toggle}
                  className="inline-flex items-center gap-2 bg-white text-hot-pink font-bold font-display tracking-widest px-6 py-3 rounded-lg shadow-pink hover:scale-[1.02] transition-transform"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : playing ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  {loading ? "BUFFERING…" : playing ? "STOP THE TRIBUTE STREAM" : "PLAY THE TRIBUTE STREAM"}
                </button>
                <Link
                  to="/stories"
                  className="border border-white/40 hover:bg-white/10 font-display tracking-widest px-6 py-3 rounded-lg"
                >
                  SHARE A MEMORY
                </Link>
              </div>
            </div>
            <div className="relative h-72 md:h-[28rem]">
              <img
                src={heroPop}
                alt="Pop singer silhouette in stage lights"
                width={1280}
                height={896}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-deep-purple/80" />
            </div>
          </div>
        </section>

        {/* Stats / pill row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Radio, label: "Years on air", value: "29" },
            { icon: Mic2, label: "Hosts remembered", value: "60+" },
            { icon: Disc3, label: "Top 40 spins", value: "∞" },
            { icon: Heart, label: "Sydney hearts", value: "1M+" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-card/60 border border-hot-pink/30 backdrop-blur p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-hot-pink/20 flex items-center justify-center text-hot-pink">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display text-3xl text-white">{value}</p>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Latest from Edge tiles */}
        <section className="mt-12">
          <div className="bg-hot-pink text-hot-pink-foreground px-5 py-3 rounded-t-xl flex items-center justify-between">
            <h2 className="font-display tracking-widest text-xl">LATEST FROM EDGE96ONE</h2>
            <span className="text-xs tracking-widest opacity-80">A WALK THROUGH THE ARCHIVE</span>
          </div>
          <div className="bg-card/60 border border-hot-pink/30 border-t-0 rounded-b-xl p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURE_TILES.map((t) => (
              <article
                key={t.title}
                className="group rounded-lg overflow-hidden bg-deep-purple/60 border border-hot-pink/20 hover:border-hot-pink transition-colors"
              >
                <div
                  className="aspect-video bg-hero-gradient relative overflow-hidden"
                  style={
                    t.img
                      ? { backgroundImage: `url(${t.img})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : undefined
                  }
                >
                  <span className="absolute top-2 left-2 text-[0.6rem] font-bold tracking-widest bg-black/60 px-2 py-1 rounded">
                    {t.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white group-hover:text-hot-pink transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Read the throwback →</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Memory wall callout */}
        <section className="mt-12 rounded-2xl overflow-hidden border border-hot-pink/30 bg-card/50 backdrop-blur p-8 md:p-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <span className="font-display tracking-[0.3em] text-xs text-hot-pink">MEMORY WALL</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mt-2">
              Drop a memory. Sing one last chorus.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              Whether it was a school drop-off with Mike E & Emma, a Friday night drink with the
              party mix or a request line dedication — share what The Edge meant to you.
            </p>
            <Link
              to="/stories"
              className="inline-block mt-5 bg-hot-pink hover:bg-hot-pink/90 font-display tracking-widest px-6 py-3 rounded-lg shadow-pink"
            >
              SUBMIT A MEMORY
            </Link>
          </div>
          <div className="space-y-3">
            {[
              ["“Doo Wah Ditty was the soundtrack to year 11.”", "— Bec, Parramatta"],
              ["“I won concert tickets in 2013 and never won anything since.”", "— Daniel, Bondi"],
              ["“The Edge raised me from the back seat of mum's Camry.”", "— Anh, Cabramatta"],
            ].map(([quote, who]) => (
              <blockquote
                key={who}
                className="p-4 rounded-lg bg-deep-purple/60 border-l-4 border-hot-pink"
              >
                <p className="text-white">{quote}</p>
                <footer className="text-xs text-muted-foreground mt-1 tracking-wider">{who}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
