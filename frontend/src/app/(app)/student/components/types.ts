export interface ScoringFinding {
  id: string
  dimension: string
  ruleId: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  description: string
  filePath?: string
  lineNumber?: number
  detectionMethod?: string
  confidence?: number
  scoreImpact?: number
  remediation?: string
}

export interface DimensionScore {
  id: string
  dimension: string
  weight: number
  effectiveWeight?: number
  score: number
  maxScore?: number
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'UNAVAILABLE' | 'NOT_APPLICABLE'
  finding?: string
  ruleCategory?: string
  explanation?: string
  confidence?: number
  findings?: ScoringFinding[]
  positiveEvidence?: Array<{ parameter: string; value: string | number; detail: string }>
  negativeEvidence?: Array<{ parameter: string; value: string | number; detail: string; deduction: number }>
  evidence: { label: string; value: string }[]
}

export interface VivaQuestion {
  id: string
  dimension: string
  question: string
  focusArea: string
  modelDefense: string
  talkingPoints: string[]
  evidenceSources: string[]
  isMastered?: boolean
}

export interface ContributionMetric {
  studentName: string
  email: string
  role: string
  contributionPercent: number
  confidence: number
  commitsCount: number
  mergedPrCount: number
  linesAdded: number
  linesDeleted: number
  pillars: {
    implementation: number
    testing: number
    tasksPrs: number
    reviews: number
    docsDesign: number
  }
}

export interface RepoDetails {
  fullName: string
  language: string
  branch: string
  stars: number
  forks: number
  lastEvaluatedAt: string
}

export type EvaluationPhase = 'PHASE_1' | 'PHASE_2' | 'PHASE_3'
