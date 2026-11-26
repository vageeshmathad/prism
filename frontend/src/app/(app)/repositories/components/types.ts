export interface EvaluationRun {
  id: string
  overallScore: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING'
  phase?: string
  createdAt?: string
}

export interface RepositoryItem {
  id: string
  fullName: string
  githubRepoId?: string
  defaultBranch: string
  language?: string
  languages?: Record<string, number>
  isPrivate: boolean
  htmlUrl?: string | null
  lastSyncedAt?: string
  metadata?: {
    source?: string
    teamName?: string
    originalFilename?: string
    stars?: number
    forks?: number
  }
  project?: {
    id: string
    name: string
  }
  _count?: {
    commits?: number
    pullRequests?: number
    evaluationRuns?: number
    securityFindings?: number
  }
  evaluationRuns?: EvaluationRun[]
}

export interface GitHubStatus {
  isConfigured: boolean
  connected: boolean
  account?: {
    login: string
    avatarUrl?: string
    name?: string
  } | null
}

export interface ProjectItem {
  id: string
  name: string
}

export type ViewMode = 'table' | 'grid'

export type SortField = 'updated' | 'name' | 'score' | 'commits'
export type SortOrder = 'asc' | 'desc'
