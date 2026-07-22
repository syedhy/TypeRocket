import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CodeLanguage } from "../config/codeSnippets";

export type GameModeType = "time" | "words" | "quote" | "code" | "custom";
export type TextType = "words" | "code" | "quotes" | "custom";
export type Difficulty = "easy" | "medium" | "hard";
export type SoundProfile = "default" | "typewriter" | "clicky" | "soft" | "silent";
export type Theme = "doodle" | "cyberpunk" | "dark-nebula" | "sunset" | "nord" | "dracula";

export interface GameMode {
  type: GameModeType;
  value: number; // e.g. 15 for 15s time, or 25 for 25 words
}

interface GameSettingsContextValue {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  textType: TextType;
  setTextType: (type: TextType) => void;
  codeLanguage: CodeLanguage;
  setCodeLanguage: (lang: CodeLanguage) => void;
  includePunctuation: boolean;
  setIncludePunctuation: (val: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (val: boolean) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundProfile: SoundProfile;
  setSoundProfile: (profile: SoundProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customText: string;
  setCustomText: (text: string) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isOpen: boolean) => void;
  isCustomTextModalOpen: boolean;
  setCustomTextModalOpen: (isOpen: boolean) => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<GameMode>({ type: "words", value: 30 });
  const [textType, setTextType] = useState<TextType>("words");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("javascript");
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>("default");
  const [theme, setTheme] = useState<Theme>("doodle");
  const [customText, setCustomText] = useState<string>("");
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isCustomTextModalOpen, setCustomTextModalOpen] = useState(false);

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <GameSettingsContext.Provider
      value={{
        mode,
        setMode,
        textType,
        setTextType,
        codeLanguage,
        setCodeLanguage,
        includePunctuation,
        setIncludePunctuation,
        includeNumbers,
        setIncludeNumbers,
        difficulty,
        setDifficulty,
        soundEnabled,
        setSoundEnabled,
        soundProfile,
        setSoundProfile,
        theme,
        setTheme,
        customText,
        setCustomText,
        isSettingsModalOpen,
        setSettingsModalOpen,
        isCustomTextModalOpen,
        setCustomTextModalOpen,
      }}
    >
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
