'use client'

import { useState } from 'react'
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  FileCode,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const FINDINGS = [
  {
    id: 'SEC-101',
    rule: 'Hardcoded Secret Pattern',
    category: 'Secrets Detection',
    severity: 'MEDIUM',
    repo: 'prism-team-nebula/smart-campus-iot',
    file: '.env.example:17',
    desc: 'Potential placeholder secret string detected in environment template.',
    remediation: 'Ensure secrets are managed strictly via cloud secrets manager or environment variables.',
  },
  {
    id: 'SEC-102',
    rule: 'Unpinned Dependency Wildcard',
    category: 'Vulnerable Dependencies',
    severity: 'LOW',
    repo: 'prism-team-aurora/healthcare-portal-microservices',
    file: 'package.json:28',
    desc: 'Package uses wildcard version identifier (^) which may pull untested transitive updates.',
    remediation: 'Pin exact package versions or lockfiles (package-lock.json / pnpm-lock.yaml).',
  },
  {
    id: 'SEC-103',
    rule: 'Missing Content-Security-Policy',
    category: 'HTTP Headers',
    severity: 'INFO',
    repo: 'prism-team-orion/autonomous-robot-slam',
    file: 'src/server.ts:42',
    desc: 'Web server does not explicitly set Content-Security-Policy (CSP) headers.',
    remediation: 'Implement helmet middleware or configure secure HTTP response headers.',
  },
  {
    id: 'SEC-104',
    rule: 'Direct Shell Execution Guard',
    category: 'Command Injection',
    severity: 'PASSED',
    repo: 'prism-team-pulsar/distributed-kv-cache',
    file: 'src/cli/executor.ts:89',
    desc: 'Parameters sanitized using child_process.execFile rather than arbitrary shell string eval.',
    remediation: 'Verified safe: No command injection vectors detected.',
  },
]

export default function SecurityPage() {
  const [filter, setFilter] = useState<'ALL' | 'MEDIUM' | 'LOW' | 'PASSED'>('ALL')
  const [isScanning, setIsScanning] = useState(false)

  const filteredFindings = filter === 'ALL'
    ? FINDINGS
    : FINDINGS.filter((f) => f.severity === filter)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      toast.success('Security scan completed: 0 Critical vulnerabilities detected across 5 repositories!')
    }, 700)
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Security & Static Analysis
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              0 Critical CVEs
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated SAST vulnerability inspection, secret detection, and dependency lockfile audits
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
          <span>{isScanning ? 'Auditing Codebases...' : 'Run Security Audit'}</span>
        </button>
      </div>

      {/* ── KPI Metrics Row (SonarCloud Style) ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Critical Vulnerabilities</span>
          <div className="flex items-center gap-1.5">
            <span className="sonar-badge sonar-badge-a w-4 h-4 text-[10px]">A</span>
            <span className="text-2xl font-bold text-slate-900">0</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">Clean baseline verified</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Secrets Ingest Flags</span>
          <span className="text-2xl font-bold text-amber-600">1</span>
          <span className="text-[11px] text-slate-500 block">Template placeholder</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dependency CVEs</span>
          <span className="text-2xl font-bold text-slate-900">0 High</span>
          <span className="text-[11px] text-slate-500 block">Audited vs advisory DB</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dimension Compliance</span>
          <span className="text-2xl font-bold text-emerald-700">95%</span>
          <span className="text-[11px] text-slate-500 block">Grade A certified</span>
        </div>
      </div>

      {/* ── Security Hotspot Log (SonarCloud / Linear Issue Stream) ──────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Lock size={14} className="text-blue-600" />
              Security Hotspots & Remediation Guidance
            </h2>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Deterministic AST checks, pattern matching, and configuration audits
            </p>
          </div>

          <div className="flex rounded-md p-0.5 bg-slate-100 text-xs font-mono">
            {(['ALL', 'MEDIUM', 'LOW', 'PASSED'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                  filter === lvl ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors text-xs font-mono"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                    {finding.id}
                  </span>
                  <span className="font-bold text-slate-900 font-sans">{finding.rule}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">• {finding.category}</span>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                    finding.severity === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : finding.severity === 'LOW'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {finding.severity}
                </span>
              </div>

              <p className="text-slate-600 font-sans text-xs leading-relaxed">{finding.desc}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <FileCode size={12} className="text-slate-400 shrink-0" />
                  <span>{finding.file} • <strong className="text-slate-800">{finding.repo}</strong></span>
                </div>

                <div className="text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Remediation: {finding.remediation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
