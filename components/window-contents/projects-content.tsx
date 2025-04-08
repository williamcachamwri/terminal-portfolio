"use client"

import { useState, useEffect, useRef } from "react"
import { Github, ExternalLink } from "lucide-react"

export default function ProjectsContent() {
  const [activeProject, setActiveProject] = useState<number | null>(null)
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
          targets: ".projects-title",
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 800,
          easing: "easeOutExpo",
        })
        .add(
          {
            targets: ".project-card",
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            delay: window.anime.stagger(150),
            duration: 800,
          },
          "-=400",
        )
    }
  }, [])

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with Next.js and Stripe integration for seamless payments. Includes product management, cart functionality, and order tracking.",
      tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      image: "/placeholder.svg?height=300&width=500",
      github: "https://github.com/username/ecommerce",
      demo: "https://ecommerce-demo.com",
    },
    {
      title: "AI Content Generator",
      description:
        "An AI-powered application that generates high-quality content based on user prompts. Leverages OpenAI's GPT models and provides customization options for different use cases.",
      tags: ["React", "Node.js", "OpenAI", "MongoDB"],
      image: "/placeholder.svg?height=300&width=500",
      github: "https://github.com/username/ai-generator",
      demo: "https://ai-generator-demo.com",
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates. Features include task assignment, deadlines, progress tracking, and team collaboration tools.",
      tags: ["React", "Firebase", "Redux", "Material UI"],
      image: "/placeholder.svg?height=300&width=500",
      github: "https://github.com/username/task-app",
      demo: "https://task-app-demo.com",
    },
    {
      title: "Portfolio Website",
      description:
        "A stunning portfolio website with terminal interface and interactive elements. Built with Next.js and featuring multiple themes and animations.",
      tags: ["Next.js", "Framer Motion", "TypeScript", "Tailwind CSS"],
      image: "/placeholder.svg?height=300&width=500",
      github: "https://github.com/username/portfolio",
      demo: "https://portfolio-demo.com",
    },
  ]

  return (
    <div ref={containerRef} className="space-y-8">
      <h2 className="text-xl font-bold projects-title">Projects</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card"
            onMouseEnter={() => setActiveProject(index)}
            onMouseLeave={() => setActiveProject(null)}
          >
            <div className="relative overflow-hidden">
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="project-image" />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-70" />

              <div className="absolute bottom-0 left-0 w-full p-3">
                <h3 className="project-title">{project.title}</h3>
              </div>
            </div>

            <div className="project-content">
              <p className="project-description">{project.description}</p>

              <div className="project-tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="project-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                  <Github size={16} />
                  <span>Source Code</span>
                </a>

                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
