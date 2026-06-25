import { motion, MotionValue } from "framer-motion"

interface FloorPlanProps {
  wallsProgress: MotionValue<number>
  cam1Scale: MotionValue<number>
  cam2Scale: MotionValue<number>
  cam3Scale: MotionValue<number>
  cam4Scale: MotionValue<number>
  cam5Scale: MotionValue<number>
  coverageOpacity: MotionValue<number>
  coverageScale: MotionValue<number>
}

const CAMERAS = [
  { id: "CAM-01", cx: 170, cy: 130, lx: 178, ly: 123, rot: 135 },
  { id: "CAM-02", cx: 500, cy: 130, lx: 508, ly: 123, rot: 225 },
  { id: "CAM-03", cx: 630, cy: 300, lx: 638, ly: 293, rot: 180 },
  { id: "CAM-04", cx: 170, cy: 450, lx: 178, ly: 443, rot: 45 },
  { id: "CAM-05", cx: 400, cy: 490, lx: 408, ly: 483, rot: 90 },
]

export function FloorPlan({
  wallsProgress,
  cam1Scale,
  cam2Scale,
  cam3Scale,
  cam4Scale,
  cam5Scale,
  coverageOpacity,
  coverageScale,
}: FloorPlanProps) {
  const camScales = [cam1Scale, cam2Scale, cam3Scale, cam4Scale, cam5Scale]

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ transform: "rotate(-2deg)" }}
      aria-hidden="true"
    >
      <g id="walls" fill="none">
        <motion.path
          d="M 120 100 L 680 100 L 680 520 L 120 520 Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#1a1a2e]/45 dark:text-white/50"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M 120 280 L 380 280 M 420 280 L 680 280
             M 380 100 L 380 240 M 380 320 L 380 520
             M 540 280 L 540 520"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#1a1a2e]/35 dark:text-white/40"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
      </g>

      <g id="doors" fill="none">
        <motion.path
          d="M 380 240 A 40 40 0 0 1 420 280"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#1a1a2e]/20 dark:text-white/25"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
        <motion.path
          d="M 540 340 A 30 30 0 0 0 570 310"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#1a1a2e]/20 dark:text-white/25"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
      </g>

      <motion.g
        id="coverage"
        style={{ opacity: coverageOpacity, scale: coverageScale }}
        transformOrigin="center"
      >
        {CAMERAS.map((cam) => (
          <path
            key={`cov-${cam.id}`}
            d={`M ${cam.cx} ${cam.cy}
                L ${cam.cx + Math.cos(((cam.rot - 25) * Math.PI) / 180) * 110}
                  ${cam.cy + Math.sin(((cam.rot - 25) * Math.PI) / 180) * 110}
                A 110 110 0 0 1
                  ${cam.cx + Math.cos(((cam.rot + 25) * Math.PI) / 180) * 110}
                  ${cam.cy + Math.sin(((cam.rot + 25) * Math.PI) / 180) * 110}
                Z`}
            className="fill-red-600/6 dark:fill-red-500/8"
          />
        ))}
      </motion.g>

      <g id="cameras">
        {CAMERAS.map((cam, i) => (
          <motion.g
            key={cam.id}
            style={{ scale: camScales[i] }}
            transformOrigin={`${cam.cx}px ${cam.cy}px`}
          >
            <motion.circle
              cx={cam.cx}
              cy={cam.cy}
              r={10}
              className="fill-none stroke-red-600/30 dark:stroke-red-500/30"
              strokeWidth="1"
              animate={{ r: [10, 16, 10], opacity: [0.3, 0, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
            <circle
              cx={cam.cx}
              cy={cam.cy}
              r={5}
              className="fill-red-600 dark:fill-red-500"
            />
            <text
              x={cam.lx}
              y={cam.ly}
              className="fill-[#1a1a2e]/40 dark:fill-white/40 font-mono"
              fontSize="8"
              letterSpacing="0.05em"
            >
              {cam.id}
            </text>
          </motion.g>
        ))}
      </g>
    </svg>
  )
}
