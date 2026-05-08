import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const PAGES = {
  videos: { title: "Videos", blurb: "Throwback clips, on-air pranks and red-carpet hits." },
  photos: { title: "Photos", blurb: "Studio shots, street team chaos and listener selfies." },
  win: { title: "Win", blurb: "We can't give away tickets anymore — but the memories are priceless." },
  music: { title: "Music", blurb: "The chart that powered The Edge — week by week." },
} as const;

type PageKey = keyof typeof PAGES;

function makePage(key: PageKey) {
  return function Page() {
    const p = PAGES[key];
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-white text-glow">{p.title.toUpperCase()}</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{p.blurb}</p>
          <p className="mt-10 font-display tracking-widest text-hot-pink">COMING SOON</p>
        </main>
        <SiteFooter />
      </div>
    );
  };
}

export { makePage };

export const Route = createFileRoute("/videos")({
  head: () => ({ meta: [{ title: "Videos — The Edge Memorial" }] }),
  component: makePage("videos"),
});
