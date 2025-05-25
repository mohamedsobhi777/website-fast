// Database-powered data store for projects using PostgreSQL and Drizzle ORM

import { db } from './db'
import { projects, projectVersions, ProjectVersion } from './db/schema'
import { eq, desc } from 'drizzle-orm'

// Combined interface for frontend
export interface ProjectWithVersion {
  id: string
  originalPrompt: string
  activeVersionId: string | null
  createdAt: Date
  updatedAt: Date
  // Active version details
  activeVersion?: {
    id: string
    versionNumber: number
    prompt: string
    revisionPrompt: string | null
    generatedHtml: string | null
    status: 'generating' | 'completed' | 'failed'
    createdAt: Date
    updatedAt: Date
  }
  // All versions for history
  versions?: ProjectVersion[]
}

export const ProjectStore = {
  // Create a new project with first version
  async create(data: {
    id: string
    prompt: string
    generatedHtml?: string
    status?: 'generating' | 'completed' | 'failed'
  }): Promise<ProjectWithVersion> {
    try {
      // Create project
      const [newProject] = await db.insert(projects).values({
        id: data.id,
        originalPrompt: data.prompt,
      }).returning()

      // Create first version
      const [firstVersion] = await db.insert(projectVersions).values({
        projectId: newProject.id,
        versionNumber: 1,
        prompt: data.prompt,
        revisionPrompt: null,
        generatedHtml: data.generatedHtml || '',
        status: data.status || 'generating',
        isActive: true,
      }).returning()

      // Update project to reference active version
      await db.update(projects)
        .set({ activeVersionId: firstVersion.id })
        .where(eq(projects.id, newProject.id))

      return {
        ...newProject,
        activeVersion: {
          id: firstVersion.id,
          versionNumber: firstVersion.versionNumber,
          prompt: firstVersion.prompt,
          revisionPrompt: firstVersion.revisionPrompt,
          generatedHtml: firstVersion.generatedHtml || '',
          status: firstVersion.status,
          createdAt: firstVersion.createdAt,
          updatedAt: firstVersion.updatedAt,
        }
      }
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project')
    }
  },

  // Get project with active version and version history
  async get(id: string): Promise<ProjectWithVersion | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
      
      if (!project) return undefined

      // Get all versions
      const versions = await db.select()
        .from(projectVersions)
        .where(eq(projectVersions.projectId, id))
        .orderBy(desc(projectVersions.versionNumber))

      // Get active version
      const activeVersion = versions.find(v => v.isActive) || versions[0]

      return {
        ...project,
        activeVersion: activeVersion ? {
          id: activeVersion.id,
          versionNumber: activeVersion.versionNumber,
          prompt: activeVersion.prompt,
          revisionPrompt: activeVersion.revisionPrompt,
          generatedHtml: activeVersion.generatedHtml || '',
          status: activeVersion.status,
          createdAt: activeVersion.createdAt,
          updatedAt: activeVersion.updatedAt,
        } : undefined,
        versions
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      return undefined
    }
  },

  // Update a specific version
  async updateVersion(versionId: string, updates: Partial<{
    generatedHtml: string
    status: 'generating' | 'completed' | 'failed'
  }>): Promise<ProjectVersion | null> {
    try {
      const [updatedVersion] = await db
        .update(projectVersions)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(projectVersions.id, versionId))
        .returning()

      return updatedVersion || null
    } catch (error) {
      console.error('Error updating version:', error)
      return null
    }
  },

  // Create a new revision (new version)
  async createRevision(projectId: string, data: {
    id: string
    revisionPrompt: string
    baseVersionId: string // Version to base the revision on
    generatedHtml?: string
    status?: 'generating' | 'completed' | 'failed'
  }): Promise<ProjectVersion> {
    try {
      // Get base version for context
      const [baseVersion] = await db.select()
        .from(projectVersions)
        .where(eq(projectVersions.id, data.baseVersionId))
        .limit(1)

      if (!baseVersion) {
        throw new Error('Base version not found')
      }

      // Get next version number
      const existingVersions = await db.select()
        .from(projectVersions)
        .where(eq(projectVersions.projectId, projectId))
        .orderBy(desc(projectVersions.versionNumber))

      const nextVersionNumber = existingVersions.length > 0 
        ? existingVersions[0].versionNumber + 1 
        : 1

      // Deactivate all existing versions
      await db.update(projectVersions)
        .set({ isActive: false })
        .where(eq(projectVersions.projectId, projectId))

      // Create new version
      const [newVersion] = await db.insert(projectVersions).values({
        id: data.id,
        projectId,
        versionNumber: nextVersionNumber,
        prompt: `${baseVersion.prompt}\n\nRevision: ${data.revisionPrompt}`,
        revisionPrompt: data.revisionPrompt,
        generatedHtml: data.generatedHtml || '',
        status: data.status || 'generating',
        isActive: true,
      }).returning()

      // Update project active version
      await db.update(projects)
        .set({ 
          activeVersionId: newVersion.id,
          updatedAt: new Date()
        })
        .where(eq(projects.id, projectId))

      return newVersion
    } catch (error) {
      console.error('Error creating revision:', error)
      throw new Error('Failed to create revision')
    }
  },

  // Switch to a different version
  async switchVersion(projectId: string, versionId: string): Promise<boolean> {
    try {
      // Deactivate all versions for this project
      await db.update(projectVersions)
        .set({ isActive: false })
        .where(eq(projectVersions.projectId, projectId))

      // Activate the selected version
      await db.update(projectVersions)
        .set({ isActive: true })
        .where(eq(projectVersions.id, versionId))

      // Update project active version reference
      await db.update(projects)
        .set({ 
          activeVersionId: versionId,
          updatedAt: new Date()
        })
        .where(eq(projects.id, projectId))

      return true
    } catch (error) {
      console.error('Error switching version:', error)
      return false
    }
  },

  // Get all projects (for listing)
  async getAll(): Promise<ProjectWithVersion[]> {
    try {
      const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt))
      
      const projectsWithVersions = await Promise.all(
        allProjects.map(async (project) => {
          const versions = await db.select()
            .from(projectVersions)
            .where(eq(projectVersions.projectId, project.id))
            .orderBy(desc(projectVersions.versionNumber))

          const activeVersion = versions.find(v => v.isActive) || versions[0]

          return {
            ...project,
            activeVersion: activeVersion ? {
              id: activeVersion.id,
              versionNumber: activeVersion.versionNumber,
              prompt: activeVersion.prompt,
              revisionPrompt: activeVersion.revisionPrompt,
              generatedHtml: activeVersion.generatedHtml || '',
              status: activeVersion.status,
              createdAt: activeVersion.createdAt,
              updatedAt: activeVersion.updatedAt,
            } : undefined,
            versions
          }
        })
      )

      return projectsWithVersions
    } catch (error) {
      console.error('Error fetching all projects:', error)
      return []
    }
  },

  // Delete project and all versions
  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(projects).where(eq(projects.id, id))
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  },

  // Get project count
  async count(): Promise<number> {
    try {
      const result = await db.select().from(projects)
      return result.length
    } catch (error) {
      console.error('Error counting projects:', error)
      return 0
    }
  },

  // Clear all projects (useful for development/testing)
  async clear(): Promise<void> {
    try {
      await db.delete(projects)
    } catch (error) {
      console.error('Error clearing projects:', error)
      throw new Error('Failed to clear projects')
    }
  }
} 