'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type AcademicRole = 'STUDENT' | 'MENTOR' | 'EXAMINER' | 'COORDINATOR'

export interface RoleProfile {
  role: AcademicRole
  label: string
  name: string
  email: string
  title: string
  initials: string
  badgeColor: string
  defaultRoute: string
}

export const ROLE_PROFILES: Record<AcademicRole, RoleProfile> = {
  STUDENT: {
    role: 'STUDENT',
    label: 'Student',
    name: 'Student',
    email: '',
    title: 'Student Workspace',
    initials: 'ST',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    defaultRoute: '/student',
  },
  MENTOR: {
    role: 'MENTOR',
    label: 'Internal Mentor',
    name: 'Faculty Mentor',
    email: '',
    title: 'Project Mentorship',
    initials: 'FM',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultRoute: '/mentor',
  },
  EXAMINER: {
    role: 'EXAMINER',
    label: 'Viva Examiner',
    name: 'Viva Examiner',
    email: '',
    title: 'Examination Board',
    initials: 'VE',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    defaultRoute: '/evaluator',
  },
  COORDINATOR: {
    role: 'COORDINATOR',
    label: 'Coordinator',
    name: 'Department Coordinator',
    email: '',
    title: 'Project Coordinator',
    initials: 'DC',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultRoute: '/dashboard',
  },
}

interface RoleContextType {
  activeRole: AcademicRole
  profile: RoleProfile
  switchRole: (role: AcademicRole) => void
}

const RoleContext = createContext<RoleContextType>({
  activeRole: 'STUDENT',
  profile: ROLE_PROFILES.STUDENT,
  switchRole: () => {},
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<AcademicRole>('STUDENT')
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('prism_academic_role') as AcademicRole
    if (saved && ROLE_PROFILES[saved]) {
      setActiveRole(saved)
    }
    try {
      const stored = localStorage.getItem('prism_user') || localStorage.getItem('prism_auth_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        const fullName = [parsed.firstName, parsed.lastName].filter(Boolean).join(' ') || parsed.name
        if (fullName || parsed.email) {
          setUserProfile({ name: fullName, email: parsed.email })
        }
      }
    } catch {}
  }, [])

  const switchRole = (role: AcademicRole) => {
    setActiveRole(role)
    localStorage.setItem('prism_academic_role', role)
    const target = ROLE_PROFILES[role].defaultRoute
    router.push(target)
  }

  const baseProfile = ROLE_PROFILES[activeRole]
  const profile = {
    ...baseProfile,
    name: userProfile?.name || baseProfile.name,
    email: userProfile?.email || baseProfile.email,
  }

  return (
    <RoleContext.Provider value={{ activeRole, profile, switchRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useAcademicRole() {
  return useContext(RoleContext)
}
