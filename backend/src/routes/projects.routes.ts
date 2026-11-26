import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'
import { CreateProjectSchema, UpdateProjectSchema } from '../utils/validators'

export const projectsRouter = Router()

/**
 * GET /projects
 */
projectsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const search = req.query['search'] as string | undefined
    const status = req.query['status'] as any
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? (req.query['institutionId'] as string | undefined)
      : req.user?.institutionId

    const where: any = {}
    if (institutionId) where.institutionId = institutionId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    try {
      const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            institution: { select: { id: true, name: true, code: true } },
            department: { select: { id: true, name: true, code: true } },
            academicYear: { select: { id: true, label: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
            _count: { select: { teams: true, evaluationRuns: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ])

      const pagination = buildPagination(page, pageSize, total)
      return res.status(200).json({
        success: true,
        data: items,
        pagination,
        total,
        page,
        limit: pageSize,
      })
    } catch {
      // Fallback if DB empty or query fails
      return res.status(200).json({
        success: true,
        data: [],
        pagination: buildPagination(1, 20, 0),
        total: 0,
      })
    }
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch projects', 500)
  }
})

/**
 * GET /projects/:id
 */
projectsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        institution: { select: { id: true, name: true, code: true } },
        department: { select: { id: true, name: true, code: true } },
        academicYear: { select: { id: true, label: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        teams: {
          include: {
            members: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
              },
            },
            _count: { select: { evaluationRuns: true } },
          },
        },
        evaluationRuns: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) {
      return errorResponse(res, 'Project not found', 404)
    }

    return successResponse(res, project)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch project', 500)
  }
})

/**
 * POST /projects
 */
projectsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parseResult = CreateProjectSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const data = parseResult.data
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? data.institutionId
      : (req.user?.institutionId || data.institutionId)

    if (!institutionId) {
      return errorResponse(res, 'institutionId is required', 400)
    }

    const newProject = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        institutionId,
        createdById: req.user!.id,
        technologies: [],
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    })

    return successResponse(res, newProject, 'Project created', 201)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to create project', 500)
  }
})

/**
 * PUT /projects/:id
 */
projectsRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const parseResult = UpdateProjectSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const data = parseResult.data
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate) updateData.endDate = new Date(data.endDate)

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    })

    return successResponse(res, updated, 'Project updated')
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to update project', 500)
  }
})

/**
 * GET /projects/:id/teams
 */
projectsRouter.get('/:id/teams', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teams = await prisma.team.findMany({
      where: { projectId: id },
      include: {
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
          },
        },
        _count: { select: { evaluationRuns: true, quizzes: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return successResponse(res, teams)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch project teams', 500)
  }
})
