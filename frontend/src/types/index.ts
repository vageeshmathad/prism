// Core entity types for PRISM platform

export type UserRole = 'SUPER_ADMIN' | 'INSTITUTION_ADMIN' | 'FACULTY' | 'STUDENT' | 'EVALUATOR'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  institutionId?: string
  institution?: Institution
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Institution {
  id: string
  name: string
  code: string
  domain?: string
  logoUrl?: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  repositoryUrl?: string
  repositoryProvider: 'GITHUB' | 'GITLAB' | 'BITBUCKET'
  status: ProjectStatus
  academicYear: string
  semesterId?: string
  institutionId: string
  institution?: Institution
  teams?: Team[]
  evaluations?: Evaluation[]
  createdAt: string
  updatedAt: string
  techStack: string[]
  visibility: 'PUBLIC' | 'PRIVATE' | 'INSTITUTION'
}

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'SUSPENDED'

export interface Team {
  id: string
  name: string
  projectId: string
  project?: Project
  members: TeamMember[]
  repositoryUrl?: string
  branchName?: string
  evaluations?: Evaluation[]
  createdAt: string
  score?: number
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  user: User
  role: 'LEADER' | 'MEMBER'
  joinedAt: string
  contributionScore?: number
}

export interface Evaluation {
  id: string
  teamId: string
  team?: Team
  evaluatorId: string
  evaluator?: User
  projectId: string
  status: EvaluationStatus
  qualityScore: number
  contributionScore: number
  understandingScore: number
  overallScore: number
  categoryScores: CategoryScore[]
  metrics: EvaluationMetric[]
  securityFindings: SecurityFinding[]
  feedback: string
  aiAnalysis?: string
  createdAt: string
  completedAt?: string
  commitCount?: number
  linesAdded?: number
  linesRemoved?: number
}

export type EvaluationStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface CategoryScore {
  category: string
  score: number
  maxScore: number
  weight: number
  details?: string
}

export interface EvaluationMetric {
  id: string
  evaluationId: string
  name: string
  value: number
  unit?: string
  category: string
  threshold?: number
  status: 'PASS' | 'FAIL' | 'WARNING'
}

export interface SecurityFinding {
  id: string
  evaluationId: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  type: string
  title: string
  description: string
  file?: string
  line?: number
  recommendation?: string
  status: 'OPEN' | 'FIXED' | 'IGNORED' | 'FALSE_POSITIVE'
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'EVALUATION' | 'SYSTEM'
  isRead: boolean
  link?: string
  createdAt: string
}

export interface DashboardStats {
  totalProjects: number
  activeEvaluations: number
  averageScore: number
  totalStudents: number
  totalTeams: number
  pendingEvaluations: number
  completedEvaluations: number
  criticalFindings: number
  scoreDistribution: ScoreDistribution[]
  recentActivity: ActivityItem[]
  topTeams: TopTeam[]
}

export interface ScoreDistribution {
  range: string
  count: number
}

export interface ActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
  userId?: string
  userName?: string
}

export interface TopTeam {
  id: string
  name: string
  projectName: string
  score: number
  rank: number
}

export interface RadarDimension {
  dimension: string
  score: number
  fullMark: number
}

export interface ContributionData {
  memberId: string
  memberName: string
  commits: number
  linesAdded: number
  linesRemoved: number
  filesChanged: number
  percentage: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface AuthResponse {
  user: User
  token: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateProjectDto {
  name: string
  description: string
  repositoryUrl?: string
  repositoryProvider: 'GITHUB' | 'GITLAB' | 'BITBUCKET'
  academicYear: string
  techStack: string[]
  visibility: 'PUBLIC' | 'PRIVATE' | 'INSTITUTION'
}

export interface FilterOptions {
  status?: string
  institutionId?: string
  academicYear?: string
  search?: string
  page?: number
  limit?: number
}
