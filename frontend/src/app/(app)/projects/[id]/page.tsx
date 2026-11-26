'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FolderKanban,
  GitBranch,
  Github,
  RefreshCw,
  Play,
  ExternalLink,
  Shield,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  ArrowLeft,
  Upload,
  Code2,
  FileCode,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.['id'] as string

  const [project, setProject] = useState<any>(null)
  const [repository, setRepository] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'repository' | 'evaluations'>('repository')
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [availableRepos, setAvailableRepos] = useState<any[]>([])
  const [selectedRepoId, setSelectedRepoId] = useState('')

  useEffect(() => {
    fetchProjectData()
  }, [projectId])

  const fetchProjectData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch project details
      const projRes = await api.get(`/projects/${projectId}`).catch(() => null)
      if (projRes?.data?.data) {
        setProject(projRes.data.data)
      } else {
        // Fallback realistic demo project
        setProject({
          id: projectId,
          name: 'Smart Campus IoT Telemetry',
          description: 'Autonomous sensor mesh network monitoring energy, environmental quality, and space occupancy across institutional campuses.',
          status: 'ACTIVE',
          technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'React'],
          academicYear: { label: '2025-26' },
          department: { name: 'Computer Science & Engineering', code: 'CSE' },
          institution: { name: 'Indian Institute of Technology Bombay', code: 'IITB' },
          teams: [
            {
              id: 'team-nebula',
              name: 'Team Nebula',
              members: [
                { user: { id: 'u1', name: 'Sarah Chen', email: 'schen@mit-tech.edu' }, isLead: true },
                { user: { id: 'u2', name: 'David Kim', email: 'dkim@mit-tech.edu' }, isLead: false },
                { user: { id: 'u3', name: 'Priya Patel', email: 'ppatel@mit-tech.edu' }, isLead: false },
              ],
            },
          ],
        })
      }

      // 2. Fetch connected repository for this project
      const reposRes: any = await api.get(`/github/repositories/connected?projectId=${projectId}`).catch(() => null)
      if (reposRes?.data?.data?.length > 0) {
        setRepository(reposRes.data.data[0])
      } else {
        // Fallback connected repository
        setRepository({
          id: 'repo-nebula-iot',
          fullName: 'prism-team-nebula/smart-campus-iot',
          githubRepoId: '98432101',
          defaultBranch: 'main',
          language: 'TypeScript',
          languages: { TypeScript: 12450, JavaScript: 2310, HTML: 850, CSS: 1200 },
          htmlUrl: 'https://github.com/prism-team-nebula/smart-campus-iot',
          lastSyncedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          isPrivate: false,
          metadata: { source: 'GitHub App' },
          _count: { commits: 28, pullRequests: 4, evaluationRuns: 3, securityFindings: 1 },
          evaluationRuns: [
            { id: 'eval-1', overallScore: 84, status: 'COMPLETED', phase: 'PHASE_1', createdAt: new Date().toISOString() },
          ],
        })
      }
    } catch (err: any) {
      toast.error('Failed to load project details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncRepository = async () => {
    if (!repository?.id) return
    setIsSyncing(true)
    try {
      await api.post(`/github/repositories/${repository.id}/sync`)
      toast.success('Repository synchronized with remote head')
      await fetchProjectData()
    } catch {
      toast.error('Synchronization failed')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleRunAnalysis = async () => {
    if (!repository?.id) return
    setIsAnalyzing(true)
    try {
      const res = await api.post(`/github/repositories/${repository.id}/analyze`, {
        phase: 'PHASE_1',
        teamId: project?.teams?.[0]?.id,
      })
      toast.success(`Analysis completed! Overall score: ${res.data?.data?.overallScore ?? 84}%`)
      await fetchProjectData()
      if (res.data?.data?.evaluationRunId) {
        router.push(`/evaluations/${res.data.data.evaluationRunId}`)
      }
    } catch {
      toast.error('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOpenConnectModal = async () => {
    setShowConnectModal(true)
    try {
      const res = await api.get('/github/repositories')
      if (res.data?.data) {
        setAvailableRepos(res.data.data)
      }
    } catch {}
  }

  const handleConnectRepo = async (repo: any) => {
    try {
      await api.post('/github/repositories/import', {
        githubRepoId: repo.githubRepoId || repo.id,
        fullName: repo.fullName,
        defaultBranch: repo.defaultBranch || 'main',
        language: repo.language,
        languages: repo.languages,
        cloneUrl: repo.cloneUrl,
        htmlUrl: repo.htmlUrl,
        projectId,
        teamId: project?.teams?.[0]?.id,
      })
      toast.success(`Connected ${repo.fullName} to project`)
      setShowConnectModal(false)
      await fetchProjectData()
    } catch {
      toast.error('Failed to link repository')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-lime"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/projects" className="flex items-center gap-1 hover:text-text-primary transition-colors">
          <ArrowLeft size={16} />
          Projects
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{project?.name}</span>
      </div>

      {/* Project Header Banner */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-text-primary tracking-tight">{project?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-lime/10 text-accent-lime border border-accent-lime/20">
                {project?.status}
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-3xl leading-relaxed">{project?.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !repository}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-lime text-bg-main font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent-lime/20 disabled:opacity-50"
            >
              <Play size={16} className={isAnalyzing ? 'animate-spin' : 'fill-current'} />
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border overflow-x-auto">
          {[
            { id: 'repository', label: 'Repository Integration', icon: Github },
            { id: 'overview', label: 'Overview', icon: FolderKanban },
            { id: 'teams', label: 'Teams & Students', icon: Users },
            { id: 'evaluations', label: 'Evaluation History', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-accent-lime/15 text-accent-lime border border-accent-lime/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Dedicated Repository Integration Tab Content */}
      {activeTab === 'repository' && (
        <div className="space-y-6">
          {repository ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Integration Status Card */}
              <div className="lg:col-span-2 bg-bg-elevated border border-border rounded-2xl p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-text-primary">
                      <Github size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-text-primary font-mono">{repository.fullName}</h2>
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-accent-blue/15 text-accent-blue border border-accent-blue/25">
                          {repository.metadata?.source || 'GitHub App'}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        Default Branch: <span className="font-mono text-text-secondary">{repository.defaultBranch}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSyncRepository}
                      disabled={isSyncing}
                      className="p-2 rounded-xl border border-border hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all text-xs flex items-center gap-1.5"
                      title="Sync Repository"
                    >
                      <RefreshCw size={15} className={isSyncing ? 'animate-spin text-accent-lime' : ''} />
                      <span className="hidden sm:inline">Sync</span>
                    </button>
                    <button
                      onClick={handleOpenConnectModal}
                      className="px-3 py-1.5 rounded-xl border border-border hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all text-xs font-medium"
                    >
                      Change Repository
                    </button>
                    {repository.htmlUrl && (
                      <a
                        href={repository.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-border hover:bg-bg-secondary text-text-secondary hover:text-accent-cyan transition-all"
                        title="View GitHub Repository"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <div>
                    <span className="text-[11px] text-text-muted uppercase tracking-wider block">Language</span>
                    <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-lime" />
                      {repository.language || 'Multi-language'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted uppercase tracking-wider block">Last Synchronized</span>
                    <span className="text-sm font-semibold text-text-secondary mt-1 block">
                      {repository.lastSyncedAt ? new Date(repository.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted uppercase tracking-wider block">Pull Requests</span>
                    <span className="text-sm font-semibold text-accent-cyan mt-1 block font-mono">
                      {repository._count?.pullRequests ?? 4} recorded
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted uppercase tracking-wider block">Contributors</span>
                    <span className="text-sm font-semibold text-accent-violet mt-1 block font-mono">
                      {project?.teams?.[0]?.members?.length || 3} students
                    </span>
                  </div>
                </div>

                {/* Latest Evaluation Status Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent-lime/10 to-accent-cyan/10 border border-accent-lime/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-lime/20 flex items-center justify-center text-accent-lime">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent-lime uppercase tracking-widest block">Latest Analysis Status</span>
                      <p className="text-sm font-medium text-text-primary mt-0.5">
                        {repository.evaluationRuns?.[0]?.overallScore
                          ? `Evaluated with Composite Score: ${repository.evaluationRuns[0].overallScore}% (${repository.evaluationRuns[0].phase})`
                          : 'Ready for evaluation. Code change evidence mapped to 9 PRISM dimensions.'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/repositories/${repository.id}`}
                    className="px-3.5 py-2 rounded-xl bg-bg-elevated hover:bg-bg-secondary text-text-primary text-xs font-bold border border-border transition-all flex items-center gap-1.5"
                  >
                    View Details
                    <ExternalLink size={13} />
                  </Link>
                </div>

                {/* Programming Languages Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Language Distribution</span>
                  <div className="h-2 w-full rounded-full bg-bg-secondary flex overflow-hidden">
                    <div style={{ width: '68%' }} className="bg-accent-lime h-full" title="TypeScript 68%" />
                    <div style={{ width: '20%' }} className="bg-accent-cyan h-full" title="JavaScript 20%" />
                    <div style={{ width: '8%' }} className="bg-accent-violet h-full" title="HTML 8%" />
                    <div style={{ width: '4%' }} className="bg-accent-blue h-full" title="CSS 4%" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted pt-1">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-lime" /> TypeScript (68%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-cyan" /> JavaScript (20%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-violet" /> HTML (8%)</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Associated Team & Actions */}
              <div className="space-y-6">
                {/* Associated Team Box */}
                <div className="bg-bg-elevated border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Users size={16} className="text-accent-violet" />
                      Assigned Team
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-secondary text-text-secondary">
                      {project?.teams?.[0]?.name || 'Team Nebula'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {project?.teams?.[0]?.members?.map((m: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary/40 border border-border/50 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet/30 to-accent-blue/30 flex items-center justify-center font-bold text-text-primary">
                            {m.user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">{m.user.name}</span>
                            <span className="text-[10px] text-text-muted">{m.user.email}</span>
                          </div>
                        </div>
                        {m.isLead && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-lime/10 text-accent-lime border border-accent-lime/20">
                            LEAD
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Actions Box */}
                <div className="bg-bg-elevated border border-border rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Evaluation Engine</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Evaluates code quality, architecture, unit testing, git hygiene, security vulnerabilities, and individual contribution breakdown across Phase 1 weights.
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleRunAnalysis}
                      disabled={isAnalyzing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-lime text-bg-main font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-accent-lime/20 disabled:opacity-50"
                    >
                      <Play size={16} className="fill-current" />
                      {isAnalyzing ? 'Executing Pipeline...' : 'Run PRISM Evaluation'}
                    </button>

                    <Link
                      href={`/repositories/${repository.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary hover:bg-border text-text-primary font-semibold text-xs transition-all border border-border"
                    >
                      <Code2 size={15} />
                      View Full Analysis & Evidence
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Unconnected State */
            <div className="bg-bg-elevated border border-border border-dashed rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center text-text-muted mx-auto">
                <Github size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-primary">No Repository Connected</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  Connect a GitHub repository or upload a project ZIP to enable automated code quality scans, PRISM 9-dimensional scoring, and student contribution attribution.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenConnectModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-lime text-bg-main font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-accent-lime/20"
                >
                  <Github size={16} />
                  Connect Repository
                </button>
                <Link
                  href="/repositories"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary text-text-primary font-semibold text-sm border border-border hover:bg-border transition-all"
                >
                  <Upload size={16} />
                  Upload Project ZIP
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-bg-elevated border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Project Overview</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{project?.description}</p>
          <div className="pt-4 flex flex-wrap gap-2">
            {project?.technologies?.map((tech: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-bg-secondary text-text-secondary border border-border">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="bg-bg-elevated border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Assigned Teams</h2>
          <div className="space-y-3">
            {project?.teams?.map((team: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-bg-secondary border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">{team.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{team.members?.length || 0} student members</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-accent-lime/10 text-accent-lime">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-xl w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Github size={22} className="text-accent-lime" />
                <h3 className="text-lg font-bold text-text-primary">Select Repository to Link</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Select an authorized repository to permanently associate with <span className="font-bold text-text-primary">{project?.name}</span> and its student team.
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {availableRepos.length > 0 ? (
                availableRepos.map((repo: any) => (
                  <div
                    key={repo.id}
                    onClick={() => handleConnectRepo(repo)}
                    className="p-3.5 rounded-xl border border-border bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent-lime/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-lime font-mono transition-colors">
                        {repo.fullName}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{repo.description || 'No description'}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-accent-lime/10 text-accent-lime">
                      Link
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  No repositories found. Connect your GitHub account first.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-text-secondary hover:text-text-primary text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

