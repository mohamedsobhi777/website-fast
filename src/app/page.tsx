"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedCounter } from "@/components/ui/animated-counter"
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
      description: "Experienced founder with multiple successful product launches. Passionate about democratizing web development.",
      profiles: [
        { name: "Kennan Davison", avatar: "/api/placeholder/40/40" },
        { name: "Alex Rodriguez", avatar: "/api/placeholder/40/40" },
        { name: "Sarah Kim", avatar: "/api/placeholder/40/40" },
      ],
      icon: <Users className="w-5 h-5" />
    },
    {
      ...TierPresets.investors,
      description: "Backed by leading investors who believe in making web development accessible to everyone.",
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
      description: "World-class engineers from top companies, dedicated to building the best AI-powered web development tools.",
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
      description: "Trusted by developers and designers worldwide to create beautiful, functional websites.",
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
          {["Features", "Examples", "About", "Docs"].map((item) => (
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
                  AI-Powered Website Generation
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
                  Create professional websites instantly with AI - completely free.
                </p>
                <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                  Generate unlimited responsive websites with modern design, custom styling, and clean code. No signup required.
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
                      {isGenerating ? 'Generating...' : 'Generate Website'}
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
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  View Examples
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
                <div 
                  key={index} 
                  className="text-center space-y-3 group bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subLabel}</div>
                </div>
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
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  description: "Every website is automatically optimized for mobile, tablet, and desktop.",
                },
                {
                  icon: Globe,
                  title: "Global CDN",
                  description: "Your sites are served from our global network for maximum speed worldwide.",
                },
                {
                  icon: Code,
                  title: "Clean Code",
                  description: "Export production-ready code that follows best practices and web standards.",
                },
                {
                  icon: Rocket,
                  title: "One-Click Deploy",
                  description: "Deploy instantly to our hosting or export to your preferred platform.",
                },
                {
                  icon: Sparkles,
                  title: "AI Magic",
                  description: "Our AI understands context and creates websites that match your vision perfectly.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="w-full py-32 bg-gray-50/50">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6">
                Examples
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                See what&apos;s{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  possible
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From e-commerce stores to personal portfolios, see what our AI can create for you in minutes.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "E-commerce Store",
                  description: "Modern online store with product catalog and shopping cart functionality.",
                  prompt: "Create a modern e-commerce website for selling handmade jewelry",
                  image: "/api/placeholder/400/300",
                  tags: ["E-commerce", "Product Catalog", "Shopping Cart"]
                },
                {
                  title: "Portfolio Website",
                  description: "Clean portfolio site for showcasing creative work and professional experience.",
                  prompt: "Design a minimalist portfolio website for a graphic designer",
                  image: "/api/placeholder/400/300",
                  tags: ["Portfolio", "Gallery", "Contact Form"]
                },
                {
                  title: "Restaurant Website",
                  description: "Appetizing restaurant site with menu, reservations, and location details.",
                  prompt: "Build a restaurant website with online menu and reservation system",
                  image: "/api/placeholder/400/300",
                  tags: ["Restaurant", "Menu", "Reservations"]
                },
                {
                  title: "Tech Startup",
                  description: "Professional landing page for a SaaS product with features showcase.",
                  prompt: "Create a landing page for a project management SaaS tool",
                  image: "/api/placeholder/400/300",
                  tags: ["SaaS", "Landing Page", "Features"]
                },
                {
                  title: "Blog Website",
                  description: "Content-focused blog with article layout, categories, and author profiles.",
                  prompt: "Design a tech blog with article listings and author profiles",
                  image: "/api/placeholder/400/300",
                  tags: ["Blog", "Content", "Articles"]
                },
                {
                  title: "Event Website",
                  description: "Event landing page with schedule, speakers, and registration form.",
                  prompt: "Build a conference website with speaker lineup and registration",
                  image: "/api/placeholder/400/300",
                  tags: ["Event", "Conference", "Registration"]
                }
              ].map((example, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img 
                      src={example.image} 
                      alt={example.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {example.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{example.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{example.description}</p>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">&ldquo;{example.prompt}&rdquo;</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setPrompt(example.prompt)}
                    >
                      Use This Prompt
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your Own Website
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-32 bg-gray-50/50">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6">
                About WebsiteFast
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  powerful, free
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create professional websites instantly with AI. No accounts, no limits, no hidden fees. Just describe your vision and watch it come to life.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Forever */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Free Forever</h3>
                  <p className="text-gray-600">
                    Generate unlimited websites with no restrictions. No account required, no credit card needed.
                  </p>
                </div>
              </div>

              {/* AI-Powered */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered</h3>
                  <p className="text-gray-600">
                    Advanced AI understands your vision and creates responsive, modern websites with clean code.
                  </p>
                </div>
              </div>

              {/* Instant Export */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Export</h3>
                  <p className="text-gray-600">
                    Get production-ready HTML, CSS, and JavaScript that you can deploy anywhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-600 mb-4">Every website includes:</p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
                <span className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Responsive design
                </span>
                <span className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  SEO optimization
                </span>
                <span className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Clean, modern code
                </span>
                <span className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Accessibility features
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="docs" className="w-full py-32 bg-gray-50/50">
          <div className="container max-w-6xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6">
                Documentation
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  get started
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive guides, tutorials, and API documentation to help you master WebsiteFast.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Quick Start Guide",
                  description: "Get up and running with WebsiteFast in less than 5 minutes.",
                  icon: Rocket,
                  time: "5 min read",
                  link: "#"
                },
                {
                  title: "Best Practices",
                  description: "Learn how to write effective prompts for better website generation.",
                  icon: Star,
                  time: "8 min read",
                  link: "#"
                },
                {
                  title: "Customization Guide",
                  description: "Advanced techniques for customizing your generated websites.",
                  icon: Code,
                  time: "12 min read",
                  link: "#"
                },
                {
                  title: "Deployment Options",
                  description: "Learn about all the ways to deploy and host your websites.",
                  icon: Globe,
                  time: "6 min read",
                  link: "#"
                },
                {
                  title: "API Reference",
                  description: "Complete API documentation for developers and integrations.",
                  icon: Code,
                  time: "Reference",
                  link: "#"
                },
                {
                  title: "Troubleshooting",
                  description: "Common issues and solutions to help you resolve problems quickly.",
                  icon: Sparkles,
                  time: "Reference",
                  link: "#"
                }
              ].map((doc, index) => (
                <a 
                  key={index} 
                  href={doc.link}
                  className="block bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {doc.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {doc.time}
                        </Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{doc.description}</p>
                      <div className="flex items-center mt-4 text-blue-600 text-sm font-medium">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-20 bg-white rounded-2xl border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="lg">
                    Join Community
                  </Button>
                </div>
              </div>
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
