'use client'

import Link from 'next/link'
import {
  Code2,
  GitMerge,
  Users,
  TrendingUp,
  Activity,
  Shield,
  Github,
  Upload,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react'

const STATS = [
  {
    label: 'Active Projects',
    value: '24',
    delta: '+3 new this term',
    context: 'All cohorts synced',
    icon: Code2,
  },
  {
    label: 'Connected Repositories',
    value: '5',
    delta: '100% healthy',
    context: 'GitHub App & ZIP',
    icon: Github,
  },
  {
    label: 'Evaluations Completed',
    value: '187',
    delta: 'Phase 1 & 2',
    context: '9-dimensional rubrics',
    icon: GitMerge,
  },
  {
    label: 'Avg Quality Score',
    value: '81.4%',
    delta: '+6.2% vs last term',
    context: 'Grade A benchmark',
    icon: TrendingUp,
  },
]

const RECENT_EVALS = [
  {
    team: 'Team Nebula',
    repo: 'prism-team-nebula/smart-campus-iot',
    project: 'Smart Campus IoT',
    score: 84,
    grade: 'A',
    phase: 'Phase 2',
    status: 'PASSED',
    tests: '18/18',
    time: '10m ago',
    sha: '8f2a9d',
  },
  {
    team: 'Team Aurora',
    repo: 'prism-team-aurora/healthcare-portal-microservices',
    project: 'Healthcare Portal',
    score: 78,
    grade: 'B',
    phase: 'Phase 1',
    status: 'PASSED',
    tests: '24/24',
    time: '45m ago',
    sha: '3c19eb',
  },
  {
    team: 'Team Pulsar',
    repo: 'zip-uploads/distributed-kv-cache',
    project: 'Distributed KV Engine',
    score: 89,
    grade: 'A',
    phase: 'Phase 2',
    status: 'PASSED',
    tests: '42/42',
    time: '2h ago',
    sha: '710d44',
  },
  {
    team: 'Team Orion',
    repo: 'prism-team-orion/autonomous-robot-slam',
    project: 'Robot Navigation',
    score: 72,
    grade: 'B',
    phase: 'Phase 1',
    status: 'WARNING',
    tests: '12/15',
    time: '3h ago',
    sha: '99e41b',
  },
]

const SECURITY_FLAGS = [
  {
    severity: 'MEDIUM',
    rule: 'Hardcoded Secret Pattern',
    file: '.env.example:17',
    team: 'Team Nebula',
  },
  {
    severity: 'LOW',
    rule: 'Unpinned Dependency Wildcard',
    file: 'package.json:28',
    team: 'Team Aurora',
  },
  {
    severity: 'INFO',
    rule: 'Missing License Header',
    file: 'src/index.ts:1',
    team: 'Team Pulsar',
  },
]

export default function DashboardPage() {
  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Linear-Style Header Bar ──────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Evaluation Observatory
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              Active Term AY 2025-26
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Real-time quality gates, GitHub webhook ingests, and rubric scoring across engineering cohorts
          </p>
        </div>

        {/* Quick Actions (Linear / Vercel style) */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/student"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
          >
            <GraduationCap size={14} />
            <span>Student Portal (Submit Git)</span>
          </Link>
          <Link
            href="/repositories"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 transition-colors"
          >
            <Github size={13} className="text-slate-600" />
            <span>Repositories</span>
          </Link>
          <Link
            href="/evaluations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 transition-colors"
          >
            <Layers size={13} className="text-slate-600" />
            <span>Evaluations</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Metrics Row (Linear Precision Cards) ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, delta, context, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider">
                {label}
              </span>
              <Icon size={14} className="text-slate-400" />
            </div>

            <div>
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight block">
                {value}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono">
                <span className="text-emerald-700 font-semibold">{delta}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{context}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-Column Split: SonarCloud Table & Governance Column ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: SonarCloud Recent Evaluations Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity size={15} className="text-blue-600" />
                Recent Quality Gate Runs
              </h2>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Automated 9-dimensional evaluations executed via webhook
              </p>
            </div>
            <Link
              href="/evaluations"
              className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              All Evaluations <ArrowRight size={12} />
            </Link>
          </div>

          {/* Evaluations Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="pb-2 font-medium">Cohort / Repository</th>
                  <th className="pb-2 font-medium">Quality Gate</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Tests</th>
                  <th className="pb-2 font-medium text-right">Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_EVALS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-slate-900">{item.team}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                        {item.repo}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                          item.status === 'PASSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'PASSED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`sonar-badge ${item.grade === 'A' ? 'sonar-badge-a' : 'sonar-badge-b'} w-4 h-4 text-[10px]`}>
                          {item.grade}
                        </span>
                        <span className="font-bold text-slate-900">{item.score}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {item.tests}
                    </td>
                    <td className="py-3 text-right">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">
                        {item.sha}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Repository Health & Security Feed */}
        <div className="space-y-4">
          {/* GitHub Repository Health */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Github size={13} className="text-slate-800" />
                Repository Sync
              </h3>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                Webhook Active
              </span>
            </div>

            <p className="text-xs text-slate-600 font-mono">
              5 repositories connected under organization <strong className="text-slate-900">prism-team</strong> with automatic PR inspection.
            </p>

            <Link
              href="/repositories"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors font-mono"
            >
              <span>Manage Repositories</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Security & Static Analysis Flags */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Shield size={13} className="text-amber-600" />
                Security Hotspots
              </h3>
              <span className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                3 Pending Review
              </span>
            </div>

            <div className="space-y-2">
              {SECURITY_FLAGS.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-slate-50 border border-slate-200/70 text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                      {flag.rule}
                    </span>
                    <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-amber-100/70 text-amber-800">
                      {flag.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {flag.file} • {flag.team}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/security"
              className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-1"
            >
              Open Security Center <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
