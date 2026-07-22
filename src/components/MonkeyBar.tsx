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
      setTextType("words");
      setCustomTextModalOpen(true);
    }
  };

  const isModeActive = (m: GameModeType) => {
    if (m === "quote") return textType === "quotes";
    if (m === "code") return textType === "code";
    if (m === "custom") return false;
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
    <div className="relative z-40 mx-auto mb-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-[var(--ink)] bg-[var(--panel-bg)] p-2 shadow-lg backdrop-blur-md transition-all sm:gap-3 sm:px-4 sm:py-2.5 doodle-font text-sm font-bold text-[var(--ink)]">
      {/* Punctuation & Numbers Toggles */}
      <div className="flex items-center gap-1 border-r-2 border-[var(--ink)] pr-2 sm:gap-2 sm:pr-3">
        <button
          type="button"
          onClick={() => setIncludePunctuation(!includePunctuation)}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
            includePunctuation
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
          title="Toggle Punctuation"
        >
          <AtSign className="h-4 w-4" />
          <span>punctuation</span>
        </button>

        <button
          type="button"
          onClick={() => setIncludeNumbers(!includeNumbers)}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
            includeNumbers
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
          title="Toggle Numbers"
        >
          <Hash className="h-4 w-4" />
          <span>numbers</span>
        </button>
      </div>

      {/* Main Mode Selectors */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => handleModeChange("time")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1 transition-all ${
            isModeActive("time")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>time</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("words")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1 transition-all ${
            isModeActive("words")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Type className="h-4 w-4" />
          <span>words</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("quote")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1 transition-all ${
            isModeActive("quote")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Quote className="h-4 w-4" />
          <span>quote</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("code")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1 transition-all ${
            isModeActive("code")
              ? "bg-[var(--ink)] text-[var(--paper)] font-black"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          <Code className="h-4 w-4" />
          <span>code</span>
        </button>

        <button
          type="button"
          onClick={() => setCustomTextModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1 text-[var(--muted-ink)] hover:text-[var(--ink)] transition-all"
        >
          <Edit3 className="h-4 w-4" />
          <span>custom</span>
        </button>
      </div>

      {/* Sub-options for Time / Words / Code */}
      <div className="flex items-center gap-1 border-l-2 border-[var(--ink)] pl-2 sm:gap-2 sm:pl-3">
        {mode.type === "time" && textType === "words" && (
          <>
            {[15, 30, 60, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setMode({ type: "time", value: sec })}
                className={`rounded-lg px-2 py-0.5 transition-all ${
                  mode.value === sec
                    ? "bg-[var(--ink)] text-[var(--paper)] font-black"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                }`}
              >
                {sec}s
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
                className={`rounded-lg px-2 py-0.5 transition-all ${
                  mode.value === wCount
                    ? "bg-[var(--ink)] text-[var(--paper)] font-black"
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
            className="rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 text-xs font-black text-[var(--ink)] outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        )}

        {/* Quick Settings Icon */}
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="ml-2 rounded-xl p-1.5 text-[var(--ink)] hover:bg-[var(--pill-hover-bg)] transition-colors"
          title="Open Settings (ESC)"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
