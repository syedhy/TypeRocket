import type { AtmosphereLayer, TypingMetrics } from "../types/game";

type StatsPanelProps = {
  metrics: TypingMetrics;
  layer: AtmosphereLayer;
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function StatsPanel({ metrics, layer }: StatsPanelProps) {
  const stats = [
    { label: "WPM", value: metrics.wpm },
    { label: "Accuracy", value: `${metrics.accuracy}%` },
    { label: "Progress", value: `${Math.round(metrics.progress * 100)}%` },
    { label: "Time", value: formatTime(metrics.elapsedSeconds) },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map((stat) => (
        <div
          className="rounded-2xl border-3 border-black bg-white px-4 py-3 shadow-doodle-sm"
          key={stat.label}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">{stat.label}</p>
          <p className="mt-1 font-mono text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
      <div className="col-span-2 rounded-2xl border-3 border-black bg-white px-4 py-3 shadow-doodle-sm sm:col-span-1">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">Layer</p>
        <p className="mt-1 text-lg font-black leading-tight">{layer.name}</p>
      </div>
    </section>
  );
}
