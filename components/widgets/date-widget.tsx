"use client"

import { useState, useEffect } from "react"

export default function DateWidget() {
  const [date, setDate] = useState(new Date())
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Update the date every second
    const interval = setInterval(() => {
      setDate(new Date())
    }, 1000)

    // Trigger animation if anime.js is available
    if (window.anime) {
      window.anime({
        targets: ".date-widget",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
        complete: () => setAnimationComplete(true),
      })

      window.anime({
        targets: ".date-part",
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: window.anime.stagger(100, { start: 300 }),
        duration: 600,
        easing: "easeOutExpo",
      })
    } else {
      setAnimationComplete(true)
    }

    return () => clearInterval(interval)
  }, [])

  // Format options
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return (
    <div className="date-widget">
      <div className="date-time">{date.toLocaleTimeString(undefined, timeOptions)}</div>
      <div className="text-sm mb-2">{date.toLocaleDateString(undefined, dateOptions)}</div>

      {animationComplete && (
        <div className="date-parts">
          <div className="date-part">{date.getHours() > 11 ? "PM" : "AM"}</div>
          <div className="date-part">Day {date.getDate()}</div>
          <div className="date-part">
            Week {Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}
          </div>
          <div className="date-part">Month {date.getMonth() + 1}</div>
          <div className="date-part">Q{Math.floor(date.getMonth() / 3) + 1}</div>
          <div className="date-part">
            Day {Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="date-part">
            {date.getHours() < 12 ? "Morning" : date.getHours() < 18 ? "Afternoon" : "Evening"}
          </div>
        </div>
      )}
    </div>
  )
}
