import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: "Terminal Portfolio",
  description: "A unique personal portfolio with retro terminal interface",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={ibmPlexMono.className}>{children}</body>
    </html>
  )
}
