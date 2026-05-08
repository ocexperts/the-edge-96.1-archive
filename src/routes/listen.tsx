import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Equalizer } from "@/components/Equalizer";
import { Play } from "lucide-react";

export const Route = createFileRoute("/listen")({
  head: () => ({
    meta: [
      { title: "Listen Live — The Edge Memorial Stream" },
      { name: "description", content: "Tune into the tribute stream celebrating The Edge 96.1." },
    ],
  }),
  component: ListenPage,
});

function ListenPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="rounded-2xl bg-hero-gradient p-10 md:p-16 text-center shadow-pink">
          <Equalizer />
          <h1 className="font-display text-5xl md:text-7xl text-white text-glow mt-4">TRIBUTE STREAM</h1>
          <p className="mt-3 text-white/90 max-w-md mx-auto">A non-stop playlist of the pop, dance and R&B that 96.1 spun on heavy rotation.</p>
          <button className="mt-6 inline-flex items-center gap-2 bg-white text-hot-pink font-display tracking-widest px-8 py-4 rounded-lg shadow-pink animate-pulse-glow">
            <Play className="w-5 h-5 fill-current" /> PRESS PLAY
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
