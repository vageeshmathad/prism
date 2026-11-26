'use client'

import React from 'react'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Terminal,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DimensionScore } from './types'

interface DimensionDetailModalProps {
  dimension: DimensionScore | null
  onClose: () => void
}

export const DimensionDetailModal: React.FC<DimensionDetailModalProps> = ({
  dimension,
  onClose,
}) => {
  if (!dimension) return null

  const isPassed = dimension.status === 'PASSED'
  const isWarning = dimension.status === 'WARNING'
  const isFailed = dimension.status === 'FAILED'
  const isUnavailable =
    dimension.status === 'UNAVAILABLE' || dimension.status === 'NOT_APPLICABLE'

  const statusVariant = isPassed
    ? 'success'
    : isWarning
    ? 'warning'
    : isUnavailable
    ? 'neutral'
    : 'error'

  const totalDeductions = (dimension.negativeEvidence || []).reduce(
    (acc, curr) => acc + curr.deduction,
    0
  )
  const baseScore = isUnavailable ? 0 : 100

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-xl shadow-lifted max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 p-5 sm:p-6 text-primary-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-primary-text font-sans">
                {dimension.dimension}
              </h2>
              <Badge variant={statusVariant} size="sm" dot>
                {dimension.status}
              </Badge>
            </div>
            <p className="text-xs text-secondary-text mt-1">
              Category: {dimension.ruleCategory} • Configured Weight: {dimension.weight}%
              {dimension.effectiveWeight !== undefined &&
                dimension.effectiveWeight !== dimension.weight && (
                  <span className="text-muted-text ml-1.5">
                    (Effective: {dimension.effectiveWeight}%)
                  </span>
                )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-surface-secondary transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Transparent Score Calculation */}
        {!isUnavailable ? (
          <div className="p-4 bg-surface-secondary/70 rounded-lg border border-border space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-secondary-text uppercase tracking-wider">
              <span>Transparent Scoring Calculation</span>
              <span className="text-primary-text">
                Confidence: {dimension.confidence || 90}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2.5 bg-surface border border-border rounded-md">
                <span className="text-[10px] text-muted-text uppercase block font-sans">
                  Base Score
                </span>
                <span className="text-lg font-bold text-primary-text">{baseScore}</span>
              </div>
              <div className="p-2.5 bg-surface border border-border rounded-md">
                <span className="text-[10px] text-muted-text uppercase block font-sans">
                  Deductions
                </span>
                <span
                  className={`text-lg font-bold ${
                    totalDeductions > 0 ? 'text-danger-text' : 'text-muted-text'
                  }`}
                >
                  {totalDeductions > 0 ? `-${totalDeductions}` : '0'}
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-border rounded-md">
                <span className="text-[10px] text-muted-text uppercase block font-sans">
                  Final Score
                </span>
                <span className="text-lg font-bold text-primary-text">
                  {dimension.score} / 100
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-surface-secondary/60 rounded-lg border border-border flex items-start gap-3 text-xs text-secondary-text">
            <HelpCircle size={18} className="text-muted-text shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primary-text block">
                Dimension Excluded from Scoring
              </span>
              <span>
                This dimension is marked as {dimension.status}. It is excluded from the
                overall score calculation without penalty; remaining evaluated dimensions
                are renormalized to 100%.
              </span>
            </div>
          </div>
        )}

        {/* Diagnosis / Summary Explanation */}
        {dimension.explanation && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Terminal size={13} className="text-primary" />
              Evaluation Explanation
            </span>
            <div className="p-3 bg-surface-secondary/40 border border-border rounded-lg text-xs leading-relaxed text-primary-text">
              {dimension.explanation}
            </div>
          </div>
        )}

        {/* Actionable Findings & Deductions */}
        {dimension.findings && dimension.findings.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-warning-text" />
              Findings & Deductions ({dimension.findings.length})
            </span>
            <div className="space-y-2">
              {dimension.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-3.5 bg-surface border border-border rounded-lg space-y-2 text-xs shadow-2xs"
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
                    </div>
                    {finding.scoreImpact !== undefined && (
                      <span className="font-mono font-bold text-danger-text">
                        {finding.scoreImpact} pts
                      </span>
                    )}
                  </div>

                  <p className="text-primary-text">{finding.description}</p>

                  {/* File & Line Evidence */}
                  {(finding.filePath || finding.lineNumber) && (
                    <div className="flex items-center gap-2 text-muted-text font-mono text-[11px] bg-surface-secondary/60 px-2 py-1 rounded border border-border-subtle">
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
                    <div className="pt-1.5 border-t border-border-subtle text-[11px] text-secondary-text">
                      <strong className="text-primary-text">Recommended Correction:</strong>{' '}
                      {finding.remediation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive Verified Evidence */}
        {dimension.positiveEvidence && dimension.positiveEvidence.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-success-text" />
              Positive Verified Evidence
            </span>
            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-surface-secondary border-b border-border text-muted-text">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Parameter</th>
                    <th className="py-2 px-3 font-semibold">Observed Value</th>
                    <th className="py-2 px-3 font-semibold">Verification Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-sans">
                  {dimension.positiveEvidence.map((ev, i) => (
                    <tr key={i} className="hover:bg-surface-secondary/30">
                      <td className="py-2 px-3 font-medium text-primary-text">{ev.parameter}</td>
                      <td className="py-2 px-3 text-secondary-text font-mono">{ev.value}</td>
                      <td className="py-2 px-3 text-muted-text">{ev.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fallback Metrics Table if positiveEvidence is not provided */}
        {(!dimension.positiveEvidence || dimension.positiveEvidence.length === 0) &&
          dimension.evidence &&
          dimension.evidence.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
                <Sliders size={13} className="text-primary" />
                Evidence Parameters
              </span>
              <div className="border border-border rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-surface-secondary border-b border-border text-muted-text">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Metric</th>
                      <th className="py-2 px-3 font-semibold text-right">Extracted Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-sans">
                    {dimension.evidence.map((ev, i) => (
                      <tr key={i} className="hover:bg-surface-secondary/30">
                        <td className="py-2 px-3 text-secondary-text font-medium">{ev.label}</td>
                        <td className="py-2 px-3 text-primary-text font-semibold text-right font-mono">
                          {ev.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-border-subtle flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
