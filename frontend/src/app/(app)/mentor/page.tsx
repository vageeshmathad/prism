'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  GitBranch,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  GitPullRequest,
  Check,
  MessageSquare,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AssignedTeam {
  id: string
  teamName: string
  projectTitle: string
  repo: string
  lead: string
  membersCount: number
  phase: string
  lastCommitDate: string
  weeklyCommits: number
  prsPendingReview: number
  currentScore: number
  mentorRemarks?: string
  status: 'ON_TRACK' | 'NEEDS_REVIEW' | 'FLAGGED'
}

const INITIAL_ASSIGNED_TEAMS: AssignedTeam[] = [
  {
    id: 'team-nebula',
    teamName: 'Team Nebula',
    projectTitle: 'Smart Campus IoT & Telemetry',
    repo: 'prism-team-nebula/smart-campus-iot',
    lead: 'Sarah Chen',
    membersCount: 4,
    phase: 'Phase 2 (Core)',
    lastCommitDate: '2 hours ago',
    weeklyCommits: 14,
    prsPendingReview: 1,
    currentScore: 84,
    mentorRemarks: 'Strong progress on telemetry microservice. Need to verify edge-case error tests.',
    status: 'ON_TRACK',
  },
  {
    id: 'team-aurora',
    teamName: 'Team Aurora',
    projectTitle: 'Healthcare Portal Microservices',
    repo: 'prism-team-aurora/healthcare-portal-microservices',
    lead: 'Ananya Roy',
    membersCount: 3,
    phase: 'Phase 2 (Core)',
    lastCommitDate: '1 day ago',
    weeklyCommits: 8,
    prsPendingReview: 2,
    currentScore: 78,
    mentorRemarks: 'Advised team to pin dependencies and configure JWT refresh tokens.',
    status: 'NEEDS_REVIEW',
  },
  {
    id: 'team-pulsar',
    teamName: 'Team Pulsar',
    projectTitle: 'Distributed Key-Value Engine',
    repo: 'zip-uploads/distributed-kv-cache',
    lead: 'Rahul Sharma',
    membersCount: 4,
    phase: 'Phase 2 (Core)',
    lastCommitDate: '4 hours ago',
    weeklyCommits: 18,
    prsPendingReview: 0,
    currentScore: 89,
    mentorRemarks: 'Excellent Raft consensus implementation; unit tests passing at 85%.',
    status: 'ON_TRACK',
  },
]

export default function MentorHubPage() {
  const [teams, setTeams] = useState<AssignedTeam[]>(INITIAL_ASSIGNED_TEAMS)
  const [selectedTeam, setSelectedTeam] = useState<AssignedTeam>(INITIAL_ASSIGNED_TEAMS[0])
  const [remarksInput, setRemarksInput] = useState(INITIAL_ASSIGNED_TEAMS[0].mentorRemarks || '')
  const [mentorScore, setMentorScore] = useState('85')
  const [isSaving, setIsSaving] = useState(false)

  const handleSelectTeam = (t: AssignedTeam) => {
    setSelectedTeam(t)
    setRemarksInput(t.mentorRemarks || '')
  }

  const handleSaveMentorEvaluation = () => {
    setIsSaving(true)
    setTimeout(() => {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id
            ? { ...t, mentorRemarks: remarksInput, currentScore: Number(mentorScore) }
            : t
        )
      )
      setIsSaving(false)
      toast.success(`Mentor feedback and score saved for ${selectedTeam.teamName}`)
    }, 500)
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Internal Mentorship Hub
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Prof. Arun Kumar • Project Guide
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Track weekly sprint progress, review pull requests, and enter internal continuous evaluation marks
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <div className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
            <strong>{teams.length}</strong> Assigned Teams
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Split: Assigned Teams & Active Evaluation Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Assigned Teams List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Assigned Teams
            </span>
            <span className="text-[10px] font-mono text-slate-400">AY 2025-26</span>
          </div>

          <div className="space-y-2">
            {teams.map((team) => {
              const isSelected = selectedTeam.id === team.id
              return (
                <div
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-subtle'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{team.teamName}</h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                        {team.projectTitle}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded uppercase ${
                        team.status === 'ON_TRACK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {team.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                    <span>{team.weeklyCommits} commits this week</span>
                    <span className="font-bold text-slate-800">{team.currentScore}% score</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right 2 Columns: Mentor Review & Continuous Evaluation Desk ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-4">
            {/* Header of selected team */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 font-sans">
                    {selectedTeam.teamName}
                  </h2>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                    Lead: {selectedTeam.lead}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Repo: <code className="text-slate-800">{selectedTeam.repo}</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/repositories/repo-1`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition-colors"
                >
                  <Github size={12} />
                  <span>Inspect Code</span>
                </Link>
              </div>
            </div>

            {/* Sprint Status Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Weekly Commits</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  {selectedTeam.weeklyCommits} commits
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">PRs Pending Review</span>
                <span className="text-base font-bold text-blue-600 block mt-0.5">
                  {selectedTeam.prsPendingReview} PR
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Last Active</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  {selectedTeam.lastCommitDate}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Internal Score</span>
                <span className="text-base font-bold text-emerald-700 block mt-0.5">
                  {selectedTeam.currentScore}%
                </span>
              </div>
            </div>

            {/* Mentor Continuous Evaluation Form */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-emerald-600" />
                  Mentor Feedback & Continuous Assessment
                </span>
                <span className="text-[10px] font-mono text-slate-400">Weekly Guide Review</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase block">
                  Continuous Assessment Score (Out of 100)
                </label>
                <input
                  type="number"
                  value={mentorScore}
                  onChange={(e) => setMentorScore(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-xs font-mono text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase block">
                  Mentor Remarks & Guidance for Next Sprint
                </label>
                <textarea
                  rows={3}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Enter remarks on architectural decisions, testing gaps, or git commit frequency..."
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveMentorEvaluation}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Check size={13} />
                  <span>{isSaving ? 'Submitting...' : 'Save Mentor Assessment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
