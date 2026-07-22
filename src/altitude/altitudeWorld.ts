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

// Curated high-res transparent space assets from NASA & Google Noto High Definition vectors
const SPACE_ASSETS_POOL = [
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f30d.png", title: "Earth" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f315.png", title: "Moon" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1fa90.png", title: "Saturn Ring" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f30c.png", title: "Milky Way Galaxy" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f6f0.png", title: "Space Station" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f320.png", title: "Shooting Star" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f47d.png", title: "Cosmic Alien" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u2604.png", title: "Halley's Comet" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f6f8.png", title: "UFO Craft" },
  { src: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f468_200d_1f680.png", title: "Spacewalker" },
];

export async function fetchAltitudeAssets(): Promise<AltitudeAssetConfig[]> {
  let nasaImages: string[] = [];

  try {
    // Attempt fetching live high-res imagery from NASA Official Open Images API
    const res = await fetch("https://images-api.nasa.gov/search?q=nebula+galaxy+planet&media_type=image&page_size=25");
    if (res.ok) {
      const data = await res.json();
      const items = data?.collection?.items || [];
      nasaImages = items
        .map((item: any) => item?.links?.[0]?.href)
        .filter((url: string | undefined): url is string => Boolean(url && url.startsWith("http")));
    }
  } catch {
    console.warn("NASA API unavailable, using high-definition curated space pool.");
  }

  const sideOptions: AltitudeAssetSide[] = ["left", "right", "any"];

  return Array.from({ length: 80 }).map((_, i) => {
    const useNasa = nasaImages.length > 0 && Math.random() < 0.4;
    const poolAsset = SPACE_ASSETS_POOL[i % SPACE_ASSETS_POOL.length];
    const imgSrc = useNasa
      ? nasaImages[i % nasaImages.length]
      : poolAsset.src;
    
    const altitudeKm = 50 + i * 120 + Math.pow(i, 2.1) * 2;
    const baseSize = useNasa ? 200 + Math.random() * 180 : 260 + Math.random() * 200;

    return {
      id: `space-asset-${i}`,
      src: imgSrc,
      altitudeKm,
      side: sideOptions[i % sideOptions.length],
      seed: i * 999 + Math.floor(Math.random() * 1000),
      minSize: baseSize,
      maxSize: baseSize + Math.random() * 60,
      rotationRange: [-25, 25],
      title: poolAsset.title,
    };
  });
}
