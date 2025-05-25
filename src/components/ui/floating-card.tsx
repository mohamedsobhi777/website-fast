"use client"

import { useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FloatingCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function FloatingCard({ 
  children, 
  className = "", 
  glowColor = "rgba(59, 130, 246, 0.15)"
}: FloatingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={cn(
        "floating-card relative transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1",
        className
      )}
      style={{
        boxShadow: isHovered 
          ? `0 20px 40px -12px ${glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.05)`
          : '0 4px 20px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle gradient overlay */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 rounded-inherit",
          "bg-gradient-to-br from-white/5 via-transparent to-black/5",
          isHovered && "opacity-100"
        )}
      />

      {children}
    </div>
  )
}

// Preset variants (simplified)
export const FloatingCardPresets = {
  subtle: { glowColor: "rgba(59, 130, 246, 0.1)" },
  normal: { glowColor: "rgba(59, 130, 246, 0.15)" },
  intense: { glowColor: "rgba(59, 130, 246, 0.25)" },
  purple: { glowColor: "rgba(147, 51, 234, 0.15)" },
  emerald: { glowColor: "rgba(16, 185, 129, 0.15)" },
} 