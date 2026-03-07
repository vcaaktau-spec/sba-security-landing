"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full
        border transition-colors duration-300
        ${isDark
          ? "bg-zinc-700 border-zinc-600"
          : "bg-zinc-300 border-zinc-400"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full shadow-sm
          transition-transform duration-300
          ${isDark
            ? "translate-x-4 bg-white"
            : "translate-x-0.5 bg-black"}
        `}
      />
    </button>
  )
}