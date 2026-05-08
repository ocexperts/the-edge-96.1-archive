import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "Shows — The Edge 96.1 Memorial" },
      { name: "description", content: "The shows that defined The Edge 96.1." },
    ],
  }),
  component: ShowsPage,
});

const SHOWS = [
  { name: "Mike E & Emma's Breakfast", time: "Weekdays 6–9am", desc: "The cheeky duo that woke up Sydney." },
  { name: "The Daily", time: "Weekdays 9am–12pm", desc: "Pop hits to power you through the morning." },
  { name: "Drive with The Edge", time: "Weekdays 4–7pm", desc: "Soundtrack the long crawl home." },
  { name: "Friday Night Party Mix", time: "Fri 7–10pm", desc: "Pre-drinks officially started here." },
  { name: "The Edge Top 30", time: "Sat 9am–12pm", desc: "The 30 biggest songs in the country." },
];

function ShowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-5xl md:text-6xl text-white text-glow">SHOWS WE LOVED</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">A look back at the lineups that filled Sydney's airwaves on 96.1.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {SHOWS.map((s) => (
            <article key={s.name} className="rounded-xl border border-hot-pink/30 bg-card/60 backdrop-blur p-6 hover:border-hot-pink transition-colors">
              <p className="text-xs tracking-widest text-hot-pink font-bold">{s.time}</p>
              <h2 className="font-display text-2xl text-white mt-1">{s.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
