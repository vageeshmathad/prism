'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FolderGit2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import {
  RepositoryItem,
  GitHubStatus,
  ProjectItem,
  ViewMode,
  SortField,
  RepositoryHeader,
  RepositorySummaryStats,
  RepositoryFilters,
  RepositoryTableView,
  RepositoryCardView,
  ConnectGitHubModal,
  ImportRepositoryModal,
  UploadZipModal,
} from './components'

export default function RepositoriesDashboardPage() {
  const router = useRouter()

  // Primary Data State
  const [connectedRepos, setConnectedRepos] = useState<RepositoryItem[]>([])
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null)
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null)

  // Filters, Search, Sort & View Mode
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortOption, setSortOption] = useState<SortField>('updated')
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Modals Visibility
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showZipModal, setShowZipModal] = useState(false)

  // Import Repo Modal State
  const [availableRepos, setAvailableRepos] = useState<any[]>([])
  const [importVisibility, setImportVisibility] = useState('all')
  const [isFetchingAvailable, setIsFetchingAvailable] = useState(false)
  const [selectedRepoToImport, setSelectedRepoToImport] = useState<any>(null)
  const [targetProjectId, setTargetProjectId] = useState('')

  // ZIP Upload State
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [zipProjectName, setZipProjectName] = useState('')
  const [zipTargetProjectId, setZipTargetProjectId] = useState('')
  const [isUploadingZip, setIsUploadingZip] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch GitHub connection status
      const statusRes = await api.get('/github/status').catch(() => null)
      if (statusRes?.data?.data) {
        setGithubStatus(statusRes.data.data)
      } else {
        setGithubStatus({ isConfigured: false, connected: false, account: null })
      }

      // 2. Fetch Projects for linking
      const projRes: any = await api.get('/projects').catch(() => null)
      if (projRes?.data?.data && projRes.data.data.length > 0) {
        setProjectsList(projRes.data.data)
        setTargetProjectId(projRes.data.data[0].id)
        setZipTargetProjectId(projRes.data.data[0].id)
      } else {
        setProjectsList([])
      }

      // 3. Fetch connected repositories
      const reposRes = await api.get('/github/repositories/connected').catch(() => null)
      if (reposRes?.data?.data && reposRes.data.data.length > 0) {
        setConnectedRepos(reposRes.data.data)
      } else {
        setConnectedRepos([])
      }
    } catch {
      setConnectedRepos([])
    } finally {
      setIsLoading(false)
    }
  }

  // --- Connect Account Handlers ---
  const handleInitiateOAuth = async () => {
    try {
      const res = await api.get('/github/auth/url')
      if (res.data?.url) {
        window.location.href = res.data.url
      } else {
        toast('GitHub credentials not configured. You can use Demo Sandbox Mode.', { icon: 'ℹ️' })
      }
    } catch {
      toast.error('Failed to initiate authorization')
    }
  }

  const handleConnectDemo = async () => {
    try {
      const res = await api.post('/github/auth/callback', { isDemoMode: true })
      toast.success(res.data?.data?.message || 'Connected GitHub in Demo Mode')
      setShowConnectModal(false)
      await loadDashboardData()
    } catch {
      toast.error('Failed to connect demo account')
    }
  }

  const handleDisconnectAccount = async () => {
    if (!confirm('Are you sure you want to disconnect this GitHub account?')) return
    try {
      await api.post('/github/disconnect')
      toast.success('GitHub account disconnected')
      await loadDashboardData()
    } catch {
      toast.error('Failed to disconnect account')
    }
  }

  // --- Import Modal Handlers ---
  const handleOpenImportModal = async () => {
    setShowImportModal(true)
    setIsFetchingAvailable(true)
    try {
      const res = await api.get(`/github/repositories?visibility=${importVisibility}`)
      if (res.data?.data) {
        setAvailableRepos(res.data.data)
      }
    } catch {
      toast.error('Failed to fetch available repositories')
    } finally {
      setIsFetchingAvailable(false)
    }
  }

  const handleExecuteImport = async () => {
    if (!selectedRepoToImport) {
      toast.error('Please select a repository to import')
      return
    }

    try {
      await api.post('/github/repositories/import', {
        githubRepoId: selectedRepoToImport.githubRepoId || selectedRepoToImport.id,
        projectId: targetProjectId,
      })
      toast.success(`Imported ${selectedRepoToImport.fullName}`)
      setShowImportModal(false)
      setSelectedRepoToImport(null)
      await loadDashboardData()
    } catch {
      toast.error('Failed to import repository')
    }
  }

  // --- ZIP Upload Handlers ---
  const handleZipFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast.error('Please upload a valid .zip archive')
        return
      }
      setZipFile(file)
      if (!zipProjectName) {
        setZipProjectName(file.name.replace(/\.zip$/i, ''))
      }
    }
  }

  const handleUploadZip = async () => {
    if (!zipFile) {
      toast.error('Please select a ZIP file to upload')
      return
    }

    setIsUploadingZip(true)
    const formData = new FormData()
    formData.append('file', zipFile)
    formData.append('projectName', zipProjectName)
    formData.append('projectId', zipTargetProjectId)

    try {
      await api.post('/github/repositories/upload-zip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('ZIP archive uploaded and analyzed!')
      setShowZipModal(false)
      setZipFile(null)
      setZipProjectName('')
      await loadDashboardData()
    } catch {
      toast.error('Failed to upload ZIP')
    } finally {
      setIsUploadingZip(false)
    }
  }

  // --- Run Scan Handler ---
  const handleAnalyzeRepo = async (repoId: string) => {
    setIsAnalyzing(repoId)
    try {
      await api.post('/evaluations/run', {
        repositoryId: repoId,
        phase: 'PHASE_1',
      })
      toast.success('Evaluation completed!')
      await loadDashboardData()
      router.push(`/repositories/${repoId}`)
    } catch {
      toast.error('Analysis failed to run')
    } finally {
      setIsAnalyzing(null)
    }
  }

  // Auto-extract available languages from existing dataset
  const availableLanguages = useMemo(() => {
    const set = new Set<string>()
    connectedRepos.forEach((r) => {
      if (r.language) set.add(r.language)
    })
    return Array.from(set)
  }, [connectedRepos])

  // Filter & Sort Logic
  const filteredAndSortedRepos = useMemo(() => {
    const result = connectedRepos.filter((repo) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        repo.fullName.toLowerCase().includes(q) ||
        repo.project?.name?.toLowerCase().includes(q) ||
        repo.metadata?.teamName?.toLowerCase().includes(q)

      const matchesLang =
        selectedLanguage === 'ALL' ||
        repo.language?.toLowerCase() === selectedLanguage.toLowerCase()

      const hasEvaluation = repo.evaluationRuns && repo.evaluationRuns.length > 0
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'EVALUATED' && hasEvaluation) ||
        (selectedStatus === 'PENDING' && !hasEvaluation)

      return matchesSearch && matchesLang && matchesStatus
    })

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return a.fullName.localeCompare(b.fullName)
      }
      if (sortOption === 'score') {
        const scoreA = a.evaluationRuns?.[0]?.overallScore ?? 0
        const scoreB = b.evaluationRuns?.[0]?.overallScore ?? 0
        return scoreB - scoreA
      }
      if (sortOption === 'commits') {
        const commitsA = a._count?.commits ?? 0
        const commitsB = b._count?.commits ?? 0
        return commitsB - commitsA
      }
      // default: updated
      const timeA = a.lastSyncedAt ? new Date(a.lastSyncedAt).getTime() : 0
      const timeB = b.lastSyncedAt ? new Date(b.lastSyncedAt).getTime() : 0
      return timeB - timeA
    })

    return result
  }, [connectedRepos, searchQuery, selectedLanguage, selectedStatus, sortOption])

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── SECTION 1: REPOSITORY HEADER & ACTION HUB ──────────────────── */}
      <RepositoryHeader
        totalCount={connectedRepos.length}
        githubStatus={githubStatus}
        onOpenConnectModal={() => setShowConnectModal(true)}
        onDisconnectAccount={handleDisconnectAccount}
        onOpenImportModal={handleOpenImportModal}
        onOpenZipModal={() => setShowZipModal(true)}
      />

      {/* ── SECTION 2: REPOSITORY REGISTRY SUMMARY STATS ───────────────── */}
      <RepositorySummaryStats repos={connectedRepos} />

      {/* ── SECTION 3: SEARCH, FILTER, SORT & VIEW SWITCHER ────────────── */}
      <RepositoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        availableLanguages={availableLanguages}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortOption={sortOption}
        setSortOption={setSortOption}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalFiltered={filteredAndSortedRepos.length}
        totalAll={connectedRepos.length}
        onClearFilters={() => {
          setSearchQuery('')
          setSelectedLanguage('ALL')
          setSelectedStatus('ALL')
        }}
      />

      {/* ── SECTION 4: REPOSITORY PRESENTATION (TABLE OR GRID) ─────────── */}
      {isLoading ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-2">
          <RefreshCw size={24} className="animate-spin text-primary mx-auto" />
          <span className="text-xs font-mono text-muted-text block">
            Loading repository registry...
          </span>
        </div>
      ) : filteredAndSortedRepos.length > 0 ? (
        viewMode === 'table' ? (
          <RepositoryTableView
            repos={filteredAndSortedRepos}
            isAnalyzing={isAnalyzing}
            onAnalyzeRepo={handleAnalyzeRepo}
          />
        ) : (
          <RepositoryCardView
            repos={filteredAndSortedRepos}
            isAnalyzing={isAnalyzing}
            onAnalyzeRepo={handleAnalyzeRepo}
          />
        )
      ) : (
        <div className="bg-surface border border-border rounded-xl p-10 sm:p-14 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <FolderGit2 size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-primary-text">
              No repositories connected
            </h3>
            <p className="text-xs text-secondary-text max-w-sm mx-auto">
              Connect your GitHub repository to begin tracking and evaluation.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Connect Repository</span>
            </button>
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-border hover:bg-surface-secondary text-primary-text text-xs font-medium transition-colors no-underline"
            >
              <span>URL Onboarding</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── MODALS ─────────────────────────────────────────────────────── */}
      <ConnectGitHubModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onInitiateOAuth={handleInitiateOAuth}
        onConnectDemo={handleConnectDemo}
      />

      <ImportRepositoryModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        projectsList={projectsList}
        targetProjectId={targetProjectId}
        setTargetProjectId={setTargetProjectId}
        availableRepos={availableRepos}
        isFetchingAvailable={isFetchingAvailable}
        selectedRepoToImport={selectedRepoToImport}
        setSelectedRepoToImport={setSelectedRepoToImport}
        onExecuteImport={handleExecuteImport}
      />

      <UploadZipModal
        isOpen={showZipModal}
        onClose={() => setShowZipModal(false)}
        projectsList={projectsList}
        zipTargetProjectId={zipTargetProjectId}
        setZipTargetProjectId={setZipTargetProjectId}
        zipFile={zipFile}
        onZipFileSelected={handleZipFileSelected}
        isUploadingZip={isUploadingZip}
        onUploadZip={handleUploadZip}
        fileInputRef={fileInputRef}
      />
    </div>
  )
}
