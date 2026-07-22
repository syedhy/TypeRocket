import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CodeLanguage } from "../config/codeSnippets";

export type GameModeType = "time" | "words" | "quote" | "code" | "custom";
export type TextType = "words" | "code" | "quotes" | "custom";
export type Difficulty = "easy" | "medium" | "hard";
export type SoundProfile = "default" | "typewriter" | "clicky" | "soft" | "silent";
export type Theme = "doodle" | "cyberpunk" | "dark-nebula" | "sunset" | "nord" | "dracula";
export type FontFamily = "doodle" | "jetbrains" | "firacode" | "inter" | "playfair";
export type CaretStyle = "line" | "block" | "underline" | "pulse";
export type QuickRestartKey = "tab" | "enter" | "esc";

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
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  caretStyle: CaretStyle;
  setCaretStyle: (style: CaretStyle) => void;
  smoothCaret: boolean;
  setSmoothCaret: (val: boolean) => void;
  blindMode: boolean;
  setBlindMode: (val: boolean) => void;
  masterMode: boolean;
  setMasterMode: (val: boolean) => void;
  quickRestartKey: QuickRestartKey;
  setQuickRestartKey: (key: QuickRestartKey) => void;
  customText: string;
  setCustomText: (text: string) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isOpen: boolean) => void;
  isCustomTextModalOpen: boolean;
  setCustomTextModalOpen: (isOpen: boolean) => void;
}

const STORAGE_KEY = "typerocket_user_settings_v2";

const GameSettingsContext = createContext<GameSettingsContextValue | undefined>(undefined);

function getInitialSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        mode: parsed.mode ?? { type: "words", value: 25 },
        textType: parsed.textType ?? "words",
        codeLanguage: parsed.codeLanguage ?? "javascript",
        includePunctuation: parsed.includePunctuation ?? false,
        includeNumbers: parsed.includeNumbers ?? false,
        difficulty: parsed.difficulty ?? "medium",
        soundEnabled: parsed.soundEnabled ?? false,
        soundProfile: parsed.soundProfile ?? "silent",
        theme: parsed.theme ?? "doodle",
        fontFamily: parsed.fontFamily ?? "doodle",
        caretStyle: parsed.caretStyle ?? "line",
        smoothCaret: parsed.smoothCaret ?? true,
        blindMode: parsed.blindMode ?? false,
        masterMode: parsed.masterMode ?? false,
        quickRestartKey: parsed.quickRestartKey ?? "tab",
      };
    }
  } catch (e) {
    console.warn("Failed to load settings from localStorage:", e);
  }

  return {
    mode: { type: "words", value: 25 },
    textType: "words",
    codeLanguage: "javascript",
    includePunctuation: false,
    includeNumbers: false,
    difficulty: "medium",
    soundEnabled: false,
    soundProfile: "silent",
    theme: "doodle",
    fontFamily: "doodle",
    caretStyle: "line",
    smoothCaret: true,
    blindMode: false,
    masterMode: false,
    quickRestartKey: "tab",
  };
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const initial = getInitialSettings();

  const [mode, setMode] = useState<GameMode>(initial.mode);
  const [textType, setTextType] = useState<TextType>(initial.textType as TextType);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>(initial.codeLanguage as CodeLanguage);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(initial.includePunctuation);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(initial.includeNumbers);
  const [difficulty, setDifficulty] = useState<Difficulty>(initial.difficulty as Difficulty);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initial.soundEnabled);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(initial.soundProfile as SoundProfile);
  const [theme, setTheme] = useState<Theme>(initial.theme as Theme);
  const [fontFamily, setFontFamily] = useState<FontFamily>(initial.fontFamily as FontFamily);
  const [caretStyle, setCaretStyle] = useState<CaretStyle>(initial.caretStyle as CaretStyle);
  const [smoothCaret, setSmoothCaret] = useState<boolean>(initial.smoothCaret);
  const [blindMode, setBlindMode] = useState<boolean>(initial.blindMode);
  const [masterMode, setMasterMode] = useState<boolean>(initial.masterMode);
  const [quickRestartKey, setQuickRestartKey] = useState<QuickRestartKey>(initial.quickRestartKey as QuickRestartKey);
  const [customText, setCustomText] = useState<string>("");
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isCustomTextModalOpen, setCustomTextModalOpen] = useState(false);

  // Apply theme & font class to document body
  useEffect(() => {
    document.body.className = `theme-${theme} font-${fontFamily}`;
  }, [theme, fontFamily]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode,
          textType,
          codeLanguage,
          includePunctuation,
          includeNumbers,
          difficulty,
          soundEnabled,
          soundProfile,
          theme,
          fontFamily,
          caretStyle,
          smoothCaret,
          blindMode,
          masterMode,
          quickRestartKey,
        })
      );
    } catch (e) {
      console.warn("Failed to save settings to localStorage:", e);
    }
  }, [
    mode,
    textType,
    codeLanguage,
    includePunctuation,
    includeNumbers,
    difficulty,
    soundEnabled,
    soundProfile,
    theme,
    fontFamily,
    caretStyle,
    smoothCaret,
    blindMode,
    masterMode,
    quickRestartKey,
  ]);

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
        fontFamily,
        setFontFamily,
        caretStyle,
        setCaretStyle,
        smoothCaret,
        setSmoothCaret,
        blindMode,
        setBlindMode,
        masterMode,
        setMasterMode,
        quickRestartKey,
        setQuickRestartKey,
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
