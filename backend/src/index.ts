// src/index.ts — PRISM Backend Entry Point
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { prisma } from './lib/prisma'

// Routers
import { authRouter } from './routes/auth.routes'
import { projectsRouter } from './routes/projects.routes'
import { teamsRouter } from './routes/teams.routes'
import { evaluationsRouter } from './routes/evaluations.routes'
import { usersRouter } from './routes/users.routes'
import { institutionsRouter } from './routes/institutions.routes'
import { securityRouter } from './routes/security.routes'
import { notificationsRouter } from './routes/notifications.routes'
import { dashboardRouter } from './routes/dashboard.routes'
import { githubRouter } from './routes/github.routes'

const app = express()

const PORT = process.env['PORT'] ?? 4000
const API_PREFIX = process.env['API_PREFIX'] ?? '/api/v1'

// ── Security & utility middleware ──────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000', credentials: true }))
app.use(compression())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(morgan(process.env['NODE_ENV'] === 'production' ? 'combined' : 'dev'))

// Global rate limiter
app.use(
  rateLimit({
    windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 900_000),
    max: Number(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? 200),
    standardHeaders: true,
    legacyHeaders: false,
  })
)

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() })
  } catch {
    res.status(200).json({ status: 'ok', db: 'disconnected (demo active)', ts: new Date().toISOString() })
  }
})

// ── Register API Routers ────────────────────────────────────────────────────
function registerRoutes(router: express.Router) {
  router.use('/auth', authRouter)
  router.use('/projects', projectsRouter)
  router.use('/teams', teamsRouter)
  router.use('/evaluations', evaluationsRouter)
  router.use('/users', usersRouter)
  router.use('/institutions', institutionsRouter)
  router.use('/security', securityRouter)
  router.use('/notifications', notificationsRouter)
  router.use('/dashboard', dashboardRouter)
  router.use('/github', githubRouter)
}

const v1Router = express.Router()
registerRoutes(v1Router)

// Mount on both /api/v1 and /api for seamless frontend compatibility
app.use(API_PREFIX, v1Router)
if (API_PREFIX !== '/api') {
  app.use('/api', v1Router)
}

// ── API root ───────────────────────────────────────────────────────────────
app.get([API_PREFIX, '/api'], (_req, res) => {
  res.json({
    name: 'PRISM API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      projects: `${API_PREFIX}/projects`,
      teams: `${API_PREFIX}/teams`,
      evaluations: `${API_PREFIX}/evaluations`,
      github: `${API_PREFIX}/github`,
      security: `${API_PREFIX}/security`,
      notifications: `${API_PREFIX}/notifications`,
      dashboard: `${API_PREFIX}/dashboard`,
    },
  })
})

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: process.env['NODE_ENV'] === 'production' ? 'Internal Server Error' : err.message,
  })
})

// ── Start server ──────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 PRISM API running on http://localhost:${PORT}${API_PREFIX}`)
})

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully...`)
  server.close(async () => {
    try {
      await prisma.$disconnect()
    } catch {}
    console.log('✅ Shutdown complete')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export { app, prisma }
