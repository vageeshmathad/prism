'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderGit2,
  Sliders,
  FileCode,
  Users,
  BookOpen,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabItem {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

const TABS: TabItem[] = [
  { label: 'Overview', href: '/student', icon: LayoutDashboard, exact: true },
  { label: 'Repository', href: '/student/repository', icon: FolderGit2 },
  { label: 'Evaluation', href: '/student/evaluation', icon: Sliders },
  { label: 'Technical Evidence', href: '/student/evidence', icon: FileCode },
  { label: 'Contribution', href: '/student/contribution', icon: Users },
  { label: 'Viva Preparation', href: '/student/viva', icon: BookOpen },
]

export const StudentWorkspaceNav: React.FC = () => {
  const pathname = usePathname()

  return (
    <div className="border-b border-border bg-surface px-4 sm:px-6 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6">
      <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2" aria-label="Student Workspace Tabs">
        {TABS.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-xs font-sans font-medium transition-colors whitespace-nowrap select-none no-underline',
                isActive
                  ? 'bg-primary-subtle text-primary border border-primary-border shadow-2xs font-semibold'
                  : 'text-secondary-text hover:text-primary-text hover:bg-surface-secondary/70'
              )}
            >
              <Icon size={14} className={isActive ? 'text-primary' : 'text-muted-text'} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
