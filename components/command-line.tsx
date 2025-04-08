"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface CommandLineProps {
  currentPath: string
  onSubmit: (command: string) => void
  commandHistory: string[]
  isProcessing?: boolean
}

export default function CommandLine({ currentPath, onSubmit, commandHistory, isProcessing = false }: CommandLineProps) {
  const [command, setCommand] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Common commands for suggestions
  const commonCommands = [
    "help",
    "ls",
    "dir",
    "cd",
    "cat",
    "clear",
    "about",
    "projects",
    "skills",
    "contact",
    "show",
    "close",
    "theme",
    "whoami",
    "date",
  ]

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  // Focus input on mount and when clicked anywhere
  useEffect(() => {
    if (!isProcessing) {
      inputRef.current?.focus()
    }

    const handleClick = (e: MouseEvent) => {
      // Only focus if clicking within the terminal content and not processing
      if (!isProcessing && e.target && (e.target as HTMLElement).closest(".terminal-content")) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isProcessing])

  // Update suggestions when command changes
  useEffect(() => {
    if (command) {
      const matchingCommands = commonCommands.filter((cmd) => cmd.startsWith(command.toLowerCase()))
      setSuggestions(matchingCommands)
      setShowSuggestions(matchingCommands.length > 0 && matchingCommands[0] !== command)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [command])

  // Handle command history navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Tab completion
      if (suggestions.length > 0) {
        setCommand(suggestions[0])
        setShowSuggestions(false)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim() && !isProcessing) {
      onSubmit(command)
      setCommand("")
      setHistoryIndex(-1)
      setShowSuggestions(false)
    }
  }

  const applyHighlighting = (text: string) => {
    // Highlight commands in different colors
    const keywords = commonCommands
    const regex = new RegExp(`^(${keywords.join("|")})\\b`, "i")

    if (regex.test(text)) {
      return <span style={{ color: "var(--accent-highlight)" }}>{text}</span>
    }

    return text
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="command-prompt mr-2">{currentPath} &gt;</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none"
            autoComplete="off"
            spellCheck="false"
            disabled={isProcessing}
          />
          {command === "" && cursorVisible && !isProcessing && (
            <span className="cursor absolute top-0 left-0 h-full w-1.5 opacity-70"></span>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full max-h-32 overflow-y-auto rounded-md bg-zinc-800 border border-zinc-700 shadow-lg">
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-1 cursor-pointer hover:bg-zinc-700"
              onClick={() => {
                setCommand(suggestion)
                setShowSuggestions(false)
                inputRef.current?.focus()
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
