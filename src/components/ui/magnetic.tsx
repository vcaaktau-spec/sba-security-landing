"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

export default function Magnetic({ 
  children, 
  strength = 0.2 // Сила притяжения (чем больше, тем сильнее тянется)
}: { 
  children: React.ReactNode,
  strength?: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    
    // Высчитываем центр элемента
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    
    // Умножаем на силу притяжения
    setPosition({ x: middleX * strength, y: middleY * strength })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  return (
    <motion.div
      style={{ position: "relative", display: "inline-block" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15, 
        mass: 0.1 
      }}
    >
      {children}
    </motion.div>
  )
}