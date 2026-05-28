export type AltitudeAssetSide = "left" | "right" | "any";

export type AltitudeAssetConfig = {
  id: string;
  src: string;
  altitudeKm: number;
  side: AltitudeAssetSide;
  seed: number;
  minSize: number;
  maxSize: number;
  rotationRange: [number, number];
};

export type AltitudeBackgroundLayer = {
  altitudeKm: number;
  backgroundColor: string;
  dotColor: string;
  dotOpacity: number;
};

export const ALTITUDE_MOTION_CONFIG = {
  pixelsPerKm: 10,
  minimumRecentWpm: 30,
  minimumSpeedPxPerSecond: 110,
  maximumSpeedPxPerSecond: 760,
  speedWpmRange: 105,
  speedCurveExponent: 1.15,
  minimumScoredWpm: 24,
  fullAltitudeWpm: 120,
  minimumAltitudeMultiplier: 0.24,
  distanceCatchupFactor: 7.2,
  accelerationSmoothing: 4.1,
  decelerationSmoothing: 3.6,
  coastDecelerationPxPerSecondSquared: 52,
  rocketLiftPx: 64,
  rocketMaximumSpeedPxPerSecond: 38,
  rocketDecelerationSmoothing: 3.4,
  rocketCoastDecelerationPxPerSecondSquared: 4.5,
  stopDistancePx: 0.25,
  stopVelocityPxPerSecond: 3.5,
};

export const GRID_VISUAL_CONFIG = {
  dotSizePx: 1.7,
  dotTransparentStopPx: 1.84,
  spacingPx: 40,
  maximumSpeedPxPerSecond: 760,
  baseOpacity: 0.86,
  thrustOpacityBoost: 0.12,
};

export const ALTITUDE_BACKGROUND_LAYERS: AltitudeBackgroundLayer[] = [
  {
    altitudeKm: 0,
    backgroundColor: "#ffffff",
    dotColor: "#171717",
    dotOpacity: 0.16,
  },
  {
    altitudeKm: 70,
    backgroundColor: "#f8f8f6",
    dotColor: "#171717",
    dotOpacity: 0.2,
  },
  {
    altitudeKm: 130,
    backgroundColor: "#f1f1f0",
    dotColor: "#111111",
    dotOpacity: 0.24,
  },
  {
    altitudeKm: 200,
    backgroundColor: "#e8e8e6",
    dotColor: "#0d0d0d",
    dotOpacity: 0.3,
  },
  {
    altitudeKm: 260,
    backgroundColor: "#dededc",
    dotColor: "#050505",
    dotOpacity: 0.36,
  },
];

export const ALTITUDE_ASSETS: AltitudeAssetConfig[] = [
  // Put image files directly in /public, then add entries here.
  // Example:
  // {
  //   id: "satellite-at-150",
  //   src: "/satellite.png",
  //   altitudeKm: 150,
  //   side: "right",
  //   seed: 117,
  //   minSize: 120,
  //   maxSize: 190,
  //   rotationRange: [-30, 30],
  // },

  {
    id: "satellite-at-50",
    src: "/satellite.png",
    altitudeKm: 70,
    side: "right",
    seed: 117,
    minSize: 200,
    maxSize: 300,
    rotationRange: [-30, 30],
  },
  {
    id: "spaceship-at-100",
    src: "/spaceship.png",
    altitudeKm: 120,
    side: "left",
    seed: 117,
    minSize: 300,
    maxSize: 450,
    rotationRange: [-30, 30],
  },
];
