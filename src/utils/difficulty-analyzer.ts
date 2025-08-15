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
const EASY_KEYWORDS = [
  "call",
  "email",
  "buy",
  "quick",
  "simple",
  "schedule",
  "book",
  "text",
  "reply",
];

export const analyzeDifficulty = (
  title: string,
  description: string
): "Easy" | "Medium" | "Tough" => {
  const text = `${title.toLowerCase()} ${description.toLowerCase()}`;
  const textLength = text.length;

  // Check for tough keywords or very long text
  if (
    TOUGH_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength > 150
  ) {
    return "Tough";
  }

  // Check for easy keywords or very short text
  if (
    EASY_KEYWORDS.some((keyword) => text.includes(keyword)) ||
    textLength < 50
  ) {
    return "Easy";
  }

  // Default to Medium
  return "Medium";
};