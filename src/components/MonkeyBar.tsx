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
      const validTime = [15, 30, 60, 120].includes(mode.value) ? mode.value : 30;
      setMode({ type: "time", value: validTime });
      setTextType("words");
    } else if (newModeType === "words") {
      const validWords = [10, 25, 50, 100].includes(mode.value) ? mode.value : 25;
      setMode({ type: "words", value: validWords });
      setTextType("words");
    } else if (newModeType === "quote") {
      setMode({ type: "words", value: 25 });
      setTextType("quotes");
    } else if (newModeType === "code") {
      setMode({ type: "words", value: 25 });
      setTextType("code");
    } else if (newModeType === "custom") {
      setMode({ type: "words", value: 25 });
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
    { id: "python", label: "python" },
    { id: "javascript", label: "javascript" },
    { id: "typescript", label: "typescript" },
    { id: "java", label: "java" },
    { id: "cpp", label: "c++" },
    { id: "rust", label: "rust" },
    { id: "go", label: "go" },
    { id: "html", label: "html" },
    { id: "sql", label: "sql" },
  ];

  return (
    <div className="relative z-40 mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 p-1 doodle-font text-xs font-bold text-[var(--ink)] sm:text-sm">
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

      {/* Group 3: Sub-options (Time seconds / Words count / Code Languages / Settings) */}
      <div className="flex items-center gap-1 rounded-2xl border-2 border-[var(--ink)] bg-[var(--panel-bg)] p-1.5 shadow-md backdrop-blur-md max-w-full overflow-x-auto custom-scrollbar">
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
            {[10, 25, 50, 100].map((wCount) => {
              const isSelected = mode.value === wCount || (![10, 25, 50, 100].includes(mode.value) && wCount === 25);
              return (
                <button
                  key={wCount}
                  type="button"
                  onClick={() => setMode({ type: "words", value: wCount })}
                  className={`rounded-xl px-3 py-1 transition-all ${
                    isSelected
                      ? "bg-[var(--ink)] text-[var(--paper)] font-black shadow-sm"
                      : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                  }`}
                >
                  {wCount}
                </button>
              );
            })}
          </>
        )}

        {textType === "code" && (
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar px-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setCodeLanguage(lang.id)}
                className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all ${
                  codeLanguage === lang.id
                    ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}

        {/* Settings Icon */}
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="rounded-xl p-1.5 text-[var(--ink)] hover:bg-[var(--pill-hover-bg)] transition-colors ml-1 shrink-0"
          title="Open Settings (ESC)"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
