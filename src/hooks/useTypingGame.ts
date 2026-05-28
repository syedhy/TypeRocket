import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAtmosphereLayer } from "../config/atmosphere";
import { MAX_ALTITUDE_KM, MIN_ELAPSED_SECONDS_FOR_WPM, TARGET_TEXT } from "../config/game";
import type { CharacterStatus, TypingMetrics } from "../types/game";

function countCorrectCharacters(input: string, targetText: string): number {
  return input.split("").reduce((count, character, index) => {
    return character === targetText[index] ? count + 1 : count;
  }, 0);
}

function countMistakes(input: string, targetText: string): number {
  return input.split("").reduce((count, character, index) => {
    return character !== targetText[index] ? count + 1 : count;
  }, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSpeedScoredAltitudeKilometers(correctProgress: number, accuracy: number, wpm: number) {
  const accuracyMultiplier = clamp(accuracy / 100, 0, 1);

  return Math.round(wpm * 10 * correctProgress * accuracyMultiplier);
}

export function useTypingGame(targetText = TARGET_TEXT) {
  const [input, setInput] = useState("");
  const inputRef = useRef(input);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [historicalMistakes, setHistoricalMistakes] = useState(0);
  const [historicalTypedCharacters, setHistoricalTypedCharacters] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const isComplete = input.length === targetText.length;

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (!startedAt || completedAt) {
      return;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [completedAt, startedAt]);

  const handleInputChange = useCallback(
    (nextValue: string) => {
      const nextInput = nextValue.slice(0, targetText.length);
      const isNextComplete = nextInput.length === targetText.length;

      if (!startedAt && nextInput.length > 0) {
        const startTime = Date.now();
        setStartedAt(startTime);
        setNow(startTime);
      }

      if (!isNextComplete) {
        setCompletedAt(null);
      }

      if (isNextComplete) {
        setCompletedAt((existingCompletedAt) => existingCompletedAt ?? Date.now());
      }

      inputRef.current = nextInput;
      setInput(nextInput);
    },
    [startedAt, targetText],
  );

  const reset = useCallback(() => {
    const resetTime = Date.now();
    setInput("");
    setStartedAt(null);
    setCompletedAt(null);
    setHistoricalMistakes(0);
    setHistoricalTypedCharacters(0);
    inputRef.current = "";
    setNow(resetTime);
  }, []);

  const typeCharacter = useCallback(
    (character: string) => {
      const currentInput = inputRef.current;

      if (currentInput.length >= targetText.length) {
        return;
      }

      const nextInput = `${currentInput}${character}`.slice(0, targetText.length);
      const eventTime = Date.now();
      const targetCharacter = targetText[currentInput.length];

      inputRef.current = nextInput;
      setHistoricalTypedCharacters((count) => count + 1);

      if (character !== targetCharacter) {
        setHistoricalMistakes((count) => count + 1);
      }

      if (!startedAt && currentInput.length === 0) {
        setStartedAt(eventTime);
        setNow(eventTime);
      }

      if (nextInput.length === targetText.length) {
        setCompletedAt((existingCompletedAt) => existingCompletedAt ?? eventTime);
      }

      setInput(nextInput);
    },
    [startedAt, targetText],
  );

  const deleteCharacter = useCallback(() => {
    const currentInput = inputRef.current;

    if (currentInput.length === 0) {
      return;
    }

    const nextInput = currentInput.slice(0, -1);
    inputRef.current = nextInput;
    setCompletedAt(null);
    setInput(nextInput);
  }, []);

  const metrics: TypingMetrics = useMemo(() => {
    const endTime = completedAt ?? now;
    const elapsedSeconds = startedAt ? Math.max((endTime - startedAt) / 1000, 0) : 0;
    const correctCharacters = countCorrectCharacters(input, targetText);
    const visibleMistakes = countMistakes(input, targetText);
    const mistakes = Math.max(historicalMistakes, visibleMistakes);
    const totalTypedCharacters = input.length;
    const accuracyAttempts = Math.max(historicalTypedCharacters, totalTypedCharacters);
    const elapsedMinutes = Math.max(elapsedSeconds / 60, MIN_ELAPSED_SECONDS_FOR_WPM / 60);
    const wpm = startedAt ? Math.round(correctCharacters / 5 / elapsedMinutes) : 0;
    const accuracy =
      accuracyAttempts > 0
        ? Math.round(((accuracyAttempts - mistakes) / accuracyAttempts) * 100)
        : 100;
    const progress = correctCharacters / targetText.length;
    const typedProgress = totalTypedCharacters / targetText.length;
    const altitudeKilometers = getSpeedScoredAltitudeKilometers(progress, accuracy, wpm);
    const altitudeProgress = clamp(altitudeKilometers / MAX_ALTITUDE_KM, 0, 1);
    const atmosphereLevelReached = getAtmosphereLayer(altitudeProgress).name;

    return {
      elapsedSeconds,
      correctCharacters,
      mistakes,
      totalTypedCharacters,
      wpm,
      accuracy,
      progress,
      typedProgress,
      altitudeProgress,
      altitudeKilometers,
      atmosphereLevelReached,
      isComplete,
    };
  }, [
    completedAt,
    historicalMistakes,
    historicalTypedCharacters,
    input,
    isComplete,
    now,
    startedAt,
    targetText,
  ]);

  const characterStatuses: CharacterStatus[] = useMemo(() => {
    return targetText.split("").map((targetCharacter, index) => {
      if (index === input.length && !isComplete) {
        return "current";
      }

      if (index >= input.length) {
        return "pending";
      }

      return input[index] === targetCharacter ? "correct" : "incorrect";
    });
  }, [input, isComplete, targetText]);

  return {
    targetText,
    input,
    characterStatuses,
    metrics,
    handleInputChange,
    typeCharacter,
    deleteCharacter,
    reset,
  };
}
