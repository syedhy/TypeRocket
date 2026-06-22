import type { AtmosphereLayer } from "../types/game";

export const ATMOSPHERE_LAYERS: AtmosphereLayer[] = [
  { id: "atmosphere", name: "Atmosphere", range: [0, 1] },
  { id: "low-earth-orbit", name: "Low Earth Orbit", range: [1, 5] },
  { id: "medium-earth-orbit", name: "Medium Earth Orbit", range: [5, 15] },
  { id: "high-earth-orbit", name: "High Earth Orbit", range: [15, 35] },
  { id: "lunar-trajectory", name: "Lunar Trajectory", range: [35, 65] },
  { id: "deep-space", name: "Deep Space", range: [65, 100] },
];

export function getAtmosphereLayer(progress: number): AtmosphereLayer {
  const progressPercent = progress * 100;

  return (
    ATMOSPHERE_LAYERS.find((layer) => {
      return progressPercent >= layer.range[0] && progressPercent <= layer.range[1];
    }) ?? ATMOSPHERE_LAYERS[ATMOSPHERE_LAYERS.length - 1]
  );
}
