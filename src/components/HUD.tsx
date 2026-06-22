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
    <div className="fixed top-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-8 rounded-full bg-black/30 px-8 py-3 text-white backdrop-blur-md transition-opacity duration-500">
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">WPM</span>
        <span className="text-2xl font-black">{metrics.wpm}</span>
      </div>
      <div className="h-8 w-px bg-white/20" />
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">ACC</span>
        <span className="text-2xl font-black">{metrics.accuracy}%</span>
      </div>
    </div>
  );
}
