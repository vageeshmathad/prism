'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UserItem {
  id: string
  name: string
  email: string
  role: 'FACULTY' | 'STUDENT' | 'EVALUATOR' | 'ADMIN'
  team?: string
  status: 'ACTIVE' | 'INVITED'
}

const INITIAL_USERS: UserItem[] = [
  { id: 'u-1', name: 'Dr. Faculty Coordinator', email: 'faculty@cse.iitb.ac.in', role: 'FACULTY', status: 'ACTIVE' },
  { id: 'u-2', name: 'Sarah Chen', email: 'schen@mit-tech.edu', role: 'STUDENT', team: 'Team Nebula', status: 'ACTIVE' },
  { id: 'u-3', name: 'David Kim', email: 'dkim@mit-tech.edu', role: 'STUDENT', team: 'Team Nebula', status: 'ACTIVE' },
  { id: 'u-4', name: 'Priya Patel', email: 'ppatel@mit-tech.edu', role: 'STUDENT', team: 'Team Nebula', status: 'ACTIVE' },
  { id: 'u-5', name: 'Dr. Evaluator Panel', email: 'evaluator1@iitb.ac.in', role: 'EVALUATOR', status: 'ACTIVE' },
  { id: 'u-6', name: 'Ananya Roy', email: 'ananya@mit-tech.edu', role: 'STUDENT', team: 'Team Aurora', status: 'ACTIVE' },
  { id: 'u-7', name: 'Rahul Sharma', email: 'rsharma@mit-tech.edu', role: 'STUDENT', team: 'Team Pulsar', status: 'ACTIVE' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'FACULTY' | 'STUDENT' | 'EVALUATOR'>('ALL')
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchesRole && matchesSearch
  })

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              User Directory & Roles
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Faculty coordinators, student contributors, and academic examiners
          </p>
        </div>

        <button
          onClick={() => toast.success('Invite link copied to clipboard!')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs self-start sm:self-auto"
        >
          <UserPlus size={13} />
          <span>Invite User</span>
        </button>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex rounded-md p-0.5 bg-slate-100 text-xs font-mono">
          {(['ALL', 'STUDENT', 'FACULTY', 'EVALUATOR'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                roleFilter === r ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── Users Table ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg shadow-subtle overflow-hidden">
        <table className="w-full text-xs text-left font-mono">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-medium uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-4 font-medium">User</th>
              <th className="py-2.5 px-4 font-medium">Role</th>
              <th className="py-2.5 px-4 font-medium">Cohort / Team</th>
              <th className="py-2.5 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 font-sans block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 block">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      u.role === 'FACULTY'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : u.role === 'STUDENT'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-600">
                  {u.team || '—'}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 size={11} /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
