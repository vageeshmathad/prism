import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'
import { CreateUserSchema, UpdateUserSchema } from '../utils/validators'

export const usersRouter = Router()

/**
 * GET /users
 */
usersRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const role = req.query['role'] as any
    const search = req.query['search'] as string | undefined
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? (req.query['institutionId'] as string | undefined)
      : req.user?.institutionId

    const where: any = {}
    if (institutionId) where.institutionId = institutionId
    if (role) where.role = role
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    try {
      const [total, items] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          skip,
          take: pageSize,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            institutionId: true,
            institution: { select: { id: true, name: true, code: true } },
            department: { select: { id: true, name: true, code: true } },
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ])

      const mapped = items.map((u) => ({
        ...u,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      }))

      const pagination = buildPagination(page, pageSize, total)
      return res.status(200).json({
        success: true,
        data: mapped,
        pagination,
        total,
        page,
        limit: pageSize,
      })
    } catch {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: buildPagination(1, 20, 0),
        total: 0,
      })
    }
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch users', 500)
  }
})

/**
 * GET /users/:id
 */
usersRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        institutionId: true,
        institution: true,
        department: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
        teamMemberships: {
          include: {
            team: {
              include: { project: { select: { id: true, name: true } } },
            },
          },
        },
      },
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    return successResponse(res, {
      ...user,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch user', 500)
  }
})

/**
 * POST /users
 */
usersRouter.post('/', requireAuth, requireRole('PLATFORM_ADMIN', 'INSTITUTION_ADMIN'), async (req: Request, res: Response) => {
  try {
    const parseResult = CreateUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const { email, password, name, role, institutionId, department } = parseResult.data
    const instId = req.user?.role === 'PLATFORM_ADMIN' ? institutionId : req.user?.institutionId

    if (!instId) {
      return errorResponse(res, 'institutionId is required', 400)
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || name
    const lastName = nameParts.slice(1).join(' ') || ''

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: role as any,
        institutionId: instId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        institutionId: true,
        isActive: true,
        createdAt: true,
      },
    })

    return successResponse(res, {
      ...user,
      name: `${user.firstName} ${user.lastName}`.trim(),
    }, 'User created', 201)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to create user', 500)
  }
})

/**
 * PUT /users/:id
 */
usersRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const parseResult = UpdateUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const data = parseResult.data
    const updateData: any = {}
    if (data.name) {
      const parts = data.name.trim().split(' ')
      updateData.firstName = parts[0]
      updateData.lastName = parts.slice(1).join(' ')
    }
    if (data.email) updateData.email = data.email.toLowerCase()
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })

    return successResponse(res, updated, 'User updated')
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to update user', 500)
  }
})
