"use client"

import { useState } from "react"
import { motion, useMotionValue } from "framer-motion"
import { X, Minimize2, Maximize2 } from "lucide-react"
import AboutContent from "@/components/window-contents/about-content"
import ProjectsContent from "@/components/window-contents/projects-content"
import SkillsContent from "@/components/window-contents/skills-content"
import ContactContent from "@/components/window-contents/contact-content"

interface TerminalWindowProps {
  title: string
  zIndex: number
  onClose: () => void
}

export default function TerminalWindow({ title, zIndex, onClose }: TerminalWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(Math.random() * 100)
  const y = useMotionValue(Math.random() * 100)

  const renderContent = () => {
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
    <motion.div
      className={`absolute overflow-hidden rounded-md border border-[#39FF14] bg-[#0D0D0D]/90 backdrop-blur-sm ${
        isMaximized ? "inset-0" : "h-[80vh] w-[90vw] max-w-4xl"
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isMaximized ? 0 : x.get(),
        y: isMaximized ? 0 : y.get(),
        transition: { type: "spring", damping: 20, stiffness: 300 },
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        x: isMaximized ? 0 : x,
        y: isMaximized ? 0 : y,
        zIndex,
      }}
      drag={!isMaximized}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      dragMomentum={false}
    >
      {/* Window header */}
      <div className="flex h-8 items-center justify-between border-b border-[#39FF14]/30 bg-[#1A1A1A] px-3">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-[#FF00FF]" />
          <span className="text-sm text-[#00FFFF]">{title}.sh</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
          >
            {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={onClose} className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/10">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="h-[calc(100%-2rem)] overflow-auto p-4">{renderContent()}</div>
    </motion.div>
  )
}
