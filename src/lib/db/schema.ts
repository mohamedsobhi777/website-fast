import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean } from 'drizzle-orm/pg-core'

// Enum for project status
export const projectStatusEnum = pgEnum('project_status', ['generating', 'completed', 'failed'])

// Projects table - main project container
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalPrompt: text('original_prompt').notNull(), // The initial prompt
  activeVersionId: uuid('active_version_id'), // Currently active version
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Project versions table - each revision creates a new version
export const projectVersions = pgTable('project_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(), // 1, 2, 3, etc.
  prompt: text('prompt').notNull(), // Either original prompt or revision prompt
  revisionPrompt: text('revision_prompt'), // The feedback/change request (null for v1)
  generatedHtml: text('generated_html').default(''),
  status: projectStatusEnum('status').default('generating').notNull(),
  isActive: boolean('is_active').default(false).notNull(), // Which version is currently active
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type exports for TypeScript
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectVersion = typeof projectVersions.$inferSelect
export type NewProjectVersion = typeof projectVersions.$inferInsert 