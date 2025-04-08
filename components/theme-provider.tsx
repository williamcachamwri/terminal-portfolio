"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import * as animeJs from "animejs"

// Get the default export from the module
const anime = animeJs.default || animeJs

type ThemeName =
  | "zinc"
  | "dracula"
  | "nord"
  | "solarized-dark"
  | "solarized-light"
  | "monokai"
  | "cyberpunk"
  | "tokyo-night"
  | "synthwave"
  | "tron"
  | "matrix"

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "zinc",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("zinc")

  // Apply theme class to document
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "theme-dracula",
      "theme-nord",
      "theme-solarized-dark",
      "theme-solarized-light",
      "theme-monokai",
      "theme-cyberpunk",
      "theme-tokyo-night",
      "theme-synthwave",
      "theme-tron",
      "theme-matrix",
    )

    // Add the current theme class
    if (theme !== "zinc") {
      document.documentElement.classList.add(`theme-${theme}`)
    }

    // Apply theme change animation if anime.js is loaded
    if (window.anime) {
      // Animate all themed elements
      window.anime({
        targets: [
          ".terminal-window",
          ".terminal-content",
          ".command-prompt",
          ".command-text",
          ".cursor",
          ".skill-bar",
          ".project-card",
          ".social-link",
        ],
        easing: "easeOutQuad",
        duration: 800,
        delay: window.anime.stagger(50),
        complete: () => {
          // Perform additional animations after theme change
          if (document.querySelector(".terminal-window")) {
            window.anime({
              targets: ".terminal-window",
              borderColor: [
                { value: "rgba(255,255,255,0.5)", duration: 100 },
                { value: "var(--terminal-border)", duration: 300 },
              ],
              boxShadow: [
                { value: "0 0 20px rgba(255,255,255,0.3)", duration: 100 },
                { value: "0 10px 25px -5px var(--shadow-color)", duration: 300 },
              ],
              easing: "easeOutQuad",
            })
          }
        },
      })
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
