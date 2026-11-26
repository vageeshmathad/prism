'use client'

import React from 'react'
import { Search, X, LayoutGrid, ListFilter, Table as TableIcon } from 'lucide-react'
import { ViewMode, SortField } from './types'

interface RepositoryFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedLanguage: string
  setSelectedLanguage: (lang: string) => void
  availableLanguages: string[]
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  sortOption: SortField
  setSortOption: (sort: SortField) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  totalFiltered: number
  totalAll: number
  onClearFilters: () => void
}

export const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLanguage,
  setSelectedLanguage,
  availableLanguages,
  selectedStatus,
  setSelectedStatus,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  totalFiltered,
  totalAll,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedLanguage !== 'ALL' || selectedStatus !== 'ALL'

  return (
    <div className="bg-surface border border-border rounded-lg p-3.5 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none"
        />
        <input
          type="text"
          placeholder="Filter repositories by name, project, or team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 rounded-md bg-surface-secondary border border-border text-xs font-mono text-primary-text placeholder:text-muted-text focus:outline-none focus:border-primary focus:bg-surface transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-text p-0.5"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter Controls & View Switcher */}
      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-2.5 py-1.5 rounded-md bg-surface-secondary border border-border text-primary-text focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="ALL">All Languages</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Evaluation Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 rounded-md bg-surface-secondary border border-border text-primary-text focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="EVALUATED">Evaluated</option>
          <option value="PENDING">Pending Evaluation</option>
        </select>

        {/* Sort Field */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortField)}
          className="px-2.5 py-1.5 rounded-md bg-surface-secondary border border-border text-primary-text focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="updated">Recently Updated</option>
          <option value="name">Repository Name</option>
          <option value="score">Highest Score</option>
          <option value="commits">Most Commits</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-2 py-1 rounded text-[11px] text-danger-text hover:bg-danger-subtle/50 transition-colors"
          >
            Reset
          </button>
        )}

        <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

        {/* View Mode Switcher (Table vs Grid) */}
        <div className="flex p-0.5 bg-surface-secondary rounded-md border border-border">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-surface text-primary-text shadow-2xs border border-border'
                : 'text-muted-text hover:text-primary-text'
            }`}
            title="Table View"
          >
            <TableIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-surface text-primary-text shadow-2xs border border-border'
                : 'text-muted-text hover:text-primary-text'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
