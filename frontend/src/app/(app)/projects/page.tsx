'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderKanban,
  Github,
  GitBranch,
  Search,
  ExternalLink,
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/projects').catch(() => null)
      if (res?.data?.data && res.data.data.length > 0) {
        setProjects(res.data.data)
      } else {
        setProjects([
          {
            id: 'proj-1',
            name: 'Smart Campus IoT Telemetry',
            description: 'Autonomous sensor mesh network monitoring energy, environmental quality, and space occupancy across institutional campuses.',
            status: 'ACTIVE',
            technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'React'],
            academicYear: { label: '2025-26' },
            department: { name: 'Computer Science & Engineering', code: 'CSE' },
            institution: { name: 'Indian Institute of Technology Bombay', code: 'IITB' },
            _count: { teams: 1, evaluationRuns: 3 },
            hasRepo: true,
            repoName: 'prism-team-nebula/smart-campus-iot',
          },
          {
            id: 'proj-2',
            name: 'Healthcare Portal Microservices',
            description: 'Patient records & appointment scheduling microservice suite with JWT auth and FHIR validation.',
            status: 'ACTIVE',
            technologies: ['Python', 'FastAPI', 'Redis', 'Docker'],
            academicYear: { label: '2025-26' },
            department: { name: 'Computer Science & Engineering', code: 'CSE' },
            institution: { name: 'Indian Institute of Technology Delhi', code: 'IITD' },
            _count: { teams: 1, evaluationRuns: 2 },
            hasRepo: true,
            repoName: 'prism-team-aurora/healthcare-portal-microservices',
          },
          {
            id: 'proj-3',
            name: 'Distributed Key-Value Engine',
            description: 'High-throughput in-memory key-value store implementing Raft consensus in Java 21.',
            status: 'ACTIVE',
            technologies: ['Java', 'Raft', 'Netty'],
            academicYear: { label: '2025-26' },
            department: { name: 'Information Technology', code: 'IT' },
            institution: { name: 'National Institute of Technology Trichy', code: 'NITT' },
            _count: { teams: 1, evaluationRuns: 1 },
            hasRepo: true,
            repoName: 'zip-uploads/distributed-kv-cache',
          },
        ])
      }
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto space-y-5 animate-in pb-16">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Capstone Projects
            </h1>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {projects.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Institutional project cohort specifications and linked repository workspaces
          </p>
        </div>

        <Link
          href="/repositories"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors shadow-2xs"
        >
          <Github size={13} className="text-slate-700" />
          <span>Connected Repositories</span>
        </Link>
      </div>

      {/* ── Search Input (Linear Style) ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-subtle">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* ── Project Cards Grid (Vercel & Linear Reference) ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg p-4 flex flex-col justify-between space-y-3.5 shadow-subtle transition-colors group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {project.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {project.academicYear?.label || '2025-26'}
                </span>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  <Link href={`/projects/${project.id}`}>{project.name}</Link>
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                  {project.description}
                </p>
              </div>

              {/* Technologies Pills */}
              <div className="flex flex-wrap gap-1 pt-1 font-mono">
                {project.technologies?.slice(0, 4).map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[180px]">
                <Github size={12} className="text-slate-700 shrink-0" />
                <span className="truncate text-[11px]">{project.repoName || 'Connected'}</span>
              </div>

              <Link
                href={`/projects/${project.id}`}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
