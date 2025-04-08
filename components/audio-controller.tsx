"use client"

import { useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface AudioControllerProps {
  enabled: boolean
  onToggle: () => void
}

export default function AudioController({ enabled, onToggle }: AudioControllerProps) {
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const keyPressRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio elements
    if (!ambientRef.current) {
      ambientRef.current = new Audio("/ambient.mp3")
      ambientRef.current.loop = true
      ambientRef.current.volume = 0.2
    }

    if (!keyPressRef.current) {
      keyPressRef.current = new Audio("/keypress.mp3")
      keyPressRef.current.volume = 0.1
    }

    // Handle key press sounds
    const handleKeyDown = () => {
      if (enabled && keyPressRef.current) {
        keyPressRef.current.currentTime = 0
        keyPressRef.current.play().catch(() => {})
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // Play/pause ambient sound
    if (enabled && ambientRef.current) {
      ambientRef.current.play().catch(() => {})
    } else if (ambientRef.current) {
      ambientRef.current.pause()
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [enabled])

  return (
    <button
      onClick={onToggle}
      className="absolute bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 shadow-lg hover:bg-zinc-700"
      aria-label={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  )
}
