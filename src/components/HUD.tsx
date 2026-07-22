import React from "react";
import type { TypingMetrics } from "../types/game";

interface HUDProps {
  metrics: TypingMetrics;
  isStarted: boolean;
  isComplete: boolean;
}

export function HUD({ metrics, isStarted, isComplete }: HUDProps) {
  if (!isStarted || isComplete) return null;

  return (
    <div className="fixed top-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-6 rounded-full border-2 border-[var(--ink)] bg-[var(--panel-bg)] px-8 py-3.5 text-[var(--ink)] shadow-xl backdrop-blur-md transition-all duration-300 doodle-font">
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-ink)]">
          {metrics.remainingLabel}
        </span>
        <span className="text-2xl font-black">{metrics.remainingValue}</span>
      </div>

      <div className="h-8 w-0.5 bg-[var(--ink)] opacity-30" />

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-ink)]">WPM</span>
        <span className="text-2xl font-black">{metrics.wpm}</span>
      </div>

      <div className="h-8 w-0.5 bg-[var(--ink)] opacity-30" />

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-ink)]">ACC</span>
        <span className="text-2xl font-black">{metrics.accuracy}%</span>
      </div>
    </div>
  );
}
