"use client"

import { motion } from "framer-motion"

interface FloatingCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export const FloatingCard = ({
  icon,
  title,
  desc,
  ...pos
}: FloatingCardProps) => {

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute w-[220px] p-5 rounded-2xl border bg-background/70 backdrop-blur-xl shadow-xl"
      style={pos}
    >

      <div className="flex items-center gap-3 mb-2">

        <div className="text-red-600">
          {icon}
        </div>

        <div className="font-semibold">
          {title}
        </div>

      </div>

      <div className="text-sm text-muted-foreground">
        {desc}
      </div>

    </motion.div>
  )
}