'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronRight,
  ChevronDown,
  Menu,
  Check,
  Building,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAcademicRole, AcademicRole, ROLE_PROFILES } from '@/context/RoleContext'
import { useSidebar } from '@/context/SidebarContext'

export default function Topbar() {
  const pathname = usePathname()
  const { activeRole, profile, switchRole } = useAcademicRole()
  const { toggleMobile } = useSidebar()
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Click-outside listener to dismiss role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Derive contextual section breadcrumb from current pathname
  const getSectionDetails = () => {
    if (pathname.startsWith('/student')) return { title: 'Repository Dashboard', href: '/student' }
    if (pathname.startsWith('/mentor')) return { title: 'Mentorship Hub', href: '/mentor' }
    if (pathname.startsWith('/evaluator')) return { title: 'Viva Scoring Desk', href: '/evaluator' }
    if (pathname.startsWith('/repositories/')) return { title: 'Code Evidence & AST', href: pathname }
    if (pathname.startsWith('/repositories')) return { title: 'Repositories', href: '/repositories' }
    if (pathname.startsWith('/projects')) return { title: 'Capstone Projects', href: '/projects' }
    if (pathname.startsWith('/evaluations/')) return { title: 'Evaluation Run', href: pathname }
    if (pathname.startsWith('/evaluations')) return { title: 'Evaluations', href: '/evaluations' }
    if (pathname.startsWith('/teams')) return { title: 'Teams & Cohorts', href: '/teams' }
    if (pathname.startsWith('/security')) return { title: 'Security & Integrity', href: '/security' }
    if (pathname.startsWith('/settings')) return { title: 'Platform Configuration', href: '/settings' }
    if (pathname.startsWith('/notifications')) return { title: 'Audit Stream', href: '/notifications' }
    return { title: 'Cohort Observatory', href: '/dashboard' }
  }

  const section = getSectionDetails()

  return (
    <header className="h-[52px] bg-white border-b border-slate-200/90 flex items-center justify-between px-3.5 sm:px-5 gap-3 shrink-0 z-30 select-none">
      {/* ── Left: Mobile Hamburger & Breadcrumbs ─────────────────────────── */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleMobile}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb Navigation Hierarchy */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs truncate">
          <Link
            href="/"
            className="font-semibold text-slate-800 hover:text-blue-600 transition-colors tracking-tight shrink-0"
          >
            PRISM
          </Link>

          <ChevronRight size={13} className="text-slate-400 shrink-0" aria-hidden="true" />

          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 shrink-0">
            <span>AY 2025-26</span>
          </span>

          <ChevronRight size={13} className="hidden sm:block text-slate-400 shrink-0" aria-hidden="true" />

          <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] truncate max-w-[160px] sm:max-w-none">
            {section.title}
          </span>
        </nav>
      </div>

      {/* ── Right: Role Switcher & User Profile ──────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Academic Role Switcher Pill & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-all shadow-2xs cursor-pointer',
              profile.badgeColor,
              showRoleMenu && 'ring-2 ring-blue-500/20 border-blue-400'
            )}
            aria-expanded={showRoleMenu}
            aria-haspopup="true"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <span className="hidden xs:inline">{profile.label}</span>
            <span className="xs:hidden">{profile.label.split(' ')[0]}</span>
            <ChevronDown
              size={12}
              className={cn('opacity-70 transition-transform duration-150', showRoleMenu && 'rotate-180')}
            />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-dropdown p-1.5 space-y-1 z-50 animate-in font-mono text-xs">
              <div className="px-2.5 py-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 mb-1">
                Academic Workspace Persona
              </div>

              {(['STUDENT', 'MENTOR', 'EXAMINER', 'COORDINATOR'] as AcademicRole[]).map((r) => {
                const p = ROLE_PROFILES[r]
                const isActive = activeRole === r

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r)
                      setShowRoleMenu(false)
                    }}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors',
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div>
                      <span className="block font-sans font-semibold text-xs text-slate-900">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {p.name}
                      </span>
                    </div>

                    {isActive && (
                      <Check size={14} className="text-blue-600 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono shadow-2xs">
            {profile.initials}
          </div>
          <div className="text-left hidden md:block leading-tight">
            <span className="text-xs font-semibold text-slate-900 block truncate max-w-[120px] lg:max-w-[150px]">
              {profile.name}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[120px] lg:max-w-[150px]">
              {profile.title}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
