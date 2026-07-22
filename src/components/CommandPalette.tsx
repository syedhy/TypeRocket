import React, { useEffect } from "react";
import { Command } from "cmdk";
import { useGameSettings, Theme, SoundProfile } from "../contexts/GameSettingsContext";
import { CodeLanguage } from "../config/codeSnippets";
import {
  Settings,
  Clock,
  Type,
  Code,
  Quote,
  Volume2,
  VolumeX,
  BookOpen,
  Palette,
  Edit3,
  AtSign,
  Hash,
  Sparkles,
  Zap,
} from "lucide-react";

export function CommandPalette() {
  const {
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
    isSettingsModalOpen,
    setSettingsModalOpen,
    setCustomTextModalOpen,
  } = useGameSettings();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSettingsModalOpen(!isSettingsModalOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSettingsModalOpen, setSettingsModalOpen]);

  if (!isSettingsModalOpen) return null;

  const THEMES: { id: Theme; label: string; desc: string; previewColor: string }[] = [
    { id: "doodle", label: "Doodle Hand", desc: "Classic hand-drawn paper & ink style", previewColor: "#171717" },
    { id: "cyberpunk", label: "Cyberpunk Neon", desc: "High contrast neon grid & vibrant thrust", previewColor: "#00ffcc" },
    { id: "dark-nebula", label: "Dark Nebula", desc: "Deep space darkness with cosmic purple accents", previewColor: "#9333ea" },
    { id: "sunset", label: "Sunset Pink", desc: "Warm dusk palette with soft gradient sky", previewColor: "#f43f5e" },
    { id: "nord", label: "Nordic Frost", desc: "Cool arctic blues and clean slate aesthetic", previewColor: "#38bdf8" },
    { id: "dracula", label: "Dracula Night", desc: "Vampire dark mode with crisp pastel highlights", previewColor: "#ff79c6" },
  ];

  const SOUND_PROFILES: { id: SoundProfile; label: string; desc: string }[] = [
    { id: "default", label: "Standard Keypress", desc: "Classic mechanical key click" },
    { id: "typewriter", label: "Retro Typewriter", desc: "Authentic heavy metallic strike sound" },
    { id: "clicky", label: "Blue Switches", desc: "Tactile high-pitched clicky switch" },
    { id: "soft", label: "Silent Linear", desc: "Subtle cushioned keystroke audio" },
    { id: "silent", label: "Mute All", desc: "No keypress audio feedback" },
  ];

  const CODE_LANGUAGES: { id: CodeLanguage; label: string }[] = [
    { id: "python", label: "Python 3" },
    { id: "javascript", label: "JavaScript (ES6+)" },
    { id: "typescript", label: "TypeScript 5" },
    { id: "java", label: "Java 21" },
    { id: "cpp", label: "C++ 20" },
    { id: "rust", label: "Rust 2024" },
    { id: "go", label: "Go 1.22" },
    { id: "html", label: "HTML5 / JSX" },
    { id: "sql", label: "PostgreSQL / SQL" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh] sm:pt-[10vh] doodle-font">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={() => setSettingsModalOpen(false)}
      />

      <div className="relative mx-4 w-full max-w-4xl transform overflow-hidden rounded-[2.5rem] border-4 border-[var(--ink)] bg-[var(--panel-bg)] shadow-2xl transition-all scale-in-center">
        <Command className="flex h-full w-full flex-col text-[var(--ink)]" loop onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center border-b-4 border-[var(--ink)] bg-[var(--paper)] px-6 py-4">
            <Settings className="mr-4 h-8 w-8 shrink-0 text-[var(--ink)]" />
            <Command.Input
              autoFocus
              className="flex h-12 w-full bg-transparent text-xl font-bold outline-none placeholder:text-[var(--muted-ink)] text-[var(--ink)]"
              placeholder="Search settings, themes, code languages, modes..."
            />
            <button
              className="ml-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--pill-bg)] px-4 py-2 text-sm font-black text-[var(--ink)] hover:bg-[var(--pill-hover-bg)] transition-colors"
              onClick={() => setSettingsModalOpen(false)}
            >
              ESC
            </button>
          </div>

          <Command.List className="custom-scrollbar max-h-[72vh] sm:max-h-[620px] overflow-y-auto overflow-x-hidden p-6">
            <Command.Empty className="py-16 text-center text-xl font-bold text-[var(--muted-ink)]">
              No matching settings found!
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="mb-6 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Command.Item
                  onSelect={() => {
                    setSettingsModalOpen(false);
                    setCustomTextModalOpen(true);
                  }}
                  className="flex cursor-pointer items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                >
                  <Edit3 className="mr-3 h-6 w-6 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-[var(--ink)]">Paste Custom Text / Code</span>
                    <span className="text-xs text-[var(--muted-ink)]">Type your own custom text or code snippet</span>
                  </div>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    setIncludePunctuation(!includePunctuation);
                    setIncludeNumbers(!includeNumbers);
                  }}
                  className="flex cursor-pointer items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                >
                  <Sparkles className="mr-3 h-6 w-6 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-[var(--ink)]">Toggle Punctuation & Numbers</span>
                    <span className="text-xs text-[var(--muted-ink)]">
                      Punctuation: {includePunctuation ? "ON" : "OFF"} | Numbers: {includeNumbers ? "ON" : "OFF"}
                    </span>
                  </div>
                </Command.Item>
              </div>
            </Command.Group>

            {/* Game Modes */}
            <Command.Group heading="Game Modes & Duration" className="mb-6 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[15, 30, 60, 120].map((seconds) => (
                  <Command.Item
                    key={`time-${seconds}`}
                    onSelect={() => {
                      setMode({ type: "time", value: seconds });
                      setTextType("words");
                      setSettingsModalOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-[var(--ink)]" />
                      <span className="text-lg font-bold text-[var(--ink)]">{seconds} Seconds Time Mode</span>
                    </div>
                    {mode.type === "time" && mode.value === seconds && textType === "words" && (
                      <span className="text-xs font-black text-[var(--ink)]">ACTIVE</span>
                    )}
                  </Command.Item>
                ))}

                {[10, 25, 50, 100].map((wordCount) => (
                  <Command.Item
                    key={`words-${wordCount}`}
                    onSelect={() => {
                      setMode({ type: "words", value: wordCount });
                      setTextType("words");
                      setSettingsModalOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex items-center gap-3">
                      <Type className="h-6 w-6 text-[var(--ink)]" />
                      <span className="text-lg font-bold text-[var(--ink)]">{wordCount} Words Mode</span>
                    </div>
                    {mode.type === "words" && mode.value === wordCount && textType === "words" && (
                      <span className="text-xs font-black text-[var(--ink)]">ACTIVE</span>
                    )}
                  </Command.Item>
                ))}
              </div>
            </Command.Group>

            {/* Programming Code Typing Tests */}
            <Command.Group heading="Programming Language Code Tests" className="mb-6 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CODE_LANGUAGES.map((lang) => (
                  <Command.Item
                    key={lang.id}
                    onSelect={() => {
                      setCodeLanguage(lang.id);
                      setTextType("code");
                      setSettingsModalOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-[var(--ink)]" />
                      <span className="text-base font-bold text-[var(--ink)]">{lang.label}</span>
                    </div>
                    {textType === "code" && codeLanguage === lang.id && (
                      <span className="text-xs font-black text-[var(--ink)]">ACTIVE</span>
                    )}
                  </Command.Item>
                ))}
              </div>
            </Command.Group>

            {/* Visual Themes */}
            <Command.Group heading="Visual Themes" className="mb-6 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((th) => (
                  <Command.Item
                    key={th.id}
                    onSelect={() => setTheme(th.id)}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-[var(--ink)]" style={{ backgroundColor: th.previewColor }} />
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">{th.label}</span>
                        <span className="text-xs text-[var(--muted-ink)]">{th.desc}</span>
                      </div>
                    </div>
                    {theme === th.id && <span className="text-xs font-black text-[var(--ink)]">ACTIVE</span>}
                  </Command.Item>
                ))}
              </div>
            </Command.Group>

            {/* Audio Profiles */}
            <Command.Group heading="Mechanical Audio Profiles" className="mb-6 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 flex flex-col gap-3">
                {SOUND_PROFILES.map((sp) => (
                  <Command.Item
                    key={sp.id}
                    onSelect={() => {
                      setSoundProfile(sp.id);
                      setSoundEnabled(sp.id !== "silent");
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex items-center gap-4">
                      {sp.id === "silent" ? <VolumeX className="h-6 w-6 text-[var(--muted-ink)]" /> : <Volume2 className="h-6 w-6 text-[var(--ink)]" />}
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">{sp.label}</span>
                        <span className="text-xs text-[var(--muted-ink)]">{sp.desc}</span>
                      </div>
                    </div>
                    {soundProfile === sp.id && <span className="text-xs font-black text-[var(--ink)]">ACTIVE</span>}
                  </Command.Item>
                ))}
              </div>
            </Command.Group>

            {/* Word Difficulty */}
            <Command.Group heading="Word Dictionary Difficulty" className="mb-4 px-2 text-xs font-black uppercase tracking-widest text-[var(--ink)]">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <Command.Item
                    key={diff}
                    onSelect={() => setDifficulty(diff)}
                    className="flex cursor-pointer items-center justify-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-4 outline-none transition-all hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-[var(--ink)] capitalize">{diff}</span>
                      {difficulty === diff && <span className="mt-1 text-xs font-black text-[var(--ink)]">ACTIVE</span>}
                    </div>
                  </Command.Item>
                ))}
              </div>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
