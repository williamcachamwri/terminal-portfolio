"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

export default function BackgroundEffects() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<HTMLCanvasElement>(null)
  const dotPatternRef = useRef<HTMLCanvasElement>(null)

  // Grid background with parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!document.documentElement) return

      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight

      const moveX = mouseX * 20 - 10
      const moveY = mouseY * 20 - 10

      document.documentElement.style.setProperty("--grid-offset-x", `${moveX}px`)
      document.documentElement.style.setProperty("--grid-offset-y", `${moveY}px`)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Ambient glow effects
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      radius: number
      color: string
      baseOpacity: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }> = []

    // Define base colors without opacity - use theme variables
    const getBaseColors = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      
      // Get theme colors and ensure they're in RGB format
      const safeColor = (color: string) => {
        // If it's already an RGB value like "123, 45, 67"
        if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
          return color;
        }
        
        // If it's a hex color
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return `${r}, ${g}, ${b}`;
        }
        
        // If it's any other format, use a fallback color
        return "100, 100, 100";
      };
      
      // Get colors with fallbacks
      const accentPrimary = computedStyle.getPropertyValue("--accent-primary").trim() || "#a1a1aa";
      const accentSecondary = computedStyle.getPropertyValue("--accent-secondary").trim() || "#71717a";
      const accentHighlight = computedStyle.getPropertyValue("--accent-highlight").trim() || "#e4e4e7";
      
      return [
        safeColor(accentPrimary),
        safeColor(accentSecondary),
        safeColor(accentHighlight)
      ];
    }

    // Create initial particles
    const createParticles = () => {
      particles.length = 0 // Clear existing particles
      const baseColors = getBaseColors()

      for (let i = 0; i < 15; i++) {
        const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)]
        const baseOpacity = 0.1

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 150 + 50,
          color: baseColor,
          baseOpacity: baseOpacity,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          life: 0,
          maxLife: Math.random() * 300 + 100,
        })
      }
    }

    createParticles()

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.life++

        // Wrap around edges
        if (p.x < -p.radius) p.x = canvas.width + p.radius
        if (p.x > canvas.width + p.radius) p.x = -p.radius
        if (p.y < -p.radius) p.y = canvas.height + p.radius
        if (p.y > canvas.height + p.radius) p.y = -p.radius

        // Fade based on life
        const fadeOpacity = 1 - p.life / p.maxLife

        // Draw glow
        try {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)

          // Correctly format RGBA strings with calculated opacity
          const innerOpacity = p.baseOpacity * fadeOpacity
          const outerOpacity = 0

          gradient.addColorStop(0, `rgba(${p.color}, ${innerOpacity})`)
          gradient.addColorStop(1, `rgba(${p.color}, ${outerOpacity})`)

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        } catch (error) {
          console.error("Error drawing gradient:", error);
          // Continue with the animation even if there's an error
        }

        // Remove dead particles and create new ones
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          i--

          // Add a new particle
          const baseColors = getBaseColors()
          const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)]
          const baseOpacity = 0.1

          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 150 + 50,
            color: baseColor,
            baseOpacity: baseOpacity,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            life: 0,
            maxLife: Math.random() * 300 + 100,
          })
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createParticles() // Recreate particles on resize
    }

    window.addEventListener("resize", handleResize)

    // Recreate particles when theme changes
    const observer = new MutationObserver(() => {
      createParticles()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [theme])

  // Floating particles effect
  useEffect(() => {
    if (!particlesRef.current) return

    const canvas = particlesRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      color: string
      speed: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }

        if (!ctx) return;
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    // Remove the hash if it exists
    hex = hex.replace('#', '')
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    return [r, g, b]
  }

  // Dot pattern background
  useEffect(() => {
    if (!dotPatternRef.current) return

    const canvas = dotPatternRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawDotPattern()
    }

    const drawDotPattern = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dotSize = 2
      const spacing = 30
      const opacity = 0.1

      // Get theme colors
      const computedStyle = getComputedStyle(document.documentElement)
      const accentColor = computedStyle.getPropertyValue("--accent-primary").trim() || "#a1a1aa"
      const [r, g, b] = hexToRgb(accentColor)

      // Draw dots
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
          ctx.fill()
        }
      }
    }

    // Initial setup
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return (
    <>
      {/* Grid background with parallax effect */}
      <div
        className="absolute inset-0 z-0 grid-background"
        style={{
          transform: "translate(var(--grid-offset-x, 0), var(--grid-offset-y, 0))",
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Dot pattern background */}
      <canvas ref={dotPatternRef} className="absolute inset-0 z-0" />

      {/* Ambient glow effects */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Floating particles */}
      <canvas ref={particlesRef} className="absolute inset-0 z-0" />
    </>
  )
}