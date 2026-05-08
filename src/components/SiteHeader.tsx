import { Link } from "@tanstack/react-router";
import { EdgeLogo } from "./EdgeLogo";
import { Equalizer } from "./Equalizer";
import { Play, Pause, Search, Facebook, Twitter } from "lucide-react";
import { useStreamPlayer } from "./StreamPlayer";

const NAV = [
  { label: "HOME", to: "/" },
  { label: "SHOWS", to: "/shows" },
  { label: "LISTEN", to: "/listen" },
  { label: "VIDEOS", to: "/videos" },
  { label: "PHOTOS", to: "/photos" },
  { label: "WIN", to: "/win" },
  { label: "MUSIC", to: "/music" },
  { label: "STORIES", to: "/stories" },
  { label: "ABOUT", to: "/about" },
] as const;

export function SiteHeader() {
  const { playing, loading, toggle } = useStreamPlayer();

  return (
    <header className="relative z-20">
      <div className="container mx-auto px-4 pt-6 pb-3 flex flex-wrap items-center gap-6">
        <Link to="/" className="shrink-0">
          <EdgeLogo />
        </Link>

        <div className="flex-1 min-w-[260px] flex flex-wrap gap-3">
          <div className="flex-1 min-w-[260px] rounded-lg bg-deep-purple/60 backdrop-blur border border-hot-pink/30 px-4 py-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-hero-gradient flex items-center justify-center shadow-pink">
              <Equalizer />
            </div>
            <div className="leading-tight">
              <p className="text-[0.65rem] tracking-[0.25em] text-hot-pink font-bold">NOW PLAYING</p>
              <p className="text-sm font-semibold text-white">A tribute to Sydney's pop powerhouse</p>
              <p className="text-xs text-muted-foreground">The Edge 96.1 · The Memorial Stream</p>
            </div>
          </div>
          <button
            onClick={toggle}
            aria-label={playing ? "Stop live stream" : "Play live stream"}
            className="rounded-lg bg-hot-pink hover:bg-hot-pink/90 text-hot-pink-foreground font-bold px-5 flex items-center gap-2 shadow-pink animate-pulse-glow disabled:opacity-70"
          >
            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span className="font-display tracking-wider text-lg">
              {loading ? "BUFFERING…" : playing ? "STOP" : "LISTEN LIVE"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a className="w-9 h-9 rounded bg-hot-pink/20 hover:bg-hot-pink flex items-center justify-center transition-colors" href="#"><Facebook className="w-4 h-4" /></a>
          <a className="w-9 h-9 rounded bg-hot-pink/20 hover:bg-hot-pink flex items-center justify-center transition-colors" href="#"><Twitter className="w-4 h-4" /></a>
          <div className="hidden md:flex items-center bg-deep-purple/60 border border-hot-pink/30 rounded-lg overflow-hidden">
            <input className="bg-transparent px-3 py-2 text-sm outline-none w-36" placeholder="Search" />
            <button className="bg-hot-pink px-3 h-full"><Search className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <nav className="border-y border-hot-pink/30 bg-deep-purple/70 backdrop-blur">
        <div className="container mx-auto px-4 flex flex-wrap">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-hot-pink text-hot-pink-foreground" }}
              activeOptions={{ exact: true }}
              className="font-display tracking-widest text-sm md:text-base px-5 py-3 hover:bg-hot-pink/40 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
