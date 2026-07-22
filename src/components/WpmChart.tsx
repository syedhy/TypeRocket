import React from "react";

type WpmChartProps = {
  history: number[];
  wpm: number;
  accuracy: number;
};

export function WpmChart({ history, wpm, accuracy }: WpmChartProps) {
  const data = history.length > 1 ? history : [0, Math.round(wpm / 2), wpm];
  const maxWpm = Math.max(...data, 40);
  const minWpm = 0;
  const width = 600;
  const height = 150;
  const padding = 20;

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
    <div className="relative w-full rounded-2xl border-2 border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 sm:p-5 shadow-sm doodle-font">
      <div className="flex items-center justify-between mb-3 px-1 text-xs font-bold">
        <span className="uppercase tracking-widest text-[var(--muted-ink)]">
          Flight Speed Curve (WPM)
        </span>
        <span className="text-[var(--ink)] font-black">
          Peak: {Math.max(...data)} WPM
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--ink)" strokeOpacity="0.12" strokeDasharray="4 4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--ink)" strokeOpacity="0.12" strokeDasharray="4 4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Gradient fill */}
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#wpmGradient)" />
        <path d={pathD} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        ))}
      </svg>

      <div className="flex justify-between items-center mt-3 px-1 pt-1 text-[11px] font-bold text-[var(--muted-ink)]">
        <span>0s (Start)</span>
        <span>{history.length}s (Finish)</span>
      </div>
    </div>
  );
}
