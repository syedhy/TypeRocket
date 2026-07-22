import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ALTITUDE_MOTION_CONFIG, GRID_VISUAL_CONFIG } from "./altitude/altitudeWorld";
import { ROCKET_ASSETS } from "./config/assets";
import { getAtmosphereLayer } from "./config/atmosphere";
import { MAX_ALTITUDE_KM } from "./config/game";
import { useRecentTypingSpeed } from "./hooks/useRecentTypingSpeed";
import { useTypingGame } from "./hooks/useTypingGame";
import { Rocket } from "./components/Rocket";
import { SkyMotion } from "./components/SkyMotion";
import { TypingText } from "./components/TypingText";
import { CardBody, CardContainer, CardItem } from "./components/ui/3d-card";
import { HUD } from "./components/HUD";
import { CommandPalette } from "./components/CommandPalette";
import { MonkeyBar } from "./components/MonkeyBar";
import { CustomTextModal } from "./components/CustomTextModal";
import { WpmChart } from "./components/WpmChart";
import { useGameSettings } from "./contexts/GameSettingsContext";
import { Settings, RotateCcw } from "lucide-react";

gsap.registerPlugin(useGSAP);

type FlightState = {
  altitudeKilometers: number;
  velocityPxPerSecond: number;
};

type ResultSnapshot = {
  accuracy: number;
  altitudeKilometers: number;
  elapsedSeconds: number;
  flightProgress: number;
  layerName: string;
  mistakes: number;
  typedProgress: number;
  wpm: number;
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function getProjectedStopAltitudeKilometers(
  { altitudeKilometers, velocityPxPerSecond }: FlightState,
  metrics: {
    accuracy: number;
    progress: number;
    wpm: number;
  },
  recentWpm: number
) {
  const accuracyMultiplier = Math.min(Math.max(metrics.accuracy / 100, 0), 1);
  const completionMultiplier = Math.min(Math.max(metrics.progress, 0), 1);
  const recentSpeedProgress = Math.min(
    Math.max(
      (recentWpm - ALTITUDE_MOTION_CONFIG.minimumRecentWpm) /
        ALTITUDE_MOTION_CONFIG.speedWpmRange,
      0
    ),
    1
  );
  const estimatedVelocity =
    recentWpm >= ALTITUDE_MOTION_CONFIG.minimumRecentWpm
      ? ALTITUDE_MOTION_CONFIG.minimumSpeedPxPerSecond +
        (ALTITUDE_MOTION_CONFIG.maximumSpeedPxPerSecond -
          ALTITUDE_MOTION_CONFIG.minimumSpeedPxPerSecond) *
          Math.pow(recentSpeedProgress, ALTITUDE_MOTION_CONFIG.speedCurveExponent)
      : 0;
  const effectiveVelocity = Math.max(velocityPxPerSecond, estimatedVelocity);
  const normalizedVelocity = Math.min(
    Math.max(effectiveVelocity / GRID_VISUAL_CONFIG.maximumSpeedPxPerSecond, 0),
    1
  );
  const coastPixels =
    (effectiveVelocity * effectiveVelocity) /
    (2 * ALTITUDE_MOTION_CONFIG.coastDecelerationPxPerSecondSquared);
  const physicsCoastKilometers = coastPixels / ALTITUDE_MOTION_CONFIG.pixelsPerKm;
  const speedCoastKilometers =
    metrics.wpm *
    (1.1 + normalizedVelocity * 1.45) *
    accuracyMultiplier *
    completionMultiplier;

  return altitudeKilometers + Math.max(physicsCoastKilometers, speedCoastKilometers);
}

function App() {
  const { isSettingsModalOpen, setSettingsModalOpen } = useGameSettings();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const flightStateRef = useRef<FlightState>({
    altitudeKilometers: 0,
    velocityPxPerSecond: 0,
  });
  const isResultFrozenRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const [flightAltitudeKilometers, setFlightAltitudeKilometers] = useState(0);
  const [resultSnapshot, setResultSnapshot] = useState<ResultSnapshot | null>(null);
  const {
    targetText,
    input,
    characterStatuses,
    metrics,
    isLoading,
    handleInputChange,
    typeCharacter,
    deleteCharacter,
    reset,
    wpmHistory,
  } = useTypingGame();

  const recentSpeed = useRecentTypingSpeed(input, targetText);
  const flightProgress = Math.min(flightAltitudeKilometers / MAX_ALTITUDE_KM, 1);
  const displayAltitudeKilometers = Math.round(flightAltitudeKilometers);
  const layer = getAtmosphereLayer(flightProgress);
  const resultAltitudeKilometers = resultSnapshot?.altitudeKilometers ?? displayAltitudeKilometers;
  const resultFlightProgress = resultSnapshot?.flightProgress ?? flightProgress;
  const resultLayerName = resultSnapshot?.layerName ?? layer.name;
  const isTyping = metrics.typedProgress > 0;

  const motionIntensity = Math.min(
    Math.max(
      (recentSpeed.recentWpm - ALTITUDE_MOTION_CONFIG.minimumRecentWpm) /
        ALTITUDE_MOTION_CONFIG.speedWpmRange,
      0
    ),
    1
  );

  useGSAP(() => {
    if (metrics.isComplete && resultsRef.current) {
      const q = gsap.utils.selector(resultsRef.current);
      gsap.from(q(".results-topbar"), { y: -50, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
      gsap.from(q(".results-rocket-panel"), { x: -100, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
      gsap.from(q(".mission-report"), { opacity: 0, y: 50, duration: 0.8, ease: "power3.out", delay: 0.4 });
      gsap.from(q(".result-stat"), { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)", delay: 0.6 });
      gsap.from(q(".result-mini"), { opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 1.0 });
    }
  }, [metrics.isComplete]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    isResultFrozenRef.current = resultSnapshot !== null;
  }, [resultSnapshot]);

  const handleFlightStateChange = useCallback((state: FlightState) => {
    flightStateRef.current = state;

    if (isResultFrozenRef.current) {
      return;
    }

    setFlightAltitudeKilometers((currentAltitude) => {
      if (Math.abs(currentAltitude - state.altitudeKilometers) < 0.05) {
        return currentAltitude;
      }

      return state.altitudeKilometers;
    });
  }, []);

  useEffect(() => {
    if (!metrics.isComplete || resultSnapshot) {
      return;
    }

    const projectedAltitude = getProjectedStopAltitudeKilometers(
      flightStateRef.current,
      metrics,
      recentSpeed.recentWpm
    );
    const finalAltitudeKilometers = Math.round(
      Math.max(projectedAltitude, metrics.altitudeKilometers)
    );
    const finalFlightProgress = Math.min(finalAltitudeKilometers / MAX_ALTITUDE_KM, 1);

    setResultSnapshot({
      accuracy: metrics.accuracy,
      altitudeKilometers: finalAltitudeKilometers,
      elapsedSeconds: metrics.elapsedSeconds,
      flightProgress: finalFlightProgress,
      layerName: getAtmosphereLayer(finalFlightProgress).name,
      mistakes: metrics.mistakes,
      typedProgress: metrics.typedProgress,
      wpm: metrics.wpm,
    });
    setFlightAltitudeKilometers(finalAltitudeKilometers);
  }, [metrics, recentSpeed.recentWpm, resultSnapshot]);

  const restart = () => {
    isResultFrozenRef.current = false;
    setResultSnapshot(null);
    setResetKey((currentResetKey) => currentResetKey + 1);
    setFlightAltitudeKilometers(0);
    flightStateRef.current = {
      altitudeKilometers: 0,
      velocityPxPerSecond: 0,
    };
    reset();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleTypingKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (isSettingsModalOpen) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      restart();
      return;
    }

    if (metrics.isComplete) {
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      deleteCharacter();
      return;
    }

    if (event.key.length === 1 && input.length < targetText.length) {
      event.preventDefault();
      typeCharacter(event.key);
    }
  };

  const statCards = [
    { label: "Speed", value: resultSnapshot?.wpm ?? metrics.wpm, suffix: "wpm", glyph: "↗" },
    { label: "Accuracy", value: resultSnapshot?.accuracy ?? metrics.accuracy, suffix: "%", glyph: "◎" },
    { label: "Altitude", value: resultAltitudeKilometers, suffix: "km", glyph: "△" },
    { label: "Mistakes", value: resultSnapshot?.mistakes ?? metrics.mistakes, suffix: "", glyph: "!" },
  ];

  return (
    <main
      className={`monochrome-hero atmosphere-${layer.id} relative h-[100dvh] overflow-hidden text-ink`}
      onClick={() => inputRef.current?.focus()}
      onKeyDown={handleTypingKeyDown}
    >
      <div className="atmosphere-wash fixed inset-0 z-[1]" />
      <CommandPalette />
      <CustomTextModal />

      <SkyMotion
        altitudeKilometers={metrics.altitudeKilometers}
        isPaused={resultSnapshot !== null}
        onFlightStateChange={handleFlightStateChange}
        recentWpm={recentSpeed.recentWpm}
        lastKeystrokeAt={recentSpeed.lastKeystrokeAt}
        resetKey={resetKey}
      />

      <textarea
        aria-label="Typing input"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="sr-only"
        onChange={(event) => handleInputChange(event.target.value)}
        ref={inputRef}
        spellCheck={false}
        value={input}
      />

      {metrics.isComplete ? (
        <section ref={resultsRef} className="results-page fixed inset-0 z-40 overflow-y-auto px-4 py-4 sm:px-6 md:px-10">
          <div className="results-topbar mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img className="brand-rocket" src={ROCKET_ASSETS.calm} alt="" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-ink">
                  mission report
                </p>
                <h1 className="doodle-font text-2xl font-black tracking-tight">TypeRocket</h1>
              </div>
            </div>
            <button className="doodle-pill flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black" onClick={restart} type="button">
              <RotateCcw className="h-4 w-4" />
              restart
            </button>
          </div>

          <div className="results-layout mx-auto grid min-h-[calc(100dvh-96px)] w-full max-w-7xl items-center gap-7 py-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="results-rocket-panel">
              <Rocket
                progress={resultFlightProgress}
                intensity={1}
                isComplete={metrics.isComplete}
                recentWpm={recentSpeed.recentWpm}
                resetKey={resetKey}
              />
            </div>

            <CardContainer className="results-card-container">
              <CardBody className="mission-report">
                <CardItem translateZ={24}>
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-muted-ink">
                    flight logged
                  </p>
                </CardItem>
                <CardItem translateZ={34}>
                  <h2 className="doodle-font mt-2 text-[clamp(2.65rem,6vw,5.6rem)] font-black leading-none">
                    Mission complete.
                  </h2>
                </CardItem>
                <CardItem translateZ={26}>
                  <p className="mt-3 max-w-2xl text-base font-black text-soft-ink md:text-lg">
                    The rocket coasted to {resultAltitudeKilometers} km and reached{" "}
                    {resultLayerName}.
                  </p>
                </CardItem>

                <CardItem translateZ={12} className="mission-progress mt-5">
                  <div className="mission-progress__bar">
                    <span style={{ width: `${Math.round(resultFlightProgress * 100)}%` }} />
                  </div>
                  <div className="mission-progress__labels">
                    <span>Launch</span>
                    <strong>{resultAltitudeKilometers} km</strong>
                    <span>{resultLayerName}</span>
                  </div>
                </CardItem>

                <div className="result-stat-grid mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
                  {statCards.map((stat, index) => {
                    return (
                      <CardItem className="result-stat" key={stat.label} translateZ={index % 2 === 0 ? 18 : 24}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-ink">
                            {stat.label}
                          </p>
                          <span className="text-xl text-muted-ink" aria-hidden="true">
                            {stat.glyph}
                          </span>
                        </div>
                        <p className="mt-3 font-black leading-none">
                          <span className="text-3xl md:text-4xl">{stat.value}</span>
                          {stat.suffix && <span className="ml-2 text-lg text-muted-ink">{stat.suffix}</span>}
                        </p>
                      </CardItem>
                    );
                  })}
                </div>

                {/* SVG Live WPM Chart */}
                <CardItem translateZ={28} className="mt-5 mb-5">
                  <WpmChart history={wpmHistory} wpm={resultSnapshot?.wpm ?? metrics.wpm} accuracy={resultSnapshot?.accuracy ?? metrics.accuracy} />
                </CardItem>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <CardItem className="result-mini" translateZ={12}>
                    <p>Time</p>
                    <strong>{formatTime(resultSnapshot?.elapsedSeconds ?? metrics.elapsedSeconds)}</strong>
                  </CardItem>
                  <CardItem className="result-mini" translateZ={16}>
                    <p>Typed</p>
                    <strong>{Math.round((resultSnapshot?.typedProgress ?? metrics.typedProgress) * 100)}%</strong>
                  </CardItem>
                  <CardItem className="result-mini" translateZ={20}>
                    <p>Layer</p>
                    <strong>{resultLayerName}</strong>
                  </CardItem>
                </div>

                <CardItem translateZ={24}>
                  <button className="doodle-pill mt-5 w-full rounded-full px-8 py-3 font-black" onClick={restart} type="button">
                    press enter or restart
                  </button>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </section>
      ) : (
        <>
          <HUD metrics={metrics} isStarted={isTyping} isComplete={metrics.isComplete} />

          {/* Top Title & Control Navigation Bar */}
          <nav className="site-nav relative z-50 flex items-center justify-between px-4 py-3 sm:px-6 md:px-12 md:py-4">
            <div className="flex items-center gap-3">
              <img className="brand-rocket" src={ROCKET_ASSETS.calm} alt="" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-ink">
                  launch typing
                </p>
                <h1 className="doodle-font text-2xl font-black tracking-tight">TypeRocket</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="doodle-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
                onClick={() => setSettingsModalOpen(true)}
                type="button"
                title="Settings (ESC)"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                className="doodle-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
                onClick={(event) => {
                  event.stopPropagation();
                  restart();
                }}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                restart
              </button>
            </div>
          </nav>

          {/* MonkeyBar Mode Selector Container: Prominent on home screen, fades out when typing */}
          <div className={`transition-all duration-300 ease-out pt-1 px-4 relative z-40 ${isTyping ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100 translate-y-0"}`}>
            <MonkeyBar />
          </div>

          {/* Rocket Stage Container - Perfectly Positioned */}
          <section className="home-rocket-shell pointer-events-none absolute inset-x-0 top-[20vh] z-20 flex justify-center">
            <div className="rocket-stage relative h-[42vh] w-full max-w-5xl">
              <Rocket
                progress={flightProgress}
                intensity={motionIntensity}
                isComplete={metrics.isComplete}
                recentWpm={recentSpeed.recentWpm}
                resetKey={resetKey}
              />
            </div>
          </section>

          {/* Typing Panel - Elevated with Generous Bottom Spacing */}
          <section className="typing-panel relative z-30 flex h-[calc(100dvh-140px)] flex-col justify-end px-4 pb-[11vh] sm:px-6 md:px-12 md:pb-[14vh]">
            <div className="mx-auto w-full max-w-[1120px]">
              <div className={`hud-row mb-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-6 sm:text-sm transition-opacity ${isTyping ? "opacity-0" : "opacity-100"}`}>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">↯</span>
                  {Math.round(motionIntensity * 100)}% thrust
                </span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">◷</span>
                  {formatTime(metrics.elapsedSeconds)}
                </span>
                <span>{metrics.wpm} wpm</span>
                <span>{recentSpeed.recentWpm} recent</span>
                <span>{metrics.accuracy}% acc</span>
                <span>{displayAltitudeKilometers} km altitude</span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-10 opacity-60">
                  <span className="animate-pulse text-lg font-black tracking-widest text-muted-ink uppercase">Receiving transmission...</span>
                </div>
              ) : (
                <TypingText targetText={targetText} statuses={characterStatuses} cursorIndex={input.length} />
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
