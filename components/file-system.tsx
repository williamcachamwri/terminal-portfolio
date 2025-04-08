"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react"

interface FileSystemProps {
  structure: any
}

export default function FileSystem({ structure }: FileSystemProps) {
  return (
    <div className="font-mono text-sm">
      <FileSystemNode node={structure} name="/" level={0} />
    </div>
  )
}

interface FileSystemNodeProps {
  node: any
  name: string
  level: number
}

function FileSystemNode({ node, name, level }: FileSystemNodeProps) {
  const [expanded, setExpanded] = useState(level < 1)

  const isDirectory = typeof node === "object" && node !== null

  const toggleExpanded = () => {
    if (isDirectory) {
      setExpanded(!expanded)
    }
  }

  const indent = level * 16

  return (
    <div>
      <div
        className="flex cursor-pointer items-center py-0.5 hover:text-[#00FFFF]"
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpanded}
      >
        {isDirectory ? (
          <>
            {expanded ? (
              <ChevronDown size={14} className="mr-1 text-[#FF00FF]" />
            ) : (
              <ChevronRight size={14} className="mr-1 text-[#FF00FF]" />
            )}
            <Folder size={14} className="mr-1 text-[#FF00FF]" />
            <span>{name}/</span>
          </>
        ) : (
          <>
            <FileText size={14} className="mr-1 text-[#00FFFF]" />
            <span>{name}</span>
          </>
        )}
      </div>

      {isDirectory && expanded && (
        <div>
          {Object.entries(node).map(([childName, childNode]) => (
            <FileSystemNode key={childName} node={childNode} name={childName} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
