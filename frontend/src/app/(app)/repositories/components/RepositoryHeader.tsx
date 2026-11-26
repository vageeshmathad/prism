'use client'

import React from 'react'
import { Github, GitBranch, Upload, Trash2, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { GitHubStatus } from './types'

interface RepositoryHeaderProps {
  totalCount: number
  githubStatus: GitHubStatus | null
  onOpenConnectModal: () => void
  onDisconnectAccount: () => void
  onOpenImportModal: () => void
  onOpenZipModal: () => void
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  totalCount,
  githubStatus,
  onOpenConnectModal,
  onDisconnectAccount,
  onOpenImportModal,
  onOpenZipModal,
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Scope */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-lg font-bold text-primary-text tracking-tight font-sans">
            Repository Registry
          </h1>
          <Badge variant="primary" size="sm">
            {totalCount} Connected
          </Badge>
        </div>
        <p className="text-xs text-secondary-text font-mono mt-1">
          Synchronize GitHub repositories, ingest ZIP archives, and inspect automated code quality evaluations
        </p>
      </div>

      {/* GitHub Account Pill & Main Actions */}
      <div className="flex items-center gap-2 flex-wrap self-start md:self-auto shrink-0">
        {githubStatus?.connected ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-secondary border border-border text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-primary-text font-medium">@{githubStatus.account?.login}</span>
            <button
              type="button"
              onClick={onDisconnectAccount}
              className="ml-1 text-muted-text hover:text-danger-text transition-colors p-0.5 rounded"
              title="Disconnect GitHub Account"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenConnectModal}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <Github size={13} />
            <span>Connect GitHub</span>
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 font-semibold text-xs shadow-2xs"
        >
          <GitBranch size={13} />
          <span>Import Repository</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenZipModal}
          className="flex items-center gap-1.5 font-mono text-xs"
        >
          <Upload size={13} />
          <span>Upload ZIP</span>
        </Button>
      </div>
    </div>
  )
}
