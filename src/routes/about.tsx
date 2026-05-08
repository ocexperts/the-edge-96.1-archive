import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Edge 96.1 Memorial" },
      { name: "description", content: "Why we built cada.au — a fan tribute to The Edge 96.1." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-5xl md:text-6xl text-white text-glow">WHY THIS SITE EXISTS</h1>
        <div className="mt-6 space-y-5 text-lg text-white/90 leading-relaxed">
          <p>
            On a Tuesday in 2024, The Edge 96.1 was rebranded as CADA. For a generation of
            Sydneysiders, that frequency wasn't just a station — it was the morning bus ride,
            the Friday pre-drinks, the dedications at midnight.
          </p>
          <p>
            <strong className="text-hot-pink">cada.au</strong> is an unofficial, fan-made memorial.
            We don't have a broadcast license, but we have memories — and a streaming player full
            of bangers The Edge would have absolutely played.
          </p>
          <p>
            Got photos, jingles, audio drops or a Mike E & Emma anecdote? Send them in. The
            archive is yours.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
