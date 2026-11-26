'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { EvaluationPhase } from './types'

interface StudentHeaderProps {
  studentName: string
  studentEmail: string
  studentRole: string
  phase: EvaluationPhase
  onPhaseChange: (phase: EvaluationPhase) => void
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  studentName,
  studentEmail,
  studentRole,
  phase,
  onPhaseChange,
}) => {
  const phases: EvaluationPhase[] = ['PHASE_1', 'PHASE_2', 'PHASE_3']

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Student Profile Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-subtle select-none">
          {studentName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-primary-text">{studentName}</span>
            <span className="text-xs text-secondary-text">{studentEmail}</span>
            <Badge variant="primary" size="sm">
              {studentRole}
            </Badge>
          </div>
          <p className="text-xs text-muted-text mt-0.5">
            Automated 9-dimensional repository evaluator and individual contribution analyzer
          </p>
        </div>
      </div>

      {/* Phase Segmented Selector */}
      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
        <span className="text-xs font-medium text-secondary-text">Phase:</span>
        <div className="flex p-0.5 bg-surface-secondary rounded-md border border-border">
          {phases.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPhaseChange(p)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                phase === p
                  ? 'bg-surface text-primary-text shadow-2xs font-bold border border-border'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
