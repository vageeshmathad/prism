'use client'

import React from 'react'
import {
  Github,
  GitBranch,
  Upload,
  RefreshCw,
  Check,
  Zap,
  Clock,
  Shield,
  FileArchive,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useStudentWorkspace } from '../StudentWorkspaceContext'

export default function StudentRepositoryPage() {
  const {
    submissionType,
    setSubmissionType,
    gitUrl,
    setGitUrl,
    gitBranch,
    setGitBranch,
    selectedZipFile,
    setSelectedZipFile,
    isProcessing,
    currentStep,
    repoDetails,
    handleRunEvaluation,
  } = useStudentWorkspace()

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const repo = repoDetails || {
    fullName: 'No repository connected',
    branch: 'none',
    language: 'N/A',
    lastEvaluatedAt: 'Not evaluated',
  }

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      {/* ── Active Ingested Repository Status ────────────────────────────── */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2 font-sans">
            <Github size={16} className="text-primary-text" />
            <h2 className="text-sm font-bold text-primary-text">Active Connected Repository</h2>
          </div>
          <Badge variant={repoDetails ? 'success' : 'neutral'} size="sm" dot>
            {repoDetails ? 'Inspected' : 'None'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
          <div className="p-3 bg-surface-secondary rounded-md border border-border">
            <span className="text-[10px] text-muted-text uppercase block">Repository</span>
            <span className="font-bold text-primary-text truncate block mt-0.5" title={repo.fullName}>
              {repo.fullName}
            </span>
          </div>

          <div className="p-3 bg-surface-secondary rounded-md border border-border">
            <span className="text-[10px] text-muted-text uppercase block">Default Branch</span>
            <span className="font-bold text-primary-text flex items-center gap-1 mt-0.5">
              <GitBranch size={12} className="text-muted-text" />
              {repo.branch}
            </span>
          </div>

          <div className="p-3 bg-surface-secondary rounded-md border border-border">
            <span className="text-[10px] text-muted-text uppercase block">Primary Language</span>
            <span className="font-bold text-primary-text block mt-0.5">
              {repo.language}
            </span>
          </div>

          <div className="p-3 bg-surface-secondary rounded-md border border-border">
            <span className="text-[10px] text-muted-text uppercase block">Last Inspected</span>
            <span className="font-bold text-primary-text block mt-0.5">
              {repo.lastEvaluatedAt}
            </span>
          </div>
        </div>
      </div>

      {/* ── Repository Submission / Re-scan Panel ───────────────────────── */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle space-y-4">
        <div>
          <h2 className="text-sm font-bold text-primary-text font-sans">
            Repository Submission & Code Ingestion
          </h2>
          <p className="text-xs text-secondary-text font-sans mt-0.5">
            Submit a GitHub repository URL or upload a local ZIP archive to trigger automated rubric evaluation
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-0.5 bg-surface-secondary rounded-md border border-border w-fit font-sans text-xs">
          <button
            type="button"
            onClick={() => setSubmissionType('git')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              submissionType === 'git'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <Github size={13} />
            <span>GitHub Repository URL</span>
          </button>

          <button
            type="button"
            onClick={() => setSubmissionType('zip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              submissionType === 'zip'
                ? 'bg-surface text-primary-text font-bold shadow-2xs border border-border'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <Upload size={13} />
            <span>Upload Project ZIP</span>
          </button>
        </div>

        {/* Git Form */}
        {submissionType === 'git' ? (
          <form onSubmit={handleRunEvaluation} className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-text">
                  <Github size={14} />
                </div>
                <input
                  type="text"
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                  placeholder="https://github.com/organization/repository"
                  className="w-full pl-9 pr-3 py-2 bg-surface-secondary/70 border border-border focus:bg-surface focus:border-primary rounded-md text-primary-text placeholder:text-muted-text font-sans text-xs transition-colors outline-none"
                  disabled={isProcessing}
                />
              </div>

              <div className="w-full sm:w-32 shrink-0">
                <input
                  type="text"
                  value={gitBranch}
                  onChange={(e) => setGitBranch(e.target.value)}
                  placeholder="branch"
                  className="w-full px-3 py-2 bg-surface-secondary/70 border border-border focus:bg-surface focus:border-primary rounded-md text-primary-text placeholder:text-muted-text font-sans text-xs transition-colors outline-none"
                  disabled={isProcessing}
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                variant="primary"
                size="md"
                className="shrink-0 font-semibold text-xs"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Running Inspection...</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} className="fill-white" />
                    <span>Run Inspection</span>
                  </>
                )}
              </Button>
            </div>
            <span className="text-[11px] font-mono text-muted-text block">
              PRISM analyzes commit logs, pull request author attribution, and AST tree structures.
            </span>
          </form>
        ) : (
          <form onSubmit={handleRunEvaluation} className="space-y-3 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedZipFile(e.target.files[0])
                }
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-lg p-6 text-center cursor-pointer transition-colors bg-surface-secondary/40 hover:bg-surface-secondary/70"
            >
              <FileArchive size={28} className="mx-auto text-primary mb-2" />
              {selectedZipFile ? (
                <div className="space-y-1 font-sans">
                  <span className="text-xs font-bold text-primary-text block">{selectedZipFile.name}</span>
                  <span className="text-[11px] text-muted-text block">
                    {(selectedZipFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-text block">
                    Click or drag & drop project .zip archive here
                  </span>
                  <span className="text-[11px] font-mono text-muted-text block">
                    Supports up to 25MB archive files
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isProcessing || !selectedZipFile}
                variant="primary"
                size="md"
                className="font-semibold text-xs"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Extracting & Scanning...</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} className="fill-white" />
                    <span>Extract & Evaluate ZIP</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* 4-Step Inspection Stepper */}
        {isProcessing && (
          <div className="p-3.5 bg-surface-secondary/60 border border-border rounded-md space-y-2.5 animate-in">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="font-semibold text-primary-text flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin text-primary" />
                Executing PRISM Deterministic Code Analysis Pipeline
              </span>
              <span className="text-muted-text">Step {currentStep} of 4</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
              <div
                className={`p-2 rounded flex items-center gap-2 ${
                  currentStep >= 1
                    ? 'bg-surface border border-border text-primary-text font-semibold shadow-2xs'
                    : 'text-muted-text'
                }`}
              >
                <Check size={12} className={currentStep >= 1 ? 'text-success' : 'text-muted-text'} />
                <span>1. Git AST Tree</span>
              </div>
              <div
                className={`p-2 rounded flex items-center gap-2 ${
                  currentStep >= 2
                    ? 'bg-surface border border-border text-primary-text font-semibold shadow-2xs'
                    : 'text-muted-text'
                }`}
              >
                <Check size={12} className={currentStep >= 2 ? 'text-success' : 'text-muted-text'} />
                <span>2. Commit Delta</span>
              </div>
              <div
                className={`p-2 rounded flex items-center gap-2 ${
                  currentStep >= 3
                    ? 'bg-surface border border-border text-primary-text font-semibold shadow-2xs'
                    : 'text-muted-text'
                }`}
              >
                <Check size={12} className={currentStep >= 3 ? 'text-success' : 'text-muted-text'} />
                <span>3. Security Rules</span>
              </div>
              <div
                className={`p-2 rounded flex items-center gap-2 ${
                  currentStep >= 4
                    ? 'bg-surface border border-border text-primary-text font-semibold shadow-2xs'
                    : 'text-muted-text'
                }`}
              >
                <Check size={12} className={currentStep >= 4 ? 'text-success' : 'text-muted-text'} />
                <span>4. Rubric Matrix</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
