import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/music")({
  head: () => ({ meta: [{ title: "Music — The Edge Memorial" }, { name: "description", content: "The chart that powered The Edge 96.1." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-5xl md:text-7xl text-white text-glow">MUSIC</h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">The chart that powered The Edge — week by week.</p>
        <p className="mt-10 font-display tracking-widest text-hot-pink">COMING SOON</p>
      </main>
      <SiteFooter />
    </div>
  ),
});
