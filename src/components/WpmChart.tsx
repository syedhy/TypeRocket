import React from "react";

type WpmChartProps = {
  history: number[];
  wpm: number;
  accuracy: number;
};

export function WpmChart({ history, wpm, accuracy }: WpmChartProps) {
  const data = history.length > 1 ? history : [0, wpm / 2, wpm];
  const maxWpm = Math.max(...data, 40);
  const minWpm = 0;
  const width = 600;
  const height = 180;
  const padding = 24;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minWpm) / (maxWpm - minWpm || 1)) * (height - 2 * padding);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="relative w-full rounded-3xl border-4 border-[var(--ink)] bg-[var(--paper)] p-4 shadow-md doodle-font">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-black uppercase tracking-widest text-[var(--muted-ink)]">
          Flight Speed Curve (WPM over Time)
        </span>
        <span className="text-xs font-black text-[var(--ink)]">
          Peak Speed: {Math.max(...data)} WPM
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--ink)" strokeOpacity="0.15" strokeDasharray="4 4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--ink)" strokeOpacity="0.15" strokeDasharray="4 4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--ink)" strokeOpacity="0.3" strokeWidth="2" />

        {/* Gradient fill */}
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#wpmGradient)" />
        <path d={pathD} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
        ))}
      </svg>

      <div className="flex justify-between items-center mt-2 px-2 text-xs font-bold text-[var(--muted-ink)]">
        <span>0s</span>
        <span>{history.length}s</span>
      </div>
    </div>
  );
}
