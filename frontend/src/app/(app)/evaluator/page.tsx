'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Github,
  HelpCircle,
  Eye,
  EyeOff,
  Save,
  Check,
  FileCode,
  Shield,
  Layers,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CandidateDefense {
  id: string
  teamName: string
  projectTitle: string
  candidateName: string
  candidateRole: string
  candidateEmail: string
  repo: string
  overallQuality: number
  testPassRate: number
  gitHygiene: number
  securityRating: string
  allocatedVivaScore: number
  isGradeLocked: boolean
}

const CANDIDATES: CandidateDefense[] = [
  {
    id: 'cand-1',
    teamName: 'Team Nebula',
    projectTitle: 'Smart Campus IoT Telemetry',
    candidateName: 'Sarah Chen',
    candidateRole: 'Team Lead & Core Architect',
    candidateEmail: 'schen@mit-tech.edu',
    repo: 'prism-team-nebula/smart-campus-iot',
    overallQuality: 88,
    testPassRate: 82,
    gitHygiene: 94,
    securityRating: 'A (0 CVEs)',
    allocatedVivaScore: 88,
    isGradeLocked: false,
  },
  {
    id: 'cand-2',
    teamName: 'Team Nebula',
    projectTitle: 'Smart Campus IoT Telemetry',
    candidateName: 'David Kim',
    candidateRole: 'Backend & Testing Engineer',
    candidateEmail: 'dkim@mit-tech.edu',
    repo: 'prism-team-nebula/smart-campus-iot',
    overallQuality: 84,
    testPassRate: 88,
    gitHygiene: 86,
    securityRating: 'A (0 CVEs)',
    allocatedVivaScore: 82,
    isGradeLocked: false,
  },
  {
    id: 'cand-3',
    teamName: 'Team Aurora',
    projectTitle: 'Healthcare Portal Microservices',
    candidateName: 'Ananya Roy',
    candidateRole: 'Lead Fullstack Developer',
    candidateEmail: 'ananya@mit-tech.edu',
    repo: 'prism-team-aurora/healthcare-portal-microservices',
    overallQuality: 78,
    testPassRate: 74,
    gitHygiene: 82,
    securityRating: 'B (1 Warning)',
    allocatedVivaScore: 78,
    isGradeLocked: false,
  },
]

export default function EvaluatorPage() {
  const [candidates, setCandidates] = useState<CandidateDefense[]>(CANDIDATES)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDefense>(CANDIDATES[0])
  const [vivaScoreInput, setVivaScoreInput] = useState(CANDIDATES[0].allocatedVivaScore.toString())
  const [isLocked, setIsLocked] = useState(false)
  const [revealedKey, setRevealedKey] = useState<Record<number, boolean>>({})

  const toggleReveal = (idx: number) => {
    setRevealedKey((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleSelectCandidate = (c: CandidateDefense) => {
    setSelectedCandidate(c)
    setVivaScoreInput(c.allocatedVivaScore.toString())
    setIsLocked(c.isGradeLocked)
  }

  const handleLockGrade = () => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id
          ? { ...c, allocatedVivaScore: Number(vivaScoreInput), isGradeLocked: true }
          : c
      )
    )
    setIsLocked(true)
    toast.success(`Grade locked and submitted for ${selectedCandidate.candidateName}!`)
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Viva Voce Examination Desk
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Dr. S. Ramanathan • Examination Board
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Conduct capstone viva defenses, review deterministic code evidence, and award final rubric marks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <strong>{candidates.length}</strong> Candidates Scheduled
          </span>
        </div>
      </div>

      {/* ── Main Split: Candidate Roster & Live Defense Examination Desk ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Col: Candidate Roster */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
            Viva Defense Roster
          </span>

          <div className="space-y-2">
            {candidates.map((cand) => {
              const isSelected = selectedCandidate.id === cand.id
              return (
                <div
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-subtle'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{cand.candidateName}</h3>
                      <p className="text-[10px] text-slate-500 font-mono">{cand.teamName} • {cand.projectTitle}</p>
                    </div>

                    <span className="font-mono text-xs font-bold text-indigo-700">
                      {cand.allocatedVivaScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                    <span>{cand.candidateRole}</span>
                    {cand.isGradeLocked ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    ) : (
                      <span className="text-amber-600">Pending Mark</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right 2 Cols: Live Defense Scoring & Prompt Generator ──────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-4">
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 font-sans">
                    {selectedCandidate.candidateName}
                  </h2>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                    {selectedCandidate.candidateRole}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Team: <strong className="text-slate-800">{selectedCandidate.teamName}</strong> • {selectedCandidate.candidateEmail}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/repositories/repo-1`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition-colors"
                >
                  <FileCode size={12} />
                  <span>Inspect AST Code</span>
                </Link>
              </div>
            </div>

            {/* Candidate Code Evidence Summary (SonarCloud Style) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Code Quality</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{selectedCandidate.overallQuality}% (A)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Test Pass Rate</span>
                <span className="text-base font-bold text-emerald-700 block mt-0.5">{selectedCandidate.testPassRate}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Git Hygiene</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{selectedCandidate.gitHygiene}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-400 uppercase block">Security Rating</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{selectedCandidate.securityRating}</span>
              </div>
            </div>

            {/* AI Defense Prompts for Examiner */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-600" />
                  Targeted Defense Prompts (Examiner Guide)
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-semibold">
                  AST Grounded
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    q: 'How did you isolate the telemetry ingestion pipeline from database I/O bottlenecks?',
                    expected: 'Separated async worker queue with Redis buffer; candidate should cite src/services/telemetry.service.ts.',
                    source: 'src/services/telemetry.service.ts:18',
                  },
                  {
                    q: 'Explain the fault-tolerance mechanism when the MQTT broker experiences transient disconnects.',
                    expected: 'Exponential backoff retry policy with client-side buffer queue; candidate should explain error trapping.',
                    source: 'tests/unit/ingest.spec.ts:42',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-indigo-700 uppercase">Question {idx + 1}</span>
                      <span className="text-slate-400">Target File: {item.source}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900">"{item.q}"</p>

                    <button
                      type="button"
                      onClick={() => toggleReveal(idx)}
                      className="text-[10px] font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold pt-0.5"
                    >
                      {revealedKey[idx] ? <EyeOff size={11} /> : <Eye size={11} />}
                      <span>{revealedKey[idx] ? 'Hide Expected Answer Key' : 'Reveal Expected Answer Key for Examiner'}</span>
                    </button>

                    {revealedKey[idx] && (
                      <div className="p-2.5 bg-white border border-slate-200 rounded text-xs text-slate-700 animate-in">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block mb-0.5">Evaluation Key:</span>
                        {item.expected}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rubric Mark Submission & Grade Lock */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Award Final Viva Defense Mark
                </span>
                <span className="text-[10px] font-mono text-slate-500">Weight: 20% of Capstone Grade</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    disabled={isLocked}
                    value={vivaScoreInput}
                    onChange={(e) => setVivaScoreInput(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-md border border-slate-300 bg-white font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 disabled:opacity-50"
                  />
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={handleLockGrade}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Lock size={12} />
                  <span>{isLocked ? 'Grade Locked & Submitted' : 'Lock & Submit Final Grade'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
