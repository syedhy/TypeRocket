import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAtmosphereLayer } from "../config/atmosphere";
import { MAX_ALTITUDE_KM, MIN_ELAPSED_SECONDS_FOR_WPM } from "../config/game";
import type { CharacterStatus, TypingMetrics } from "../types/game";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { generateRandomWords } from "../config/words";
import { soundPlayer } from "../utils/sounds";

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
  return Math.round((Math.pow(wpm, 2) * 1.8 + 25 * wpm) * correctProgress * Math.pow(accuracyMultiplier, 2));
}

export function useTypingGame() {
  const {
    mode,
    textType,
    codeLanguage,
    includePunctuation,
    includeNumbers,
    soundEnabled,
    soundProfile,
    difficulty,
    customText,
    masterMode,
    quickRestartKey,
  } = useGameSettings();

  const [targetText, setTargetText] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(input);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [historicalMistakes, setHistoricalMistakes] = useState(0);
  const [historicalTypedCharacters, setHistoricalTypedCharacters] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [failedMasterMode, setFailedMasterMode] = useState(false);

  const endTime = completedAt ?? now;
  const elapsedSeconds = startedAt ? Math.max((endTime - startedAt) / 1000, 0) : 0;

  useEffect(() => {
    if (soundEnabled) soundPlayer.init();
  }, [soundEnabled]);

  const isComplete = useMemo(() => {
    if (failedMasterMode) return true;
    if (targetText.length === 0) return false;
    if (mode.type === "words" || textType === "code" || textType === "quotes" || textType === "custom") {
      return input.length === targetText.length;
    } else {
      return startedAt !== null && elapsedSeconds >= mode.value;
    }
  }, [mode, input.length, targetText.length, startedAt, elapsedSeconds, textType, failedMasterMode]);

  const reset = useCallback(async () => {
    const resetTime = Date.now();
    setIsLoading(true);
    setInput("");
    setStartedAt(null);
    setCompletedAt(null);
    setHistoricalMistakes(0);
    setHistoricalTypedCharacters(0);
    setWpmHistory([]);
    setFailedMasterMode(false);
    inputRef.current = "";
    setNow(resetTime);

    let count = 30;
    if (mode.type === "words") count = mode.value;
    if (mode.type === "time") count = 100;

    const text = await generateRandomWords(
      count,
      textType,
      difficulty,
      codeLanguage,
      includePunctuation,
      includeNumbers,
      customText
    );

    setTargetText(text);
    setIsLoading(false);
  }, [mode, textType, difficulty, codeLanguage, includePunctuation, includeNumbers, customText]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Quick restart key binding (Tab key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quickRestartKey === "tab" && e.key === "Tab") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickRestartKey, reset]);

  // Extend buffer for time mode
  useEffect(() => {
    if (mode.type === "time" && textType === "words" && targetText.length > 0 && input.length >= targetText.length - 30 && !isComplete) {
      generateRandomWords(50, textType, difficulty, codeLanguage, includePunctuation, includeNumbers, customText).then(
        (more) => setTargetText((prev) => prev + " " + more)
      );
    }
  }, [mode.type, input.length, targetText.length, isComplete, textType, difficulty, codeLanguage, includePunctuation, includeNumbers, customText]);

  useEffect(() => {
    if (isComplete && !completedAt) {
      setCompletedAt(Date.now());
    }
  }, [isComplete, completedAt]);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  // Timer loop & WPM history sampler
  useEffect(() => {
    if (!startedAt || completedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);

      // Record WPM sample every 1 sec
      const currentElapsed = Math.max((currentNow - startedAt) / 1000, 0.1);
      const correctChars = countCorrectCharacters(inputRef.current, targetText);
      const currentWpm = Math.round((correctChars / 5) / (currentElapsed / 60));
      setWpmHistory((prev) => [...prev, currentWpm]);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [completedAt, startedAt, targetText]);

  const handleInputChange = useCallback(
    (nextValue: string) => {
      if (isComplete || isLoading) return;
      const nextInput = nextValue.slice(0, targetText.length);

      if (!startedAt && nextInput.length > 0) {
        const startTime = Date.now();
        setStartedAt(startTime);
        setNow(startTime);
      }

      inputRef.current = nextInput;
      setInput(nextInput);
    },
    [startedAt, targetText, isComplete, isLoading]
  );

  const typeCharacter = useCallback(
    (character: string) => {
      if (isComplete || isLoading) return;
      if (soundEnabled) soundPlayer.playKeypress(soundProfile);
      const currentInput = inputRef.current;

      if (currentInput.length >= targetText.length) {
        return;
      }

      const targetCharacter = targetText[currentInput.length];

      // Master Mode: Instant failure if mistake typed
      if (masterMode && character !== targetCharacter) {
        setFailedMasterMode(true);
        setCompletedAt(Date.now());
        return;
      }

      const nextInput = `${currentInput}${character}`.slice(0, targetText.length);
      const eventTime = Date.now();

      inputRef.current = nextInput;
      setHistoricalTypedCharacters((count) => count + 1);

      if (character !== targetCharacter) {
        setHistoricalMistakes((count) => count + 1);
      }

      if (!startedAt && currentInput.length === 0) {
        setStartedAt(eventTime);
        setNow(eventTime);
      }

      setInput(nextInput);
    },
    [startedAt, targetText, isComplete, isLoading, soundEnabled, soundProfile, masterMode]
  );

  const deleteCharacter = useCallback(() => {
    if (isComplete || isLoading) return;
    if (soundEnabled) soundPlayer.playKeypress(soundProfile);
    const currentInput = inputRef.current;

    if (currentInput.length === 0) {
      return;
    }

    const nextInput = currentInput.slice(0, -1);
    inputRef.current = nextInput;
    setInput(nextInput);
  }, [isComplete, isLoading, soundEnabled, soundProfile]);

  const metrics: TypingMetrics = useMemo(() => {
    const correctCharacters = countCorrectCharacters(input, targetText);
    const visibleMistakes = countMistakes(input, targetText);
    const mistakes = Math.max(historicalMistakes, visibleMistakes);
    const totalTypedCharacters = input.length;
    const accuracyAttempts = Math.max(historicalTypedCharacters, totalTypedCharacters);
    const elapsedMinutes = Math.max(elapsedSeconds / 60, MIN_ELAPSED_SECONDS_FOR_WPM / 60);
    const wpm = startedAt ? Math.round(correctCharacters / 5 / elapsedMinutes) : 0;
    const accuracy =
      accuracyAttempts > 0 ? Math.round(((accuracyAttempts - mistakes) / accuracyAttempts) * 100) : 100;

    let progress = 0;
    if (mode.type === "words" || textType === "code" || textType === "quotes" || textType === "custom") {
      progress = targetText.length > 0 ? correctCharacters / targetText.length : 0;
    } else {
      progress = clamp(elapsedSeconds / mode.value, 0, 1);
    }

    const typedProgress = targetText.length > 0 ? totalTypedCharacters / targetText.length : 0;
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
    mode,
    textType,
    elapsedSeconds,
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
    isLoading,
    handleInputChange,
    typeCharacter,
    deleteCharacter,
    reset,
    wpmHistory,
  };
}
