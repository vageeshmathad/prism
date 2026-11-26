'use client'

import React from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DimensionScore } from './types'

interface NeedsAttentionCardProps {
  dimensions: DimensionScore[]
  onInspectDimension: (dim: DimensionScore) => void
}

export const NeedsAttentionCard: React.FC<NeedsAttentionCardProps> = ({
  dimensions,
  onInspectDimension,
}) => {
  const attentionItems = dimensions.filter(
    (dim) => dim.status === 'WARNING' || dim.status === 'FAILED'
  )

  if (attentionItems.length === 0) {
    return (
      <div className="bg-surface border border-success-border/50 rounded-lg p-4 shadow-subtle flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-success-subtle text-success-text flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-primary-text block">
              All 9 Evaluation Dimensions Compliant
            </span>
            <span className="text-xs font-sans text-secondary-text">
              No critical bugs, complexity violations, or security warnings detected.
            </span>
          </div>
        </div>
        <Badge variant="success" size="sm">
          Passed
        </Badge>
      </div>
    )
  }

  return (
    <div className="bg-warning-subtle/30 border border-warning-border rounded-lg p-4 sm:p-5 shadow-subtle space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning-text shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-warning-text">
            Needs Attention ({attentionItems.length} Issue{attentionItems.length > 1 ? 's' : ''} Identified)
          </h3>
        </div>
        <span className="text-xs font-sans text-muted-text">Quality Gate Advisory</span>
      </div>

      <div className="space-y-2.5">
        {attentionItems.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-warning-border/60 rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary-text">{item.dimension}</span>
                <Badge variant={item.status === 'WARNING' ? 'warning' : 'error'} size="sm">
                  {item.status} ({item.score}%)
                </Badge>
                <span className="text-xs font-sans text-muted-text">
                  Weight: {item.weight}% • {item.ruleCategory}
                </span>
              </div>
              <p className="text-xs text-secondary-text leading-relaxed font-mono">
                {item.finding}
              </p>
              {item.evidence && item.evidence.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.evidence.map((ev, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-secondary text-secondary-text px-2 py-0.5 rounded text-[10px] font-mono border border-border"
                    >
                      <span className="text-muted-text">{ev.label}:</span> {ev.value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onInspectDimension(item)}
              className="shrink-0 font-sans text-xs flex items-center gap-1.5"
            >
              <span>Inspect Details</span>
              <ArrowRight size={12} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
