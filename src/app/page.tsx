"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FloatingCard, FloatingCardPresets } from "@/components/ui/floating-card"
import { BrandShowcase, BrandLogos } from "@/components/ui/brand-showcase"
import { TierCard, TierPresets } from "@/components/ui/tier-card"
import {
  Zap,
  Clock,
  Smartphone,
  Globe,
  Code,
  Rocket,
  Star,
  ArrowRight,
  Sparkles,
  Send,
  Play,
  Users,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [prompt, setPrompt] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  const handleGenerateWebsite = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to project page
        window.location.href = `/project/${data.projectId}`
      } else {
        alert(data.error || 'Failed to generate website. Please try again.')
      }
    } catch (error) {
      console.error('Error generating website:', error)
      alert('Failed to generate website. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Sample brands data
  const trustedBrands = [
    { name: "MUD\\WTR", logo: <BrandLogos.MudWtr /> },
    { name: "RIDGE", logo: <BrandLogos.Ridge /> },
    { name: "grüns", logo: <BrandLogos.Gruns /> },
    { name: "MOOD", logo: <BrandLogos.Mood /> },
    { name: "Momentous", logo: <BrandLogos.Momentous /> },
    { name: "Kettle & Fire", logo: <BrandLogos.KettleFire /> },
    { name: "cocojune", logo: <BrandLogos.Cocojune /> },
    { name: "BEARD CLUB", logo: <BrandLogos.BeardClub /> },
  ]

  // Sample tier data
  const tierData = [
    {
      ...TierPresets.ceo,
      description: "Solo-founded Skio ($15M+ ARR & profitable, $8M seed). Top 200 NA LoL, VC $20.",
      profiles: [
        { name: "Kennan Davison", avatar: "/api/placeholder/40/40" },
        { name: "Alex Rodriguez", avatar: "/api/placeholder/40/40" },
        { name: "Sarah Kim", avatar: "/api/placeholder/40/40" },
      ],
      icon: <Users className="w-5 h-5" />
    },
    {
      ...TierPresets.investors,
      description: "OpenAI (ChatGPT) & Ramp execs + Saquon Barkley (Super Bowl 2025).",
      profiles: [
        { name: "Peter Thiel", avatar: "/api/placeholder/40/40" },
        { name: "Marc Andreessen", avatar: "/api/placeholder/40/40" },
        { name: "Reid Hoffman", avatar: "/api/placeholder/40/40" },
        { name: "Elad Gil", avatar: "/api/placeholder/40/40" },
      ],
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      ...TierPresets.team,
      description: "Snap, Hulu, NVIDIA, & Tesla. 7-day work week.",
      profiles: [
        { name: "Emma Chen", avatar: "/api/placeholder/40/40" },
        { name: "Mike Johnson", avatar: "/api/placeholder/40/40" },
        { name: "Lisa Wang", avatar: "/api/placeholder/40/40" },
        { name: "David Miller", avatar: "/api/placeholder/40/40" },
        { name: "Anna Foster", avatar: "/api/placeholder/40/40" },
      ],
      icon: <Code className="w-5 h-5" />
    },
    {
      ...TierPresets.examples,
      description: "See ads created with Icon (static image, B-roll + voiceover, UGC + B-roll cuts, & more).",
      profiles: [
        { name: "Nike", avatar: "/api/placeholder/40/40" },
        { name: "Apple", avatar: "/api/placeholder/40/40" },
        { name: "Tesla", avatar: "/api/placeholder/40/40" },
        { name: "Stripe", avatar: "/api/placeholder/40/40" },
      ],
      icon: <Award className="w-5 h-5" />
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Simplified background - less distracting */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-100/20 to-blue-100/20 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100/15 to-pink-100/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 lg:px-8 h-20 flex items-center border-b border-gray-100/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0">
        <Link href="/" className="flex items-center justify-center group">
          <div className="relative">
            <Zap className="h-7 w-7 text-gray-900 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            WebsiteFast
          </span>
        </Link>
        <nav className="ml-auto flex gap-8">
          {["Features", "Examples", "Pricing", "Docs"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 relative group"
            >
              {item}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
        <div className="ml-8 flex gap-3">
          <Button variant="ghost" size="sm" className="hover:bg-gray-50 transition-all duration-300">
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Enhanced Hero Section */}
        <section className="w-full pt-20 pb-32 relative">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col items-center space-y-12 text-center">
              {/* Enhanced Badge */}
              <div className="group">
                <Badge
                  variant="outline"
                  className="px-6 py-3 text-sm font-medium border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                  AI-Powered Website Generation • Join 50K+ Creators
                </Badge>
              </div>

              {/* Enhanced Main Headline */}
              <div className="space-y-6 max-w-5xl">
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-tight">
                  The AI
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Webmaker
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Plan, create, & run 1000s of winning websites end-to-end.
                </p>
                <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                  Just $39/mo for 14-products-in-1 (replaces $2K-$30K/mo). Unlimited website creations, custom assets, & edits. 100x cheaper than a bad agency.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  100% money-back guarantee, no questions asked.
                </p>
              </div>

              {/* Fixed Prompt Input Area - Simplified */}
              <div className="w-full max-w-4xl">
                <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-300">
                  <label htmlFor="website-prompt" className="block text-lg font-bold text-gray-800 mb-4">
                    Describe your website:
                  </label>
                  <Textarea
                    id="website-prompt"
                    placeholder="e.g., A modern portfolio website for a photographer with a dark theme, gallery section, and contact form..."
                    value={prompt}
                    onChange={handlePromptChange}
                    className="min-h-[140px] text-lg border-0 resize-none focus:ring-0 focus:outline-none placeholder:text-gray-400 bg-transparent w-full"
                    disabled={isGenerating}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${isTyping ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                      />
                      <span>{prompt.length}/500 characters</span>
                    </div>
                    <Button
                      size="lg"
                      disabled={!prompt.trim() || isGenerating}
                      onClick={handleGenerateWebsite}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Website ($39)'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "Restaurant with online menu",
                  "Tech startup landing page", 
                  "Personal blog with portfolio",
                  "E-commerce store",
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get started ($39)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Download macOS app
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section with Animated Counters */}
        <section className="w-full py-20 border-y border-gray-100 bg-gray-50/30">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "5.0", label: "⭐️⭐️⭐️⭐️⭐️", subLabel: "2288+ brands", icon: Star },
                { value: "528K+", label: "YouTube", subLabel: "subscribers", icon: Globe },
                { value: "$12M", label: "domain", subLabel: "investment", icon: TrendingUp },
                { value: "2025", label: "Founded", subLabel: "in stealth", icon: Clock },
              ].map((stat, index) => (
                <FloatingCard 
                  key={index} 
                  className="text-center space-y-3 group bg-white rounded-2xl p-6" 
                  {...FloatingCardPresets.subtle}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subLabel}</div>
                </FloatingCard>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Showcase Section */}
        <section className="w-full py-20">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by leading brands</h2>
              <p className="text-gray-600">Join thousands of companies building with WebsiteFast</p>
            </div>
            <BrandShowcase brands={trustedBrands} columns={8} />
          </div>
        </section>

        {/* Tier Cards Section */}
        <section className="w-full py-32 bg-gray-50/50">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6">
                Our Community
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Built by the{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  best in the industry
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From solo founders to Fortune 500 companies, see who&apos;s building the future with WebsiteFast.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {tierData.map((tier, index) => (
                <TierCard
                  key={index}
                  title={tier.title}
                  subtitle={tier.subtitle}
                  description={tier.description}
                  profiles={tier.profiles}
                  tier={tier.tier}
                  badge={tier.badge}
                  icon={tier.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="w-full py-32">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6">
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  nothing you don&apos;t
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI understands your vision and creates pixel-perfect websites with all the features you need.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Generate complete websites in under 60 seconds with our advanced AI engine.",
                  preset: FloatingCardPresets.subtle,
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  description: "Every website is automatically optimized for mobile, tablet, and desktop.",
                  preset: FloatingCardPresets.purple,
                },
                {
                  icon: Globe,
                  title: "Global CDN",
                  description: "Your sites are served from our global network for maximum speed worldwide.",
                  preset: FloatingCardPresets.emerald,
                },
                {
                  icon: Code,
                  title: "Clean Code",
                  description: "Export production-ready code that follows best practices and web standards.",
                  preset: FloatingCardPresets.normal,
                },
                {
                  icon: Rocket,
                  title: "One-Click Deploy",
                  description: "Deploy instantly to our hosting or export to your preferred platform.",
                  preset: FloatingCardPresets.intense,
                },
                {
                  icon: Sparkles,
                  title: "AI Magic",
                  description: "Our AI understands context and creates websites that match your vision perfectly.",
                  preset: FloatingCardPresets.purple,
                },
              ].map((feature, index) => (
                <FloatingCard
                  key={index}
                  className="p-8 bg-white rounded-2xl border border-gray-200"
                  {...feature.preset}
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </FloatingCard>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="w-full py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
          <div className="container max-w-4xl mx-auto px-6 md:px-8 relative z-10">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to build something amazing?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of creators who have discovered the future of web development. Start building with AI
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex-1"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-blue-200">No credit card required • Generate unlimited websites</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="container max-w-6xl mx-auto px-6 md:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-gray-900" />
              <span className="font-bold text-gray-900">WebsiteFast</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                Support
              </Link>
            </div>
            <p className="text-sm text-gray-500">© 2024 WebsiteFast. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
