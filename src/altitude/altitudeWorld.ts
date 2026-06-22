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
  minimumSpeedPxPerSecond: 130, // Slightly increased
  maximumSpeedPxPerSecond: 850, // Slightly increased
  speedWpmRange: 105,
  speedCurveExponent: 1.15,
  minimumScoredWpm: 24,
  fullAltitudeWpm: 120,
  minimumAltitudeMultiplier: 0.24,
  distanceCatchupFactor: 7.2,
  accelerationSmoothing: 4.1,
  decelerationSmoothing: 3.6,
  coastDecelerationPxPerSecondSquared: 20, // Reduced for a more gradual stop
  rocketLiftPx: 64,
  rocketMaximumSpeedPxPerSecond: 38,
  rocketDecelerationSmoothing: 3.4,
  rocketCoastDecelerationPxPerSecondSquared: 2.0, // Reduced for a more gradual stop
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
  { altitudeKm: 0, backgroundColor: "#ffffff", dotColor: "#171717", dotOpacity: 0.16 },
  { altitudeKm: 150, backgroundColor: "#e8e8e6", dotColor: "#0d0d0d", dotOpacity: 0.3 },
  { altitudeKm: 750, backgroundColor: "#b5b5c0", dotColor: "#ffffff", dotOpacity: 0.4 },
  { altitudeKm: 2250, backgroundColor: "#63637a", dotColor: "#ffffff", dotOpacity: 0.5 },
  { altitudeKm: 5250, backgroundColor: "#2e2e42", dotColor: "#ffffff", dotOpacity: 0.7 },
  { altitudeKm: 9750, backgroundColor: "#11111a", dotColor: "#ffffff", dotOpacity: 0.9 },
  { altitudeKm: 15000, backgroundColor: "#000000", dotColor: "#ffffff", dotOpacity: 1.0 },
];

export async function fetchAltitudeAssets(): Promise<AltitudeAssetConfig[]> {
  // Fetching extremely cute, high quality transparent PNGs from Google's Noto Emoji Github CDN
  const EMOJI_IDS = [
    "1f30c", // Milky way
    "1f30d", // Earth
    "1f315", // Full moon
    "1f320", // Shooting star
    "1f468_200d_1f680", // Astronaut
    "1f47d", // Alien
    "1f680", // Rocket
    "1f6f0", // Satellite
    "1f6f8", // Flying saucer
    "1fa90", // Ringed planet
    "2604", // Comet
  ];

  return Array.from({ length: 80 }).map((_, i) => {
    const randomEmoji = EMOJI_IDS[Math.floor(Math.random() * EMOJI_IDS.length)];
    const imgSrc = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u${randomEmoji}.png`;
    const sideOptions: AltitudeAssetSide[] = ["left", "right", "any"];
    
    const altitudeKm = 50 + (i * 120) + Math.pow(i, 2.1) * 2;
    // Increased base sizes so the cute PNGs appear larger and more prominent!
    const baseSize = 250 + Math.random() * 200; // 250px to 450px

    return {
      id: `cute-asset-${i}`,
      src: imgSrc,
      altitudeKm,
      side: sideOptions[Math.floor(Math.random() * sideOptions.length)],
      seed: i * 999 + Math.floor(Math.random() * 1000),
      minSize: baseSize,
      maxSize: baseSize + Math.random() * 50,
      rotationRange: [-30, 30],
    };
  });
}
