"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: string | number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 2000, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Extract numeric value from string (e.g., "50K+" -> 50)
  const getNumericValue = (val: string | number): number => {
    if (typeof val === "number") return val
    const match = val.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : 0
  }

  const numericValue = getNumericValue(value)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (numericValue - startValue) * easeOutCubic

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isVisible, numericValue, duration])

  const formatValue = (val: number): string => {
    if (typeof value === "string") {
      return value.replace(/[\d.]+/, Math.round(val).toString())
    }
    return Math.round(val).toString()
  }

  return (
    <div ref={ref} className={className}>
      {formatValue(count)}
    </div>
  )
} 