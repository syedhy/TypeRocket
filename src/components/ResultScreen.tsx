import type { TypingMetrics } from "../types/game";

type ResultScreenProps = {
  metrics: TypingMetrics;
  onRestart: () => void;
};

function formatTime(seconds: number): string {
  return `${seconds.toFixed(1)}s`;
}

export function ResultScreen({ metrics, onRestart }: ResultScreenProps) {
  if (!metrics.isComplete) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border-4 border-black bg-white p-5 shadow-doodle">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-black/55">Mission complete</p>
      <h2 className="mt-2 text-3xl font-black">Orbit reached.</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/50">WPM</p>
          <p className="font-mono text-2xl font-bold">{metrics.wpm}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/50">Accuracy</p>
          <p className="font-mono text-2xl font-bold">{metrics.accuracy}%</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/50">Time</p>
          <p className="font-mono text-2xl font-bold">{formatTime(metrics.elapsedSeconds)}</p>
        </div>
      </div>
      <button className="doodle-button mt-5 w-full justify-center" type="button" onClick={onRestart}>
        Restart flight
      </button>
    </section>
  );
}
