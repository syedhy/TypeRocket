import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { CharacterStatus } from "../types/game";
import { useGameSettings } from "../contexts/GameSettingsContext";

type TypingTextProps = {
  targetText: string;
  statuses: CharacterStatus[];
  cursorIndex: number;
};

export function TypingText({ targetText, statuses, cursorIndex }: TypingTextProps) {
  const { textType, caretStyle, smoothCaret, blindMode } = useGameSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const cursorAnchorRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [lineOffsetY, setLineOffsetY] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const anchor = cursorAnchorRef.current;
    const cursor = cursorRef.current;
    const wrapper = textWrapperRef.current;

    if (!container || !anchor || !cursor || !wrapper) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const cursorHeight = Math.max(anchorRect.height * 1.1, 28);

    // Calculate vertical line shifting (Monkeytype style)
    const anchorRelativeTop = anchorRect.top - wrapper.getBoundingClientRect().top;
    const lineHeight = anchorRect.height || 36;
    const currentLineNumber = Math.floor(anchorRelativeTop / (lineHeight || 1));

    // Shift text container up when user types past line 1 (showing lines line-1, line, line+1)
    if (currentLineNumber > 1) {
      setLineOffsetY((currentLineNumber - 1) * lineHeight);
    } else {
      setLineOffsetY(0);
    }

    cursor.style.setProperty("--cursor-height", `${cursorHeight}px`);
    cursor.style.setProperty("--cursor-x", `${anchorRect.left - containerRect.left}px`);
    cursor.style.setProperty(
      "--cursor-y",
      `${anchorRect.top - containerRect.top - (cursorHeight - anchorRect.height) / 2}px`
    );
    cursor.style.opacity = "1";
  }, [cursorIndex, targetText]);

  const cursorAnchor = (
    <span className="typing-cursor-anchor inline-block w-0 h-[1em] align-middle" ref={cursorAnchorRef} aria-hidden="true" />
  );

  const isCode = textType === "code";

  // Caret style class mapping
  const caretClasses: Record<string, string> = {
    line: "w-[3px] rounded-full bg-[var(--ink)]",
    block: "w-[1ch] bg-[var(--ink)] opacity-40 rounded-sm",
    underline: "h-[4px] w-[1ch] bg-[var(--ink)] self-end rounded-sm",
    pulse: "w-[3.5px] rounded-full bg-[var(--ink)] animate-pulse shadow-[0_0_8px_var(--ink)]",
  };

  return (
    <div
      className={`typing-line relative mx-auto max-w-[960px] max-h-[140px] overflow-hidden p-2 text-[clamp(1.15rem,2.2vw,2.2rem)] leading-[1.4] select-none ${
        isCode ? "font-mono tracking-tight" : "doodle-font font-bold"
      }`}
      ref={containerRef}
    >
      {/* Sliding Caret Indicator */}
      <span
        className={`typing-cursor-slider absolute top-0 left-0 z-10 pointer-events-none ${
          caretClasses[caretStyle] || caretClasses.line
        } ${smoothCaret ? "transition-all duration-75 ease-out" : ""}`}
        ref={cursorRef}
        style={
          {
            "--cursor-height": "34px",
            "--cursor-x": "0px",
            "--cursor-y": "0px",
            opacity: 0,
          } as CSSProperties
        }
        aria-hidden="true"
      />

      {/* Vertical Shifting Text Wrapper */}
      <div
        ref={textWrapperRef}
        className="whitespace-pre-wrap break-words transition-transform duration-200 ease-out"
        style={{ transform: `translateY(-${lineOffsetY}px)` }}
      >
        {targetText.split("").map((character, index) => {
          const isNewline = character === "\n";
          const status = statuses[index];

          let statusClass = "text-[var(--typing-pending)]";
          if (status === "correct") {
            statusClass = "text-[var(--typing-correct)] font-black";
          } else if (status === "incorrect") {
            statusClass = blindMode
              ? "text-[var(--typing-correct)] font-black" // Blind mode doesn't reveal mistakes until end
              : "text-[var(--wrong)] underline decoration-wavy font-black";
          }

          return (
            <Fragment key={`char-${index}`}>
              {index === cursorIndex && cursorAnchor}
              {isNewline ? (
                <span className={`inline-block w-full ${statusClass}`}>
                  ↵{"\n"}
                </span>
              ) : (
                <span className={`relative inline-block min-w-[0.34ch] ${statusClass}`}>
                  {character}
                </span>
              )}
            </Fragment>
          );
        })}
        {cursorIndex === targetText.length && cursorAnchor}
      </div>
    </div>
  );
}
