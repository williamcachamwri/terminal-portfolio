"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Github, Linkedin, Twitter, Mail } from "lucide-react"

export default function ContactContent() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Apply anime.js animation when component mounts
  useEffect(() => {
    if (window.anime && containerRef.current) {
      const elements = containerRef.current.querySelectorAll(".animate-in")

      window.anime
        .timeline({
          easing: "easeOutExpo",
        })
        .add({
          targets: ".contact-title",
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 800,
          easing: "easeOutExpo",
        })
        .add(
          {
            targets: elements,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: window.anime.stagger(100),
            duration: 800,
          },
          "-=500",
        )
        .add(
          {
            targets: ".social-link",
            scale: [0.8, 1],
            opacity: [0, 1],
            delay: window.anime.stagger(100),
            duration: 600,
            easing: "easeOutExpo",
          },
          "-=500",
        )
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Show progress
    if (window.anime) {
      const progress = document.querySelector(".submit-progress")
      if (progress) {
        window.anime({
          targets: progress,
          width: ["0%", "100%"],
          duration: 1500,
          easing: "easeInOutQuart",
        })
      }
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({
      name: "",
      email: "",
      message: "",
    })

    // Apply success animation
    if (window.anime) {
      window.anime({
        targets: ".success-message",
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutExpo",
      })
    }

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <h2 className="text-xl font-bold contact-title">Contact</h2>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6 animate-in">
          <p>
            I'm always open to new opportunities and collaborations. Feel free to reach out through the form or via
            social media.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>

            <div className="social-links">
              <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={16} className="social-link-icon" />
                <span>Github</span>
              </a>

              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin size={16} className="social-link-icon" />
                <span>LinkedIn</span>
              </a>

              <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={16} className="social-link-icon" />
                <span>Twitter</span>
              </a>

              <a href="mailto:email@example.com" className="social-link">
                <Mail size={16} className="social-link-icon" />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Location</h3>
            <p>San Francisco, CA</p>
          </div>
        </div>

        <div className="animate-in">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="form-input"
                disabled={isSubmitting || isSubmitted}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="form-input"
                disabled={isSubmitting || isSubmitted}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                className="form-textarea"
                disabled={isSubmitting || isSubmitted}
              />
            </div>

            <button type="submit" disabled={isSubmitting || isSubmitted} className="form-submit">
              {isSubmitting ? (
                <>
                  <span>Sending...</span>
                  <div className="relative w-full h-1 mt-2 bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="submit-progress absolute left-0 top-0 h-full bg-zinc-400"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </>
              ) : isSubmitted ? (
                <div className="success-message flex items-center justify-center gap-2">
                  <span>Message Sent!</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
