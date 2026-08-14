"use client"

import { motion } from "framer-motion"

interface Props {
  cols?: number
  rows?: number
  className?: string
}

const dotBase = (i: number, col: number, row: number) =>
  ((i * 13 + col * 7 + row * 3) % 7) / 38 + 0.04

export function DotMatrix({ cols = 9, rows = 6, className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 3px)`,
        gap: "8px",
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const base = dotBase(i, col, row)
        const delay = (col * 0.06 + row * 0.09) % 1.1
        return (
          <motion.div
            key={i}
            style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "currentColor" }}
            initial={false}
            animate={{ opacity: [base, base + 0.22, base] }}
            transition={{
              duration: 2.2 + (i % 5) * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        )
      })}
    </div>
  )
}
