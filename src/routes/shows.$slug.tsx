import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getShow } from "@/lib/shows";

export const Route = createFileRoute("/shows/$slug")({
  loader: ({ params }) => {
    const show = getShow(params.slug);
    if (!show) throw notFound();
    return { show };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.show.name} — The Edge 96.1 Memorial` },
          { name: "description", content: loaderData.show.tagline },
          { property: "og:title", content: loaderData.show.name },
          { property: "og:description", content: loaderData.show.tagline },
          { property: "og:image", content: loaderData.show.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-white">Show not found</h1>
        <Link to="/shows" className="inline-block mt-6 text-hot-pink underline">Back to all shows</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-white">Something went off-air</h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </main>
    </div>
  ),
  component: ShowDetail,
});

function ShowDetail() {
  const { show } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <Link to="/shows" className="text-xs tracking-widest text-hot-pink hover:underline">← ALL SHOWS</Link>

        <section className="mt-4 rounded-2xl overflow-hidden border border-hot-pink/30 bg-card/50 backdrop-blur">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={show.image}
              alt={show.name}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-10">
            <p className="text-xs tracking-[0.3em] text-hot-pink font-bold">{show.time}</p>
            <h1 className="font-display text-4xl md:text-6xl text-white text-glow mt-2">{show.name}</h1>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl">{show.tagline}</p>
            {show.hosts && (
              <p className="mt-3 text-sm tracking-widest text-hot-pink/90">HOSTED BY · {show.hosts}</p>
            )}
          </div>
        </section>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-8">
          <article className="rounded-xl border border-hot-pink/30 bg-card/60 backdrop-blur p-6 md:p-8">
            <h2 className="font-display text-2xl text-hot-pink tracking-widest">THE FORMAT</h2>
            <p className="mt-3 text-white/90 leading-relaxed">{show.format}</p>

            <h2 className="font-display text-2xl text-hot-pink tracking-widest mt-8">SIGNATURE SEGMENTS</h2>
            <ul className="mt-3 space-y-2">
              {show.segments.map((seg: string) => (
                <li key={seg} className="pl-4 border-l-4 border-hot-pink text-white/90">{seg}</li>
              ))}
            </ul>

            <h2 className="font-display text-2xl text-hot-pink tracking-widest mt-8">WHY IT MATTERED</h2>
            <p className="mt-3 text-white/90 leading-relaxed">{show.legacy}</p>
          </article>

          <aside className="rounded-xl border border-hot-pink/30 bg-deep-purple/40 backdrop-blur p-6 h-fit">
            <h3 className="font-display text-xl text-white">Got a memory of this show?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              The dedications, the prank calls, the song you won tickets to — drop them on the wall.
            </p>
            <Link
              to="/stories"
              className="inline-block mt-4 bg-hot-pink hover:bg-hot-pink/90 text-hot-pink-foreground font-display tracking-widest px-5 py-3 rounded-lg shadow-pink"
            >
              SHARE A MEMORY
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
