interface CommandResult {
  output: Array<{ type?: string; content: any }>
  window?: string
  action?: "open" | "close"
  newPath?: string
}

export function processCommand(command: string, currentPath: string): CommandResult {
  const commandLower = command.toLowerCase().trim()
  const args = commandLower.split(" ")
  const mainCommand = args[0]

  // File system structure
  const fileSystem = {
    "about.txt": "Information about the developer",
    "skills.log": "Technical skills and expertise",
    projects: {
      "project1.md": "E-Commerce Platform",
      "project2.md": "AI Content Generator",
      "project3.md": "Task Management App",
    },
    "contact.sh": "Contact information and form",
    ".secrets": "Hidden easter egg file",
    ".themes": {
      "zinc.theme": "Default zinc theme",
      "dracula.theme": "Dracula theme",
      "nord.theme": "Nord theme",
      "solarized-dark.theme": "Solarized Dark theme",
      "solarized-light.theme": "Solarized Light theme",
      "monokai.theme": "Monokai theme",
      "cyberpunk.theme": "Cyberpunk theme",
      "tokyo-night.theme": "Tokyo Night theme",
      "synthwave.theme": "Synthwave theme",
      "tron.theme": "Tron theme",
      "matrix.theme": "Matrix theme",
    },
  }

  // File contents
  const fileContents: Record<string, string> = {
    "about.txt": `
# About Me

I'm a passionate developer with expertise in modern web technologies.
My journey in tech began over 5 years ago, and since then I've worked
with various technologies and frameworks to build solutions that solve
real problems.

## Education
- B.S. Computer Science, University of Technology (2018-2022)

## Experience
- Senior Frontend Developer, Tech Innovations Inc. (2022-Present)
- Frontend Developer, WebSolutions Co. (2020-2022)
`,
    "skills.log": `
# Technical Skills

## Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend
- Node.js
- Express
- MongoDB
- PostgreSQL
- GraphQL

## Tools & Others
- Git
- Docker
- AWS
- Figma
- CI/CD
`,
    "contact.sh": `
# Contact Information

Email: developer@example.com
LinkedIn: linkedin.com/in/developer
GitHub: github.com/developer
Twitter: twitter.com/developer

Feel free to reach out for collaboration opportunities or just to say hi!
`,
    ".secrets": `
ACCESS GRANTED: EASTER EGG FOUND!

Congratulations on finding the secret file!
Here's a special message: "The cake is a lie, but the portfolio is real."

Try these secret commands:
- matrix
- hack
- 42
- neon
- glitch
- boom
`,
  }

  // Process commands
  switch (mainCommand) {
    case "help":
      return {
        output: [
          { content: "Available commands:" },
          { content: "  help                 - Show this help message" },
          { content: "  ls, dir              - List directory contents" },
          { content: "  cd [directory]       - Change directory" },
          { content: "  cat [file]           - Display file contents" },
          { content: "  clear                - Clear the terminal" },
          { content: "  about                - Open about section" },
          { content: "  projects             - Open projects section" },
          { content: "  skills               - Open skills section" },
          { content: "  contact              - Open contact section" },
          { content: "  show [section]       - Open a section window (about, projects, skills, contact)" },
          { content: "  close [section]      - Close a section window" },
          {
            content:
              "  theme [name]         - Change theme (zinc, dracula, nord, solarized-dark, solarized-light, monokai, cyberpunk, tokyo-night, synthwave, tron, matrix)",
          },
          { content: "  whoami               - Display user information" },
          { content: "  date                 - Display current date and time" },
          { content: "" },
          { content: "Type any command with --help for more information." },
        ],
      }

    case "ls":
    case "dir":
      const currentDir = currentPath === "/home/user" ? "" : currentPath.replace("/home/user/", "")
      let dirContent = fileSystem

      // Navigate to subdirectory if specified
      if (currentDir) {
        const parts = currentDir.split("/")
        let current = fileSystem
        for (const part of parts) {
          if (current[part] && typeof current[part] === "object") {
            current = current[part]
          } else {
            return {
              output: [{ content: `Directory not found: ${currentDir}` }],
            }
          }
        }
        dirContent = current
      }

      // Check for ls options
      const showAll = args.includes("-a") || args.includes("--all")
      const showDetail = args.includes("-l") || args.includes("--long")

      // Filter hidden files if not showing all
      let displayContent = { ...dirContent }
      if (!showAll) {
        displayContent = Object.fromEntries(Object.entries(displayContent).filter(([key]) => !key.startsWith(".")))
      }

      return {
        output: [
          {
            type: "filesystem",
            content: displayContent,
            detail: showDetail,
          },
        ],
      }

    case "cd":
      if (args.length === 1 || args[1] === "~" || args[1] === "/") {
        return {
          output: [{ content: "Changed directory to /home/user" }],
          newPath: "/home/user",
        }
      } else if (args[1] === "..") {
        const pathParts = currentPath.split("/")
        pathParts.pop()
        const newPath = pathParts.join("/") || "/"
        return {
          output: [{ content: `Changed directory to ${newPath}` }],
          newPath,
        }
      } else {
        // Check if directory exists
        const targetDir = args[1]
        const currentPathWithoutHome = currentPath === "/home/user" ? "" : currentPath.replace("/home/user/", "")
        let currentDirContent = fileSystem

        // Navigate to current directory
        if (currentPathWithoutHome) {
          const parts = currentPathWithoutHome.split("/")
          let current = fileSystem
          for (const part of parts) {
            if (current[part] && typeof current[part] === "object") {
              current = current[part]
            } else {
              return {
                output: [{ content: `Directory not found: ${currentPathWithoutHome}` }],
              }
            }
          }
          currentDirContent = current
        }

        // Check if target directory exists
        if (currentDirContent[targetDir] && typeof currentDirContent[targetDir] === "object") {
          const newPath = currentPathWithoutHome ? `${currentPath}/${targetDir}` : `/home/user/${targetDir}`
          return {
            output: [{ content: `Changed directory to ${newPath}` }],
            newPath,
          }
        } else {
          return {
            output: [{ content: `Directory not found: ${targetDir}` }],
          }
        }
      }

    case "cat":
      if (args.length === 1) {
        return {
          output: [{ content: "Usage: cat [file]" }],
        }
      }

      const fileName = args[1]
      const currentFilePath = currentPath === "/home/user" ? "" : currentPath.replace("/home/user/", "")
      let currentFileDir = fileSystem

      // Navigate to current directory
      if (currentFilePath) {
        const parts = currentFilePath.split("/")
        let current = fileSystem
        for (const part of parts) {
          if (current[part] && typeof current[part] === "object") {
            current = current[part]
          } else {
            return {
              output: [{ content: `Directory not found: ${currentFilePath}` }],
            }
          }
        }
        currentFileDir = current
      }

      // Check if file exists
      if (currentFileDir[fileName]) {
        // If it's a section file, open the section
        if (fileName === "about.txt") {
          return {
            output: [
              { content: "Opening about section..." },
              { type: "file", content: fileContents["about.txt"] || "File content not available" },
            ],
            window: "about",
            action: "open",
          }
        } else if (fileName === "skills.log") {
          return {
            output: [
              { content: "Opening skills section..." },
              { type: "file", content: fileContents["skills.log"] || "File content not available" },
            ],
            window: "skills",
            action: "open",
          }
        } else if (fileName === "contact.sh") {
          return {
            output: [
              { content: "Opening contact section..." },
              { type: "file", content: fileContents["contact.sh"] || "File content not available" },
            ],
            window: "contact",
            action: "open",
          }
        } else if (fileName === ".secrets") {
          return {
            output: [{ type: "file", content: fileContents[".secrets"] || "File content not available" }],
          }
        } else {
          // For other files, just show a placeholder content
          const filePath = currentFilePath ? `${currentFilePath}/${fileName}` : fileName
          const content = fileContents[filePath] || `Content of ${fileName}`
          return {
            output: [{ type: "file", content }],
          }
        }
      } else {
        return {
          output: [{ content: `File not found: ${fileName}` }],
        }
      }

    case "clear":
      return {
        output: [],
      }

    case "about":
    case "projects":
    case "skills":
    case "contact":
      return {
        output: [{ content: `Opening ${mainCommand} section...` }],
        window: mainCommand,
        action: "open",
      }

    case "show":
      if (args.length === 1) {
        return {
          output: [{ content: "Usage: show [section]" }],
        }
      }

      if (["about", "projects", "skills", "contact"].includes(args[1])) {
        return {
          output: [{ content: `Opening ${args[1]} section...` }],
          window: args[1],
          action: "open",
        }
      } else {
        return {
          output: [{ content: `Section not found: ${args[1]}. Available sections: about, projects, skills, contact` }],
        }
      }

    case "close":
      if (args.length === 1) {
        return {
          output: [{ content: "Usage: close [section]" }],
        }
      }

      if (["about", "projects", "skills", "contact"].includes(args[1])) {
        return {
          output: [{ content: `Closing ${args[1]} section...` }],
          window: args[1],
          action: "close",
        }
      } else {
        return {
          output: [{ content: `Section not found: ${args[1]}. Available sections: about, projects, skills, contact` }],
        }
      }

    case "theme":
      if (args.length === 1 || args[1] === "--help") {
        return {
          output: [
            {
              content:
                "Usage: theme [name]. Available themes: zinc, dracula, nord, solarized-dark, solarized-light, monokai, cyberpunk, tokyo-night, synthwave, tron, matrix",
            },
            { type: "theme-selector" },
          ],
        }
      }

      if (
        [
          "zinc",
          "dracula",
          "nord",
          "solarized-dark",
          "solarized-light",
          "monokai",
          "cyberpunk",
          "tokyo-night",
          "synthwave",
          "tron",
          "matrix",
        ].includes(args[1])
      ) {
        return {
          output: [{ content: `Changing theme to ${args[1]}...` }],
        }
      } else {
        return {
          output: [
            {
              content: `Unknown theme: ${args[1]}. Available themes: zinc, dracula, nord, solarized-dark, solarized-light, monokai, cyberpunk, tokyo-night, synthwave, tron, matrix`,
            },
          ],
        }
      }

    case "whoami":
      return {
        output: [{ type: "whoami-widget" }],
      }

    case "date":
      return {
        output: [{ type: "date-widget" }],
      }

    case "matrix":
      return {
        output: [
          { content: "Initializing Matrix mode..." },
          { content: "Wake up, Neo..." },
          { content: "The Matrix has you..." },
          { content: "Follow the white rabbit." },
          { content: "Knock, knock, Neo." },
        ],
      }

    case "hack":
      return {
        output: [
          { content: "INITIATING HACK SEQUENCE..." },
          { content: "Bypassing firewall..." },
          { content: "Accessing mainframe..." },
          { content: "Decrypting security protocols..." },
          { content: "ACCESS GRANTED!" },
          { content: "Just kidding! This is just a fun easter egg. 😉" },
        ],
      }

    case "42":
      return {
        output: [
          { content: "42 is the answer to the ultimate question of life, the universe, and everything." },
          { content: "But what was the question?" },
        ],
      }

    case "neon":
      return {
        output: [{ type: "neon", content: "Neon Lights Activated!" }],
      }

    case "glitch":
      return {
        output: [{ type: "glitch", content: "T͎̰͔̘͇̫̝ͫ̅ͬ͒H͌͟E͈̲͔̓̉ͬ͢ ̯̩̱͎̾̏ͨ̑̕S̸̟̞̬̝̬͓Y̳͉̮͍͇͕̻͗͞S̉ͮ҉̻̘̯̙ͅT͉̼̝̦̻͊̑͜E̸̦̦̣̪̺ͨͭ̅̈M̤̹̰̗̣͑͐͢ ̾͗̓҉̼̘̲̪ͅH̨̗͖̳̻̙̽Ă̟̭̖͠S̴̪̝͇͖͕̔ͭͬ̔ ̖͟B̐̐҉̲̱̰̲̩Ṙ̴̗͚̫̤͕ͬƠ͖̝̺̻̙̠̇ͦ̈́̈ͪK̠̩̀̿ͨͦ́E̤͌ͫ͛ͅN͚͙͖̗̤̋̄" }],
      }

    case "boom":
      return {
        output: [{ type: "boom", content: "💥 BOOM! 💥" }],
      }

    default:
      return {
        output: [{ content: `Command not found: ${command}. Type 'help' for available commands.` }],
      }
  }
}
