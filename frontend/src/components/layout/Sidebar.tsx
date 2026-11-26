'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  Github,
  FolderKanban,
  Users,
  GitPullRequest,
  Shield,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Award,
  X,
  Sliders,
  FileCode,
  BookOpen,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAcademicRole, AcademicRole } from '@/context/RoleContext'
import { useSidebar } from '@/context/SidebarContext'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  badgeColor?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const ROLE_NAV: Record<AcademicRole, NavSection[]> = {
  STUDENT: [
    {
      title: 'Workspace',
      items: [
        {
          label: 'Overview',
          href: '/student',
          icon: LayoutDashboard,
        },
        {
          label: 'My Repositories',
          href: '/repositories',
          icon: FolderKanban,
        },
        {
          label: 'Evaluation',
          href: '/student/evaluation',
          icon: Sliders,
        },
        {
          label: 'Code Evidence',
          href: '/student/evidence',
          icon: FileCode,
        },
        {
          label: 'Contribution',
          href: '/student/contribution',
          icon: Users,
        },
        {
          label: 'Viva Preparation',
          href: '/student/viva',
          icon: BookOpen,
        },
      ],
    },
  ],
  MENTOR: [
    {
      title: 'Project Mentorship',
      items: [
        {
          label: 'Mentorship Hub',
          href: '/mentor',
          icon: Users,
          badge: '3 Teams',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          label: 'Assigned Repositories',
          href: '/repositories',
          icon: Github,
        },
        {
          label: 'Cohort Rosters',
          href: '/teams',
          icon: FolderKanban,
        },
      ],
    },
  ],
  EXAMINER: [
    {
      title: 'Examination Board',
      items: [
        {
          label: 'Viva Scoring Desk',
          href: '/evaluator',
          icon: Award,
          badge: 'Live',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        },
        {
          label: 'Candidate Evaluations',
          href: '/evaluations',
          icon: GitPullRequest,
        },
        {
          label: 'Security & CVEs',
          href: '/security',
          icon: Shield,
        },
      ],
    },
  ],
  COORDINATOR: [
    {
      title: 'Cohort Observatory',
      items: [
        { label: 'Department Analytics', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Capstone Projects', href: '/projects', icon: FolderKanban },
        { label: 'Teams & Cohorts', href: '/teams', icon: Users },
        { label: 'Evaluations', href: '/evaluations', icon: GitPullRequest },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Rubrics & Settings', href: '/settings', icon: Settings },
        { label: 'Audit Stream', href: '/notifications', icon: Bell },
      ],
    },
  ],
}

export default function Sidebar() {
  const pathname = usePathname()
  const { activeRole, profile } = useAcademicRole()
  const { collapsed, toggleCollapsed, isMobileOpen, closeMobile } = useSidebar()

  const navSections = ROLE_NAV[activeRole] || ROLE_NAV.STUDENT

  // Shared navigation items renderer
  const renderNav = (isDrawer = false) => {
    const isCompact = collapsed && !isDrawer

    return (
      <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto no-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCompact && (
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 tracking-wider uppercase font-sans">
                {section.title}
              </div>
            )}
            <nav className="space-y-0.5">
              {section.items.map(({ label, href, icon: Icon, badge, badgeColor }) => {
                const active =
                  href === '/student'
                    ? pathname === '/student'
                    : pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => {
                      if (isDrawer) closeMobile()
                    }}
                    title={isCompact ? label : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md text-xs font-medium transition-colors relative group select-none no-underline',
                      isCompact ? 'justify-center p-2' : 'px-2.5 py-1.5',
                      active
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {active && (
                      <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-600 rounded-r-full" />
                    )}

                    <Icon
                      size={16}
                      className={cn(
                        'shrink-0 transition-colors',
                        active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                      )}
                    />

                    {!isCompact && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{label}</span>
                        {badge && (
                          <span
                            className={cn(
                              'text-[9px] px-1.5 py-0.2 rounded font-semibold font-mono border',
                              badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                            )}
                          >
                            {badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Compact Tooltip Preview on Hover */}
                    {isCompact && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-sans font-medium rounded shadow-dropdown whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {label}
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    )
  }

  // Branding Section
  const renderBranding = (isDrawer = false) => {
    const isCompact = collapsed && !isDrawer

    return (
      <div className="p-3 border-b border-slate-200/80">
        <div className="flex items-center justify-between p-1.5 rounded-md">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 text-left no-underline"
            onClick={() => {
              if (isDrawer) closeMobile()
            }}
          >
            {/* PRISM Brand Mark */}
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs font-sans">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-400"
              >
                <polygon
                  points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>

            {!isCompact && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 tracking-tight block truncate font-sans">
                    PRISM
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/70">
                    v2.4
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate block font-sans">
                  {profile.label} Workspace
                </span>
              </div>
            )}
          </Link>

          {isDrawer && (
            <button
              type="button"
              onClick={closeMobile}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Bottom Persona & Collapse Strip
  const renderFooter = (isDrawer = false) => {
    const isCompact = collapsed && !isDrawer

    return (
      <div className="p-2.5 border-t border-slate-200/80 space-y-1">
        {/* User Card */}
        <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-50/70 border border-slate-200/60">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-sans">
              {profile.initials}
            </div>
            {!isCompact && (
              <div className="min-w-0 leading-tight">
                <span className="text-xs font-semibold text-slate-900 block truncate font-sans">
                  {profile.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-sans">
                  {profile.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        {!isDrawer && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors text-[11px]"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={14}
              className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
            />
            {!collapsed && <span className="font-sans text-[11px]">Collapse</span>}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* ── 1. Desktop Sidebar (Static Layout) ─────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 shrink-0 select-none z-20',
          collapsed ? 'w-[64px]' : 'w-[240px]'
        )}
      >
        {renderBranding(false)}
        {renderNav(false)}
        {renderFooter(false)}
      </aside>

      {/* ── 2. Mobile Drawer & Backdrop Overlay ────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div className="relative w-[260px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in">
            {renderBranding(true)}
            {renderNav(true)}
            {renderFooter(true)}
          </div>
        </div>
      )}
    </>
  )
}
