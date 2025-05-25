"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface Profile {
  name: string
  avatar: string
  role?: string
}

interface TierCardProps {
  title: string
  subtitle: string
  description: string
  profiles: Profile[]
  tier: "tier1" | "tier2" | "tier3"
  className?: string
  badge?: string
  icon?: ReactNode
}

export function TierCard({ 
  title, 
  subtitle,
  description, 
  profiles, 
  tier,
  className = "",
  badge,
  icon
}: TierCardProps) {
  const tierStyles = {
    tier1: {
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      glow: "shadow-orange-500/25",
      badge: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
    },
    tier2: {
      gradient: "from-blue-400 via-purple-500 to-pink-500", 
      glow: "shadow-purple-500/25",
      badge: "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
    },
    tier3: {
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      glow: "shadow-green-500/25", 
      badge: "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
    }
  }

  const currentTier = tierStyles[tier]

  return (
    <div className={cn(
      "relative group rounded-2xl p-6 bg-white border border-gray-200",
      "hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
      "overflow-hidden",
      className
    )}>
      {/* Gradient border on hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-r", currentTier.gradient, "p-[1px]"
      )}>
        <div className="w-full h-full bg-white rounded-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "bg-gradient-to-r", currentTier.gradient
                )}>
                  <div className="text-white">
                    {icon}
                  </div>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                {title}
              </h3>
            </div>
            {badge && (
              <Badge className={cn("text-xs font-semibold", currentTier.badge)}>
                {badge}
              </Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-600">{subtitle}</p>
        </div>

        {/* Profile avatars */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-3">
            {profiles.slice(0, 4).map((profile, index) => (
              <div
                key={index}
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 border-white",
                  "overflow-hidden group-hover:scale-110 transition-transform duration-300",
                  "bg-gradient-to-br", currentTier.gradient
                )}
                style={{ zIndex: profiles.length - index }}
              >
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
            ))}
            {profiles.length > 4 && (
              <div className={cn(
                "relative w-10 h-10 rounded-full border-2 border-white",
                "bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold"
              )}>
                +{profiles.length - 4}
              </div>
            )}
          </div>
          
          {profiles.length > 0 && (
            <div className="text-sm text-gray-500">
              {profiles[0].name}
              {profiles.length > 1 && (
                <span className="text-gray-400"> +{profiles.length - 1} others</span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Hover effect glow */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-r", currentTier.gradient, "blur-xl -z-10"
        )} />
      </div>
    </div>
  )
}

// Preset data for common tier types
export const TierPresets = {
  ceo: {
    title: "Story (Tier 1 CEO)",
    subtitle: "College dropout. Solo-founded",
    badge: "CEO",
    tier: "tier1" as const
  },
  investors: {
    title: "Investors (Tier 1 VCs)", 
    subtitle: "Peter Thiel's Founders Fund +",
    badge: "VCs",
    tier: "tier2" as const
  },
  team: {
    title: "Team (Tier 1 Engineers)",
    subtitle: "From Google, Facebook, Pinterest,",
    badge: "Engineers", 
    tier: "tier3" as const
  },
  examples: {
    title: "Examples (Tier 1 Brands)",
    subtitle: "See ads created with Icon (static",
    badge: "Brands",
    tier: "tier1" as const
  }
} 