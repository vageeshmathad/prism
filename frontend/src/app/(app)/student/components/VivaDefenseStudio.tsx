'use client'

import React from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { VivaQuestion } from './types'

interface VivaDefenseStudioProps {
  vivaQuestions: VivaQuestion[]
  activeQuestionIdx: number
  setActiveQuestionIdx: (idx: number | ((prev: number) => number)) => void
  revealedAnswers: Record<number, boolean>
  toggleAnswerReveal: (idx: number) => void
  masteredMap: Record<number, boolean>
  toggleMastered: (idx: number) => void
  studyViewMode: 'flashcard' | 'list'
  setStudyViewMode: (mode: 'flashcard' | 'list') => void
}

export const VivaDefenseStudio: React.FC<VivaDefenseStudioProps> = ({
  vivaQuestions,
  activeQuestionIdx,
  setActiveQuestionIdx,
  revealedAnswers,
  toggleAnswerReveal,
  masteredMap,
  toggleMastered,
  studyViewMode,
  setStudyViewMode,
}) => {
  const activeViva = vivaQuestions[activeQuestionIdx] || vivaQuestions[0]

  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-4">
      {/* Studio Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <BookOpen size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-primary-text font-sans">
              Viva Voce Defense Studio
            </h2>
            <Badge variant="primary" size="sm">
              Quizlet & NotebookLM Mode
            </Badge>
          </div>
          <p className="text-xs text-muted-text font-sans mt-0.5">
            AI-synthesized examiner questions derived from your commit diffs, AST structures, and architectural trade-offs
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-0.5 bg-surface-secondary rounded-md border border-border text-xs font-sans">
          <button
            type="button"
            onClick={() => setStudyViewMode('flashcard')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              studyViewMode === 'flashcard'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Flashcard Mode
          </button>
          <button
            type="button"
            onClick={() => setStudyViewMode('list')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              studyViewMode === 'list'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Summary Sheet ({vivaQuestions.length})
          </button>
        </div>
      </div>

      {studyViewMode === 'flashcard' ? (
        /* Quizlet Interactive Study Card */
        <div className="space-y-4">
          {/* Flashcard Header Controls */}
          <div className="flex items-center justify-between text-xs font-sans text-secondary-text">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-primary-text">
                Card {activeQuestionIdx + 1} of {vivaQuestions.length}
              </span>
              <span className="text-border">•</span>
              <span className="text-primary font-semibold">{activeViva.dimension}</span>
              {masteredMap[activeQuestionIdx] && (
                <Badge variant="success" size="sm" dot>
                  Defense Ready
                </Badge>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded border border-border hover:bg-surface-secondary disabled:opacity-30 transition-colors"
                title="Previous Card"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={activeQuestionIdx === vivaQuestions.length - 1}
                onClick={() => setActiveQuestionIdx((prev) => Math.min(vivaQuestions.length - 1, prev + 1))}
                className="p-1 rounded border border-border hover:bg-surface-secondary disabled:opacity-30 transition-colors"
                title="Next Card"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Flashcard Body */}
          <div className="bg-surface-secondary/50 border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-text font-semibold">
                Focus Area: {activeViva.focusArea}
              </span>
              <span className="text-[10px] font-mono text-secondary-text bg-surface px-2 py-0.5 rounded border border-border">
                Examiner Anticipation
              </span>
            </div>

            {/* Question Prompt */}
            <h3 className="text-base font-semibold text-primary-text leading-relaxed font-sans">
              "{activeViva.question}"
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAnswerReveal(activeQuestionIdx)}
                className="font-sans text-xs flex items-center gap-1.5"
              >
                {revealedAnswers[activeQuestionIdx] ? (
                  <>
                    <EyeOff size={13} className="text-muted-text" />
                    <span>Hide Model Defense & Talking Points</span>
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
                onClick={() => toggleMastered(activeQuestionIdx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-sans font-semibold transition-colors ${
                  masteredMap[activeQuestionIdx]
                    ? 'bg-success-subtle text-success-text border-success-border'
                    : 'bg-surface text-secondary-text border-border hover:bg-surface-secondary hover:text-primary-text'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>
                  {masteredMap[activeQuestionIdx] ? 'Marked Defense Ready' : 'Mark as Ready'}
                </span>
              </button>
            </div>

            {/* Revealed Answer & Citations */}
            {revealedAnswers[activeQuestionIdx] && (
              <div className="mt-3 p-4 bg-surface border border-border rounded-md space-y-3 animate-in">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block mb-1">
                    Model Defense Strategy
                  </span>
                  <p className="text-xs text-primary-text leading-relaxed font-medium">
                    {activeViva.modelDefense}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-secondary-text block mb-1">
                    Key Talking Points for Viva Voce
                  </span>
                  <ul className="space-y-1.5 text-xs text-secondary-text list-disc list-inside">
                    {activeViva.talkingPoints?.map((pt, i) => (
                      <li key={i} className="leading-relaxed">
                        {pt}
                      </li>
                    )) || <li>Demonstrate clear understanding of trade-offs and code modularity.</li>}
                  </ul>
                </div>

                {/* Perplexity Grounding Citations */}
                {activeViva.evidenceSources && activeViva.evidenceSources.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle flex items-center gap-2 flex-wrap text-xs font-sans text-secondary-text">
                    <span className="text-[10px] uppercase font-bold text-muted-text">
                      Grounding Evidence Citations:
                    </span>
                    {activeViva.evidenceSources.map((src, i) => (
                      <span
                        key={i}
                        className="bg-surface-secondary text-primary-text px-2 py-0.5 rounded border border-border text-[10px]"
                      >
                        [{i + 1}] {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Summary Sheet (List Mode) */
        <div className="space-y-3">
          {vivaQuestions.map((vq, idx) => (
            <div
              key={vq.id}
              className="p-4 bg-surface-secondary/40 border border-border rounded-md space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-primary uppercase">
                  Q{idx + 1} • {vq.dimension}
                </span>
                <span className="text-muted-text">{vq.focusArea}</span>
              </div>
              <p className="text-xs font-semibold text-primary-text leading-relaxed">
                "{vq.question}"
              </p>
              <div className="text-xs text-secondary-text bg-surface p-3 rounded border border-border space-y-1 font-sans">
                <span className="text-[10px] font-bold text-muted-text uppercase block">
                  Model Defense Summary:
                </span>
                <p>{vq.modelDefense || vq.talkingPoints[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
