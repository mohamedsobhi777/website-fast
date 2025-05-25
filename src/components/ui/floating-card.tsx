"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FloatingCardProps {
  children: ReactNode
  className?: string
}

export function FloatingCard({ 
  children, 
  className = ""
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        "floating-card relative",
        className
      )}
      style={{
        boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {children}
    </div>
  )
}

// Simplified preset variants (no animations)
export const FloatingCardPresets = {
  subtle: {},
  normal: {},
  intense: {},
  purple: {},
  emerald: {},
} 