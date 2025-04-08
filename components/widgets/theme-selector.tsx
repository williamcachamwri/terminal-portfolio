"use client"

import { useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "zinc", label: "Zinc" },
    { name: "dracula", label: "Dracula" },
    { name: "nord", label: "Nord" },
    { name: "solarized-dark", label: "Solarized Dark" },
    { name: "solarized-light", label: "Solarized Light" },
    { name: "monokai", label: "Monokai" },
    { name: "cyberpunk", label: "Cyberpunk" },
    { name: "tokyo-night", label: "Tokyo Night" },
    { name: "synthwave", label: "Synthwave" },
    { name: "tron", label: "Tron" },
    { name: "matrix", label: "Matrix" },
  ]

  useEffect(() => {
    // Trigger animation if anime.js is available
    if (window.anime) {
      window.anime({
        targets: ".theme-option",
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: window.anime.stagger(50),
        duration: 600,
        easing: "easeOutExpo",
      })
    }
  }, [])

  return (
    <div className="theme-selector">
      {themes.map((themeOption) => (
        <div
          key={themeOption.name}
          className={`theme-option ${theme === themeOption.name ? "active" : ""}`}
          onClick={() => setTheme(themeOption.name as any)}
        >
          <div className={`theme-option-preview theme-${themeOption.name}`}>
            <div className="theme-option-preview-header"></div>
            <div className="theme-option-preview-body">{themeOption.label}</div>
          </div>
          <div className="theme-option-name">{themeOption.label}</div>
        </div>
      ))}
    </div>
  )
}
