'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { setToken } from '@/lib/auth'
import { AuthResponse, LoginCredentials } from '@/types'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@prism.dev', password: 'admin123' },
  { role: 'Faculty', email: 'faculty@prism.dev', password: 'faculty123' },
  { role: 'Student', email: 'student@prism.dev', password: 'student123' },
  { role: 'Evaluator', email: 'evaluator@prism.dev', password: 'eval123' },
]

function PrismLogo() {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* SVG Prism Crystal */}
      <div className="relative">
        <svg width="64" height="72" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Crystal body */}
          <defs>
            <linearGradient id="prismGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B6F36B" stopOpacity="1" />
              <stop offset="100%" stopColor="#53D9E8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="prismGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#53D9E8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9B8CFF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="prismGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B8CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B6F36B" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Top face */}
          <polygon
            points="32,4 56,22 32,32 8,22"
            fill="url(#prismGrad1)"
            filter="url(#glow)"
            opacity="0.95"
          />
          {/* Left face */}
          <polygon
            points="8,22 32,32 32,66 8,48"
            fill="url(#prismGrad2)"
            opacity="0.85"
          />
          {/* Right face */}
          <polygon
            points="56,22 32,32 32,66 56,48"
            fill="url(#prismGrad3)"
            opacity="0.85"
          />
          {/* Inner glow lines */}
          <line x1="32" y1="4" x2="32" y2="66" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="8" y1="22" x2="56" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="8" y1="48" x2="56" y2="48" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

          {/* Refraction ray */}
          <line
            x1="56" y1="48" x2="72" y2="60"
            stroke="url(#prismGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="56" y1="48" x2="72" y2="52"
            stroke="#53D9E8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          <line
            x1="56" y1="48" x2="72" y2="44"
            stroke="#9B8CFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>

        {/* Ambient glow behind logo */}
        <div
          className="absolute inset-0 blur-2xl opacity-30 -z-10"
          style={{ background: 'radial-gradient(circle, #B6F36B 0%, transparent 70%)' }}
        />
      </div>

      {/* Wordmark */}
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight gradient-text">PRISM</h1>
        <p className="text-text-secondary text-sm mt-1 tracking-widest uppercase font-medium">
          See beyond the code.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', formData as LoginCredentials)
      setToken(data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invalid email or password'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemo = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    setShowDemo(false)
  }

  return (
    <div className="animate-slide-up">
      <PrismLogo />

      {/* Login Card */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-8 shadow-elevated">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Sign in to your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`input-field ${errors.email ? 'border-status-critical focus:border-status-critical focus:ring-status-critical/20' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-status-critical">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input-field pr-12 ${errors.password ? 'border-status-critical focus:border-status-critical focus:ring-status-critical/20' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-status-critical">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo credentials toggle */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors w-full text-center"
          >
            {showDemo ? 'Hide' : 'Show'} demo credentials
          </button>

          {showDemo && (
            <div className="mt-3 space-y-2 animate-slide-up">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred.email, cred.password)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-bg-secondary border border-border hover:border-accent-lime/40 hover:bg-accent-lime/5 transition-all group"
                >
                  <div className="text-left">
                    <span className="text-xs font-semibold text-accent-lime group-hover:text-accent-lime">
                      {cred.role}
                    </span>
                    <p className="text-xs text-text-muted font-mono">{cred.email}</p>
                  </div>
                  <span className="text-xs text-text-muted font-mono">{cred.password}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-text-muted mt-6">
        PRISM v1.0 · AI-Powered Engineering Evaluation
      </p>
    </div>
  )
}
