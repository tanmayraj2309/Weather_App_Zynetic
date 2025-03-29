"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const TemperatureDisplay = ({ temperature }) => {
  const [percentage, setPercentage] = useState(0)
  const [tempLabel, setTempLabel] = useState("")
  const [colorClass, setColorClass] = useState("")

  useEffect(() => {
    const maxTemp = 45
    const calculatedPercentage = Math.min(100, Math.max(0, (temperature / maxTemp) * 100))
    setPercentage(calculatedPercentage)

    // Set temperature label and color class based on temperature range
    if (temperature < 8) {
      setColorClass("from-blue-500 to-blue-600")
      setTempLabel("Very Low")
    } else if (temperature < 18) {
      setColorClass("from-cyan-500 to-blue-500")
      setTempLabel("Low")
    } else if (temperature < 28) {
      setColorClass("from-green-400 to-emerald-500")
      setTempLabel("Medium")
    } else if (temperature < 38) {
      setColorClass("from-amber-500 to-orange-500")
      setTempLabel("High")
    } else {
      setColorClass("from-orange-500 to-red-500")
      setTempLabel("Very High")
    }
  }, [temperature])

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer decorative ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg"></div>

      {/* Inner background */}
      <div className="absolute inset-2 rounded-full bg-slate-950 shadow-inner"></div>

      {/* Temperature gauge track */}
      <div className="absolute inset-4 rounded-full bg-slate-800/50 overflow-hidden backdrop-blur-sm">
        {/* Temperature fill - animated */}
        <motion.div
          className={`absolute bottom-0 w-full bg-gradient-to-t ${colorClass}`}
          initial={{ height: "0%" }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Subtle wave effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -inset-1 bg-white/10 blur-md rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* Glass effect overlay */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

      {/* Temperature display */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            {temperature}°C
          </div>
          <motion.div
            className={`text-sm font-medium mt-1 bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {tempLabel}
          </motion.div>
        </motion.div>
      </div>

      {/* Tick marks around the gauge */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-slate-600 rounded-full transform -translate-x-1/2 top-2"
            style={{ left: `${12.5 + i * 12.5}%` }}
          />
        ))}
      </div>

      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-full opacity-20 blur-md bg-gradient-to-r ${colorClass}`}></div>
    </div>
  )
}

export default TemperatureDisplay

