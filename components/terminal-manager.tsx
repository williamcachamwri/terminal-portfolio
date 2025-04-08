"use client"

import { useState, useEffect } from "react"
import Terminal from "@/components/terminal"
import { useTheme } from "@/components/theme-provider"
import { nanoid } from "nanoid"

interface TerminalManagerProps {
  animeLoaded: boolean
}

export default function TerminalManager({ animeLoaded }: TerminalManagerProps) {
  const { theme, setTheme } = useTheme()
  const [terminals, setTerminals] = useState<Array<{ id: string; title: string; type: string; zIndex: number }>>([])
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null)
  const [nextZIndex, setNextZIndex] = useState(100)

  // Create initial terminal on load
  useEffect(() => {
    if (terminals.length === 0) {
      const id = nanoid()
      setTerminals([{ id, title: "main-terminal", type: "terminal", zIndex: 100 }])
      setActiveTerminalId(id)
    }
  }, [terminals.length])

  // Apply animation to terminals when they're created
  useEffect(() => {
    if (animeLoaded && window.anime && terminals.length > 0) {
      window.anime({
        targets: ".terminal-window",
        opacity: [0, 1],
        translateY: [20, 0],
        delay: window.anime.stagger(100),
        duration: 600,
        easing: "easeOutExpo",
      })
    }
  }, [animeLoaded, terminals.length])

  const createTerminal = (type: string, title: string) => {
    const id = nanoid()
    const newZIndex = nextZIndex + 1

    // Add animation if anime.js is loaded
    if (animeLoaded && window.anime) {
      // First create the terminal
      setTerminals((prev) => [...prev, { id, title, type, zIndex: newZIndex }])
      setActiveTerminalId(id)
      setNextZIndex(newZIndex)

      // Then apply animation in the next tick
      setTimeout(() => {
        const terminalEl = document.querySelector(`.terminal-window[data-id="${id}"]`)
        if (terminalEl) {
          window.anime({
            targets: terminalEl,
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 600,
            easing: "easeOutExpo",
          })
        }
      }, 0)
    } else {
      setTerminals((prev) => [...prev, { id, title, type, zIndex: newZIndex }])
      setActiveTerminalId(id)
      setNextZIndex(newZIndex)
    }

    return id
  }

  const closeTerminal = (id: string) => {
    if (animeLoaded && window.anime) {
      const terminalEl = document.querySelector(`.terminal-window[data-id="${id}"]`)
      if (terminalEl) {
        window.anime({
          targets: terminalEl,
          opacity: 0,
          scale: 0.9,
          duration: 300,
          easing: "easeOutQuad",
          complete: () => {
            setTerminals((prev) => prev.filter((terminal) => terminal.id !== id))
            if (activeTerminalId === id) {
              const remaining = terminals.filter((terminal) => terminal.id !== id)
              setActiveTerminalId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
            }
          },
        })
      }
    } else {
      setTerminals((prev) => prev.filter((terminal) => terminal.id !== id))
      if (activeTerminalId === id) {
        const remaining = terminals.filter((terminal) => terminal.id !== id)
        setActiveTerminalId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
      }
    }
  }

  const bringToFront = (id: string) => {
    if (id === activeTerminalId) return

    const newZIndex = nextZIndex + 1
    setTerminals((prev) => prev.map((terminal) => (terminal.id === id ? { ...terminal, zIndex: newZIndex } : terminal)))
    setActiveTerminalId(id)
    setNextZIndex(newZIndex)
  }

  const handleCommand = (command: string, terminalId: string) => {
    const parts = command.toLowerCase().trim().split(" ")

    // Handle theme command
    if (parts[0] === "theme" && parts.length > 1) {
      const requestedTheme = parts[1]
      const availableThemes = [
        "zinc",
        "dracula",
        "nord",
        "solarized-dark",
        "solarized-light",
        "monokai",
        "cyberpunk",
        "tokyo-night",
        "synthwave",
        "tron",
        "matrix",
      ]

      if (availableThemes.includes(requestedTheme)) {
        setTheme(requestedTheme as any)
        return {
          success: true,
          message: `Theme changed to ${requestedTheme}`,
        }
      } else {
        return {
          success: false,
          message: `Unknown theme: ${requestedTheme}. Available themes: ${availableThemes.join(", ")}`,
        }
      }
    }

    // Handle show command
    if (parts[0] === "show" && parts.length > 1) {
      const section = parts[1]
      if (["about", "projects", "skills", "contact"].includes(section)) {
        createTerminal("section", section)
        return {
          success: true,
          message: `Opening ${section} window...`,
        }
      } else {
        return {
          success: false,
          message: `Unknown section: ${section}. Available sections: about, projects, skills, contact`,
        }
      }
    }

    // Handle direct section commands
    if (["about", "projects", "skills", "contact"].includes(parts[0])) {
      createTerminal("section", parts[0])
      return {
        success: true,
        message: `Opening ${parts[0]} window...`,
      }
    }

    // Handle close command
    if (parts[0] === "close" && parts.length > 1) {
      const section = parts[1]
      const terminalToClose = terminals.find((t) => t.title === section && t.type === "section")
      if (terminalToClose) {
        closeTerminal(terminalToClose.id)
        return {
          success: true,
          message: `Closing ${section} window...`,
        }
      } else {
        return {
          success: false,
          message: `No open window found with name: ${section}`,
        }
      }
    }

    return null
  }

  return (
    <div className="h-full w-full">
      {terminals.map((terminal) => (
        <Terminal
          key={terminal.id}
          id={terminal.id}
          title={terminal.title}
          type={terminal.type}
          zIndex={terminal.zIndex}
          isActive={terminal.id === activeTerminalId}
          onClose={() => closeTerminal(terminal.id)}
          onFocus={() => bringToFront(terminal.id)}
          onCommand={handleCommand}
          animeLoaded={animeLoaded}
        />
      ))}
    </div>
  )
}
