'use client'

import React from 'react'
import { CheckCircle2, ShieldCheck, GitCommit, FileCode } from 'lucide-react'
import { MetricDisplay } from '@/components/ui/MetricDisplay'

export const QualityGateMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricDisplay
        label="Reliability & Tests"
        value="78%"
        subtext="Cov"
        grade="A"
        context="18 unit tests passing"
        icon={<CheckCircle2 size={16} />}
      />
      <MetricDisplay
        label="Security & CVEs"
        value="0"
        subtext="Vulns"
        grade="A"
        context="0 secrets / 0 critical CVEs"
        icon={<ShieldCheck size={16} />}
      />
      <MetricDisplay
        label="Maintainability"
        value="0.4%"
        subtext="Debt"
        grade="A"
        context="Modular functions < 40 lines"
        icon={<FileCode size={16} />}
      />
      <MetricDisplay
        label="Git Hygiene"
        value="94%"
        subtext="Compl"
        grade="A"
        context="Conventional commit adherence"
        icon={<GitCommit size={16} />}
      />
    </div>
  )
}
