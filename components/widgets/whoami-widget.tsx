"use client"

import { useEffect } from "react"

export default function WhoamiWidget() {
  useEffect(() => {
    // Trigger animation if anime.js is available
    if (window.anime) {
      window.anime({
        targets: ".whoami-widget",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
      })

      window.anime({
        targets: ".user-detail",
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: window.anime.stagger(100, { start: 300 }),
        duration: 600,
        easing: "easeOutExpo",
      })
    }
  }, [])

  const userInfo = {
    username: "developer",
    fullName: "Full Stack Developer",
    uid: "1000",
    gid: "1000",
    shell: "/bin/terminal",
    home: "/home/user",
    status: "Available for hire",
    lastLogin: new Date().toLocaleDateString(),
    permissions: "Read/Write",
    groups: ["developers", "designers", "admins"],
  }

  return (
    <div className="whoami-widget">
      <div className="user-info">{userInfo.username}@terminal-os</div>
      <div className="text-sm mb-2">{userInfo.fullName}</div>

      <div className="user-details">
        <div className="user-detail">UID: {userInfo.uid}</div>
        <div className="user-detail">GID: {userInfo.gid}</div>
        <div className="user-detail">Shell: {userInfo.shell}</div>
        <div className="user-detail">Home: {userInfo.home}</div>
        <div className="user-detail">Status: {userInfo.status}</div>
        <div className="user-detail">Login: {userInfo.lastLogin}</div>
        <div className="user-detail">Permissions: {userInfo.permissions}</div>
        {userInfo.groups.map((group, index) => (
          <div key={index} className="user-detail">
            Group: {group}
          </div>
        ))}
      </div>
    </div>
  )
}
