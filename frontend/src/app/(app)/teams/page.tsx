'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Github,
  Award,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  FolderKanban,
  GitCommit,
} from 'lucide-react'

const TEAMS = [
  {
    id: 'team-nebula',
    name: 'Team Nebula',
    project: 'Smart Campus IoT & Telemetry',
    repo: 'prism-team-nebula/smart-campus-iot',
    lead: 'Sarah Chen',
    membersCount: 4,
    members: ['Sarah Chen (Lead)', 'David Kim', 'Priya Patel', 'Marcus Vance'],
    score: 84,
    grade: 'A',
    phase: 'Phase 2',
    prsMerged: 4,
    commits: 18,
    lastSync: '10m ago',
  },
  {
    id: 'team-aurora',
    name: 'Team Aurora',
    project: 'Healthcare Portal Microservices',
    repo: 'prism-team-aurora/healthcare-portal-microservices',
    lead: 'Ananya Roy',
    membersCount: 3,
    members: ['Ananya Roy (Lead)', 'Kevin Zhang', 'Maya Lin'],
    score: 78,
    grade: 'B+',
    phase: 'Phase 2',
    prsMerged: 3,
    commits: 14,
    lastSync: '45m ago',
  },
  {
    id: 'team-pulsar',
    name: 'Team Pulsar',
    project: 'Distributed Key-Value Engine',
    repo: 'zip-uploads/distributed-kv-cache',
    lead: 'Rahul Sharma',
    membersCount: 4,
    members: ['Rahul Sharma (Lead)', 'Elena Rostova', 'Chloe Bennett', 'Samira Khan'],
    score: 89,
    grade: 'A',
    phase: 'Phase 2',
    prsMerged: 6,
    commits: 22,
    lastSync: '2h ago',
  },
  {
    id: 'team-orion',
    name: 'Team Orion',
    project: 'Autonomous Robot Navigation & SLAM',
    repo: 'prism-team-orion/autonomous-robot-slam',
    lead: 'Vikram Singh',
    membersCount: 3,
    members: ['Vikram Singh (Lead)', 'Alex Torres', 'Jordan Patel'],
    score: 72,
    grade: 'B',
    phase: 'Phase 2',
    prsMerged: 2,
    commits: 11,
    lastSync: '3h ago',
  },
]

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeams = TEAMS.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.lead.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Student Cohorts & Teams
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {TEAMS.length} Active Teams
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cohort rosters, repository associations, and team-level rubric evaluations
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── Teams Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg p-4 space-y-3.5 shadow-subtle transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-slate-900 block">{team.name}</span>
                <span className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                  <FolderKanban size={12} className="text-blue-600 shrink-0" />
                  {team.project}
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-bold text-slate-900 block">{team.score}%</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Grade {team.grade}
                </span>
              </div>
            </div>

            {/* Repo link pill */}
            <div className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 truncate flex items-center gap-1.5">
                <Github size={13} className="text-slate-500 shrink-0" />
                {team.repo}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">{team.lastSync}</span>
            </div>

            {/* Members Roster */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block">
                Team Roster ({team.membersCount} Members)
              </span>
              <div className="flex flex-wrap gap-1 font-mono">
                {team.members.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Stats & Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span>{team.commits} Commits</span>
                <span>•</span>
                <span>{team.prsMerged} PRs</span>
              </div>

              <Link
                href="/student"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View Evaluation</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
