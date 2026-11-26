import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateTokens, verifyRefreshToken } from '../lib/jwt'
import { requireAuth } from '../middleware/auth'
import { redisClient } from '../lib/redis'
import { successResponse, errorResponse } from '../utils/response'
import { LoginSchema, RefreshTokenSchema } from '../utils/validators'

export const authRouter = Router()

// Demo users fallback if DB does not have the requested demo account
const DEMO_USERS: Record<string, { id: string; name: string; email: string; role: string; institutionId?: string }> = {
  'admin@prism.dev': { id: 'demo-admin-1', name: 'Platform Admin', email: 'admin@prism.dev', role: 'PLATFORM_ADMIN' },
  'faculty@prism.dev': { id: 'demo-faculty-1', name: 'Faculty Evaluator', email: 'faculty@prism.dev', role: 'FACULTY_COORDINATOR' },
  'student@prism.dev': { id: 'demo-student-1', name: 'Alex Student', email: 'student@prism.dev', role: 'STUDENT' },
  'evaluator@prism.dev': { id: 'demo-evaluator-1', name: 'Dr. Jane Evaluator', email: 'evaluator@prism.dev', role: 'FACULTY_EVALUATOR' },
  'admin@iitb.ac.in': { id: 'demo-iitb-admin', name: 'IITB Admin', email: 'admin@iitb.ac.in', role: 'INSTITUTION_ADMIN' },
  'inst.admin@mit-tech.edu': { id: 'demo-mit-admin', name: 'Institution Admin', email: 'inst.admin@mit-tech.edu', role: 'INSTITUTION_ADMIN' },
  'coordinator@mit-tech.edu': { id: 'demo-mit-coord', name: 'Faculty Coordinator', email: 'coordinator@mit-tech.edu', role: 'FACULTY_COORDINATOR' },
  'student1@mit-tech.edu': { id: 'demo-mit-stud1', name: 'Student One', email: 'student1@mit-tech.edu', role: 'STUDENT' },
}

/**
 * POST /auth/login
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const { email, password } = parseResult.data

    let user: any = null
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { institution: true },
      })
    } catch {
      // Database query failed or table not ready, try demo fallback
    }

    if (!user) {
      // Check demo credentials fallback
      const demoUser = DEMO_USERS[email.toLowerCase()]
      if (demoUser) {
        const tokens = generateTokens(demoUser.id, demoUser.role, demoUser.institutionId)
        const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString()
        const userObj = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          institutionId: demoUser.institutionId,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return res.status(200).json({
          success: true,
          token: tokens.accessToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          user: userObj,
          data: {
            user: userObj,
            token: tokens.accessToken,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt,
          },
        })
      }

      return errorResponse(res, 'Invalid email or password', 401)
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403)
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password', 401)
    }

    // Update lastLoginAt asynchronously
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {})

    const tokens = generateTokens(user.id, user.role, user.institutionId ?? undefined)
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString()
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email

    const userObj = {
      id: user.id,
      email: user.email,
      name: fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      institutionId: user.institutionId,
      institution: user.institution,
      avatar: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return res.status(200).json({
      success: true,
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
      user: userObj,
      data: {
        user: userObj,
        token: tokens.accessToken,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
      },
    })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Login failed', 500)
  }
})

/**
 * GET /auth/me
 */
authRouter.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const authUser = req.user!
    let user: any = null

    try {
      user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: { institution: true, department: true },
      })
    } catch {
      // Fallback if DB query fails
    }

    const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : authUser.name
    const userResponse = {
      id: authUser.id,
      email: authUser.email,
      name: fullName || authUser.name,
      role: authUser.role,
      institutionId: authUser.institutionId,
      institution: user?.institution,
      department: user?.department,
      avatar: user?.avatarUrl,
      isActive: true,
      permissions: authUser.permissions,
    }

    return res.status(200).json({
      success: true,
      data: userResponse,
      user: userResponse,
    })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch user', 500)
  }
})

/**
 * POST /auth/refresh
 */
authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const parseResult = RefreshTokenSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Refresh token required', 400)
    }

    const payload = verifyRefreshToken(parseResult.data.refreshToken)
    const tokens = generateTokens(payload.sub, payload.role, payload.institutionId)

    return successResponse(res, {
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to refresh token', 401)
  }
})

/**
 * POST /auth/logout
 */
authRouter.post('/logout', requireAuth, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.slice(7)
    if (token) {
      try {
        await redisClient.setex(`blacklist:${token}`, 24 * 3600, 'revoked')
      } catch {
        // Fallback gracefully
      }
    }
    return successResponse(res, { message: 'Logged out successfully' })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Logout failed', 500)
  }
})
