import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ALTITUDE_MOTION_CONFIG } from "../altitude/altitudeWorld";
import { ROCKET_ASSETS } from "../config/assets";

gsap.registerPlugin(useGSAP);

type RocketProps = {
  progress: number;
  intensity: number;
  isComplete: boolean;
  recentWpm?: number;
  resetKey?: number;
};

export function Rocket({ progress, intensity, isComplete, resetKey = 0 }: RocketProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const maxProgressRef = useRef(progress);
  const previousResetKeyRef = useRef(resetKey);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    if (previousResetKeyRef.current !== resetKey) {
      previousResetKeyRef.current = resetKey;
      maxProgressRef.current = progress;
      const targetLift = progress * ALTITUDE_MOTION_CONFIG.rocketLiftPx;
      gsap.killTweensOf(root);
      gsap.set(root, { "--rocket-lift": `${targetLift}px` });
      return;
    }

    maxProgressRef.current = Math.max(maxProgressRef.current, progress);
    const targetLift = maxProgressRef.current * ALTITUDE_MOTION_CONFIG.rocketLiftPx;
    
    // Dynamic duration based on distance, but clamped to feel responsive
    gsap.to(root, {
      "--rocket-lift": `${targetLift}px`,
      duration: isComplete ? 2 : 0.8,
      ease: isComplete ? "power3.out" : "power2.out",
      overwrite: "auto",
    });

  }, [progress, isComplete, resetKey]);

  // Use GSAP to animate the powered state opacity for a smoother effect
  const poweredRef = useRef<HTMLImageElement>(null);
  const poweredOpacity = Math.min(intensity * 1.15 + (isComplete ? 0.35 : 0), 1);

  useGSAP(() => {
    if (!poweredRef.current) return;
    gsap.to(poweredRef.current, {
      opacity: poweredOpacity,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [poweredOpacity]);

  return (
    <div
      className="rocket-flight"
      ref={rootRef}
      style={{
        "--rocket-lift": `0px`,
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
          ref={poweredRef}
          alt=""
          aria-hidden="true"
          className="rocket-art rocket-art--powered absolute inset-0 block h-full w-full object-contain"
          draggable={false}
          src={ROCKET_ASSETS.powered}
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
