import React from "react";
import { useGameSettings, GameModeType } from "../contexts/GameSettingsContext";
import { CodeLanguage } from "../config/codeSnippets";
import { AtSign, Hash, Clock, Type, Quote, Code, Edit3, Settings } from "lucide-react";

export function MonkeyBar() {
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
    setSettingsModalOpen,
    setCustomTextModalOpen,
  } = useGameSettings();

  const handleModeChange = (newModeType: GameModeType) => {
    if (newModeType === "time") {
      setMode({ type: "time", value: mode.type === "time" ? mode.value : 30 });
      setTextType("words");
    } else if (newModeType === "words") {
      setMode({ type: "words", value: mode.type === "words" ? mode.value : 30 });
      setTextType("words");
    } else if (newModeType === "quote") {
      setMode({ type: "words", value: 30 });
      setTextType("quotes");
    } else if (newModeType === "code") {
      setMode({ type: "words", value: 30 });
      setTextType("code");
    } else if (newModeType === "custom") {
      setMode({ type: "words", value: 30 });
      setTextType("custom");
      setCustomTextModalOpen(true);
    }
  };

  const isModeActive = (m: GameModeType) => {
    if (m === "quote") return textType === "quotes";
    if (m === "code") return textType === "code";
    if (m === "custom") return textType === "custom";
    return mode.type === m && textType === "words";
  };

  const LANGUAGES: { id: CodeLanguage; label: string }[] = [
    { id: "python", label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "rust", label: "Rust" },
    { id: "go", label: "Go" },
    { id: "html", label: "HTML" },
    { id: "sql", label: "SQL" },
  ];

  return (
    <div className="relative z-40 mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 p-1 doodle-font text-xs font-bold text-[var(--ink)] sm:text-sm">
      {/* Group 1: Modifiers (Punctuation & Numbers) */}
      <div className="flex items-center gap-1 rounded-2xl border-2 border-[var(--ink)] bg-[var(--panel-bg)] p-1.5 shadow-md backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIncludePunctuation(!includePunctuation)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            includePunctuation
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
          title="Toggle Punctuation"
        >
          <AtSign className="h-3.5 w-3.5" />
          <span>punctuation</span>
        </button>

        <button
          type="button"
          onClick={() => setIncludeNumbers(!includeNumbers)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            includeNumbers
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
          title="Toggle Numbers"
        >
          <Hash className="h-3.5 w-3.5" />
          <span>numbers</span>
        </button>
      </div>

      {/* Group 2: Mode Selectors (Time, Words, Quote, Code, Custom) */}
      <div className="flex items-center gap-1 rounded-2xl border-2 border-[var(--ink)] bg-[var(--panel-bg)] p-1.5 shadow-md backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleModeChange("time")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            isModeActive("time")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>time</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("words")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            isModeActive("words")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          <span>words</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("quote")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            isModeActive("quote")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Quote className="h-3.5 w-3.5" />
          <span>quote</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("code")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            isModeActive("code")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Code className="h-3.5 w-3.5" />
          <span>code</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("custom")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
            isModeActive("custom")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>custom</span>
        </button>
      </div>

      {/* Group 3: Sub-options (Durations / Word Counts / Language / Settings) */}
      <div className="flex items-center gap-1 rounded-2xl border-2 border-[var(--ink)] bg-[var(--panel-bg)] p-1.5 shadow-md backdrop-blur-md">
        {mode.type === "time" && textType === "words" && (
          <>
            {[15, 30, 60, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setMode({ type: "time", value: sec })}
                className={`rounded-xl px-3 py-1 transition-all ${
                  mode.value === sec
                    ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                }`}
              >
                {sec}
              </button>
            ))}
          </>
        )}

        {mode.type === "words" && textType === "words" && (
          <>
            {[10, 25, 50, 100].map((wCount) => (
              <button
                key={wCount}
                type="button"
                onClick={() => setMode({ type: "words", value: wCount })}
                className={`rounded-xl px-3 py-1 transition-all ${
                  mode.value === wCount
                    ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                }`}
              >
                {wCount}
              </button>
            ))}
          </>
        )}

        {textType === "code" && (
          <select
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value as CodeLanguage)}
            className="rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-1 text-xs font-black text-[var(--ink)] outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        )}

        {/* Settings Icon */}
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="rounded-xl p-1.5 text-[var(--ink)] hover:bg-[var(--pill-hover-bg)] transition-colors ml-1"
          title="Open Settings (ESC)"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
