"use client"

import { useEffect, useRef } from "react"

export default function SkillsContent() {
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
          targets: ".skills-title",
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
            targets: ".skill-bar",
            width: (el) => el.dataset.width || "0%",
            duration: 1200,
            easing: "easeInOutQuart",
            delay: window.anime.stagger(100),
          },
          "-=800",
        )

      // Add special animation for language tags
      window.anime({
        targets: ".language-tag",
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: window.anime.stagger(100, { start: 1000 }),
        duration: 600,
        easing: "easeOutExpo",
      })
    }
  }, [])

  const skillCategories = [
    {
      name: "Frontend",
      skills: [
        { name: "React", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Framer Motion", level: 75 },
      ],
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express", level: 80 },
        { name: "MongoDB", level: 75 },
        { name: "PostgreSQL", level: 70 },
        { name: "GraphQL", level: 65 },
      ],
    },
    {
      name: "Tools & Others",
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 70 },
        { name: "AWS", level: 65 },
        { name: "Figma", level: 80 },
        { name: "CI/CD", level: 75 },
      ],
    },
  ]

  return (
    <div ref={containerRef} className="space-y-8">
      <h2 className="text-xl font-bold skills-title">Skills</h2>

      <div className="space-y-8">
        {skillCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4 animate-in">
            <h3 className="text-lg font-semibold">{category.name}</h3>

            <div className="space-y-5">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{skill.name}</span>
                    <span className="text-xs">{skill.level}%</span>
                  </div>

                  <div className="skill-bar-container">
                    <div className="skill-bar" data-width={`${skill.level}%`} style={{ width: "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-in">
        <h3 className="text-lg font-semibold">Languages</h3>

        <div className="flex flex-wrap gap-3">
          {["JavaScript", "TypeScript", "Python", "HTML", "CSS", "SQL", "Bash"].map((language, index) => (
            <div
              key={index}
              className="language-tag rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm"
              style={{ opacity: 0, transform: "scale(0.8)" }}
            >
              {language}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 animate-in">
        <h3 className="text-lg font-semibold">Certifications</h3>

        <ul className="list-inside list-disc space-y-2">
          <li>AWS Certified Developer Associate</li>
          <li>Google Cloud Professional Developer</li>
          <li>MongoDB Certified Developer</li>
        </ul>
      </div>
    </div>
  )
}
