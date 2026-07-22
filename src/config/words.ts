import { Difficulty } from "../contexts/GameSettingsContext";
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS } from "./dictionary";
import { CODE_SNIPPETS, CodeLanguage } from "./codeSnippets";

const PUNCTUATION_MARKS = [".", ",", "!", "?", ";", ":", "-", '"', "'"];
const COMMON_NUMBERS = ["1", "2", "3", "7", "10", "42", "69", "100", "365", "2026", "99"];

function applyModifiers(words: string[], punctuation: boolean, numbers: boolean): string[] {
  let result = [...words];

  if (numbers) {
    result = result.map((word) => {
      if (Math.random() < 0.25) {
        const num = COMMON_NUMBERS[Math.floor(Math.random() * COMMON_NUMBERS.length)];
        return Math.random() < 0.5 ? `${num}` : `${word} ${num}`;
      }
      return word;
    });
  }

  if (punctuation) {
    result = result.map((word, idx) => {
      if (Math.random() < 0.3) {
        const mark = PUNCTUATION_MARKS[Math.floor(Math.random() * PUNCTUATION_MARKS.length)];
        if (mark === '"' || mark === "'") {
          return `${mark}${word}${mark}`;
        }
        return `${word}${mark}`;
      }
      if (idx === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
  }

  return result;
}

export async function generateRandomWords(
  count: number,
  type: "words" | "code" | "quotes" | "custom" = "words",
  difficulty: Difficulty = "medium",
  codeLanguage: CodeLanguage = "javascript",
  punctuation: boolean = false,
  numbers: boolean = false,
  customText: string = ""
): Promise<string> {
  if (type === "custom") {
    return customText && customText.trim().length > 0
      ? customText.trim()
      : "Constellation telemetry active. TypeRocket engines ignited!";
  }

  if (type === "code") {
    const snippets = CODE_SNIPPETS[codeLanguage] || CODE_SNIPPETS.javascript;
    const randomIndex = Math.floor(Math.random() * snippets.length);
    return snippets[randomIndex];
  }

  if (type === "quotes") {
    try {
      const skip = Math.floor(Math.random() * 1400);
      const res = await fetch(`https://dummyjson.com/quotes?limit=3&skip=${skip}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.quotes && data.quotes.length > 0) {
          return data.quotes.map((q: { quote: string }) => q.quote).join(" ");
        }
      }
    } catch {
      console.warn("Quotes API offline, using curated quotes");
    }
    const fallbackQuotes = [
      "That's one small step for man, one giant leap for mankind.",
      "The universe is under no obligation to make sense to you.",
      "Across the sea of space, the stars are other suns.",
      "Somewhere, something incredible is waiting to be known."
    ];
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  let dictionary: string[] = [];

  switch (difficulty) {
    case "easy":
      dictionary = EASY_WORDS;
      break;
    case "medium":
      dictionary = MEDIUM_WORDS;
      break;
    case "hard":
      dictionary = HARD_WORDS;
      break;
    default:
      dictionary = MEDIUM_WORDS;
  }

  const selectedWords: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    selectedWords.push(dictionary[randomIndex]);
  }

  const modifiedWords = applyModifiers(selectedWords, punctuation, numbers);
  return modifiedWords.join(" ");
}
