'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useStudentWorkspace } from '../StudentWorkspaceContext'

export default function StudentVivaPage() {
  const { vivaQuestions, masteredMap, toggleMastered, hasEvaluated } = useStudentWorkspace()

  if (!hasEvaluated || !vivaQuestions || vivaQuestions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <BookOpen size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            No Viva Preparation Available
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Viva preparation will be generated after your project evaluation.
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

  const [activeIdx, setActiveIdx] = useState(0)
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({})
  const [viewMode, setViewMode] = useState<'flashcard' | 'bank'>('flashcard')

  const activeQuestion = vivaQuestions[activeIdx] || vivaQuestions[0]
  const masteredCount = Object.values(masteredMap).filter(Boolean).length
  const progressPercent = Math.round((masteredCount / vivaQuestions.length) * 100)

  const toggleReveal = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="space-y-4 animate-in max-w-4xl">
      {/* Header & Study Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-primary-text font-sans">
              Viva Voce Oral Defense Preparation
            </h2>
            <Badge variant="primary" size="sm">
              AI-Synthesized
            </Badge>
          </div>
          <p className="text-xs text-secondary-text font-sans mt-0.5">
            Technical examiner questions derived from your commit diffs, AST structures, and architectural trade-offs
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-0.5 bg-surface-secondary rounded-md border border-border text-xs font-sans">
          <button
            type="button"
            onClick={() => setViewMode('flashcard')}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === 'flashcard'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Flashcards Mode
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bank')}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === 'bank'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Question Bank ({vivaQuestions.length})
          </button>
        </div>
      </div>

      {/* Study Progress Bar */}
      <div className="bg-surface border border-border rounded-lg p-3.5 shadow-subtle flex items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-primary" />
          <span className="font-semibold text-primary-text">Defense Readiness:</span>
          <span className="text-secondary-text">
            {masteredCount} of {vivaQuestions.length} Questions Mastered
          </span>
        </div>

        <div className="flex items-center gap-2 w-48">
          <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-primary-text">{progressPercent}%</span>
        </div>
      </div>

      {viewMode === 'flashcard' ? (
        /* ── FLASHCARD MODE (ONE QUESTION AT A TIME) ─────────────────────── */
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle space-y-5 font-sans">
          {/* Card Top Strip */}
          <div className="flex items-center justify-between text-xs text-secondary-text border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary-text">
                Question {activeIdx + 1} of {vivaQuestions.length}
              </span>
              <span className="text-border">•</span>
              <span className="text-primary font-semibold">{activeQuestion.dimension}</span>
              {masteredMap[activeIdx] && (
                <Badge variant="success" size="sm" dot>
                  Mastered
                </Badge>
              )}
            </div>

            {/* Prev / Next Pagination */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded border border-border hover:bg-surface-secondary disabled:opacity-30 transition-colors"
                title="Previous Question"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={activeIdx === vivaQuestions.length - 1}
                onClick={() => setActiveIdx((prev) => Math.min(vivaQuestions.length - 1, prev + 1))}
                className="p-1 rounded border border-border hover:bg-surface-secondary disabled:opacity-30 transition-colors"
                title="Next Question"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Question Surface */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-muted-text tracking-wider block">
              Focus Area: {activeQuestion.focusArea}
            </span>

            <h3 className="text-lg font-semibold text-primary-text leading-relaxed font-sans">
              "{activeQuestion.question}"
            </h3>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2.5 pt-2 flex-wrap border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleReveal(activeIdx)}
              className="text-xs font-sans flex items-center gap-1.5"
            >
              {revealedAnswers[activeIdx] ? (
                <>
                  <EyeOff size={13} className="text-muted-text" />
                  <span>Hide Model Defense</span>
                </>
              ) : (
                <>
                  <Eye size={13} className="text-primary" />
                  <span>Reveal Model Defense & Talking Points</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => toggleMastered(activeIdx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-sans font-semibold transition-colors ${
                masteredMap[activeIdx]
                  ? 'bg-success-subtle text-success-text border-success-border'
                  : 'bg-surface text-secondary-text border-border hover:bg-surface-secondary hover:text-primary-text'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>{masteredMap[activeIdx] ? 'Mastered for Defense' : 'Mark as Mastered'}</span>
            </button>
          </div>

          {/* Revealed Defense & Talking Points */}
          {revealedAnswers[activeIdx] && (
            <div className="p-4 bg-surface-secondary/50 border border-border rounded-lg space-y-3.5 animate-in text-xs font-sans">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                  Model Defense Strategy
                </span>
                <p className="text-primary-text leading-relaxed font-medium">
                  {activeQuestion.modelDefense}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-text block mb-1">
                  Key Talking Points for Viva Voce
                </span>
                <ul className="space-y-1 text-secondary-text list-disc list-inside">
                  {activeQuestion.talkingPoints?.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {activeQuestion.evidenceSources && activeQuestion.evidenceSources.length > 0 && (
                <div className="pt-2 border-t border-border-subtle flex items-center gap-2 flex-wrap text-[11px] text-muted-text">
                  <span className="font-bold uppercase text-[10px]">Codebase Citations:</span>
                  {activeQuestion.evidenceSources.map((src, i) => (
                    <span
                      key={i}
                      className="bg-surface text-primary-text px-2 py-0.5 rounded border border-border text-[10px]"
                    >
                      [{i + 1}] {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── QUESTION BANK MODE (ALL QUESTIONS LIST) ─────────────────────── */
        <div className="space-y-3 font-sans">
          {vivaQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 bg-surface border border-border rounded-lg shadow-subtle space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary uppercase">
                  Q{idx + 1} • {q.dimension}
                </span>
                <span className="text-muted-text text-[11px]">{q.focusArea}</span>
              </div>
              <p className="text-xs font-semibold text-primary-text leading-relaxed font-sans">
                "{q.question}"
              </p>
              <div className="text-xs text-secondary-text bg-surface-secondary/40 p-3 rounded border border-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-text block">
                  Model Defense Summary:
                </span>
                <p>{q.modelDefense}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
