'use client'

import React from 'react'
import { Users, GitCommit, GitPullRequest } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ContributionMetric } from './types'

interface ContributorAuditCardProps {
  contributor: ContributionMetric
}

export const ContributorAuditCard: React.FC<ContributorAuditCardProps> = ({ contributor }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-4">
      {/* Contributor Profile & Git Activity Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            {contributor.studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-primary-text font-sans">
                {contributor.studentName}
              </span>
              <span className="text-xs font-sans text-secondary-text">
                ({contributor.email})
              </span>
              <Badge variant="primary" size="sm">
                {contributor.role}
              </Badge>
            </div>
            <span className="text-xs font-sans text-secondary-text block mt-0.5">
              Verified Contribution Share: <strong>{contributor.contributionPercent}%</strong> •{' '}
              {contributor.confidence}% Confidence Rating
            </span>
          </div>
        </div>

        {/* Git Delta Badges */}
        <div className="flex items-center gap-2 text-xs font-sans flex-wrap">
          <div className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-secondary-text">
            <strong className="text-primary-text">{contributor.commitsCount}</strong> commits
          </div>
          <div className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-secondary-text">
            <strong className="text-primary-text">{contributor.mergedPrCount}</strong> PRs
          </div>
          <div className="px-2.5 py-1 rounded bg-success-subtle border border-success-border text-success-text font-semibold">
            +{contributor.linesAdded}
          </div>
          <div className="px-2.5 py-1 rounded bg-danger-subtle border border-danger-border text-danger-text font-semibold">
            -{contributor.linesDeleted}
          </div>
        </div>
      </div>

      {/* 5-Pillar Academic Contribution Breakdown */}
      <div className="space-y-2">
        <span className="text-xs font-sans font-semibold text-secondary-text uppercase tracking-wider block">
          5-Pillar Verified Academic Breakdown
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-sans">
          <div className="p-3 rounded bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] text-muted-text uppercase block">Implementation (30%)</span>
            <span className="text-lg font-bold text-primary-text block">
              {contributor.pillars.implementation}%
            </span>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(contributor.pillars.implementation / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] text-muted-text uppercase block">Testing (20%)</span>
            <span className="text-lg font-bold text-primary-text block">
              {contributor.pillars.testing}%
            </span>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${(contributor.pillars.testing / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] text-muted-text uppercase block">Tasks & PRs (20%)</span>
            <span className="text-lg font-bold text-primary-text block">
              {contributor.pillars.tasksPrs}%
            </span>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(contributor.pillars.tasksPrs / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] text-muted-text uppercase block">Reviews (15%)</span>
            <span className="text-lg font-bold text-primary-text block">
              {contributor.pillars.reviews}%
            </span>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${(contributor.pillars.reviews / 15) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] text-muted-text uppercase block">Docs & Arch (15%)</span>
            <span className="text-lg font-bold text-primary-text block">
              {contributor.pillars.docsDesign}%
            </span>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full"
                style={{ width: `${(contributor.pillars.docsDesign / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
