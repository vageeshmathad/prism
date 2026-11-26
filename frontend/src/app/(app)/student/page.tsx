'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Github,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useAcademicRole } from '@/context/RoleContext'
import { useStudentWorkspace } from './StudentWorkspaceContext'

function StudentOverviewContent() {
  const { profile } = useAcademicRole()
  const {
    repoDetails,
    overallScore,
    hasEvaluated,
    dimensions,
    isProcessing,
    analyzeRepositoryUrl,
  } = useStudentWorkspace()

  // Local state for GitHub URL input on initial onboarding
  const [inputUrl, setInputUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  // Onboarding submission handler
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError('')

    const trimmed = inputUrl.trim()
    if (!trimmed) {
      setUrlError('Please enter a GitHub repository URL')
      return
    }

    const cleanUrl = trimmed.replace(/\.git$/i, '')
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/i
    const shortPattern = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/

    if (!cleanUrl.match(urlPattern) && !cleanUrl.match(shortPattern)) {
      setUrlError('Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)')
      return
    }

    const success = await analyzeRepositoryUrl(trimmed)
    if (!success) {
      // Error is notified via toast in context
    }
  }

  // ── INITIAL ONBOARDING STATE: No Repository Analyzed ────────────────
  if (!hasEvaluated || !repoDetails) {
    return (
      <div className="max-w-2xl mx-auto py-8 sm:py-16 px-4 animate-in">
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-10 shadow-subtle space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-2xs">
              <Github size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight pt-1">
              Welcome to PRISM
            </h1>
            <p className="text-sm text-secondary-text max-w-md mx-auto">
              Connect your GitHub repository to begin your automated project evaluation.
            </p>
          </div>

          {/* GitHub Submission Form */}
          <form onSubmit={handleOnboardingSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="github-url-input" className="sr-only">
                GitHub Repository URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-text">
                  <Github size={16} />
                </div>
                <input
                  id="github-url-input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value)
                    if (urlError) setUrlError('')
                  }}
                  placeholder="https://github.com/username/repository"
                  disabled={isProcessing}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-primary-text placeholder:text-muted-text bg-surface transition-all outline-none ${
                    urlError
                      ? 'border-danger focus:ring-2 focus:ring-danger/20'
                      : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
              </div>

              {urlError && (
                <p className="text-xs text-danger flex items-center gap-1.5 pt-0.5">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span>{urlError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white text-sm font-semibold shadow-2xs transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing Repository...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Analyze Repository</span>
                </>
              )}
            </button>
          </form>

          {/* Helper Microcopy */}
          <div className="pt-2 border-t border-border-subtle text-center">
            <p className="text-xs text-muted-text">
              PRISM will analyze your repository and generate your evaluation results.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── EVALUATED STATE: Real Repository Analyzed ──────────────────────
  const attentionItems = dimensions.filter(
    (dim) => dim.status === 'WARNING' || dim.status === 'FAILED'
  )

  const repoShortName = repoDetails.fullName.split('/')[1] || repoDetails.fullName
  const ACRONYMS: Record<string, string> = {
    iot: 'IoT',
    api: 'API',
    ast: 'AST',
    ai: 'AI',
    prism: 'PRISM',
    ui: 'UI',
    db: 'DB',
  }
  const projectTitle = repoShortName
    .split('-')
    .map((word) => ACRONYMS[word.toLowerCase()] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const isPassed = overallScore >= 80

  return (
    <div className="space-y-5 animate-in">
      {/* ── Welcome Header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
          Project Evaluation Overview
        </h1>
        <p className="text-sm text-secondary-text">
          Here&apos;s an overview of your project and what needs your attention.
        </p>
      </div>

      {/* ── Active Project ─────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-semibold text-primary-text">
                {projectTitle}
              </h2>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-secondary text-secondary-text font-mono border border-border">
                {repoDetails.branch}
              </span>
            </div>
            <p className="text-xs text-secondary-text flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-primary-text">{repoShortName}</span>
              <span className="text-border">•</span>
              <span>{repoDetails.language}</span>
              <span className="text-border">•</span>
              <span>{repoDetails.branch} branch</span>
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3 text-xs text-secondary-text shrink-0 pt-1 sm:pt-0 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              <span className="font-medium text-primary-text">Repository Connected</span>
            </div>
            <span className="text-border hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              <span className="font-medium text-primary-text">Evaluation Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overall Evaluation Summary ─────────────────────────────── */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <span className="text-[11px] font-semibold text-muted-text uppercase tracking-wider block">
              Overall Evaluation Result
            </span>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">
                {overallScore}
              </span>
              <span className="text-sm text-muted-text">/ 100</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isPassed ? 'Grade A' : 'Grade B'}
              </span>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-success" />
                {isPassed ? 'Quality Gate Passed' : 'Needs Refinement'}
              </span>
            </div>
            <p className="text-xs text-secondary-text pt-0.5 leading-relaxed">
              Passed {dimensions.filter((d) => d.status === 'PASSED').length} of {dimensions.length} rubric evaluation dimensions. Compliant with academic engineering standards.
            </p>
          </div>

          <Link
            href="/student/evaluation"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary-subtle border border-primary/20 hover:border-primary/40 transition-colors shrink-0 self-stretch sm:self-auto text-center no-underline"
          >
            <span>View Full Evaluation</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Needs Attention (Only shown if issues exist) ────────────── */}
      {attentionItems.length > 0 ? (
        <div className="bg-surface border border-border rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-warning" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-warning-text">
                Needs Attention
              </h3>
            </div>
            <Link
              href="/student/evaluation"
              className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 no-underline"
            >
              <span>View in Evaluation</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-md bg-surface-secondary/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-primary-text">
                      {item.dimension.replace(/^\d+\.\s*/, '')}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                      {item.score}% Score
                    </span>
                  </div>
                  <p className="text-secondary-text leading-relaxed">
                    {item.finding}
                  </p>
                </div>
                <Link
                  href="/student/evaluation"
                  className="px-3 py-1.5 rounded bg-white hover:bg-surface-secondary border border-border text-primary-text font-medium text-xs shrink-0 self-start sm:self-auto transition-colors no-underline shadow-2xs"
                >
                  View Evaluation
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-success shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-primary-text block">
                All Evaluation Dimensions Compliant
              </span>
              <span className="text-xs text-muted-text block">
                No quality gate warnings or code hygiene issues detected.
              </span>
            </div>
          </div>
          <Link
            href="/student/evaluation"
            className="text-xs text-primary font-medium hover:underline shrink-0 no-underline"
          >
            Review Rubric →
          </Link>
        </div>
      )}

      {/* ── Project Activity (Only Real Events) ────────────────────── */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
          Project Activity
        </h3>
        <div className="divide-y divide-border-subtle text-xs">
          <div className="py-2.5 flex items-center justify-between gap-3 first:pt-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-primary-text font-medium truncate">
                Evaluation Completed
              </span>
              <span className="text-muted-text truncate hidden sm:inline">
                — Grade A ({overallScore} / 100) awarded
              </span>
            </div>
            <span className="text-muted-text shrink-0 text-[11px]">
              {repoDetails.lastEvaluatedAt}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-3 last:pb-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-primary-text font-medium truncate">
                Repository Connected
              </span>
              <span className="text-muted-text truncate hidden sm:inline">
                — {repoDetails.fullName} ({repoDetails.branch})
              </span>
            </div>
            <span className="text-muted-text shrink-0 text-[11px]">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentOverviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-text">Loading overview...</div>}>
      <StudentOverviewContent />
    </Suspense>
  )
}
