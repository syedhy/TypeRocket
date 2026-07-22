export type AtmosphereLayerId =
  | "atmosphere"
  | "low-earth-orbit"
  | "medium-earth-orbit"
  | "high-earth-orbit"
  | "lunar-trajectory"
  | "deep-space";

export type AtmosphereLayer = {
  id: AtmosphereLayerId;
  name: string;
  range: [number, number];
};

export type CharacterStatus = "correct" | "incorrect" | "current" | "pending";

export type TypingMetrics = {
  elapsedSeconds: number;
  correctCharacters: number;
  mistakes: number;
  totalTypedCharacters: number;
  wpm: number;
  accuracy: number;
  progress: number;
  typedProgress: number;
  altitudeProgress: number;
  altitudeKilometers: number;
  atmosphereLevelReached: string;
  isComplete: boolean;
  remainingLabel: string;
  remainingValue: string;
};
