import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'
import { CreateTeamSchema, UpdateTeamSchema, AddMemberSchema } from '../utils/validators'

export const teamsRouter = Router()

/**
 * GET /teams
 */
teamsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const projectId = req.query['projectId'] as string | undefined
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? (req.query['institutionId'] as string | undefined)
      : req.user?.institutionId

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (institutionId) where.institutionId = institutionId

    try {
      const [total, items] = await Promise.all([
        prisma.team.count({ where }),
        prisma.team.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            project: { select: { id: true, name: true } },
            members: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
              },
            },
            _count: { select: { evaluationRuns: true, quizzes: true } },
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
      return res.status(200).json({
        success: true,
        data: [],
        pagination: buildPagination(1, 20, 0),
        total: 0,
      })
    }
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch teams', 500)
  }
})

/**
 * GET /teams/:id
 */
teamsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        project: true,
        institution: { select: { id: true, name: true, code: true } },
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
          },
        },
        evaluationRuns: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        quizzes: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!team) {
      return errorResponse(res, 'Team not found', 404)
    }

    return successResponse(res, team)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch team', 500)
  }
})

/**
 * POST /teams
 */
teamsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parseResult = CreateTeamSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const { name, projectId } = parseResult.data

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      return errorResponse(res, 'Project not found', 404)
    }

    const team = await prisma.team.create({
      data: {
        name,
        projectId,
        institutionId: project.institutionId,
      },
    })

    return successResponse(res, team, 'Team created', 201)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to create team', 500)
  }
})

/**
 * POST /teams/:id/members
 */
teamsRouter.post('/:id/members', requireAuth, async (req: Request, res: Response) => {
  try {
    const teamId = req.params['id'] as string
    const parseResult = AddMemberSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const { userId, role } = parseResult.data

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        isLead: role === 'LEAD',
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return successResponse(res, member, 'Member added to team', 201)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to add member', 500)
  }
})

/**
 * DELETE /teams/:id/members/:userId
 */
teamsRouter.delete('/:id/members/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const teamId = req.params['id'] as string
    const userId = req.params['userId'] as string
    await prisma.teamMember.delete({
      where: {
        teamId_userId: { teamId, userId },
      },
    })

    return successResponse(res, { message: 'Member removed from team' })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to remove member', 500)
  }
})
