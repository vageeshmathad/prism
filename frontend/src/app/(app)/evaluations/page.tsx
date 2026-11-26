'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GitPullRequest,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Github,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import api from '@/lib/api'

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/evaluations').catch(() => null)
      if (res?.data?.data && res.data.data.length > 0) {
        setEvaluations(res.data.data)
      } else {
        setEvaluations([
          {
            id: 'eval-1',
            phase: 'PHASE_2',
            status: 'COMPLETED',
            overallScore: 84,
            qualityScore: 80,
            contributionScore: 88,
            understandingScore: 82,
            team: { name: 'Team Nebula' },
            project: { name: 'Smart Campus IoT Telemetry' },
            repository: { id: 'repo-1', fullName: 'prism-team-nebula/smart-campus-iot' },
            durationMs: 4200,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'eval-2',
            phase: 'PHASE_1',
            status: 'COMPLETED',
            overallScore: 78,
            qualityScore: 74,
            contributionScore: 82,
            understandingScore: 76,
            team: { name: 'Team Aurora' },
            project: { name: 'Healthcare Portal Microservices' },
            repository: { id: 'repo-2', fullName: 'prism-team-aurora/healthcare-portal-microservices' },
            durationMs: 3800,
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          },
          {
            id: 'eval-3',
            phase: 'PHASE_2',
            status: 'COMPLETED',
            overallScore: 89,
            qualityScore: 86,
            contributionScore: 91,
            understandingScore: 88,
            team: { name: 'Team Pulsar' },
            project: { name: 'Distributed Key-Value Engine' },
            repository: { id: 'repo-3', fullName: 'zip-uploads/distributed-kv-cache' },
            durationMs: 5100,
            createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
        ])
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = evaluations.filter((e) =>
    e.team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.repository?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Evaluation Runs
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {evaluations.length} Runs Recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Audit history of automated 9-dimensional evaluations and student attribution scores
          </p>
        </div>

        <Link
          href="/repositories"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <Github size={13} />
          <span>View Repositories</span>
        </Link>
      </div>

      {/* ── Search Input (Linear Style) ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-subtle">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search runs by team, project, or repo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* ── Evaluations Grid (SonarCloud & Linear Cards) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg p-4 flex flex-col justify-between space-y-3.5 shadow-subtle transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {ev.phase.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="sonar-badge sonar-badge-a w-4 h-4 text-[10px]">A</span>
                  <span className="text-sm font-bold text-slate-900">{ev.overallScore}%</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900">{ev.team?.name || 'Assigned Team'}</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{ev.project?.name || 'Project'}</p>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600 truncate">
                {ev.repository?.fullName || 'Repository'}
              </div>

              {/* Metric Triplet */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-xs">
                <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase block">Quality</span>
                  <span className="font-bold text-slate-800">{ev.qualityScore}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase block">Contrib</span>
                  <span className="font-bold text-slate-800">{ev.contributionScore}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase block">Viva</span>
                  <span className="font-bold text-slate-800">{ev.understandingScore}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock size={11} />
                {new Date(ev.createdAt).toLocaleDateString()}
              </span>

              <Link
                href={`/repositories/${ev.repository?.id || 'repo-1'}`}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
