'use client'

import React, { useState } from 'react'
import { GitBranch, X, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProjectItem } from './types'

interface ImportRepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  projectsList: ProjectItem[]
  targetProjectId: string
  setTargetProjectId: (id: string) => void
  availableRepos: any[]
  isFetchingAvailable: boolean
  selectedRepoToImport: any
  setSelectedRepoToImport: (repo: any) => void
  onExecuteImport: () => void
}

export const ImportRepositoryModal: React.FC<ImportRepositoryModalProps> = ({
  isOpen,
  onClose,
  projectsList,
  targetProjectId,
  setTargetProjectId,
  availableRepos,
  isFetchingAvailable,
  selectedRepoToImport,
  setSelectedRepoToImport,
  onExecuteImport,
}) => {
  const [filterQuery, setFilterQuery] = useState('')

  if (!isOpen) return null

  const filtered = availableRepos.filter((r) =>
    r.fullName?.toLowerCase().includes(filterQuery.toLowerCase())
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-lifted"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-bold text-primary-text flex items-center gap-2 font-mono">
            <GitBranch size={16} className="text-primary" />
            Import GitHub Repository
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-text hover:text-primary-text p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Selector */}
        <div className="space-y-1.5 font-mono">
          <label className="text-[11px] font-semibold text-muted-text uppercase block">
            Target Project Association
          </label>
          <select
            value={targetProjectId}
            onChange={(e) => setTargetProjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-secondary border border-border text-xs text-primary-text focus:outline-none focus:border-primary cursor-pointer"
          >
            {projectsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search inside available repos */}
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-muted-text uppercase">
              Accessible Repositories
            </label>
            <span className="text-[11px] text-muted-text">
              {availableRepos.length} available
            </span>
          </div>

          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text"
            />
            <input
              type="text"
              placeholder="Filter accessible repositories..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-surface-secondary border border-border text-xs text-primary-text placeholder:text-muted-text focus:outline-none focus:border-primary"
            />
          </div>

          {isFetchingAvailable ? (
            <div className="py-8 text-center text-muted-text text-xs">
              <RefreshCw size={16} className="animate-spin mx-auto mb-1.5 text-primary" />
              Fetching repositories from GitHub...
            </div>
          ) : filtered.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 border border-border rounded-md p-1.5 bg-surface-secondary/40">
              {filtered.map((repo) => {
                const isSelected = selectedRepoToImport?.fullName === repo.fullName
                return (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepoToImport(repo)}
                    className={`p-2.5 rounded-md border text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary-subtle border-primary text-primary font-semibold'
                        : 'bg-surface border-border hover:bg-surface-secondary text-primary-text'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{repo.fullName}</span>
                      <span className="text-[10px] text-muted-text block">
                        {repo.description || 'No description'}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary border border-border shrink-0">
                      {repo.language || 'Code'}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-muted-text text-xs border border-dashed border-border rounded-md">
              No repositories found matching query. Ensure your account is connected.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle font-mono">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onExecuteImport}
            disabled={!selectedRepoToImport}
            className="font-semibold"
          >
            Import & Sync
          </Button>
        </div>
      </div>
    </div>
  )
}
