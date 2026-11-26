'use client'

import { useState } from 'react'
import {
  Settings,
  Github,
  Shield,
  Layers,
  Save,
  CheckCircle2,
  RefreshCw,
  Key,
  Webhook,
  Sliders,
  Building,
  User,
  Bell,
  Check,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'github' | 'rubric' | 'notifications'>('general')

  // General Settings
  const [institutionName, setInstitutionName] = useState('Indian Institute of Technology Bombay')
  const [department, setDepartment] = useState('Department of Computer Science & Engineering')
  const [academicTerm, setAcademicTerm] = useState('AY 2025-26')
  const [activePhase, setActivePhase] = useState<'PHASE_1' | 'PHASE_2' | 'PHASE_3'>('PHASE_2')
  const [passingThreshold, setPassingThreshold] = useState('70')

  // GitHub Settings
  const [clientId, setClientId] = useState('gh_app_prism_academic_prod')
  const [defaultBranch, setDefaultBranch] = useState('main')
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:4000/api/v1/github/webhook')
  const [autoEvaluateOnPr, setAutoEvaluateOnPr] = useState(true)
  const [secretScanningEnabled, setSecretScanningEnabled] = useState(true)

  // Notification Toggles
  const [notifyOnPrMerge, setNotifyOnPrMerge] = useState(true)
  const [notifyOnSecurityAlert, setNotifyOnSecurityAlert] = useState(true)
  const [notifyOnScoreDrop, setNotifyOnScoreDrop] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Configuration saved successfully!')
    }, 600)
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Platform Configuration
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Institutional Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Manage academic rubric weighting, GitHub webhook parameters, and automated alert preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
          <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* ── Tab Bar (Linear Style) ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-md border border-slate-200/70 w-fit text-xs font-mono">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building size={13} />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'github'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Github size={13} />
          <span>GitHub & Webhooks</span>
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'rubric'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders size={13} />
          <span>Rubric Weights</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell size={13} />
          <span>Alerts</span>
        </button>
      </div>

      {/* ── TAB 1: GENERAL & INSTITUTION ─────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3 font-mono text-xs">
            <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Building size={14} className="text-blue-600" />
              Institutional Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-sans outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-sans outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Active Academic Term</label>
                <input
                  type="text"
                  value={academicTerm}
                  onChange={(e) => setAcademicTerm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-mono outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Passing Threshold Score (%)</label>
                <input
                  type="number"
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GITHUB & WEBHOOKS ──────────────────────────────────────── */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3 font-mono text-xs">
            <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Github size={14} className="text-slate-800" />
              GitHub App & Webhook Ingestion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">GitHub App Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-mono outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Default Main Branch</label>
                <input
                  type="text"
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-mono outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-medium">Live Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-mono outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(webhookUrl)
                      toast.success('Webhook URL copied to clipboard')
                    }}
                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEvaluateOnPr}
                  onChange={(e) => setAutoEvaluateOnPr(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-xs text-slate-700 font-sans">
                  Automatically trigger evaluation run whenever a PR is merged
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secretScanningEnabled}
                  onChange={(e) => setSecretScanningEnabled(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-xs text-slate-700 font-sans">
                  Execute Gitleaks entropy audit on every incoming commit push
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EVALUATION RUBRIC (SONARCLOUD WEIGHT MATRIX) ──────────── */}
      {activeTab === 'rubric' && (
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight flex items-center gap-1.5">
              <Sliders size={14} className="text-blue-600" />
              9 PRISM Dimension Weights Matrix
            </h2>

            <div className="flex p-0.5 bg-slate-100 rounded-md border border-slate-200/70 text-[10px]">
              {(['PHASE_1', 'PHASE_2', 'PHASE_3'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePhase(p)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activePhase === p ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="pb-2 font-medium">Dimension</th>
                <th className="pb-2 font-medium">Phase 1</th>
                <th className="pb-2 font-medium">Phase 2</th>
                <th className="pb-2 font-medium">Phase 3</th>
                <th className="pb-2 font-medium text-right">Active Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: '1. Code Quality', p1: '10%', p2: '15%', p3: '10%' },
                { name: '2. Design & Architecture', p1: '20%', p2: '10%', p3: '5%' },
                { name: '3. Correctness & Testing', p1: '5%', p2: '20%', p3: '20%' },
                { name: '4. Efficiency & Performance', p1: '0%', p2: '10%', p3: '15%' },
                { name: '5. Git Hygiene', p1: '15%', p2: '10%', p3: '5%' },
                { name: '6. Documentation', p1: '15%', p2: '5%', p3: '5%' },
                { name: '7. Security & Integrity', p1: '10%', p2: '10%', p3: '15%' },
                { name: '8. Technical Understanding', p1: '20%', p2: '15%', p3: '20%' },
                { name: '9. Task Scope', p1: '5%', p2: '5%', p3: '5%' },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/70">
                  <td className="py-2.5 font-semibold text-slate-900 font-sans">{row.name}</td>
                  <td className="py-2.5 text-slate-500">{row.p1}</td>
                  <td className="py-2.5 text-slate-500 font-bold">{row.p2}</td>
                  <td className="py-2.5 text-slate-500">{row.p3}</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {activePhase === 'PHASE_1' ? row.p1 : activePhase === 'PHASE_2' ? row.p2 : row.p3}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 4: NOTIFICATIONS ─────────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle space-y-3 font-mono text-xs">
          <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Bell size={14} className="text-blue-600" />
            Alert Subscriptions
          </h2>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnPrMerge}
                onChange={(e) => setNotifyOnPrMerge(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <div>
                <span className="font-semibold text-slate-900 font-sans block">Pull Request Evaluations</span>
                <span className="text-[11px] text-slate-500 block">Dispatch notification on completion of PR code inspection.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnSecurityAlert}
                onChange={(e) => setNotifyOnSecurityAlert(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <div>
                <span className="font-semibold text-slate-900 font-sans block">Security CVEs & Secrets</span>
                <span className="text-[11px] text-slate-500 block">Immediate alert on detected secret strings or critical package vulnerabilities.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnScoreDrop}
                onChange={(e) => setNotifyOnScoreDrop(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <div>
                <span className="font-semibold text-slate-900 font-sans block">Score Drops Below 70%</span>
                <span className="text-[11px] text-slate-500 block">Flag any submission failing the institutional baseline threshold.</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
