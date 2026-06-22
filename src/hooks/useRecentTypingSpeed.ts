import { useEffect, useMemo, useRef, useState } from "react";
import { RECENT_SPEED_WINDOW_MS } from "../config/game";

type TypingEvent = {
  at: number;
};

export function useRecentTypingSpeed(input: string, targetText: string) {
  const previousInputRef = useRef(input);
  const eventsRef = useRef<TypingEvent[]>([]);
  const [tick, setTick] = useState(() => Date.now());

  useEffect(() => {
    const previousInput = previousInputRef.current;
    const addedCharacter = input.length > previousInput.length;

    if (input.length < previousInput.length) {
      eventsRef.current = [];
      setTick(Date.now());
    }

    if (addedCharacter) {
      const addedText = input.slice(previousInput.length);
      const validEvents = addedText.split("").filter((character, offset) => {
        const index = previousInput.length + offset;
        return character === targetText[index];
      });

      if (validEvents.length > 0) {
        const eventTime = Date.now();
        eventsRef.current = [
          ...eventsRef.current,
          ...validEvents.map(() => ({ at: eventTime })),
        ];
        setTick(eventTime);
      }
    }

    previousInputRef.current = input;
  }, [input, targetText]);

  useEffect(() => {
    const nextExpiry = eventsRef.current[0]?.at + RECENT_SPEED_WINDOW_MS;

    if (!nextExpiry) {
      return;
    }

    const delay = Math.max(nextExpiry - Date.now() + 16, 16);
    const timeout = window.setTimeout(() => setTick(Date.now()), delay);
    return () => window.clearTimeout(timeout);
  }, [tick]);

  return useMemo(() => {
    const cutoff = tick - RECENT_SPEED_WINDOW_MS;
    eventsRef.current = eventsRef.current.filter((event) => event.at >= cutoff);
    const recentCharacters = eventsRef.current.length;
    const charactersPerSecond = recentCharacters / (RECENT_SPEED_WINDOW_MS / 1000);
    const recentWpm = Math.round((recentCharacters / 5) / (RECENT_SPEED_WINDOW_MS / 60000));
    const intensity = Math.min(charactersPerSecond / 5, 1);
    const lastKeystrokeAt = eventsRef.current.length > 0 
      ? eventsRef.current[eventsRef.current.length - 1].at 
      : 0;

    return {
      recentCharacters,
      charactersPerSecond,
      recentWpm,
      intensity,
      lastKeystrokeAt,
    };
  }, [tick]);
}
