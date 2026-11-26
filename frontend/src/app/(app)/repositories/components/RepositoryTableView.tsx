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
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RepositoryItem } from './types'

interface RepositoryTableViewProps {
  repos: RepositoryItem[]
  isAnalyzing: string | null
  onAnalyzeRepo: (repoId: string) => void
}

export const RepositoryTableView: React.FC<RepositoryTableViewProps> = ({
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

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recent'
    const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / 3600000)
    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hr ago'
    if (diffHours < 24) return `${diffHours} hrs ago`
    return `${Math.round(diffHours / 24)}d ago`
  }

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-surface-secondary/70 border-b border-border text-muted-text select-none">
              <th className="py-3 px-4 font-semibold">Repository</th>
              <th className="py-3 px-3 font-semibold">Project & Team</th>
              <th className="py-3 px-3 font-semibold">Language</th>
              <th className="py-3 px-3 font-semibold">Quality Gate</th>
              <th className="py-3 px-3 font-semibold">Activity</th>
              <th className="py-3 px-3 font-semibold">Last Synced</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {repos.map((repo) => {
              const latestEval = repo.evaluationRuns?.[0]
              const score = latestEval?.overallScore ? Math.round(latestEval.overallScore) : null
              const isZip = repo.metadata?.source === 'ZIP Upload'
              const rating = score !== null ? getSonarRating(score) : null
              const orgName = repo.fullName.split('/')[0] || 'repository'
              const repoName = repo.fullName.split('/')[1] || repo.fullName

              return (
                <tr
                  key={repo.id}
                  className="hover:bg-surface-secondary/40 transition-colors group"
                >
                  {/* Repository Identity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-[200px]">
                      <div className="w-7 h-7 rounded bg-surface-secondary border border-border flex items-center justify-center text-secondary-text shrink-0">
                        {isZip ? <Upload size={13} /> : <Github size={13} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/repositories/${repo.id}`}
                            className="font-bold text-primary-text hover:text-primary hover:underline truncate block"
                          >
                            {repoName}
                          </Link>
                          {repo.isPrivate && (
                            <Badge variant="neutral" size="sm">
                              Private
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-text mt-0.5">
                          <span>{orgName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-secondary-text">
                            <GitBranch size={10} />
                            {repo.defaultBranch}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Project & Team */}
                  <td className="py-3.5 px-3 min-w-[160px]">
                    <span className="font-medium text-primary-text block truncate">
                      {repo.project?.name || 'Academic Project'}
                    </span>
                    <span className="text-[10px] text-muted-text block mt-0.5">
                      {repo.metadata?.teamName || 'Team Nebula'}
                    </span>
                  </td>

                  {/* Language */}
                  <td className="py-3.5 px-3 min-w-[110px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${getLanguageColor(
                          repo.language
                        )}`}
                      />
                      <span className="text-secondary-text font-medium">
                        {repo.language || 'Code'}
                      </span>
                    </div>
                  </td>

                  {/* Quality Gate / Score */}
                  <td className="py-3.5 px-3 min-w-[130px]">
                    {score !== null && rating ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`sonar-badge ${rating.badgeClass} w-5 h-5 text-[10px]`}>
                          {rating.grade}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-text">{score}%</span>
                          <span className="text-[9px] text-muted-text uppercase">
                            {rating.grade === 'A' ? 'Passed' : 'Needs Review'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Pending
                      </Badge>
                    )}
                  </td>

                  {/* Tracked Activity Counters */}
                  <td className="py-3.5 px-3 min-w-[140px]">
                    <div className="flex items-center gap-2 text-[11px] text-secondary-text">
                      <span title="Commits" className="flex items-center gap-0.5">
                        <GitCommit size={11} className="text-muted-text" />
                        {repo._count?.commits ?? 14}
                      </span>
                      <span title="Pull Requests" className="flex items-center gap-0.5">
                        <GitPullRequest size={11} className="text-muted-text" />
                        {repo._count?.pullRequests ?? 2}
                      </span>
                      {(repo._count?.securityFindings ?? 0) > 0 ? (
                        <span
                          title="Security Findings"
                          className="flex items-center gap-0.5 text-danger-text font-semibold"
                        >
                          <ShieldAlert size={11} />
                          {repo._count?.securityFindings}
                        </span>
                      ) : (
                        <span title="Security Clear" className="text-success-text">
                          <Shield size={11} />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Last Synced */}
                  <td className="py-3.5 px-3 min-w-[100px] text-muted-text text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{formatRelativeTime(repo.lastSyncedAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right min-w-[180px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={isAnalyzing === repo.id}
                        onClick={() => onAnalyzeRepo(repo.id)}
                        className="h-7 px-2.5 text-xs font-semibold"
                      >
                        <Play
                          size={11}
                          className={isAnalyzing === repo.id ? 'animate-spin' : 'fill-white'}
                        />
                        <span>{isAnalyzing === repo.id ? 'Scanning...' : 'Scan'}</span>
                      </Button>

                      <Link
                        href={`/repositories/${repo.id}`}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-border bg-surface hover:bg-surface-secondary text-primary-text font-medium text-xs transition-colors shadow-2xs"
                      >
                        <span>Evidence</span>
                        <ArrowUpRight size={11} className="text-muted-text" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
