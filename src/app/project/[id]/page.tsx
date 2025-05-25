"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FloatingCard, FloatingCardPresets } from "@/components/ui/floating-card"
import {
  ArrowLeft,
  Globe,
  Share2,
  Download,
  ExternalLink,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  RefreshCw,
  Loader2,
  Edit,
  Send,
  History,
  Rocket,
  Clock,
  GitBranch
} from "lucide-react"
import Link from "next/link"
import { ProjectWithVersion, ProjectVersion } from "@/lib/data-store"

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<ProjectWithVersion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Revision state
  const [isRevising, setIsRevising] = useState(false)
  const [revisionPrompt, setRevisionPrompt] = useState("")
  const [isGeneratingRevision, setIsGeneratingRevision] = useState(false)
  
  // Version history state
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  
  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)
  const [showDeploymentSuccess, setShowDeploymentSuccess] = useState(false)

  const projectId = params.id as string

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/project/${projectId}`)
      const data = await response.json()

      if (data.success) {
        setProject(data.project)
      } else {
        setError(data.error || 'Failed to load project')
      }
    } catch (err) {
      setError('Failed to load project')
      console.error('Error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleCopyHtml = async () => {
    if (!project?.activeVersion?.generatedHtml) return

    try {
      await navigator.clipboard.writeText(project.activeVersion.generatedHtml)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy HTML:', err)
    }
  }

  const handleDownloadHtml = () => {
    if (!project?.activeVersion?.generatedHtml) return

    const blob = new Blob([project.activeVersion.generatedHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `website-${project.id}-v${project.activeVersion.versionNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getShareUrl = () => {
    return `${window.location.origin}/project/${projectId}`
  }

  const handleShare = (platform: string) => {
    const url = getShareUrl()
    const text = `Check out this AI-generated website I created with WebsiteFast! Original prompt: "${project?.originalPrompt}"`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
  }

  const handleRequestRevision = async () => {
    if (!revisionPrompt.trim() || !project?.activeVersion) return

    setIsGeneratingRevision(true)

    try {
      const response = await fetch('/api/revise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          revisionPrompt: revisionPrompt.trim(),
          baseVersionId: project.activeVersion.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh project data to show new version
        await fetchProject()
        setRevisionPrompt("")
        setIsRevising(false)
      } else {
        alert(data.error || 'Failed to generate revision. Please try again.')
      }
    } catch (error) {
      console.error('Error generating revision:', error)
      alert('Failed to generate revision. Please try again.')
    } finally {
      setIsGeneratingRevision(false)
    }
  }

  const handleSwitchVersion = async (versionId: string) => {
    try {
      const response = await fetch('/api/switch-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project?.id,
          versionId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh project data to show switched version
        await fetchProject()
        setShowVersionHistory(false)
      } else {
        alert(data.error || 'Failed to switch version.')
      }
    } catch (error) {
      console.error('Error switching version:', error)
      alert('Failed to switch version.')
    }
  }

  const handleDeploy = async () => {
    if (!project?.activeVersion?.generatedHtml) {
      alert('No website content to deploy.')
      return
    }

    setIsDeploying(true)

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          // Deploy active version by default
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDeploymentUrl(data.deploymentUrl)
        setShowDeploymentSuccess(true)
        setTimeout(() => setShowDeploymentSuccess(false), 10000) // Hide after 10 seconds
      } else {
        alert(data.error || 'Failed to deploy website. Please try again.')
      }
    } catch (error) {
      console.error('Error deploying website:', error)
      alert('Failed to deploy website. Please try again.')
    } finally {
      setIsDeploying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading your project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
          <p className="text-gray-600">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Your Generated Website
                  {project.activeVersion && (
                    <span className="text-sm text-gray-500 ml-2">
                      v{project.activeVersion.versionNumber}
                    </span>
                  )}
                </h1>
                <Badge variant={project.activeVersion?.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                  {project.activeVersion?.status === 'completed' && '✅ Complete'}
                  {project.activeVersion?.status === 'generating' && <><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Generating</>}
                  {project.activeVersion?.status === 'failed' && '❌ Failed'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                <History className="w-4 h-4 mr-2" />
                Versions ({project.versions?.length || 0})
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyHtml}>
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy HTML'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHtml}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleDeploy}
                disabled={isDeploying || !project.activeVersion?.generatedHtml}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy
                  </>
                )}
              </Button>
              <div className="relative group">
                <Button size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                {/* Share dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                      Share on LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Deployment Success Banner */}
      {showDeploymentSuccess && deploymentUrl && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Website deployed successfully!
                  </h3>
                  <p className="text-sm text-green-600">
                    Your website is now live at:{' '}
                    <a 
                      href={deploymentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium underline hover:no-underline"
                    >
                      {deploymentUrl}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeploymentSuccess(false)}
                  className="text-green-700 hover:bg-green-100"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website Preview */}
            <FloatingCard className="bg-white rounded-lg p-6" {...FloatingCardPresets.subtle}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Website Preview</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`data:text/html,${encodeURIComponent(project.activeVersion?.generatedHtml || '')}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
              
              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  srcDoc={project.activeVersion?.generatedHtml || ''}
                  className="w-full h-full border-0"
                  title="Website Preview"
                />
              </div>
            </FloatingCard>

            {/* Request Revision */}
            <FloatingCard className="bg-white rounded-lg p-6" {...FloatingCardPresets.normal}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Revision</h3>
                <Badge variant="outline">v{project.activeVersion?.versionNumber}</Badge>
              </div>
              
              {!isRevising ? (
                <Button 
                  onClick={() => setIsRevising(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Make Changes to This Website
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="revision-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                      What would you like to change?
                    </label>
                    <Textarea
                      id="revision-prompt"
                      placeholder="e.g., Change the header color to blue, add a contact form, make the layout wider..."
                      value={revisionPrompt}
                      onChange={(e) => setRevisionPrompt(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isGeneratingRevision}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRequestRevision}
                      disabled={!revisionPrompt.trim() || isGeneratingRevision}
                      className="flex-1"
                    >
                      {isGeneratingRevision ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Generate Revision
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsRevising(false)
                        setRevisionPrompt("")
                      }}
                      disabled={isGeneratingRevision}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </FloatingCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <FloatingCard className="bg-white rounded-lg p-6" {...FloatingCardPresets.subtle}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Original Prompt</label>
                  <p className="text-sm text-gray-900">{project.originalPrompt}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Active Version</label>
                  <p className="text-sm text-gray-900">
                    Version {project.activeVersion?.versionNumber}
                    {project.activeVersion?.revisionPrompt && (
                      <span className="text-xs text-gray-500 block">
                        Revision: {project.activeVersion.revisionPrompt}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </FloatingCard>

            {/* Version History */}
            {showVersionHistory && (
              <FloatingCard className="bg-white rounded-lg p-6" {...FloatingCardPresets.normal}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {project.versions?.map((version: any) => (
                    <div
                      key={version.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        version.isActive 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => !version.isActive && handleSwitchVersion(version.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">
                            Version {version.versionNumber}
                          </span>
                          {version.isActive && (
                            <Badge variant="default" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {version.revisionPrompt && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {version.revisionPrompt}
                        </p>
                      )}
                      <div className="flex items-center mt-2">
                        <Clock className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {new Date(version.updatedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No versions found.</p>
                  )}
                </div>
              </FloatingCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 