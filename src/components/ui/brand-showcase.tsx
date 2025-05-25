"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Brand {
  name: string
  logo: ReactNode
  description?: string
}

interface BrandShowcaseProps {
  brands: Brand[]
  className?: string
  columns?: number
  showDescriptions?: boolean
}

export function BrandShowcase({ 
  brands, 
  className = "",
  columns = 6,
  showDescriptions = false
}: BrandShowcaseProps) {
  const gridCols = {
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    8: "grid-cols-2 md:grid-cols-4 lg:grid-cols-8"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "grid gap-8 items-center justify-items-center",
        gridCols[columns as keyof typeof gridCols] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      )}>
        {brands.map((brand, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center justify-center space-y-3 p-6 rounded-2xl transition-all duration-300 hover:bg-gray-50/50 hover:scale-105"
          >
            {/* Logo container */}
            <div className="relative flex items-center justify-center w-full h-16 transition-all duration-300 group-hover:scale-110">
              <div className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                {brand.logo}
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Brand name (always visible but subtle) */}
            <div className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300 text-center">
              {brand.name}
            </div>

            {/* Description (optional) */}
            {showDescriptions && brand.description && (
              <div className="text-xs text-gray-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[120px]">
                {brand.description}
              </div>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Brand logo components for common brands
export const BrandLogos = {
  MudWtr: () => (
    <div className="font-bold text-lg tracking-wider">MUD\\WTR</div>
  ),
  Ridge: () => (
    <div className="font-bold text-xl tracking-widest">RIDGE</div>
  ),
  Gruns: () => (
    <div className="font-bold text-lg italic">grüns</div>
  ),
  Mood: () => (
    <div className="font-bold text-xl tracking-wider">MOOD</div>
  ),
  Momentous: () => (
    <div className="font-semibold text-lg">Momentous</div>
  ),
  KettleFire: () => (
    <div className="flex items-center space-x-1">
      <span className="text-sm">🔥</span>
      <span className="font-semibold">Kettle & Fire</span>
    </div>
  ),
  Cocojune: () => (
    <div className="font-semibold text-lg lowercase">cocojune</div>
  ),
  BeardClub: () => (
    <div className="flex flex-col items-center">
      <div className="text-xs font-bold">BEARD</div>
      <div className="text-xs font-bold">CLUB</div>
    </div>
  ),
  // Generic placeholder logos
  TechCorp: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
      TC
    </div>
  ),
  StartupX: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
      SX
    </div>
  ),
  InnovateLab: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
      IL
    </div>
  ),
  FutureAI: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
      AI
    </div>
  )
} 