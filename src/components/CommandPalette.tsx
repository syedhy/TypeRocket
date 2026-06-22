import React, { useEffect } from "react";
import { Command } from "cmdk";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { Settings, Clock, Type, Code, Quote, Volume2, VolumeX, BookOpen, Brain, Dumbbell } from "lucide-react";

export function CommandPalette() {
  const {
    mode,
    setMode,
    textType,
    setTextType,
    difficulty,
    setDifficulty,
    soundEnabled,
    setSoundEnabled,
    isSettingsModalOpen,
    setSettingsModalOpen,
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] doodle-font">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={() => setSettingsModalOpen(false)}
      />
      
      <div className="relative w-full max-w-4xl transform overflow-hidden rounded-[2rem] bg-[var(--panel-bg)] shadow-2xl border-4 border-[var(--ink)] transition-all mx-4 scale-in-center">
        <Command 
          className="flex h-full w-full flex-col text-[var(--ink)]"
          loop
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b-4 border-[var(--ink)] px-6 py-3 bg-[var(--paper)]">
            <Settings className="mr-4 h-8 w-8 shrink-0 text-[var(--ink)]" />
            <Command.Input 
              autoFocus
              className="flex h-16 w-full bg-transparent py-3 text-2xl outline-none placeholder:text-[var(--muted-ink)] disabled:cursor-not-allowed disabled:opacity-50 text-[var(--ink)] font-bold" 
              placeholder="Search settings, game modes..." 
            />
            <button 
              className="ml-4 rounded-xl border-2 border-[var(--ink)] px-4 py-2 bg-[var(--pill-bg)] text-lg font-black text-[var(--ink)] hover:bg-[var(--pill-hover-bg)] transition-colors"
              onClick={() => setSettingsModalOpen(false)}
            >
              ESC
            </button>
          </div>

          <Command.List className="max-h-[70vh] sm:max-h-[600px] overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
            <Command.Empty className="py-16 text-center text-xl text-[var(--muted-ink)] font-bold">
              No matching settings found!
            </Command.Empty>

            <Command.Group heading="Game Mode" className="text-lg font-black uppercase tracking-widest text-[var(--ink)] mb-4 px-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <Command.Item 
                  onSelect={() => setMode({ type: "words", value: 10 })}
                  className="relative flex cursor-pointer select-none items-start rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-5 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <Type className="mt-1 mr-4 h-8 w-8 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Short Sprint</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Type exactly 10 words</span>
                  </div>
                  {mode.type === "words" && mode.value === 10 && <span className="ml-auto text-sm font-black text-[var(--ink)] self-center">ACTIVE</span>}
                </Command.Item>
                <Command.Item 
                  onSelect={() => setMode({ type: "words", value: 30 })}
                  className="relative flex cursor-pointer select-none items-start rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-5 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <Type className="mt-1 mr-4 h-8 w-8 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Standard</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Type exactly 30 words</span>
                  </div>
                  {mode.type === "words" && mode.value === 30 && <span className="ml-auto text-sm font-black text-[var(--ink)] self-center">ACTIVE</span>}
                </Command.Item>
                <Command.Item 
                  onSelect={() => setMode({ type: "time", value: 30 })}
                  className="relative flex cursor-pointer select-none items-start rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-5 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <Clock className="mt-1 mr-4 h-8 w-8 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Time Challenge</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Type for 30 seconds</span>
                  </div>
                  {mode.type === "time" && mode.value === 30 && <span className="ml-auto text-sm font-black text-[var(--ink)] self-center">ACTIVE</span>}
                </Command.Item>
                <Command.Item 
                  onSelect={() => setMode({ type: "time", value: 60 })}
                  className="relative flex cursor-pointer select-none items-start rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-5 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <Clock className="mt-1 mr-4 h-8 w-8 text-[var(--ink)]" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Endurance</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Type for 60 seconds</span>
                  </div>
                  {mode.type === "time" && mode.value === 60 && <span className="ml-auto text-sm font-black text-[var(--ink)] self-center">ACTIVE</span>}
                </Command.Item>
              </div>
            </Command.Group>

            <Command.Group heading="Content Type" className="text-lg font-black uppercase tracking-widest text-[var(--ink)] mb-4 px-2 mt-8">
              <div className="flex flex-col gap-3 mt-3">
                <Command.Item 
                  onSelect={() => setTextType("words")}
                  className="relative flex cursor-pointer select-none items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-4 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--paper)] border-2 border-[var(--ink)] mr-5">
                    <BookOpen className="h-6 w-6 text-[var(--ink)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Dictionary Words</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Random standard english words</span>
                  </div>
                  {textType === "words" && <span className="ml-auto text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                </Command.Item>
                <Command.Item 
                  onSelect={() => setTextType("quotes")}
                  className="relative flex cursor-pointer select-none items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-4 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--paper)] border-2 border-[var(--ink)] mr-5">
                    <Quote className="h-6 w-6 text-[var(--ink)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Sentences & Quotes</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Full sentences with punctuation</span>
                  </div>
                  {textType === "quotes" && <span className="ml-auto text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                </Command.Item>
                <Command.Item 
                  onSelect={() => setTextType("code")}
                  className="relative flex cursor-pointer select-none items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-4 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--paper)] border-2 border-[var(--ink)] mr-5">
                    <Code className="h-6 w-6 text-[var(--ink)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Programming Code</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Code snippets and keywords</span>
                  </div>
                  {textType === "code" && <span className="ml-auto text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                </Command.Item>
              </div>
            </Command.Group>

            <Command.Group heading="Difficulty (Words Mode Only)" className="text-lg font-black uppercase tracking-widest text-[var(--ink)] mb-4 px-2 mt-8">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <Command.Item 
                  onSelect={() => setDifficulty("easy")}
                  className="relative flex cursor-pointer select-none items-center justify-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-6 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-[var(--ink)]">Easy</span>
                    <span className="text-sm text-[var(--muted-ink)] mt-2 uppercase tracking-wider">3-4 letters</span>
                    {difficulty === "easy" && <span className="mt-3 text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                  </div>
                </Command.Item>
                <Command.Item 
                  onSelect={() => setDifficulty("medium")}
                  className="relative flex cursor-pointer select-none items-center justify-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-6 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-[var(--ink)]">Medium</span>
                    <span className="text-sm text-[var(--muted-ink)] mt-2 uppercase tracking-wider">5-7 letters</span>
                    {difficulty === "medium" && <span className="mt-3 text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                  </div>
                </Command.Item>
                <Command.Item 
                  onSelect={() => setDifficulty("hard")}
                  className="relative flex cursor-pointer select-none items-center justify-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] p-6 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-[var(--ink)]">Hard</span>
                    <span className="text-sm text-[var(--muted-ink)] mt-2 uppercase tracking-wider">8+ letters</span>
                    {difficulty === "hard" && <span className="mt-3 text-sm font-black text-[var(--ink)]">ACTIVE</span>}
                  </div>
                </Command.Item>
              </div>
            </Command.Group>

            <Command.Group heading="Audio" className="text-lg font-black uppercase tracking-widest text-[var(--ink)] mb-4 px-2 mt-8">
               <div className="flex flex-col gap-3 mt-3">
                <Command.Item 
                  onSelect={() => setSoundEnabled(!soundEnabled)}
                  className="relative flex cursor-pointer select-none items-center rounded-2xl border-4 border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-4 outline-none transition-all hover:bg-[var(--pill-hover-bg)] hover:border-[var(--ink)] hover:-translate-y-1 aria-selected:bg-[var(--pill-hover-bg)] aria-selected:border-[var(--ink)] data-[selected]:bg-[var(--pill-hover-bg)] data-[selected]:border-[var(--ink)]"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--paper)] border-2 border-[var(--ink)] mr-5">
                    {soundEnabled ? <Volume2 className="h-6 w-6 text-[var(--ink)]" /> : <VolumeX className="h-6 w-6 text-[var(--muted-ink)]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--ink)]">Mechanical Key Sounds</span>
                    <span className="text-base text-[var(--muted-ink)] mt-1">Satisfying keyboard clacks while typing</span>
                  </div>
                  <span className="ml-auto text-lg font-black text-[var(--muted-ink)]">{soundEnabled ? "ON" : "OFF"}</span>
                </Command.Item>
              </div>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
