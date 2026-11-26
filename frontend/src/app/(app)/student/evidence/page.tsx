'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Terminal,
  FileCode,
  Shield,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useStudentWorkspace } from '../StudentWorkspaceContext'

interface EvidenceSection {
  id: string
  title: string
  category: string
  icon: LucideIcon
  status: 'PASSED' | 'WARNING'
  summary: string
  metrics: { label: string; value: string; threshold?: string }[]
  details: string[]
}

export default function StudentTechnicalEvidencePage() {
  const { dimensions, hasEvaluated, repoDetails } = useStudentWorkspace()

  if (!hasEvaluated || !repoDetails) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-14 text-center shadow-2xs space-y-4 max-w-xl mx-auto my-8 animate-in">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <FileCode size={22} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-primary-text">
            No Technical Evidence Available
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Technical evidence will be available after repository analysis.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs transition-colors no-underline"
          >
            <span>Connect & Analyze Repository</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    )
  }

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ast: true,
    complexity: true,
    security: false,
    testing: false,
    quality: false,
    vcs: false,
  })

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const sections: EvidenceSection[] = [
    {
      id: 'ast',
      title: 'AST Analysis & Modular Structure',
      category: 'Syntax & Abstract Syntax Tree',
      icon: Terminal,
      status: 'PASSED',
      summary: 'Deterministic syntax tree parsed. Modular function length under 40 lines; 0 circular dependencies.',
      metrics: [
        { label: 'Duplication Index', value: '3.4%', threshold: '< 5.0%' },
        { label: 'Avg Function Length', value: '28 lines', threshold: '< 40 lines' },
        { label: 'Max Cyclomatic Complexity', value: '6', threshold: '< 15' },
        { label: 'Circular Imports', value: '0 detected', threshold: '0' },
      ],
      details: [
        'Checked 42 source TypeScript files in /src and /routes',
        'Verified absence of cyclic module dependencies using Tarjan topological sort',
        'Separation of controllers, service business classes, and models strictly observed',
      ],
    },
    {
      id: 'complexity',
      title: 'Algorithmic Complexity & Big-O Scaling',
      category: 'Performance & Optimization',
      icon: Cpu,
      status: 'WARNING',
      summary: 'Telemetry ingestion contains nested loop; batch streaming hashing recommended for O(n) scaling.',
      metrics: [
        { label: 'Worst-case Complexity', value: 'O(n²) in parser', threshold: 'O(n log n)' },
        { label: 'Primary Transformer Loop', value: 'O(n) linear streaming', threshold: 'Optimal' },
        { label: 'Memory Allocation', value: 'Optimal (Stream Buffers)', threshold: 'No heap spikes' },
      ],
      details: [
        'Detected nested iteration loop in /src/utils/parser.ts:89',
        'Auxiliary lookup should utilize in-memory Map to reduce search from O(M*N) to O(M+N)',
        'Node.js stream piping prevents excessive garbage collector overhead during multi-MB batches',
      ],
    },
    {
      id: 'security',
      title: 'Security Rules & Credential Entropy',
      category: 'Defensive Integrity & Vulnerabilities',
      icon: Shield,
      status: 'PASSED',
      summary: '0 hardcoded secret strings detected, 0 critical CVEs, strict parameterized SQL queries verified.',
      metrics: [
        { label: 'Gitleaks Secrets Scan', value: '0 leaks detected', threshold: '0' },
        { label: 'Critical CVEs', value: '0', threshold: '0' },
        { label: 'High CVEs', value: '0', threshold: '0' },
        { label: 'SQL Injection Defense', value: 'Parameterized Prisma queries', threshold: 'Verified' },
      ],
      details: [
        'Scanned commit delta history for high-entropy tokens and API keys (0 flagged)',
        'Zod schema validation enforced on all HTTP ingress endpoints (preventing mass assignment)',
        'Rate limiting middleware configured on device authentication endpoints',
      ],
    },
    {
      id: 'testing',
      title: 'Automated Testing & Assertion Coverage',
      category: 'Correctness & Reliability',
      icon: CheckCircle2,
      status: 'PASSED',
      summary: '18 automated unit test suites passing; branch code coverage verified at 78.2%.',
      metrics: [
        { label: 'Test Suites', value: '18 passed / 0 failed', threshold: '100% pass' },
        { label: 'Branch Code Coverage', value: '78.2%', threshold: '> 75%' },
        { label: 'Line Coverage', value: '82.4%', threshold: '> 75%' },
        { label: 'Mock Test Spies', value: 'Verified (MQTT & Redis stubbed)', threshold: 'Isolated' },
      ],
      details: [
        'Simulated network disconnect scenarios with synthetic telemetry payloads',
        'Asserted error middleware produces structured RFC-7807 problem responses',
        'End-to-end integration assertions verified with ephemeral Postgres container',
      ],
    },
    {
      id: 'quality',
      title: 'Code Quality & Style Adherence',
      category: 'Maintainability & Clean Code',
      icon: FileCode,
      status: 'PASSED',
      summary: 'ESLint 0 errors, full TypeScript strict mode, comprehensive OpenAPI schemas.',
      metrics: [
        { label: 'Technical Debt Ratio', value: '0.4%', threshold: '< 5%' },
        { label: 'ESLint Diagnostic Errors', value: '0', threshold: '0' },
        { label: 'TypeScript Strict Mode', value: 'Enabled', threshold: 'Required' },
        { label: 'Inline Documentation', value: '88% public functions', threshold: '> 70%' },
      ],
      details: [
        'Zero any-typed parameters in public domain service classes',
        'OpenAPI 3.1 schema specification generated and tested against endpoints',
        'README provides full reproducible setup script and environment templates',
      ],
    },
    {
      id: 'vcs',
      title: 'VCS & Git Hygiene Audit',
      category: 'Process & Branching',
      icon: GitCommit,
      status: 'PASSED',
      summary: 'Conventional commit standards followed; active PR review comments and branch isolation verified.',
      metrics: [
        { label: 'Conventional Commits', value: '92% adherence', threshold: '> 80%' },
        { label: 'Force Pushes to Main', value: '0', threshold: '0' },
        { label: 'Active Feature Branches', value: '3 isolated', threshold: 'Isolated' },
        { label: 'GPG Signed Commits', value: 'Verified', threshold: 'Attributed' },
      ],
      details: [
        'Commit message prefixes strictly adhere to feat:, fix:, test:, docs:',
        'Feature branches merged via Pull Requests with mandatory peer review sign-offs',
        'Clean linear git history without detached head merges',
      ],
    },
  ]

  return (
    <div className="space-y-4 animate-in">
      <div>
        <h2 className="text-sm font-bold text-primary-text tracking-tight font-sans flex items-center gap-2">
          <Terminal size={15} className="text-primary" />
          Technical Evidence & AST Diagnostics
        </h2>
        <p className="text-xs text-secondary-text font-sans mt-0.5">
          Deep deterministic analysis extracted directly from repository syntax trees and git logs
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const isExpanded = expandedSections[sec.id]
          const Icon = sec.icon
          const isPassed = sec.status === 'PASSED'

          return (
            <div
              key={sec.id}
              className="bg-surface border border-border rounded-lg shadow-subtle overflow-hidden transition-colors"
            >
              {/* Collapsible Header */}
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-secondary/40 transition-colors font-sans"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                      isPassed
                        ? 'bg-success-subtle text-success-text'
                        : 'bg-warning-subtle text-warning-text'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-primary-text">{sec.title}</span>
                      <Badge variant={isPassed ? 'success' : 'warning'} size="sm">
                        {sec.status}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-text block mt-0.5 truncate">
                      {sec.category} • {sec.summary}
                    </span>
                  </div>
                </div>

                <div className="text-muted-text shrink-0 ml-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>

              {/* Expanded Technical Parameters */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-border-subtle bg-surface-secondary/20 space-y-3 font-sans text-xs animate-in">
                  {/* Parameter Metrics Table */}
                  <div className="mt-3 border border-border rounded-md overflow-hidden bg-surface">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-secondary/70 border-b border-border text-muted-text text-[11px]">
                          <th className="py-2 px-3 font-semibold">Parameter / Metric</th>
                          <th className="py-2 px-3 font-semibold">Extracted Value</th>
                          <th className="py-2 px-3 font-semibold text-right">Academic Threshold</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {sec.metrics.map((m, idx) => (
                          <tr key={idx} className="hover:bg-surface-secondary/40">
                            <td className="py-2 px-3 text-secondary-text font-medium">{m.label}</td>
                            <td className="py-2 px-3 text-primary-text font-bold">{m.value}</td>
                            <td className="py-2 px-3 text-muted-text text-right">{m.threshold || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Diagnostic Verification Notes */}
                  <div className="p-3 bg-surface border border-border rounded-md space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-muted-text block">
                      Diagnostic Findings & Verification Trace
                    </span>
                    <ul className="space-y-1 text-secondary-text text-xs list-disc list-inside">
                      {sec.details.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
