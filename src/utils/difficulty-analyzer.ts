const VERY_TOUGH_KEYWORDS = [
  "architecture",
  "database",
  "deployment",
  "end-to-end",
  "entire",
  "refactor",
];
const TOUGH_KEYWORDS = [
  "project",
  "research",
  "develop",
  "implement",
  "design",
  "report",
  "build",
  "create",
];
const CHALLENGING_KEYWORDS = [
  "complex",
  "detailed",
  "investigate",
  "analyze",
  "optimize",
  "test",
];
const EASY_KEYWORDS = [
  "email",
  "buy",
  "schedule",
  "book",
  "reply",
  "review",
  "update",
];
const VERY_EASY_KEYWORDS = ["call", "text", "quick", "simple", "check", "send"];

export const analyzeDifficulty = (
  title: string,
  description: string
): "Very Easy" | "Easy" | "Medium" | "Challenging" | "Tough" | "Very Tough" => {
  const text = `${title.toLowerCase()} ${description.toLowerCase()}`;
  const textLength = text.length;

  if (
    VERY_TOUGH_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength > 200
  ) {
    return "Very Tough";
  }

  if (
    TOUGH_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength > 120
  ) {
    return "Tough";
  }

  if (
    CHALLENGING_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength > 90
  ) {
    return "Challenging";
  }

  if (
    VERY_EASY_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength < 30
  ) {
    return "Very Easy";
  }

  if (
    EASY_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength < 60
  ) {
    return "Easy";
  }

  return "Medium";
};