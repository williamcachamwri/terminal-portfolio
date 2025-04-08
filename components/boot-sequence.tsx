"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [bootStage, setBootStage] = useState(0)
  const [bootText, setBootText] = useState<string[]>([])

  const bootMessages = [
    "BIOS Initialization...",
    "CPU: AMD Ryzen 9 5950X @ 3.4GHz",
    "Memory Test: 32768MB OK",
    "Initializing Disk Subsystem...",
    "Loading Terminal OS v3.0.0 - Multi-Theme Edition...",
    "Mounting filesystems...",
    "Starting network services...",
    "Initializing graphics subsystem...",
    "Loading user profile...",
    "Starting Terminal UI...",
  ]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (bootStage < bootMessages.length) {
      timeout = setTimeout(
        () => {
          setBootText((prev) => [...prev, bootMessages[bootStage]])
          setBootStage((prev) => prev + 1)
        },
        300 + Math.random() * 300,
      )
    } else {
      timeout = setTimeout(() => {
        onComplete()
      }, 800)
    }

    return () => clearTimeout(timeout)
  }, [bootStage, bootMessages, onComplete])

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-3xl">
        <pre className="text-xs text-zinc-400 sm:text-sm">
          {`
 _______                    _             _   ____   _____ 
|__   __|                  (_)           | | / __ \\ / ____|
   | | ___ _ __ _ __ ___    _ _ __   __ _| || |  | | (___  
   | |/ _ \\ '__| '_ \` _ \\  | | '_ \\ / _\` | || |  | |\\___ \\ 
   | |  __/ |  | | | | | | | | | | | (_| | || |__| |____) |
   |_|\\___|_|  |_| |_| |_| |_|_| |_|\\__,_|_(_)____/|_____/ 
                                                           
          `}
        </pre>

        <div className="mt-8 font-mono text-sm">
          {bootText.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-zinc-300"
            >
              {text}
            </motion.div>
          ))}

          {bootStage < bootMessages.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
              className="cursor inline-block h-4 w-2"
            />
          )}
        </div>

        <motion.div className="mt-12 h-2 w-full overflow-hidden rounded-full bg-zinc-800" initial={{ width: "0%" }}>
          <motion.div
            className="h-full bg-zinc-400"
            initial={{ width: "0%" }}
            animate={{ width: `${(bootStage / bootMessages.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
