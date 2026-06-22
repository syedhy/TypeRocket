export const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "been", "has", "had", "does", "did", "doing",
  "am", "is", "are", "was", "were", "be", "being", "been", "have", "has",
  "had", "do", "does", "did", "shall", "will", "should", "would", "may", "might",
  "must", "can", "could", "ought", "need", "dare", "used", "to", "a", "an",
  "the", "and", "but", "or", "for", "nor", "so", "yet", "after", "although",
  "as", "because", "before", "even", "if", "in", "order", "that", "since", "though",
  "unless", "until", "when", "whenever", "where", "whereas", "wherever", "whether", "while", "he",
  "she", "it", "they", "him", "her", "them", "his", "hers", "its", "theirs",
  "space", "planet", "stars", "orbit", "rocket", "comet", "galaxy", "moon", "mars", "earth"
];

import { Difficulty } from "../contexts/GameSettingsContext";
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS } from "./dictionary";

export const CODE_WORDS = [
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do",
  "switch", "case", "break", "continue", "default", "class", "extends", "super",
  "this", "new", "true", "false", "null", "undefined", "NaN", "Infinity",
  "import", "export", "from", "as", "default", "async", "await", "yield",
  "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of",
  "void", "delete", "debugger", "with", "=>", "==", "===", "!=", "!==",
  "&&", "||", "!", "+", "-", "*", "/", "%", "++", "--", "=", "+=", "-=",
  "[]", "{}", "()", ";", ":", ",", ".", "?", "??", "?.[]", "?.()"
];

export async function generateRandomWords(count: number, type: "words" | "code" | "quotes" = "words", difficulty: Difficulty = "medium"): Promise<string> {
  if (type === "quotes") {
    try {
      const skip = Math.floor(Math.random() * 1400);
      const res = await fetch(`https://dummyjson.com/quotes?limit=3&skip=${skip}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.quotes && data.quotes.length > 0) {
          return data.quotes.map((q: any) => q.quote).join(" ");
        }
      }
    } catch (e) {
      console.warn("Quotes API failed, falling back to local");
    }
    return "The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step.";
  }

  let dictionary: string[] = [];

  if (type === "code") {
    dictionary = CODE_WORDS;
  } else {
    // For 'words' type, use offline dictionary for 0ms latency and difficulty scaling
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
  }

  const selectedWords = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    selectedWords.push(dictionary[randomIndex]);
  }
  return selectedWords.join(" ");
}
