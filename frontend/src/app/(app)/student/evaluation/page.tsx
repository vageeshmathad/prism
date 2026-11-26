'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sliders,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  GitBranch,
  FileCode,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DimensionScore, ScoringFinding } from '../components/types'
import { DimensionDetailModal } from '../components/DimensionDetailModal'
import { useStudentWorkspace } from '../StudentWorkspaceContext'

const DIMENSION_ORDER = [
  'code_quality',
  'design_structure',
  'correctness_testing',
  'efficiency',
  'git_hygiene',
  'documentation',
  'security',
  'understanding',
  'task_scope',
]

export default function StudentEvaluationPage() {
  const { dimensions, overallScore, hasEvaluated, repoDetails } = useStudentWorkspace()
  const [selectedDimension, setSelectedDimension] = useState<DimensionScore | null>(null)
  const [filter, setFilter] = useState<'all' | 'passed' | 'attention' | 'unavailable'>('all')

  // Empty State 1: No repository connected
  if (!repoDetails && !hasEvaluated) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in font-sans">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-muted-text">
          <GitBranch size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            No Repository Connected
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Connect your GitHub repository to generate your automated academic project evaluation.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs transition-colors no-underline"
          >
            <span>Connect & Analyze Repository</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    )
  }

  // Empty State 2: Repository connected but evaluation not run
  if (repoDetails && !hasEvaluated) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in font-sans">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <Layers size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            Evaluation Pending
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Repository <strong className="text-primary-text">{repoDetails.fullName}</strong> is connected, but has not been evaluated yet.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs transition-colors no-underline"
          >
            <span>Run Evaluation Now</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    )
  }

  // Empty State 3: Evaluation data unavailable
  if (hasEvaluated && dimensions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in font-sans">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-muted-text">
          <HelpCircle size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            Evaluation Data Unavailable
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            No evaluation result data was recorded for this repository snapshot.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-primary-text text-xs font-semibold shadow-2xs transition-colors no-underline"
          >
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate grade and quality gate
  const grade = overallScore >= 80 ? 'A' : overallScore >= 65 ? 'B' : 'C'
  const isPassed = overallScore >= 80
  const isWarning = overallScore >= 65 && overallScore < 80

  const qualityGateConfig = isPassed
    ? {
        label: 'QUALITY GATE PASSED',
        variant: 'success' as const,
        description: 'Meets academic engineering standards',
      }
    : isWarning
    ? {
        label: 'QUALITY GATE WARNING',
        variant: 'warning' as const,
        description: 'Review recommended before final defense',
      }
    : {
        label: 'QUALITY GATE FAILED',
        variant: 'error' as const,
        description: 'Action required to meet rubric criteria',
      }

  // Sort dimensions in canonical 9-rubric order
  const orderedDimensions = [...dimensions].sort((a, b) => {
    const idxA = DIMENSION_ORDER.indexOf(a.id)
    const idxB = DIMENSION_ORDER.indexOf(b.id)
    return (idxA >= 0 ? idxA : 99) - (idxB >= 0 ? idxB : 99)
  })

  // Filter dimensions
  const filteredDimensions = orderedDimensions.filter((dim) => {
    if (filter === 'passed') return dim.status === 'PASSED'
    if (filter === 'attention') return dim.status === 'WARNING' || dim.status === 'FAILED'
    if (filter === 'unavailable') return dim.status === 'UNAVAILABLE' || dim.status === 'NOT_APPLICABLE'
    return true
  })

  // Aggregate all genuine findings across all dimensions (Part 5: Recommendations)
  const allFindings: Array<ScoringFinding & { dimensionName: string }> = []
  dimensions.forEach((d) => {
    if (Array.isArray(d.findings)) {
      d.findings.forEach((f) => {
        allFindings.push({ ...f, dimensionName: d.dimension })
      })
    }
  })

  // Sort findings by severity: CRITICAL -> HIGH -> MEDIUM -> LOW -> INFO
  const severityRank: Record<string, number> = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    INFO: 5,
  }
  const sortedFindings = allFindings.sort(
    (a, b) => (severityRank[a.severity] || 99) - (severityRank[b.severity] || 99)
  )

  const unavailableCount = dimensions.filter(
    (d) => d.status === 'UNAVAILABLE' || d.status === 'NOT_APPLICABLE'
  ).length
  const passedCount = dimensions.filter((d) => d.status === 'PASSED').length
  const attentionCount = dimensions.filter(
    (d) => d.status === 'WARNING' || d.status === 'FAILED'
  ).length

  return (
    <div className="space-y-6 animate-in font-sans max-w-5xl">
      {/* 1. Page Header */}
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-xl font-bold tracking-tight text-primary-text flex items-center gap-2">
          <Sliders size={20} className="text-primary" />
          Evaluation
        </h1>
        <p className="text-xs text-secondary-text mt-1 leading-relaxed">
          Review your repository score, evaluation dimensions, and evidence behind each result.
        </p>
      </div>

      {/* 2. Overall Result Banner */}
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Score & Gate */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shrink-0">
              <span className="text-2xl font-mono font-bold text-primary-text">
                {grade}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={qualityGateConfig.variant} size="sm" dot>
                  {qualityGateConfig.label}
                </Badge>
                <span className="text-xs text-muted-text">
                  {qualityGateConfig.description}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-primary-text tracking-tight">
                  {overallScore}
                </span>
                <span className="text-xs font-mono text-muted-text">/ 100</span>
                <span className="text-xs text-secondary-text ml-1">
                  • Grade {grade} Certified
                </span>
              </div>
            </div>
          </div>

          {/* Repository & Snapshot Context */}
          {repoDetails && (
            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle text-xs text-secondary-text space-y-1">
              <div>
                <span className="text-muted-text">Repository: </span>
                <strong className="text-primary-text font-mono">
                  {repoDetails.fullName}
                </strong>
              </div>
              <div className="flex items-center sm:justify-end gap-2 text-[11px] text-muted-text">
                <span>branch: {repoDetails.branch || 'main'}</span>
                <span>•</span>
                <span>{repoDetails.language || 'Codebase'}</span>
              </div>
              {repoDetails.lastEvaluatedAt && (
                <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-muted-text pt-0.5">
                  <Calendar size={12} />
                  <span>Evaluated {repoDetails.lastEvaluatedAt}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Nine Evaluation Dimensions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider flex items-center gap-2">
              <Layers size={15} className="text-primary" />
              Nine Rubric Dimensions
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Click any dimension to view its transparent calculation, applied rules, and evidence.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1 p-0.5 bg-surface-secondary rounded-lg border border-border text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'all'
                  ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              All ({dimensions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('passed')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'passed'
                  ? 'bg-surface text-success-text font-bold shadow-2xs border border-border'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Passed ({passedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('attention')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'attention'
                  ? 'bg-surface text-warning-text font-bold shadow-2xs border border-border'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Attention ({attentionCount})
            </button>
            {unavailableCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter('unavailable')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filter === 'unavailable'
                    ? 'bg-surface text-muted-text font-bold shadow-2xs border border-border'
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                N/A ({unavailableCount})
              </button>
            )}
          </div>
        </div>

        {/* Dimensions Table */}
        <div className="bg-surface border border-border rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border text-muted-text select-none">
                <tr>
                  <th className="py-3 px-4 font-semibold">Evaluation Dimension</th>
                  <th className="py-3 px-3 font-semibold">Weight</th>
                  <th className="py-3 px-3 font-semibold">Score</th>
                  <th className="py-3 px-3 font-semibold">Evaluation Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-sans">
                {filteredDimensions.map((dim, idx) => {
                  const isDimPassed = dim.status === 'PASSED'
                  const isDimWarning = dim.status === 'WARNING'
                  const isDimUnavailable =
                    dim.status === 'UNAVAILABLE' || dim.status === 'NOT_APPLICABLE'

                  const badgeVariant = isDimPassed
                    ? 'success'
                    : isDimWarning
                    ? 'warning'
                    : isDimUnavailable
                    ? 'neutral'
                    : 'error'

                  return (
                    <tr
                      key={dim.id}
                      className="hover:bg-surface-secondary/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedDimension(dim)}
                    >
                      {/* Dimension Name & Subtitle */}
                      <td className="py-3.5 px-4 font-semibold text-primary-text">
                        <div className="min-w-[200px]">
                          <span className="font-bold">{dim.dimension}</span>
                          <span className="text-[11px] text-muted-text block truncate mt-0.5 font-normal">
                            {dim.finding || dim.explanation}
                          </span>
                        </div>
                      </td>

                      {/* Weight */}
                      <td className="py-3.5 px-3 text-secondary-text font-mono min-w-[80px]">
                        <span>{dim.weight}%</span>
                        {dim.effectiveWeight !== undefined &&
                          dim.effectiveWeight !== dim.weight && (
                            <span className="text-[10px] text-muted-text block font-sans">
                              eff: {dim.effectiveWeight}%
                            </span>
                          )}
                      </td>

                      {/* Score Display (Never zero for unavailable) */}
                      <td className="py-3.5 px-3 min-w-[120px]">
                        {!isDimUnavailable ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary-text">
                              {dim.score} / 100
                            </span>
                            <div className="w-14 h-1.5 bg-surface-secondary rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  dim.score >= 80
                                    ? 'bg-success'
                                    : dim.score >= 65
                                    ? 'bg-warning'
                                    : 'bg-danger'
                                }`}
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-text font-mono">
                            {dim.status === 'NOT_APPLICABLE' ? 'N/A' : 'Unavailable'}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3 min-w-[110px]">
                        <Badge variant={badgeVariant} size="sm" dot>
                          {dim.status}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right min-w-[110px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDimension(dim)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-secondary text-primary-text text-xs font-medium transition-colors shadow-2xs"
                        >
                          <Eye size={12} className="text-muted-text" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Actionable Recommendations from Actual Findings */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert size={15} className="text-primary" />
            Recommendations & Action Items
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Prioritized engineering improvements derived strictly from verified evaluation findings.
          </p>
        </div>

        {sortedFindings.length > 0 ? (
          <div className="space-y-2.5">
            {sortedFindings.map((finding) => (
              <div
                key={finding.id}
                className="p-4 bg-surface border border-border rounded-xl space-y-2 shadow-2xs text-xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        finding.severity === 'CRITICAL'
                          ? 'error'
                          : finding.severity === 'HIGH'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {finding.severity}
                    </Badge>
                    <code className="text-primary-text font-mono font-bold">
                      {finding.ruleId}
                    </code>
                    <span className="text-muted-text">•</span>
                    <span className="text-secondary-text font-medium">
                      {finding.dimensionName}
                    </span>
                  </div>
                  {finding.scoreImpact !== undefined && (
                    <span className="font-mono font-bold text-danger-text">
                      {finding.scoreImpact} pts deduction
                    </span>
                  )}
                </div>

                <p className="text-primary-text leading-relaxed">
                  {finding.description}
                </p>

                {/* File & Line Evidence if available */}
                {(finding.filePath || finding.lineNumber) && (
                  <div className="flex items-center gap-2 text-muted-text font-mono text-[11px] bg-surface-secondary/60 px-2.5 py-1.5 rounded-lg border border-border-subtle">
                    <FileCode size={12} className="text-secondary-text" />
                    <span>
                      {finding.filePath}
                      {finding.lineNumber ? `:${finding.lineNumber}` : ''}
                    </span>
                    {finding.detectionMethod && (
                      <span className="ml-auto text-[10px] text-muted-text font-sans">
                        via {finding.detectionMethod}
                      </span>
                    )}
                  </div>
                )}

                {/* Remediation */}
                {finding.remediation && (
                  <div className="pt-2 border-t border-border-subtle text-[11px] text-secondary-text">
                    <strong className="text-primary-text">Correction:</strong>{' '}
                    {finding.remediation}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Clean confirmation state when 0 findings exist */
          <div className="bg-surface border border-border rounded-xl p-6 text-center shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-success/10 text-success-text flex items-center justify-center mx-auto">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-sm font-semibold text-primary-text">
              All Rubric Checks Passed
            </h3>
            <p className="text-xs text-secondary-text max-w-md mx-auto">
              Zero findings or deductions were flagged for this evaluation. All evaluated dimensions satisfy institutional academic criteria.
            </p>
          </div>
        )}
      </div>

      {/* 4. Dimension Details Modal */}
      {selectedDimension && (
        <DimensionDetailModal
          dimension={selectedDimension}
          onClose={() => setSelectedDimension(null)}
        />
      )}
    </div>
  )
}
