'use client'

import React from 'react'
import Link from 'next/link'
import {
  Github,
  Upload,
  GitBranch,
  Play,
  ArrowUpRight,
  Shield,
  ShieldAlert,
  GitCommit,
  GitPullRequest,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RepositoryItem } from './types'

interface RepositoryCardViewProps {
  repos: RepositoryItem[]
  isAnalyzing: string | null
  onAnalyzeRepo: (repoId: string) => void
}

export const RepositoryCardView: React.FC<RepositoryCardViewProps> = ({
  repos,
  isAnalyzing,
  onAnalyzeRepo,
}) => {
  const getLanguageColor = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case 'typescript':
        return 'bg-blue-600'
      case 'python':
        return 'bg-amber-500'
      case 'java':
        return 'bg-rose-500'
      case 'javascript':
        return 'bg-yellow-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getSonarRating = (score: number) => {
    if (score >= 80) return { grade: 'A', badgeClass: 'sonar-badge-a', variant: 'success' as const }
    if (score >= 65) return { grade: 'B', badgeClass: 'sonar-badge-b', variant: 'warning' as const }
    return { grade: 'C', badgeClass: 'sonar-badge-c', variant: 'error' as const }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => {
        const latestEval = repo.evaluationRuns?.[0]
        const score = latestEval?.overallScore ? Math.round(latestEval.overallScore) : null
        const isZip = repo.metadata?.source === 'ZIP Upload'
        const rating = score !== null ? getSonarRating(score) : null
        const orgName = repo.fullName.split('/')[0] || 'repository'
        const repoName = repo.fullName.split('/')[1] || repo.fullName

        return (
          <div
            key={repo.id}
            className="bg-surface border border-border hover:border-slate-300 rounded-lg p-4 flex flex-col justify-between space-y-3.5 shadow-subtle transition-colors"
          >
            {/* Header */}
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded bg-surface-secondary border border-border flex items-center justify-center text-secondary-text shrink-0">
                    {isZip ? <Upload size={14} /> : <Github size={14} />}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/repositories/${repo.id}`}
                      className="text-xs font-bold text-primary-text font-mono hover:text-primary hover:underline truncate block"
                      title={repo.fullName}
                    >
                      {repoName}
                    </Link>
                    <span className="text-[10px] text-muted-text font-mono block truncate">
                      {orgName}
                    </span>
                  </div>
                </div>

                {score !== null && rating ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`sonar-badge ${rating.badgeClass} w-5 h-5 text-[10px]`}>
                      {rating.grade}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary-text">
                      {score}%
                    </span>
                  </div>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Pending
                  </Badge>
                )}
              </div>

              {/* Project & Team */}
              <div className="p-2.5 rounded bg-surface-secondary/70 border border-border text-xs font-mono">
                <span className="text-[9px] uppercase text-muted-text font-semibold block">
                  Associated Project
                </span>
                <span className="font-medium text-primary-text truncate block mt-0.5">
                  {repo.project?.name || 'Academic Project'}
                </span>
              </div>

              {/* Language, Branch & Team Stats */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-secondary-text">
                <span className="flex items-center gap-1.5 font-medium text-primary-text">
                  <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                  {repo.language || 'Code'}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1 text-muted-text">
                  <GitBranch size={11} />
                  {repo.defaultBranch}
                </span>
                <span className="text-border">•</span>
                <span className="text-muted-text">{repo.metadata?.teamName || 'Team Nebula'}</span>
              </div>
            </div>

            {/* Footer & Actions */}
            <div className="pt-3 border-t border-border-subtle space-y-2.5 font-mono">
              <div className="flex items-center justify-between text-xs text-secondary-text">
                <span className="flex items-center gap-1">
                  <GitCommit size={11} className="text-muted-text" />
                  {repo._count?.commits ?? 14} commits
                </span>
                <span className="flex items-center gap-1">
                  <GitPullRequest size={11} className="text-muted-text" />
                  {repo._count?.pullRequests ?? 2} PRs
                </span>
                {(repo._count?.securityFindings ?? 0) > 0 ? (
                  <span className="flex items-center gap-1 text-danger-text font-semibold">
                    <ShieldAlert size={11} />
                    {repo._count?.securityFindings} flags
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-success-text">
                    <Shield size={11} />
                    Clean
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isAnalyzing === repo.id}
                  onClick={() => onAnalyzeRepo(repo.id)}
                  className="font-semibold text-xs"
                >
                  <Play
                    size={11}
                    className={isAnalyzing === repo.id ? 'animate-spin' : 'fill-white'}
                  />
                  <span>{isAnalyzing === repo.id ? 'Running...' : 'Run Scan'}</span>
                </Button>

                <Link
                  href={`/repositories/${repo.id}`}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-md bg-surface hover:bg-surface-secondary text-primary-text font-medium text-xs border border-border transition-colors shadow-2xs"
                >
                  <span>Evidence</span>
                  <ArrowUpRight size={12} className="text-muted-text" />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
