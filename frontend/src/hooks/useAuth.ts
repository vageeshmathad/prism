'use client'

import { useCurrentUser } from './useCurrentUser'
import { UserRole } from '@/types'

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  INSTITUTION_ADMIN: [
    'projects.create', 'projects.edit', 'projects.delete', 'projects.view',
    'teams.view', 'teams.manage',
    'evaluations.view', 'evaluations.create',
    'users.view', 'users.manage',
    'security.view',
    'reports.view', 'reports.export',
  ],
  FACULTY: [
    'projects.view', 'projects.create',
    'teams.view',
    'evaluations.view', 'evaluations.create',
    'security.view',
    'reports.view',
  ],
  EVALUATOR: [
    'projects.view',
    'teams.view',
    'evaluations.view', 'evaluations.create', 'evaluations.complete',
    'security.view',
  ],
  STUDENT: [
    'projects.view',
    'teams.view',
    'evaluations.view',
  ],
}

export function useAuth() {
  const { data: user, isLoading, error } = useCurrentUser()

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    const perms = ROLE_PERMISSIONS[user.role] ?? []
    return perms.includes('*') || perms.includes(permission)
  }

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'INSTITUTION_ADMIN'
  const isFaculty = user?.role === 'FACULTY'
  const isStudent = user?.role === 'STUDENT'
  const isEvaluator = user?.role === 'EVALUATOR'

  return {
    user,
    role: user?.role,
    isLoading,
    error,
    hasPermission,
    hasRole,
    isAdmin,
    isFaculty,
    isStudent,
    isEvaluator,
    isAuthenticated: !!user,
  }
}
