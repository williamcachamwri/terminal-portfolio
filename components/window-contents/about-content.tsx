"use client"

import { useEffect, useRef } from "react"

export default function AboutContent() {
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
          targets: ".about-header",
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 1000,
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
            targets: ".experience-card",
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: window.anime.stagger(200),
            duration: 800,
          },
          "-=500",
        )
    }
  }, [])

  return (
    <div ref={containerRef} className="space-y-6 text-zinc-300">
      <div className="about-header text-center">
        <pre className="inline-block text-left text-xs text-zinc-400 sm:text-sm">
          {`
  _____                      _                 
 |  __ \\                    | |                
 | |  | | _____   _____  ___| | ___  _ __  ___ 
 | |  | |/ _ \\ \\ / / _ \\/ __| |/ _ \\| '_ \\/ __|
 | |__| |  __/\\ V /  __/ (__| | (_) | |_) \\__ \\
 |_____/ \\___| \\_/ \\___|\\___|_|\\___/| .__/|___/
                                    | |        
                                    |_|        
`}
        </pre>
      </div>

      <div className="space-y-4 animate-in">
        <h2 className="text-xl font-bold text-zinc-200">About Me</h2>
        <p>
          Hello, I'm a developer passionate about creating beautiful and functional web experiences. With a background
          in both design and development, I bring a unique perspective to every project.
        </p>
        <p>
          My journey in tech began over 5 years ago, and since then I've worked with various technologies and frameworks
          to build solutions that solve real problems.
        </p>
        <p>
          When I'm not coding, you can find me exploring new technologies, contributing to open source, or enjoying the
          outdoors.
        </p>
      </div>

      <div className="space-y-4 animate-in">
        <h2 className="text-xl font-bold text-zinc-200">Education</h2>
        <div className="space-y-2">
          <div className="experience-card">
            <div className="experience-period">2018-2022</div>
            <div className="experience-title">B.S. Computer Science</div>
            <div className="experience-company">University of Technology</div>
            <div className="experience-description">
              Graduated with honors. Specialized in software engineering and artificial intelligence.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 animate-in">
        <h2 className="text-xl font-bold text-zinc-200">Experience</h2>
        <div className="space-y-4">
          <div className="experience-card">
            <div className="experience-period">2022-Present</div>
            <div className="experience-title">Senior Frontend Developer</div>
            <div className="experience-company">Tech Innovations Inc.</div>
            <div className="experience-description">
              <ul className="mt-2 list-inside list-disc">
                <li>Led the development of the company's flagship product, improving performance by 40%</li>
                <li>Implemented modern frontend architecture using React and Next.js</li>
                <li>Mentored junior developers and conducted code reviews</li>
              </ul>
            </div>
          </div>

          <div className="experience-card">
            <div className="experience-period">2020-2022</div>
            <div className="experience-title">Frontend Developer</div>
            <div className="experience-company">WebSolutions Co.</div>
            <div className="experience-description">
              <ul className="mt-2 list-inside list-disc">
                <li>Developed responsive web applications for various clients</li>
                <li>Collaborated with designers to implement pixel-perfect UIs</li>
                <li>Optimized applications for maximum speed and scalability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
