export function EdgeLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="relative">
        <span className="font-display text-5xl md:text-6xl tracking-wider text-white text-glow leading-none">
          THE EDGE
        </span>
        <span className="absolute -right-3 -top-2 font-display text-xl md:text-2xl text-hot-pink">
          96.1
        </span>
      </div>
      <span className="font-display text-[0.65rem] tracking-[0.3em] text-hot-pink mt-1">
        LIVE · SEXY · RIGHT NOW
      </span>
    </div>
  );
}
