import type { AtmosphereLayer } from "../types/game";

export const ATMOSPHERE_LAYERS: AtmosphereLayer[] = [
  {
    id: "launch-zone",
    name: "Launch Zone",
    range: [0, 20],
  },
  {
    id: "troposphere",
    name: "Troposphere",
    range: [20, 45],
  },
  {
    id: "stratosphere",
    name: "Stratosphere",
    range: [45, 70],
  },
  {
    id: "mesosphere",
    name: "Mesosphere",
    range: [70, 90],
  },
  {
    id: "space",
    name: "Space",
    range: [90, 100],
  },
];

export function getAtmosphereLayer(progress: number): AtmosphereLayer {
  const progressPercent = progress * 100;

  return (
    ATMOSPHERE_LAYERS.find((layer) => {
      return progressPercent >= layer.range[0] && progressPercent <= layer.range[1];
    }) ?? ATMOSPHERE_LAYERS[ATMOSPHERE_LAYERS.length - 1]
  );
}
