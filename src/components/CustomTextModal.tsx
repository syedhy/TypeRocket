import React, { useState } from "react";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { Edit3, Check, X } from "lucide-react";

export function CustomTextModal() {
  const { customText, setCustomText, setTextType, isCustomTextModalOpen, setCustomTextModalOpen } = useGameSettings();
  const [localText, setLocalText] = useState(customText);

  if (!isCustomTextModalOpen) return null;

  const handleSave = () => {
    setCustomText(localText);
    setTextType("custom");
    setCustomTextModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 doodle-font">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setCustomTextModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[2rem] border-4 border-[var(--ink)] bg-[var(--panel-bg)] p-6 shadow-2xl transition-all scale-in-center">
        <div className="flex items-center justify-between border-b-4 border-[var(--ink)] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <Edit3 className="h-7 w-7 text-[var(--ink)]" />
            <h2 className="text-2xl font-black text-[var(--ink)]">Custom Text & Code</h2>
          </div>
          <button
            onClick={() => setCustomTextModalOpen(false)}
            className="rounded-xl border-2 border-[var(--ink)] p-2 hover:bg-[var(--pill-hover-bg)]"
          >
            <X className="h-5 w-5 text-[var(--ink)]" />
          </button>
        </div>

        <p className="mb-4 text-base font-bold text-[var(--muted-ink)]">
          Paste your custom text, paragraphs, or programming code snippets below to practice typing:
        </p>

        <textarea
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          rows={7}
          placeholder="Paste your text or code snippet here..."
          className="w-full rounded-2xl border-4 border-[var(--ink)] bg-[var(--paper)] p-4 text-lg font-mono text-[var(--ink)] outline-none custom-scrollbar"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setCustomTextModalOpen(false)}
            className="rounded-full border-4 border-[var(--ink)] bg-[var(--paper)] px-6 py-2.5 text-base font-black text-[var(--ink)] hover:bg-[var(--pill-hover-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full border-4 border-[var(--ink)] bg-[var(--ink)] px-8 py-2.5 text-base font-black text-[var(--paper)] hover:opacity-90"
          >
            <Check className="h-5 w-5" />
            Apply Custom Text
          </button>
        </div>
      </div>
    </div>
  );
}
