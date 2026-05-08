export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-hot-pink/30 bg-deep-purple/70 py-10">
      <div className="container mx-auto px-4 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} The Edge Memorial · A fan tribute to 96.1</p>
        <p className="font-display tracking-widest text-hot-pink">cada.au · WE REMEMBER THE EDGE</p>
      </div>
    </footer>
  );
}
