'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  ShieldAlert,
  GitPullRequest,
  Sparkles,
  ArrowRight,
  Check,
  Layers,
  Shield,
  Activity,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface NotificationItem {
  id: string
  type: 'EVAL' | 'SEC' | 'PR' | 'SYS'
  title: string
  description: string
  time: string
  unread: boolean
  link?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'EVAL',
    title: 'Evaluation Completed: Team Nebula',
    description: 'Automated 9-dimension analysis completed for Smart Campus IoT. Composite score: 84% (Grade A).',
    time: '12m ago',
    unread: true,
    link: '/student',
  },
  {
    id: 'n-2',
    type: 'SEC',
    title: 'Security Finding Flagged: Team Nebula',
    description: 'Potential placeholder secret pattern detected in .env.example (Rule PRISM-SEC-001).',
    time: '45m ago',
    unread: true,
    link: '/security',
  },
  {
    id: 'n-3',
    type: 'PR',
    title: 'Pull Request Merged: Team Pulsar',
    description: 'PR #6 "feat: add consensus ring buffer" merged into main by Rahul Sharma.',
    time: '2h ago',
    unread: false,
    link: '/repositories',
  },
  {
    id: 'n-4',
    type: 'EVAL',
    title: 'Evaluation Completed: Team Pulsar',
    description: 'ZIP submission evaluated across all 9 dimensions. Composite score: 89% (Grade A).',
    time: '2h ago',
    unread: false,
    link: '/repositories',
  },
  {
    id: 'n-5',
    type: 'SYS',
    title: 'Academic Milestone: Phase 2 Active',
    description: 'Phase 2 evaluation window is now open. Test coverage weight increased to 20%.',
    time: '1d ago',
    unread: false,
    link: '/settings',
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast.success('All notifications marked as read')
  }

  const filtered = filter === 'ALL'
    ? notifications
    : notifications.filter((n) => n.unread)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EVAL':
        return <Activity size={14} className="text-blue-600" />
      case 'SEC':
        return <Shield size={14} className="text-amber-600" />
      case 'PR':
        return <GitPullRequest size={14} className="text-indigo-600" />
      default:
        return <Layers size={14} className="text-slate-600" />
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Audit Stream & Alerts
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {unreadCount} Unread
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Audit events, automated evaluation notifications, and static analysis security alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors self-start sm:self-auto"
          >
            <Check size={13} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* ── Filter Segment (Linear Style) ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-md border border-slate-200/70 w-fit text-xs font-mono">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            filter === 'ALL'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Activity ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            filter === 'UNREAD'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* ── Notifications Stream (Linear Activity Log) ──────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-2 shadow-subtle divide-y divide-slate-100">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 flex items-start justify-between gap-3 transition-colors hover:bg-slate-50/70 ${
              item.unread ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {getTypeIcon(item.type)}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  {item.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.description}</p>
                <span className="text-[10px] font-mono text-slate-400 block pt-0.5">{item.time}</span>
              </div>
            </div>

            {item.link && (
              <Link
                href={item.link}
                className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 pt-1"
              >
                <span>View</span>
                <ArrowRight size={11} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
