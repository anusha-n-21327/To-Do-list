import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme =
  | "light"
  | "dark"
  | "blue-dark"
  | "purple-dark"
  | "green-dark"
  | "sunset-dark"
  | "aurora-dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "blue-dark",
      "purple-dark",
      "green-dark",
      "sunset-dark",
      "aurora-dark"
    );

    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }

    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};