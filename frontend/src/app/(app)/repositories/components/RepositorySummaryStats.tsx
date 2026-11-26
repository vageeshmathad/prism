'use client'

import React from 'react'
import { FolderGit2, CheckCircle2, ShieldAlert, GitCommit } from 'lucide-react'
import { MetricDisplay } from '@/components/ui/MetricDisplay'
import { RepositoryItem } from './types'

interface RepositorySummaryStatsProps {
  repos: RepositoryItem[]
}

export const RepositorySummaryStats: React.FC<RepositorySummaryStatsProps> = ({ repos }) => {
  const totalRepos = repos.length
  const evaluatedRepos = repos.filter(
    (r) => r.evaluationRuns && r.evaluationRuns.length > 0 && r.evaluationRuns[0].overallScore
  )
  const passedRepos = evaluatedRepos.filter((r) => (r.evaluationRuns?.[0].overallScore ?? 0) >= 80)
  
  const totalFindings = repos.reduce((acc, r) => acc + (r._count?.securityFindings ?? 0), 0)
  const totalCommits = repos.reduce((acc, r) => acc + (r._count?.commits ?? 0), 0)
  const totalPRs = repos.reduce((acc, r) => acc + (r._count?.pullRequests ?? 0), 0)

  const passRatePercent = evaluatedRepos.length > 0
    ? Math.round((passedRepos.length / evaluatedRepos.length) * 100)
    : 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricDisplay
        label="Total Repositories"
        value={totalRepos}
        subtext="repos"
        grade="A"
        context={`${evaluatedRepos.length} evaluated • ${totalRepos - evaluatedRepos.length} pending`}
        icon={<FolderGit2 size={16} />}
      />

      <MetricDisplay
        label="Quality Gate Pass Rate"
        value={`${passRatePercent}%`}
        subtext="pass"
        grade={passRatePercent >= 80 ? 'A' : passRatePercent >= 65 ? 'B' : 'C'}
        context={`${passedRepos.length} of ${evaluatedRepos.length} compliant`}
        icon={<CheckCircle2 size={16} />}
      />

      <MetricDisplay
        label="Security & Integrity"
        value={totalFindings}
        subtext="flags"
        grade={totalFindings === 0 ? 'A' : totalFindings < 3 ? 'B' : 'C'}
        context={totalFindings === 0 ? '0 CVEs detected' : `${totalFindings} flags require review`}
        icon={<ShieldAlert size={16} />}
      />

      <MetricDisplay
        label="Tracked Activity"
        value={totalCommits}
        subtext="commits"
        grade="A"
        context={`${totalPRs} merged PRs across teams`}
        icon={<GitCommit size={16} />}
      />
    </div>
  )
}
