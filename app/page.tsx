"use client"

import { useEffect, useState } from "react"
import BootSequence from "@/components/boot-sequence"
import TerminalManager from "@/components/terminal-manager"
import BackgroundEffects from "@/components/background-effects"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

export default function Home() {
  const [booting, setBooting] = useState(true)
  const [animeLoaded, setAnimeLoaded] = useState(false)

  useEffect(() => {
    // Simulate boot sequence timing
    const timer = setTimeout(() => {
      setBooting(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  // Initialize anime.js on window object
  const handleAnimeLoad = () => {
    // Make sure anime.js is properly loaded on the window object
    if (typeof window !== "undefined" && window.anime) {
      setAnimeLoaded(true)
    }
  }

  return (
    <ThemeProvider>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"
        onLoad={handleAnimeLoad}
        strategy="afterInteractive"
      />
      <div className="relative h-screen w-screen overflow-hidden bg-zinc-900 text-zinc-300 font-mono">
        <BackgroundEffects />

        {booting ? (
          <BootSequence onComplete={() => setBooting(false)} />
        ) : (
          <TerminalManager animeLoaded={animeLoaded} />
        )}
      </div>
    </ThemeProvider>
  )
}
