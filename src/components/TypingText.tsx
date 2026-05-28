import {
  Fragment,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";
import type { CharacterStatus } from "../types/game";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorAnchorRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  let characterIndex = 0;
  const tokens = targetText.match(/\S+\s*/g) ?? [];

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
      `${anchorRect.top - containerRect.top - (cursorHeight - anchorRect.height) / 2}px`,
    );
    cursor.style.opacity = "1";
  }, [cursorIndex, targetText]);

  const cursorAnchor = (
    <span className="typing-cursor-anchor" ref={cursorAnchorRef} aria-hidden="true" />
  );

  return (
    <div
      className="typing-line mx-auto max-w-[980px] text-[clamp(1.18rem,2.75vw,3rem)] leading-[1.16]"
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

      {tokens.map((token, tokenIndex) => {
        const startIndex = characterIndex;
        characterIndex += token.length;

        return (
          <span className="inline-block whitespace-nowrap" key={`${token}-${tokenIndex}`}>
            {token.split("").map((character, offset) => {
              const index = startIndex + offset;

              return (
                <Fragment key={`${character}-${index}`}>
                  {index === cursorIndex && cursorAnchor}
                  <span
                    className={`relative inline-block min-w-[0.34ch] ${statusClassNames[statuses[index]]}`}
                  >
                    {character}
                  </span>
                </Fragment>
              );
            })}
          </span>
        );
      })}
      {cursorIndex === targetText.length && cursorAnchor}
    </div>
  );
}
