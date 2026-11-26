'use client'

import React from 'react'
import { Github, Sparkles, X, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ConnectGitHubModalProps {
  isOpen: boolean
  onClose: () => void
  onInitiateOAuth: () => void
  onConnectDemo: () => void
}

export const ConnectGitHubModal: React.FC<ConnectGitHubModalProps> = ({
  isOpen,
  onClose,
  onInitiateOAuth,
  onConnectDemo,
}) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg max-w-md w-full p-5 space-y-4 shadow-lifted"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-bold text-primary-text flex items-center gap-2 font-mono">
            <Github size={16} />
            Connect GitHub Account
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-text hover:text-primary-text p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-secondary-text leading-relaxed font-mono">
          Authorize PRISM to read authorized public and private student repositories, commit
          histories, and pull requests to calculate deterministic contribution scores and rubric
          compliance.
        </p>

        <div className="space-y-2 pt-1 font-mono">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onInitiateOAuth}
            className="w-full flex items-center justify-center gap-2 font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Github size={14} />
            Authorize via GitHub OAuth
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onConnectDemo}
            className="w-full flex items-center justify-center gap-2 font-semibold text-xs border-primary-border bg-primary-subtle text-primary hover:bg-primary-subtle/80"
          >
            <Sparkles size={14} />
            Connect in Demo Sandbox Mode
          </Button>
        </div>
      </div>
    </div>
  )
}
