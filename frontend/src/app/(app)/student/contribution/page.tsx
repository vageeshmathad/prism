'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { MetricDisplay } from '@/components/ui/MetricDisplay'
import { useStudentWorkspace } from '../StudentWorkspaceContext'

export default function StudentContributionPage() {
  const { contributor } = useStudentWorkspace()

  if (!contributor) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <Users size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            No Contribution Analysis Available
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Contribution analysis will appear after repository analysis.
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

  return (
    <div className="space-y-4 animate-in">
      <div>
        <h2 className="text-sm font-bold text-primary-text tracking-tight font-sans flex items-center gap-2">
          <Users size={15} className="text-primary" />
          Individual Contributor Attribution Audit
        </h2>
        <p className="text-xs text-secondary-text font-sans mt-0.5">
          Verified academic contribution calculated across git commit logs, code authored, and review participation
        </p>
      </div>

      {/* Contributor Profile Banner */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-subtle shrink-0">
            {contributor.studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-primary-text">
                {contributor.studentName}
              </span>
              <span className="text-xs text-muted-text">({contributor.email})</span>
              <Badge variant="primary" size="sm">
                {contributor.role}
              </Badge>
            </div>
            <span className="text-xs text-secondary-text block mt-1">
              Deterministic Git Attribution • GPG Authorship Signature Verified
            </span>
          </div>
        </div>

        {/* Confidence Rating Pill */}
        <div className="p-3 bg-surface-secondary rounded-md border border-border flex items-center gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-muted-text uppercase block">Contribution Share</span>
            <span className="text-xl font-bold text-primary-text block">{contributor.contributionPercent}%</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <span className="text-[10px] text-muted-text uppercase block">Confidence Rating</span>
            <span className="text-xl font-bold text-success-text block">{contributor.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Git Activity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
        <div className="p-3.5 bg-surface border border-border rounded-lg shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-muted-text text-xs">
            <span>Authored Commits</span>
            <GitCommit size={14} />
          </div>
          <span className="text-2xl font-bold text-primary-text block">{contributor.commitsCount}</span>
          <span className="text-[10px] text-muted-text block">On main & feature branches</span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-lg shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-muted-text text-xs">
            <span>Merged Pull Requests</span>
            <GitPullRequest size={14} />
          </div>
          <span className="text-2xl font-bold text-primary-text block">{contributor.mergedPrCount}</span>
          <span className="text-[10px] text-muted-text block">Peer reviewed & approved</span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-lg shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-muted-text text-xs">
            <span>Lines Added</span>
            <span className="text-success-text font-bold">+</span>
          </div>
          <span className="text-2xl font-bold text-success-text block">+{contributor.linesAdded}</span>
          <span className="text-[10px] text-muted-text block">AST syntax statements</span>
        </div>

        <div className="p-3.5 bg-surface border border-border rounded-lg shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-muted-text text-xs">
            <span>Lines Deleted</span>
            <span className="text-danger-text font-bold">-</span>
          </div>
          <span className="text-2xl font-bold text-danger-text block">-{contributor.linesDeleted}</span>
          <span className="text-[10px] text-muted-text block">Refactored code</span>
        </div>
      </div>

      {/* 5-Pillar Academic Contribution Breakdown */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-4 font-sans">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary-text">
            5-Pillar Verified Academic Breakdown
          </h3>
          <p className="text-xs text-muted-text mt-0.5">
            Normalized weighting model validating genuine individual software engineering effort
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded bg-surface-secondary border border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-text uppercase block">Implementation (30%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-primary-text">{contributor.pillars.implementation}%</span>
                <span className="text-[10px] text-muted-text">/ 30%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (contributor.pillars.implementation / 30) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary-text block">Core logic & services</span>
          </div>

          <div className="p-3.5 rounded bg-surface-secondary border border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-text uppercase block">Testing (20%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-primary-text">{contributor.pillars.testing}%</span>
                <span className="text-[10px] text-muted-text">/ 20%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${Math.min(100, (contributor.pillars.testing / 20) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary-text block">Unit & integration tests</span>
          </div>

          <div className="p-3.5 rounded bg-surface-secondary border border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-text uppercase block">Tasks & PRs (20%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-primary-text">{contributor.pillars.tasksPrs}%</span>
                <span className="text-[10px] text-muted-text">/ 20%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(100, (contributor.pillars.tasksPrs / 20) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary-text block">Branching & deliverables</span>
          </div>

          <div className="p-3.5 rounded bg-surface-secondary border border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-text uppercase block">Reviews (15%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-primary-text">{contributor.pillars.reviews}%</span>
                <span className="text-[10px] text-muted-text">/ 15%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${Math.min(100, (contributor.pillars.reviews / 15) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary-text block">Peer PR feedback</span>
          </div>

          <div className="p-3.5 rounded bg-surface-secondary border border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-text uppercase block">Docs & Arch (15%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-primary-text">{contributor.pillars.docsDesign}%</span>
                <span className="text-[10px] text-muted-text">/ 15%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full"
                style={{ width: `${Math.min(100, (contributor.pillars.docsDesign / 15) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary-text block">Specs & dataflow</span>
          </div>
        </div>
      </div>
    </div>
  )
}
