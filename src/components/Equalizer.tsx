export function Equalizer() {
  return (
    <div className="flex items-end gap-1 h-6">
      {[0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.15].map((d, i) => (
        <span
          key={i}
          className="eq-bar w-1 rounded-sm"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </div>
  );
}
