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
  title?: string;
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
  minimumSpeedPxPerSecond: 130,
  maximumSpeedPxPerSecond: 850,
  speedWpmRange: 105,
  speedCurveExponent: 1.15,
  minimumScoredWpm: 24,
  fullAltitudeWpm: 120,
  minimumAltitudeMultiplier: 0.24,
  distanceCatchupFactor: 7.2,
  accelerationSmoothing: 4.1,
  decelerationSmoothing: 3.6,
  coastDecelerationPxPerSecondSquared: 20,
  rocketLiftPx: 64,
  rocketMaximumSpeedPxPerSecond: 38,
  rocketDecelerationSmoothing: 3.4,
  rocketCoastDecelerationPxPerSecondSquared: 2.0,
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
  const EMOJI_IDS = [
    { id: "1f30c", title: "Milky Way" },
    { id: "1f30d", title: "Earth" },
    { id: "1f315", title: "Full Moon" },
    { id: "1f320", title: "Shooting Star" },
    { id: "1f468_200d_1f680", title: "Astronaut" },
    { id: "1f47d", title: "Alien" },
    { id: "1f680", title: "Rocket" },
    { id: "1f6f0", title: "Satellite" },
    { id: "1f6f8", title: "Flying Saucer" },
    { id: "1fa90", title: "Ringed Planet" },
    { id: "2604", title: "Comet" },
  ];

  const sideOptions: AltitudeAssetSide[] = ["left", "right", "any"];

  return Array.from({ length: 80 }).map((_, i) => {
    const item = EMOJI_IDS[i % EMOJI_IDS.length];
    const imgSrc = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u${item.id}.png`;
    
    const altitudeKm = 50 + i * 120 + Math.pow(i, 2.1) * 2;
    const baseSize = 250 + Math.random() * 200; // 250px to 450px cute prominent PNGs

    return {
      id: `cute-asset-${i}`,
      src: imgSrc,
      altitudeKm,
      side: sideOptions[i % sideOptions.length],
      seed: i * 999 + Math.floor(Math.random() * 1000),
      minSize: baseSize,
      maxSize: baseSize + Math.random() * 50,
      rotationRange: [-30, 30],
      title: item.title,
    };
  });
}
