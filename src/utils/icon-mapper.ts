import { icons } from "lucide-react";

const KEYWORD_ICON_MAP: { [key: string]: keyof typeof icons } = {
  email: "Mail",
  mail: "Mail",
  send: "Send",
  buy: "ShoppingCart",
  shop: "Store",
  purchase: "CreditCard",
  call: "Phone",
  phone: "Phone",
  meet: "Users",
  meeting: "Users",
  schedule: "Calendar",
  book: "Book",
  read: "BookOpen",
  write: "PenSquare",
  code: "Code",
  develop: "TerminalSquare",
  design: "Palette",
  draw: "PenTool",
  clean: "Trash2",
  organize: "Folder",
  gym: "Dumbbell",
  workout: "HeartPulse",
  run: "Footprints",
  pay: "DollarSign",
  bill: "Receipt",
  fix: "Wrench",
  build: "Hammer",
  cook: "CookingPot",
  eat: "Utensils",
  travel: "Plane",
  fly: "Plane",
  drive: "Car",
  review: "FileCheck",
  check: "ListChecks",
  update: "RefreshCw",
  learn: "BrainCircuit",
  study: "GraduationCap",
};

const DEFAULT_ICON: keyof typeof icons = "ClipboardCheck";

export const getIconForTask = (
  title: string,
  description: string
): keyof typeof icons => {
  const text = `${title.toLowerCase()} ${description.toLowerCase()}`;
  const words = text.split(/\s+/);

  for (const word of words) {
    if (KEYWORD_ICON_MAP[word]) {
      return KEYWORD_ICON_MAP[word];
    }
  }

  return DEFAULT_ICON;
};