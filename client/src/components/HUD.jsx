export default function HUD({ timeSec, score, lives, lifeState = 'normal' }) {
  const t = Math.floor(timeSec || 0);
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');

  const hearts = Array.from({ length: lives ?? 0 }, (_, i) => {
    const base = 'text-lg sm:text-xl drop-shadow';
    const stateClass =
      lifeState === 'fading'
        ? ' text-red-500/40 opacity-60 animate-pulse'
        : ' text-red-500';

    return (
      <span key={i} className={base + stateClass}>
        ♥
      </span>
    );
  });

  return (
    <div className="absolute top-3 left-3 right-3 flex justify-between text-xs sm:text-sm text-white/80 pointer-events-none">
      <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10">
        <span className="font-semibold mr-1">Time:</span>
        {mm}:{ss}
      </div>
      <div className="flex gap-2">
        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10">
          <span className="font-semibold mr-1">Score:</span>
          {score}
        </div>
        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 flex items-center gap-1">
          <span className="font-semibold mr-1">Lives:</span>
          {hearts}
        </div>
      </div>
    </div>
  );
}
