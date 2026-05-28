import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import {
  ALTITUDE_ASSETS,
  ALTITUDE_BACKGROUND_LAYERS,
  ALTITUDE_MOTION_CONFIG,
  GRID_VISUAL_CONFIG,
  type AltitudeAssetConfig,
  type AltitudeBackgroundLayer,
} from "../altitude/altitudeWorld";

type SkyMotionProps = {
  altitudeKilometers: number;
  isPaused?: boolean;
  onFlightStateChange?: (state: {
    altitudeKilometers: number;
    velocityPxPerSecond: number;
  }) => void;
  onDisplayedAltitudeChange?: (altitudeKilometers: number) => void;
  recentWpm: number;
  resetKey: number;
};

type RenderedAltitudeAsset = AltitudeAssetConfig & {
  leftPercent: number;
  rotation: number;
  size: number;
  worldY: number;
};

type RgbColor = {
  b: number;
  g: number;
  r: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function getSidePosition(asset: AltitudeAssetConfig, random: () => number) {
  if (asset.side === "left") {
    return 10 + random() * 26;
  }

  if (asset.side === "right") {
    return 64 + random() * 26;
  }

  return 12 + random() * 76;
}

function getAssetRotation(asset: AltitudeAssetConfig, random: () => number) {
  const [min, max] = asset.rotationRange;
  return Math.round(min + random() * (max - min));
}

function getAssetSize(asset: AltitudeAssetConfig, random: () => number) {
  return Math.round(asset.minSize + random() * (asset.maxSize - asset.minSize));
}

function hexToRgb(hexColor: string): RgbColor {
  const normalizedColor = hexColor.replace("#", "");
  const colorValue = Number.parseInt(normalizedColor, 16);

  return {
    r: (colorValue >> 16) & 255,
    g: (colorValue >> 8) & 255,
    b: colorValue & 255,
  };
}

function interpolateNumber(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function interpolateRgb(start: RgbColor, end: RgbColor, amount: number) {
  return {
    r: Math.round(interpolateNumber(start.r, end.r, amount)),
    g: Math.round(interpolateNumber(start.g, end.g, amount)),
    b: Math.round(interpolateNumber(start.b, end.b, amount)),
  };
}

function getAltitudeLayerPair(altitudeKilometers: number) {
  const sortedLayers = [...ALTITUDE_BACKGROUND_LAYERS].sort(
    (firstLayer, secondLayer) => firstLayer.altitudeKm - secondLayer.altitudeKm,
  );
  const nextLayerIndex = sortedLayers.findIndex((layer) => {
    return layer.altitudeKm >= altitudeKilometers;
  });

  if (nextLayerIndex <= 0) {
    return {
      from: sortedLayers[0],
      to: sortedLayers[0],
      amount: 0,
    };
  }

  if (nextLayerIndex === -1) {
    const lastLayer = sortedLayers[sortedLayers.length - 1];
    return {
      from: lastLayer,
      to: lastLayer,
      amount: 0,
    };
  }

  const from = sortedLayers[nextLayerIndex - 1];
  const to = sortedLayers[nextLayerIndex];
  const layerDistance = to.altitudeKm - from.altitudeKm || 1;

  return {
    from,
    to,
    amount: clamp((altitudeKilometers - from.altitudeKm) / layerDistance, 0, 1),
  };
}

function getInterpolatedLayer(altitudeKilometers: number): AltitudeBackgroundLayer {
  const { amount, from, to } = getAltitudeLayerPair(altitudeKilometers);
  const background = interpolateRgb(hexToRgb(from.backgroundColor), hexToRgb(to.backgroundColor), amount);
  const dot = interpolateRgb(hexToRgb(from.dotColor), hexToRgb(to.dotColor), amount);

  return {
    altitudeKm: altitudeKilometers,
    backgroundColor: `rgb(${background.r} ${background.g} ${background.b})`,
    dotColor: `rgb(${dot.r} ${dot.g} ${dot.b})`,
    dotOpacity: interpolateNumber(from.dotOpacity, to.dotOpacity, amount),
  };
}

function getColorWithAlpha(color: string, alpha: number) {
  return color.replace(")", ` / ${alpha.toFixed(3)})`);
}

function getSpeedFromRecentWpm(recentWpm: number) {
  const {
    maximumSpeedPxPerSecond,
    minimumRecentWpm,
    minimumSpeedPxPerSecond,
    speedCurveExponent,
    speedWpmRange,
  } = ALTITUDE_MOTION_CONFIG;

  if (recentWpm < minimumRecentWpm) {
    return 0;
  }

  const speedProgress = clamp((recentWpm - minimumRecentWpm) / speedWpmRange, 0, 1);
  const curvedProgress = Math.pow(speedProgress, speedCurveExponent);
  return interpolateNumber(minimumSpeedPxPerSecond, maximumSpeedPxPerSecond, curvedProgress);
}

export function SkyMotion({
  altitudeKilometers,
  isPaused = false,
  onFlightStateChange,
  onDisplayedAltitudeChange,
  recentWpm,
  resetKey,
}: SkyMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const maxTargetOffsetRef = useRef(0);
  const recentWpmRef = useRef(0);
  const isPausedRef = useRef(isPaused);
  const onFlightStateChangeRef = useRef(onFlightStateChange);
  const onDisplayedAltitudeChangeRef = useRef(onDisplayedAltitudeChange);
  const previousResetKeyRef = useRef(resetKey);
  const lastReportedAltitudeRef = useRef(-1);

  const renderedAssets = useMemo<RenderedAltitudeAsset[]>(() => {
    return ALTITUDE_ASSETS.map((asset) => {
      const random = createSeededRandom(asset.seed);

      return {
        ...asset,
        leftPercent: getSidePosition(asset, random),
        rotation: getAssetRotation(asset, random),
        size: getAssetSize(asset, random),
        worldY: asset.altitudeKm * ALTITUDE_MOTION_CONFIG.pixelsPerKm,
      };
    });
  }, []);

  const cancelAnimation = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const reportAltitude = (altitude: number) => {
    const roundedAltitude = Math.max(Math.round(altitude * 10) / 10, 0);

    if (roundedAltitude === lastReportedAltitudeRef.current) {
      return;
    }

    lastReportedAltitudeRef.current = roundedAltitude;
    onDisplayedAltitudeChangeRef.current?.(roundedAltitude);
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

      const lastTime = lastTimeRef.current ?? time;
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTimeRef.current = time;

      const currentOffset = offsetRef.current;
      const cappedTypingSpeed = Math.min(
        getSpeedFromRecentWpm(recentWpmRef.current),
        GRID_VISUAL_CONFIG.maximumSpeedPxPerSecond,
      );
      const targetSpeed = isPausedRef.current ? 0 : cappedTypingSpeed;
      const nextVelocity =
        targetSpeed >= velocityRef.current
          ? velocityRef.current +
            (targetSpeed - velocityRef.current) *
              (1 - Math.exp(-ALTITUDE_MOTION_CONFIG.accelerationSmoothing * deltaSeconds))
          : Math.max(
              targetSpeed,
              velocityRef.current -
                ALTITUDE_MOTION_CONFIG.coastDecelerationPxPerSecondSquared * deltaSeconds,
            );
      const nextOffset = currentOffset + nextVelocity * deltaSeconds;
      const displayedAltitude = nextOffset / ALTITUDE_MOTION_CONFIG.pixelsPerKm;
      const interpolatedLayer = getInterpolatedLayer(displayedAltitude);

      offsetRef.current = nextOffset;
      velocityRef.current =
        targetSpeed === 0 && nextVelocity <= ALTITUDE_MOTION_CONFIG.stopVelocityPxPerSecond
          ? 0
          : nextVelocity;

      const thrust = clamp(velocityRef.current / GRID_VISUAL_CONFIG.maximumSpeedPxPerSecond, 0, 1);
      root.style.setProperty("--sky-offset", `${nextOffset.toFixed(2)}px`);
      root.style.setProperty("--grid-offset", `${nextOffset.toFixed(2)}px`);
      root.style.setProperty("--sky-thrust", `${thrust.toFixed(3)}`);
      root.style.setProperty("--sky-background", interpolatedLayer.backgroundColor);
      root.style.setProperty(
        "--grid-dot",
        getColorWithAlpha(interpolatedLayer.dotColor, interpolatedLayer.dotOpacity),
      );
      onFlightStateChangeRef.current?.({
        altitudeKilometers: displayedAltitude,
        velocityPxPerSecond: velocityRef.current,
      });
      reportAltitude(displayedAltitude);

      const shouldKeepMoving =
        (!isPausedRef.current && targetSpeed > 0) ||
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
    onDisplayedAltitudeChangeRef.current = onDisplayedAltitudeChange;
  }, [onDisplayedAltitudeChange]);

  useEffect(() => {
    onFlightStateChangeRef.current = onFlightStateChange;
  }, [onFlightStateChange]);

  useEffect(() => {
    return cancelAnimation;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const nextTargetOffset = altitudeKilometers * ALTITUDE_MOTION_CONFIG.pixelsPerKm;

    if (previousResetKeyRef.current !== resetKey) {
      previousResetKeyRef.current = resetKey;
      maxTargetOffsetRef.current = nextTargetOffset;
      targetOffsetRef.current = nextTargetOffset;
      offsetRef.current = nextTargetOffset;
      velocityRef.current = 0;
      lastTimeRef.current = null;
      cancelAnimation();

      const resetLayer = getInterpolatedLayer(altitudeKilometers);
      root?.style.setProperty("--sky-offset", `${nextTargetOffset.toFixed(2)}px`);
      root?.style.setProperty("--grid-offset", `${nextTargetOffset.toFixed(2)}px`);
      root?.style.setProperty("--sky-thrust", "0");
      root?.style.setProperty("--sky-background", resetLayer.backgroundColor);
      root?.style.setProperty("--grid-dot", getColorWithAlpha(resetLayer.dotColor, resetLayer.dotOpacity));
      onFlightStateChangeRef.current?.({
        altitudeKilometers,
        velocityPxPerSecond: 0,
      });
      reportAltitude(altitudeKilometers);
      return;
    }

    maxTargetOffsetRef.current = Math.max(maxTargetOffsetRef.current, nextTargetOffset);
    targetOffsetRef.current = maxTargetOffsetRef.current;
    startAnimation();
  }, [altitudeKilometers, resetKey]);

  useEffect(() => {
    recentWpmRef.current = recentWpm;
    isPausedRef.current = isPaused;

    if (isPaused) {
      velocityRef.current = 0;
      cancelAnimation();
      onFlightStateChangeRef.current?.({
        altitudeKilometers: offsetRef.current / ALTITUDE_MOTION_CONFIG.pixelsPerKm,
        velocityPxPerSecond: 0,
      });
      reportAltitude(offsetRef.current / ALTITUDE_MOTION_CONFIG.pixelsPerKm);
      return;
    }

    startAnimation();
  }, [isPaused, recentWpm]);

  return (
    <div
      aria-hidden="true"
      className="sky-motion"
      ref={rootRef}
      style={
        {
          "--grid-dot-size": `${GRID_VISUAL_CONFIG.dotSizePx}px`,
          "--grid-dot-stop": `${GRID_VISUAL_CONFIG.dotTransparentStopPx}px`,
          "--grid-size": `${GRID_VISUAL_CONFIG.spacingPx}px`,
          "--grid-base-opacity": GRID_VISUAL_CONFIG.baseOpacity,
          "--grid-thrust-opacity-boost": GRID_VISUAL_CONFIG.thrustOpacityBoost,
        } as CSSProperties
      }
    >
      <div className="moving-grid" />
      <div className="altitude-world">
        {renderedAssets.map((asset) => {
          return (
            <span
              className="altitude-asset"
              key={asset.id}
              style={
                {
                  "--asset-rotation": `${asset.rotation}deg`,
                  "--asset-size": `${asset.size}px`,
                  left: `${asset.leftPercent}%`,
                  top: `calc(50% - ${asset.worldY}px)`,
                } as CSSProperties
              }
            >
              <img alt="" className="altitude-asset__image" draggable={false} src={asset.src} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
