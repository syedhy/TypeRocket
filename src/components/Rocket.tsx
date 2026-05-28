import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { ALTITUDE_MOTION_CONFIG } from "../altitude/altitudeWorld";
import { ROCKET_ASSETS } from "../config/assets";

type RocketProps = {
  progress: number;
  intensity: number;
  isComplete: boolean;
  recentWpm?: number;
  resetKey?: number;
};

export function Rocket({ progress, intensity, isComplete, resetKey = 0 }: RocketProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const currentLiftRef = useRef(progress * ALTITUDE_MOTION_CONFIG.rocketLiftPx);
  const velocityRef = useRef(0);
  const maxProgressRef = useRef(progress);
  const isCompleteRef = useRef(isComplete);
  const previousResetKeyRef = useRef(resetKey);

  const cancelAnimation = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const startAnimation = () => {
    if (frameRef.current !== null) {
      return;
    }

    lastTimeRef.current = null;

    const tick = (time: number) => {
      const root = rootRef.current;

      if (!root) {
        frameRef.current = null;
        return;
      }

      const targetLift = maxProgressRef.current * ALTITUDE_MOTION_CONFIG.rocketLiftPx;
      const currentLift = currentLiftRef.current;
      const distance = Math.max(targetLift - currentLift, 0);
      const lastTime = lastTimeRef.current ?? time;
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      const speedLimit = isCompleteRef.current
        ? ALTITUDE_MOTION_CONFIG.rocketMaximumSpeedPxPerSecond * 1.8
        : ALTITUDE_MOTION_CONFIG.rocketMaximumSpeedPxPerSecond;
      const targetSpeed =
        distance > ALTITUDE_MOTION_CONFIG.stopDistancePx
          ? Math.min(speedLimit, distance * ALTITUDE_MOTION_CONFIG.distanceCatchupFactor)
          : 0;
      const nextVelocity =
        targetSpeed >= velocityRef.current
          ? velocityRef.current +
            (targetSpeed - velocityRef.current) *
              (1 - Math.exp(-ALTITUDE_MOTION_CONFIG.accelerationSmoothing * deltaSeconds))
          : Math.max(
              targetSpeed,
              velocityRef.current -
                ALTITUDE_MOTION_CONFIG.rocketCoastDecelerationPxPerSecondSquared * deltaSeconds,
            );
      const nextLift = Math.min(currentLift + nextVelocity * deltaSeconds, targetLift);

      lastTimeRef.current = time;
      currentLiftRef.current = nextLift;
      velocityRef.current =
        targetLift - nextLift <= ALTITUDE_MOTION_CONFIG.stopDistancePx &&
        nextVelocity <= ALTITUDE_MOTION_CONFIG.stopVelocityPxPerSecond
          ? 0
          : nextVelocity;
      root.style.setProperty("--rocket-lift", `${nextLift.toFixed(2)}px`);

      const shouldKeepMoving =
        (targetSpeed > 0 && targetLift - nextLift > ALTITUDE_MOTION_CONFIG.stopDistancePx) ||
        velocityRef.current > ALTITUDE_MOTION_CONFIG.stopVelocityPxPerSecond;

      if (shouldKeepMoving) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      frameRef.current = null;
      lastTimeRef.current = null;
    };

    frameRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    return cancelAnimation;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const nextTargetLift = progress * ALTITUDE_MOTION_CONFIG.rocketLiftPx;

    isCompleteRef.current = isComplete;

    if (previousResetKeyRef.current !== resetKey) {
      previousResetKeyRef.current = resetKey;
      maxProgressRef.current = progress;
      currentLiftRef.current = nextTargetLift;
      velocityRef.current = 0;
      lastTimeRef.current = null;
      root?.style.setProperty("--rocket-lift", `${nextTargetLift.toFixed(2)}px`);
      cancelAnimation();

      return;
    }

    maxProgressRef.current = Math.max(maxProgressRef.current, progress);
    startAnimation();
  }, [isComplete, progress, resetKey]);

  const poweredOpacity = Math.min(intensity * 1.15 + (isComplete ? 0.35 : 0), 1);

  return (
    <div
      className="rocket-flight"
      ref={rootRef}
      style={{
        "--rocket-lift": `${currentLiftRef.current.toFixed(2)}px`,
      } as CSSProperties}
    >
      <div className="rocket-image-shell relative mx-auto aspect-[0.74/1] w-full">
        <img
          alt="Doodle rocket"
          className="rocket-art absolute inset-0 block h-full w-full object-contain"
          draggable={false}
          src={ROCKET_ASSETS.calm}
        />
        <img
          alt=""
          aria-hidden="true"
          className="rocket-art rocket-art--powered absolute inset-0 block h-full w-full object-contain"
          draggable={false}
          src={ROCKET_ASSETS.powered}
          style={{ opacity: poweredOpacity }}
        />
      </div>
    </div>
  );
}
