"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import CommandLine from "@/components/command-line"
import { processCommand } from "@/lib/command-processor"
import AboutContent from "@/components/window-contents/about-content"
import ProjectsContent from "@/components/window-contents/projects-content"
import SkillsContent from "@/components/window-contents/skills-content"
import ContactContent from "@/components/window-contents/contact-content"
import DateWidget from "@/components/widgets/date-widget"
import WhoamiWidget from "@/components/widgets/whoami-widget"
import ThemeSelector from "@/components/widgets/theme-selector"

interface TerminalProps {
  id: string
  title: string
  type: string
  zIndex: number
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  onCommand: (command: string, terminalId: string) => any
  animeLoaded: boolean
}

export default function Terminal({
  id,
  title,
  type,
  zIndex,
  isActive,
  onClose,
  onFocus,
  onCommand,
  animeLoaded,
}: TerminalProps) {
  const { theme } = useTheme()
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [outputHistory, setOutputHistory] = useState<Array<{ type: string; content: any }>>([
    { type: "text", content: "Terminal OS v3.0.0 - Multi-Theme Edition" },
    { type: "text", content: 'Type "help" to see available commands.' },
    { type: "text", content: "" },
  ])
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [position, setPosition] = useState({
    x: Math.random() * (window.innerWidth - 600),
    y: Math.random() * (window.innerHeight - 400),
  })
  const [size, setSize] = useState({ width: 600, height: 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isCommandProcessing, setIsCommandProcessing] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new content is added
  useEffect(() => {
    if (contentRef.current && type === "terminal") {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [outputHistory, type])

  // Apply anime.js animation when terminal is created
  useEffect(() => {
    if (animeLoaded && window.anime && terminalRef.current) {
      window.anime({
        targets: terminalRef.current,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: "easeOutExpo",
      })
    }
  }, [animeLoaded])

  const handleCommand = async (command: string) => {
    // Add command to history
    setCommandHistory((prev) => [...prev, command])

    // Add the command to output history with typing animation
    setOutputHistory((prev) => [...prev, { type: "command", content: `${currentPath} > ${command}` }])

    // Show processing state
    setIsCommandProcessing(true)

    // Simulate slight processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, command.length * 10 + 100))

    // Pass command to parent for potential window creation or theme change
    const parentResult = onCommand(command, id)

    // If parent handled the command, add its result to output
    if (parentResult) {
      setOutputHistory((prev) => [
        ...prev,
        {
          type: parentResult.success ? "success" : "error",
          content: parentResult.message,
        },
      ])
      setIsCommandProcessing(false)
      return
    }

    // Handle clear command directly
    if (command.toLowerCase().trim() === "clear") {
      setOutputHistory([])
      setIsCommandProcessing(false)
      return
    }

    // Process command and get result
    const result = processCommand(command, currentPath)

    // Update path if changed
    if (result.newPath) {
      setCurrentPath(result.newPath)
    }

    // Add output to history with special handling for widgets
    setOutputHistory((prev) => {
      // Convert result output to proper format and handle special widgets
      const formattedOutput = result.output.map((o) => {
        if (o.type === "date-widget") {
          return { type: "widget", content: <DateWidget /> }
        } else if (o.type === "whoami-widget") {
          return { type: "widget", content: <WhoamiWidget /> }
        } else if (o.type === "theme-selector") {
          return { type: "widget", content: <ThemeSelector /> }
        } else if (o.type === "neon") {
          return { type: "special", content: o.content, effect: "neon" }
        } else if (o.type === "glitch") {
          return { type: "special", content: o.content, effect: "glitch" }
        } else if (o.type === "boom") {
          return { type: "special", content: o.content, effect: "boom" }
        } else {
          return { type: o.type || "text", content: o.content }
        }
      })

      return [...prev, ...formattedOutput]
    })

    setIsCommandProcessing(false)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest(".terminal-header")) {
      setIsDragging(true)
      onFocus()

      const rect = terminalRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && terminalRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Keep window within viewport bounds
        const maxX = window.innerWidth - terminalRef.current.offsetWidth
        const maxY = window.innerHeight - terminalRef.current.offsetHeight

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const renderSpecialContent = (output: any) => {
    if (output.effect === "neon") {
      return (
        <div
          className="my-2 px-4 py-2 text-center"
          style={{
            color: "var(--accent-highlight)",
            textShadow:
              "0 0 5px var(--accent-highlight), 0 0 10px var(--accent-highlight), 0 0 20px var(--accent-highlight)",
            animation: "pulse 2s infinite",
          }}
        >
          <div className="text-xl font-bold">{output.content}</div>
        </div>
      )
    } else if (output.effect === "glitch") {
      return (
        <div className="my-2 px-4 py-2 text-center glitch" style={{ animation: "glitch 0.3s infinite" }}>
          <div className="text-xl font-bold">{output.content}</div>
        </div>
      )
    } else if (output.effect === "boom") {
      return (
        <div
          className="my-2 px-4 py-2 text-center"
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            animation: "scale 0.5s infinite alternate",
          }}
        >
          {output.content}
        </div>
      )
    }
    return <div>{output.content}</div>
  }

  const renderContent = () => {
    if (type === "section") {
      switch (title.toLowerCase()) {
        case "about":
          return <AboutContent />
        case "projects":
          return <ProjectsContent />
        case "skills":
          return <SkillsContent />
        case "contact":
          return <ContactContent />
        default:
          return <div>Window content not found</div>
      }
    }

    return (
      <>
        <div className="space-y-1">
          {outputHistory.map((output, i) => (
            <div
              key={i}
              className={
                output.type === "command"
                  ? "command-text"
                  : output.type === "error"
                    ? "text-red-400"
                    : output.type === "success"
                      ? "text-green-400"
                      : output.type === "file"
                        ? "file-content"
                        : ""
              }
            >
              {output.type === "filesystem" ? (
                <pre className="text-xs">{JSON.stringify(output.content, null, 2)}</pre>
              ) : output.type === "widget" ? (
                output.content
              ) : output.type === "special" ? (
                renderSpecialContent(output)
              ) : (
                <pre className="whitespace-pre-wrap break-words">{output.content}</pre>
              )}
            </div>
          ))}
          {isCommandProcessing && (
            <div className="flex items-center gap-2 text-sm">
              <div className="loading-spinner"></div>
              <span>Processing command...</span>
            </div>
          )}
        </div>
        <div className="pt-2">
          <CommandLine
            currentPath={currentPath}
            onSubmit={handleCommand}
            commandHistory={commandHistory}
            isProcessing={isCommandProcessing}
          />
        </div>
      </>
    )
  }

  const terminalWidth = type === "terminal" ? 600 : 700
  const terminalHeight = type === "terminal" ? 400 : 500

  return (
    <div
      ref={terminalRef}
      data-id={id}
      className={`terminal-window absolute ${isActive ? "glow-border" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${terminalWidth}px`,
        height: `${terminalHeight}px`,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={onFocus}
    >
      <div className="terminal-header">
        <div className="terminal-button close" onClick={onClose}></div>
        <div className="terminal-button minimize"></div>
        <div className="terminal-button maximize"></div>
        <div className="ml-2 text-xs flex-1 text-center">
          {type === "terminal" ? `${title} - ${currentPath}` : `${title}.sh`}
        </div>
      </div>
      <div ref={contentRef} className="terminal-content">
        {renderContent()}
      </div>
    </div>
  )
}
