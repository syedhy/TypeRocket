import React, { createContext, useContext, useState, ReactNode } from "react";

export type GameModeType = "time" | "words";
export type TextType = "words" | "code" | "quotes";

export interface GameMode {
  type: GameModeType;
  value: number; // e.g. 15 for 15s time, or 25 for 25 words
}

export type Difficulty = "easy" | "medium" | "hard";

interface GameSettingsContextValue {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  textType: TextType;
  setTextType: (type: TextType) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isOpen: boolean) => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<GameMode>({ type: "words", value: 30 });
  const [textType, setTextType] = useState<TextType>("words");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <GameSettingsContext.Provider value={{ mode, setMode, textType, setTextType, difficulty, setDifficulty, soundEnabled, setSoundEnabled, isSettingsModalOpen, setSettingsModalOpen }}>
      {children}
    </GameSettingsContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error("useGameSettings must be used within a GameSettingsProvider");
  }
  return context;
}
