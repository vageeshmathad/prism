'use client'

import React from 'react'
import { Upload, X, RefreshCw, FileArchive } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProjectItem } from './types'

interface UploadZipModalProps {
  isOpen: boolean
  onClose: () => void
  projectsList: ProjectItem[]
  zipTargetProjectId: string
  setZipTargetProjectId: (id: string) => void
  zipFile: File | null
  onZipFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploadingZip: boolean
  onUploadZip: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export const UploadZipModal: React.FC<UploadZipModalProps> = ({
  isOpen,
  onClose,
  projectsList,
  zipTargetProjectId,
  setZipTargetProjectId,
  zipFile,
  onZipFileSelected,
  isUploadingZip,
  onUploadZip,
  fileInputRef,
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
        className="bg-surface border border-border rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-lifted"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-bold text-primary-text flex items-center gap-2 font-mono">
            <Upload size={16} className="text-primary" />
            Upload Project Archive (.ZIP)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-text hover:text-primary-text p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Association */}
        <div className="space-y-1.5 font-mono">
          <label className="text-[11px] font-semibold text-muted-text uppercase block">
            Associate with Project
          </label>
          <select
            value={zipTargetProjectId}
            onChange={(e) => setZipTargetProjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-secondary border border-border text-xs text-primary-text focus:outline-none focus:border-primary cursor-pointer"
          >
            {projectsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Drag & Drop File Surface */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary rounded-lg p-6 text-center cursor-pointer transition-colors bg-surface-secondary/40 hover:bg-surface-secondary/70"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".zip"
            onChange={onZipFileSelected}
            className="hidden"
          />
          <FileArchive size={28} className="mx-auto text-primary mb-2" />
          {zipFile ? (
            <div className="font-mono text-xs space-y-0.5">
              <span className="font-bold text-primary-text block">{zipFile.name}</span>
              <span className="text-[11px] text-muted-text">
                {(zipFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload & evaluate
              </span>
            </div>
          ) : (
            <div className="text-xs space-y-1">
              <span className="font-semibold text-primary-text block">
                Click or drag & drop a .zip archive
              </span>
              <span className="text-[11px] font-mono text-muted-text block">
                Deterministic sandbox AST analysis up to 25MB
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle font-mono">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!zipFile || isUploadingZip}
            onClick={onUploadZip}
            className="font-semibold flex items-center gap-1.5"
          >
            {isUploadingZip && <RefreshCw size={12} className="animate-spin" />}
            <span>{isUploadingZip ? 'Extracting...' : 'Upload & Evaluate'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
