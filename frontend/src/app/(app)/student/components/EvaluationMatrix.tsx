'use client'

import React from 'react'
import { Sliders, Eye, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { DimensionScore } from './types'

interface EvaluationMatrixProps {
  dimensions: DimensionScore[]
  dimensionFilter: 'all' | 'passed' | 'warning'
  setDimensionFilter: (filter: 'all' | 'passed' | 'warning') => void
  onSelectDimension: (dim: DimensionScore) => void
}

export const EvaluationMatrix: React.FC<EvaluationMatrixProps> = ({
  dimensions,
  dimensionFilter,
  setDimensionFilter,
  onSelectDimension,
}) => {
  const getSonarRating = (score: number) => {
    if (score >= 80) return { grade: 'A', className: 'sonar-badge-a' }
    if (score >= 65) return { grade: 'B', className: 'sonar-badge-b' }
    return { grade: 'C', className: 'sonar-badge-c' }
  }

  const passedCount = dimensions.filter((d) => d.status === 'PASSED').length
  const attentionCount = dimensions.filter((d) => d.status === 'WARNING' || d.status === 'FAILED').length

  const filteredDimensions = dimensions.filter((dim) => {
    if (dimensionFilter === 'passed') return dim.status === 'PASSED'
    if (dimensionFilter === 'warning') return dim.status === 'WARNING' || dim.status === 'FAILED'
    return true
  })

  return (
    <div className="space-y-3.5">
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-primary-text tracking-tight flex items-center gap-2 font-sans">
            <Sliders size={15} className="text-primary" />
            PRISM 9-Dimensional Evaluation Matrix
          </h2>
          <p className="text-xs text-muted-text font-sans mt-0.5">
            Deterministic code inspection across accredited academic rubrics
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-0.5 bg-surface-secondary rounded-md border border-border text-xs font-sans">
          <button
            type="button"
            onClick={() => setDimensionFilter('all')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              dimensionFilter === 'all'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            All ({dimensions.length})
          </button>
          <button
            type="button"
            onClick={() => setDimensionFilter('passed')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              dimensionFilter === 'passed'
                ? 'bg-surface text-success-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Passed ({passedCount})
          </button>
          <button
            type="button"
            onClick={() => setDimensionFilter('warning')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              dimensionFilter === 'warning'
                ? 'bg-surface text-warning-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Needs Attention ({attentionCount})
          </button>
        </div>
      </div>

      {/* 9 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDimensions.map((dim) => {
          const rating = getSonarRating(dim.score)
          const isPassed = dim.status === 'PASSED'
          const isWarning = dim.status === 'WARNING'

          return (
            <div
              key={dim.id}
              className="bg-surface border border-border rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-subtle hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex items-start gap-2">
                  <span className={`sonar-badge ${rating.className} w-5 h-5 shrink-0 mt-0.5`}>
                    {rating.grade}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-primary-text block leading-tight">
                      {dim.dimension}
                    </span>
                    <span className="text-[10px] font-mono text-muted-text block mt-0.5">
                      Weight: {dim.weight}% • {dim.ruleCategory}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={isPassed ? 'success' : isWarning ? 'warning' : 'error'}
                  size="sm"
                >
                  {dim.status}
                </Badge>
              </div>

              {/* Progress & Score */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-xs font-sans">
                  <span className="text-[10px] text-muted-text">Compliance</span>
                  <span className="font-bold text-primary-text">{dim.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      dim.score >= 80 ? 'bg-success' : dim.score >= 65 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>

              {/* Finding Preview */}
              <div className="pt-2 border-t border-border-subtle text-[11px] font-mono space-y-2">
                <p className="text-secondary-text leading-snug line-clamp-2">{dim.finding}</p>

                {dim.evidence && dim.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dim.evidence.slice(0, 2).map((ev, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-secondary text-secondary-text px-1.5 py-0.5 rounded text-[10px] border border-border"
                      >
                        <span className="text-muted-text">{ev.label}:</span> {ev.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: View Details */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectDimension(dim)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-surface-secondary/70 hover:bg-surface-secondary text-xs font-sans text-secondary-text hover:text-primary-text border border-border transition-colors shadow-2xs"
                >
                  <Eye size={12} />
                  <span>Inspect Technical Evidence</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
