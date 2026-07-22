import {
  Fragment,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";
import type { CharacterStatus } from "../types/game";
import { useGameSettings } from "../contexts/GameSettingsContext";

type TypingTextProps = {
  targetText: string;
  statuses: CharacterStatus[];
  cursorIndex: number;
};

const statusClassNames: Record<CharacterStatus, string> = {
  correct: "typing-correct",
  incorrect: "typing-incorrect",
  current: "typing-pending",
  pending: "typing-pending",
};

export function TypingText({ targetText, statuses, cursorIndex }: TypingTextProps) {
  const { textType } = useGameSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorAnchorRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const anchor = cursorAnchorRef.current;
    const cursor = cursorRef.current;

    if (!container || !anchor || !cursor) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const cursorHeight = Math.max(anchorRect.height * 1.2, 30);

    cursor.style.setProperty("--cursor-height", `${cursorHeight}px`);
    cursor.style.setProperty("--cursor-x", `${anchorRect.left - containerRect.left}px`);
    cursor.style.setProperty(
      "--cursor-y",
      `${anchorRect.top - containerRect.top - (cursorHeight - anchorRect.height) / 2}px`
    );
    cursor.style.opacity = "1";
  }, [cursorIndex, targetText]);

  const cursorAnchor = (
    <span className="typing-cursor-anchor" ref={cursorAnchorRef} aria-hidden="true" />
  );

  const isCode = textType === "code";

  return (
    <div
      className={`typing-line mx-auto max-w-[980px] text-[clamp(1.1rem,2.5vw,2.5rem)] leading-[1.3] ${
        isCode ? "font-mono tracking-tight" : "doodle-font"
      }`}
      ref={containerRef}
    >
      <span
        className="typing-cursor-slider"
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

      <div className="whitespace-pre-wrap break-words">
        {targetText.split("").map((character, index) => {
          const isNewline = character === "\n";

          return (
            <Fragment key={`char-${index}`}>
              {index === cursorIndex && cursorAnchor}
              {isNewline ? (
                <span className={`inline-block w-full ${statusClassNames[statuses[index]]}`}>
                  ↵{"\n"}
                </span>
              ) : (
                <span
                  className={`relative inline-block min-w-[0.35ch] ${statusClassNames[statuses[index]]}`}
                >
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
