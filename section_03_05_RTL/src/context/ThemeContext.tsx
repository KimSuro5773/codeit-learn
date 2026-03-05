// src/contexts/ThemeContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme 는 ThemeProvider 내부에서 사용되어야 합니다.");
  }
  return context;
};
