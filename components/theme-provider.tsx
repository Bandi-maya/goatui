"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = 
  | "goat-dark" 
  | "goat-light" 
  | "leather-black" 
  | "midnight-blue" 
  | "cyber-neon" 
  | "glass-frost" 
  | "enterprise-gray" 
  | "luxury-gold";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("leather-black");

  useEffect(() => {
    const saved = localStorage.getItem("goat-theme") as Theme;
    if (saved) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme("leather-black");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    // Remove other theme classes
    root.classList.remove(
      "theme-goat-dark",
      "theme-goat-light",
      "theme-leather-black",
      "theme-midnight-blue",
      "theme-cyber-neon",
      "theme-glass-frost",
      "theme-enterprise-gray",
      "theme-luxury-gold",
      "dark",
      "light"
    );

    root.classList.add(`theme-${newTheme}`);
    if (newTheme === "goat-light" || newTheme === "glass-frost") {
      root.classList.add("light");
    } else {
      root.classList.add("dark");
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("goat-theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
