'use client'

import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Github, Printer } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { RepoDetails, EvaluationPhase } from './types'

interface QualityGateHeroProps {
  overallScore: number
  phase: EvaluationPhase
  repoDetails: RepoDetails | null
  onPrint: () => void
}

export const QualityGateHero: React.FC<QualityGateHeroProps> = ({
  overallScore,
  phase,
  repoDetails,
  onPrint,
}) => {
  const isPassed = overallScore >= 80
  const isWarning = overallScore >= 65 && overallScore < 80
  const repo = repoDetails || {
    fullName: 'No repository connected',
    branch: 'none',
    language: 'N/A',
    lastEvaluatedAt: 'Not evaluated',
  }

  const statusConfig = isPassed
    ? {
        label: 'QUALITY GATE PASSED',
        variant: 'success' as const,
        icon: <CheckCircle2 size={24} strokeWidth={2.5} />,
        grade: 'A',
        badgeClass: 'sonar-badge-a',
        complianceText: 'Grade A • Certified Compliant',
        bgBox: 'bg-success text-white',
      }
    : isWarning
    ? {
        label: 'QUALITY GATE WARNING',
        variant: 'warning' as const,
        icon: <AlertTriangle size={24} strokeWidth={2.5} />,
        grade: 'B',
        badgeClass: 'sonar-badge-b',
        complianceText: 'Grade B • Needs Refinement',
        bgBox: 'bg-warning text-white',
      }
    : {
        label: 'QUALITY GATE FAILED',
        variant: 'error' as const,
        icon: <XCircle size={24} strokeWidth={2.5} />,
        grade: 'C',
        badgeClass: 'sonar-badge-c',
        complianceText: 'Grade C • Non-Compliant',
        bgBox: 'bg-danger text-white',
      }

  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-4">
      {/* Top Banner: Gate Indicator & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 shadow-subtle ${statusConfig.bgBox}`}
          >
            {statusConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusConfig.variant} size="sm" dot>
                {statusConfig.label}
              </Badge>
              <span className="text-xs font-sans text-secondary-text">
                Phase: {phase.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-mono font-bold text-primary-text tracking-tight">
                {overallScore}
              </span>
              <span className="text-sm font-mono text-muted-text">/ 100</span>
              <span
                className={`text-xs font-semibold font-mono ml-1 ${
                  isPassed ? 'text-success-text' : isWarning ? 'text-warning-text' : 'text-danger-text'
                }`}
              >
                ({statusConfig.complianceText})
              </span>
            </div>
          </div>
        </div>

        {/* Action: Print Evaluation Report */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-secondary text-xs font-sans text-secondary-text hover:text-primary-text transition-colors shadow-2xs"
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Ingested Repository Bar (GitHub Style) */}
      <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between text-xs font-sans text-secondary-text gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Github size={14} className="text-primary-text" />
          <span className="font-bold text-primary-text">{repo.fullName}</span>
          <span className="text-border">•</span>
          <span>branch: {repo.branch}</span>
          <span className="text-border">•</span>
          <span>{repo.language}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-text">
          <span>
            Commit:{' '}
            <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-primary-text font-mono border border-border">
              8f2a9d
            </code>
          </span>
          <span className="text-border">•</span>
          <span>Evaluated {repo.lastEvaluatedAt}</span>
        </div>
      </div>
    </div>
  )
}
