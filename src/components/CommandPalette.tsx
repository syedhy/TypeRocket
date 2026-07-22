import React, { useEffect, useState } from "react";
import { useGameSettings, Theme, SoundProfile, FontFamily, CaretStyle } from "../contexts/GameSettingsContext";
import { CodeLanguage } from "../config/codeSnippets";
import {
  Settings,
  Clock,
  Type,
  Code,
  Volume2,
  VolumeX,
  Palette,
  Edit3,
  Sparkles,
  EyeOff,
  Flame,
  MousePointer,
  AtSign,
  Hash,
  X,
  Check,
  Zap,
} from "lucide-react";

type SettingsTab = "modes" | "code" | "appearance" | "caret" | "sound";

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
    fontFamily,
    setFontFamily,
    caretStyle,
    setCaretStyle,
    blindMode,
    setBlindMode,
    masterMode,
    setMasterMode,
    isSettingsModalOpen,
    setSettingsModalOpen,
    setCustomTextModalOpen,
  } = useGameSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>("modes");
  const [searchQuery, setSearchQuery] = useState("");

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

  const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "modes", label: "Modes & Rules", icon: <Clock className="h-4 w-4" /> },
    { id: "code", label: "Code Languages", icon: <Code className="h-4 w-4" /> },
    { id: "appearance", label: "Themes & Fonts", icon: <Palette className="h-4 w-4" /> },
    { id: "caret", label: "Caret & Challenge", icon: <MousePointer className="h-4 w-4" /> },
    { id: "sound", label: "Sound Effects", icon: <Volume2 className="h-4 w-4" /> },
  ];

  const THEMES: { id: Theme; label: string; desc: string; previewColor: string }[] = [
    { id: "doodle", label: "Doodle Hand", desc: "Classic hand-drawn paper & ink style", previewColor: "#171717" },
    { id: "cyberpunk", label: "Cyberpunk Neon", desc: "High contrast neon grid & vibrant thrust", previewColor: "#00ffcc" },
    { id: "dark-nebula", label: "Dark Nebula", desc: "Deep space darkness with cosmic purple accents", previewColor: "#9333ea" },
    { id: "sunset", label: "Sunset Pink", desc: "Warm dusk palette with soft gradient sky", previewColor: "#f43f5e" },
    { id: "nord", label: "Nordic Frost", desc: "Cool arctic blues and clean slate aesthetic", previewColor: "#38bdf8" },
    { id: "dracula", label: "Dracula Night", desc: "Vampire dark mode with crisp pastel highlights", previewColor: "#ff79c6" },
  ];

  const SOUND_PROFILES: { id: SoundProfile; label: string; desc: string }[] = [
    { id: "silent", label: "Mute All (Default)", desc: "No keypress audio feedback" },
    { id: "default", label: "Standard Keypress", desc: "Classic mechanical key click" },
    { id: "typewriter", label: "Retro Typewriter", desc: "Authentic heavy metallic strike sound" },
    { id: "clicky", label: "Blue Switches", desc: "Tactile high-pitched clicky switch" },
    { id: "soft", label: "Silent Linear", desc: "Subtle cushioned keystroke audio" },
  ];

  const FONTS: { id: FontFamily; label: string; desc: string }[] = [
    { id: "doodle", label: "Doodle Hand", desc: "Playful handwritten font" },
    { id: "jetbrains", label: "JetBrains Mono", desc: "Developer standard monospace" },
    { id: "firacode", label: "Fira Code", desc: "Crisp ligatures monospace" },
    { id: "inter", label: "Inter Clean", desc: "Sleek modern sans-serif" },
    { id: "playfair", label: "Playfair Serif", desc: "Elegant classic serif font" },
  ];

  const CARETS: { id: CaretStyle; label: string; desc: string }[] = [
    { id: "line", label: "Vertical Line |", desc: "Classic vertical bar cursor" },
    { id: "block", label: "Full Block █", desc: "Retro terminal block cursor" },
    { id: "underline", label: "Underline _", desc: "Bottom bar cursor" },
    { id: "pulse", label: "Glow Pulse 🌟", desc: "Pulsing neon line cursor" },
  ];

  const CODE_LANGUAGES: { id: CodeLanguage; label: string; desc: string }[] = [
    { id: "python", label: "Python 3", desc: "Def, async/await, list comprehensions" },
    { id: "javascript", label: "JavaScript", desc: "ES6+, promises, arrow functions" },
    { id: "typescript", label: "TypeScript", desc: "Interfaces, generics, types" },
    { id: "java", label: "Java 21", desc: "Classes, streams, CompletableFuture" },
    { id: "cpp", label: "C++ 20", desc: "Templates, vectors, smart pointers" },
    { id: "rust", label: "Rust 2024", desc: "Structs, impl, pattern matching" },
    { id: "go", label: "Go 1.22", desc: "Goroutines, channels, structs" },
    { id: "html", label: "HTML5 / JSX", desc: "Elements, attributes, components" },
    { id: "sql", label: "SQL / Postgres", desc: "Queries, joins, inserts, transactions" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 doodle-font">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={() => setSettingsModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative mx-auto flex h-[85vh] max-h-[780px] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border-4 border-[var(--ink)] bg-[var(--panel-bg)] shadow-2xl transition-all scale-in-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-[var(--ink)] bg-[var(--paper)] px-6 py-4">
          <div className="flex items-center gap-3">
            <Settings className="h-7 w-7 text-[var(--ink)]" />
            <h2 className="text-2xl font-black text-[var(--ink)]">TypeRocket Settings</h2>
          </div>

          <button
            onClick={() => setSettingsModalOpen(false)}
            className="flex items-center gap-2 rounded-2xl border-2 border-[var(--ink)] bg-[var(--pill-bg)] px-4 py-2 text-sm font-black text-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
          >
            <span>ESC</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex overflow-x-auto border-b-4 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[var(--ink)] text-[var(--paper)] shadow-md"
                  : "text-[var(--muted-ink)] hover:bg-[var(--pill-hover-bg)] hover:text-[var(--ink)]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* TAB 1: MODES & RULES */}
          {activeTab === "modes" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-3">
                  Mode Selection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[15, 30, 60, 120].map((sec) => (
                    <button
                      key={`time-${sec}`}
                      onClick={() => {
                        setMode({ type: "time", value: sec });
                        setTextType("words");
                      }}
                      className={`flex flex-col items-start p-5 rounded-2xl border-4 transition-all text-left ${
                        mode.type === "time" && mode.value === sec && textType === "words"
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <Clock className="h-6 w-6 text-[var(--ink)] mb-2" />
                      <span className="text-xl font-bold text-[var(--ink)]">{sec} Seconds</span>
                      <span className="text-xs text-[var(--muted-ink)] mt-1">Timed flight test</span>
                    </button>
                  ))}

                  {[10, 25, 50, 100].map((wCount) => (
                    <button
                      key={`words-${wCount}`}
                      onClick={() => {
                        setMode({ type: "words", value: wCount });
                        setTextType("words");
                      }}
                      className={`flex flex-col items-start p-5 rounded-2xl border-4 transition-all text-left ${
                        mode.type === "words" && mode.value === wCount && textType === "words"
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <Type className="h-6 w-6 text-[var(--ink)] mb-2" />
                      <span className="text-xl font-bold text-[var(--ink)]">{wCount} Words</span>
                      <span className="text-xs text-[var(--muted-ink)] mt-1">Fixed word sprint</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-3">
                  Text Modifiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setIncludePunctuation(!includePunctuation)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all ${
                      includePunctuation
                        ? "border-[var(--ink)] bg-[var(--pill-hover-bg)]"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AtSign className="h-6 w-6 text-[var(--ink)]" />
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-bold text-[var(--ink)]">Punctuation</span>
                        <span className="text-xs text-[var(--muted-ink)]">Include commas, periods, quotes</span>
                      </div>
                    </div>
                    {includePunctuation && <Check className="h-6 w-6 text-[var(--ink)]" />}
                  </button>

                  <button
                    onClick={() => setIncludeNumbers(!includeNumbers)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all ${
                      includeNumbers
                        ? "border-[var(--ink)] bg-[var(--pill-hover-bg)]"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="h-6 w-6 text-[var(--ink)]" />
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-bold text-[var(--ink)]">Numbers</span>
                        <span className="text-xs text-[var(--muted-ink)]">Include digits 0-9</span>
                      </div>
                    </div>
                    {includeNumbers && <Check className="h-6 w-6 text-[var(--ink)]" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-3">
                  Word Difficulty
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(["easy", "medium", "hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-5 rounded-2xl border-4 text-center capitalize transition-all ${
                        difficulty === diff
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-md"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <span className="text-xl font-bold text-[var(--ink)]">{diff}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE LANGUAGES */}
          {activeTab === "code" && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                Select Programming Language Code Test
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CODE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setCodeLanguage(lang.id);
                      setTextType("code");
                      setSettingsModalOpen(false);
                    }}
                    className={`flex flex-col items-start p-5 rounded-2xl border-4 transition-all text-left ${
                      textType === "code" && codeLanguage === lang.id
                        ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <Code className="h-6 w-6 text-[var(--ink)] mb-2" />
                    <span className="text-lg font-bold text-[var(--ink)]">{lang.label}</span>
                    <span className="text-xs text-[var(--muted-ink)] mt-1">{lang.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THEMES & FONTS */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                  Visual Themes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all text-left ${
                        theme === th.id
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full border-2 border-[var(--ink)]" style={{ backgroundColor: th.previewColor }} />
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-[var(--ink)]">{th.label}</span>
                          <span className="text-xs text-[var(--muted-ink)]">{th.desc}</span>
                        </div>
                      </div>
                      {theme === th.id && <Check className="h-6 w-6 text-[var(--ink)]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                  Font Family
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      className={`p-5 rounded-2xl border-4 transition-all text-left ${
                        fontFamily === f.id
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <span className="text-lg font-bold text-[var(--ink)] block">{f.label}</span>
                      <span className="text-xs text-[var(--muted-ink)] mt-1 block">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARET & CHALLENGE */}
          {activeTab === "caret" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                  Caret & Cursor Style
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CARETS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCaretStyle(c.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all text-left ${
                        caretStyle === c.id
                          ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                          : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">{c.label}</span>
                        <span className="text-xs text-[var(--muted-ink)]">{c.desc}</span>
                      </div>
                      {caretStyle === c.id && <Check className="h-6 w-6 text-[var(--ink)]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                  Challenge Modes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setBlindMode(!blindMode)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all text-left ${
                      blindMode
                        ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <EyeOff className="h-6 w-6 text-[var(--ink)]" />
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">Blind Mode</span>
                        <span className="text-xs text-[var(--muted-ink)]">Hide error highlights until finished</span>
                      </div>
                    </div>
                    {blindMode && <Check className="h-6 w-6 text-[var(--ink)]" />}
                  </button>

                  <button
                    onClick={() => setMasterMode(!masterMode)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all text-left ${
                      masterMode
                        ? "border-[var(--wrong)] bg-[var(--pill-hover-bg)] shadow-lg"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="h-6 w-6 text-[var(--wrong)]" />
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">Master Mode</span>
                        <span className="text-xs text-[var(--muted-ink)]">Fail flight immediately on a single typo</span>
                      </div>
                    </div>
                    {masterMode && <Check className="h-6 w-6 text-[var(--wrong)]" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SOUND EFFECTS */}
          {activeTab === "sound" && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted-ink)] mb-4">
                Mechanical Audio Profiles
              </h3>
              <div className="flex flex-col gap-4">
                {SOUND_PROFILES.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      setSoundProfile(sp.id);
                      setSoundEnabled(sp.id !== "silent");
                    }}
                    className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all text-left ${
                      soundProfile === sp.id
                        ? "border-[var(--ink)] bg-[var(--pill-hover-bg)] shadow-lg"
                        : "border-[var(--panel-border)] bg-[var(--pill-bg)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {sp.id === "silent" ? <VolumeX className="h-6 w-6 text-[var(--muted-ink)]" /> : <Volume2 className="h-6 w-6 text-[var(--ink)]" />}
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--ink)]">{sp.label}</span>
                        <span className="text-xs text-[var(--muted-ink)]">{sp.desc}</span>
                      </div>
                    </div>
                    {soundProfile === sp.id && <Check className="h-6 w-6 text-[var(--ink)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
