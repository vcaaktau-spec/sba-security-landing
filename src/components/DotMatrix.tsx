"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface Props {
  cols?: number
  rows?: number
  className?: string
}

const dotBase = (i: number, col: number, row: number) =>
  ((i * 13 + col * 7 + row * 3) % 7) / 38 + 0.04

export function DotMatrix({ cols = 9, rows = 6, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div
      ref={ref}
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
            animate={inView ? { opacity: [base, base + 0.22, base] } : { opacity: 0 }}
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
