import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'
import { OverrideEvaluationSchema } from '../utils/validators'

export const evaluationsRouter = Router()

/**
 * GET /evaluations
 */
evaluationsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const projectId = req.query['projectId'] as string | undefined
    const teamId = req.query['teamId'] as string | undefined
    const status = req.query['status'] as any
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? (req.query['institutionId'] as string | undefined)
      : req.user?.institutionId

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (teamId) where.teamId = teamId
    if (status) where.status = status
    if (institutionId) where.institutionId = institutionId

    try {
      const [total, items] = await Promise.all([
        prisma.evaluationRun.count({ where }),
        prisma.evaluationRun.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            team: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
            repository: { select: { id: true, fullName: true, defaultBranch: true } },
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
    return errorResponse(res, err.message || 'Failed to fetch evaluations', 500)
  }
})

/**
 * GET /evaluations/:id
 */
evaluationsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const evaluation = await prisma.evaluationRun.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        project: true,
        repository: true,
        metricResults: {
          include: { metricDefinition: true },
        },
        securityFindings: true,
        scoreOverrides: true,
      },
    })

    if (!evaluation) {
      return errorResponse(res, 'Evaluation not found', 404)
    }

    return successResponse(res, evaluation)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch evaluation', 500)
  }
})

/**
 * POST /evaluations (Trigger evaluation)
 */
evaluationsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { repositoryId, projectId, teamId, phase = 'PHASE_1' } = req.body

    const institutionId = req.user?.institutionId || 'default-inst'
    const evalKey = `${repositoryId || teamId || 'eval'}:${Date.now()}:${phase}`

    const evaluation = await prisma.evaluationRun.create({
      data: {
        institutionId,
        repositoryId: repositoryId || 'default-repo',
        projectId,
        teamId,
        phase: phase as any,
        evaluationKey: evalKey,
        status: 'PENDING',
        triggeredBy: req.user?.email || 'manual',
      },
    })

    return successResponse(res, evaluation, 'Evaluation queued', 201)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to trigger evaluation', 500)
  }
})

/**
 * POST /evaluations/:id/override
 */
evaluationsRouter.post('/:id/override', requireAuth, requireRole('PLATFORM_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY_COORDINATOR', 'FACULTY_EVALUATOR'), async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string
    const parseResult = OverrideEvaluationSchema.safeParse(req.body)
    if (!parseResult.success) {
      return errorResponse(res, 'Validation error', 400, parseResult.error.flatten().fieldErrors)
    }

    const { overriddenScore, overrideReason } = parseResult.data

    const evaluation = await prisma.evaluationRun.findUnique({ where: { id } })
    if (!evaluation) {
      return errorResponse(res, 'Evaluation not found', 404)
    }

    const previousScore = evaluation.overallScore ?? 0

    const [override, updatedEval] = await prisma.$transaction([
      prisma.scoreOverride.create({
        data: {
          evaluationRunId: id,
          facultyId: req.user!.id,
          component: 'overall',
          previousScore,
          newScore: overriddenScore,
          reason: overrideReason,
        },
      }),
      prisma.evaluationRun.update({
        where: { id },
        data: { overallScore: overriddenScore },
      }),
    ])

    return successResponse(res, { override, evaluation: updatedEval }, 'Score overridden successfully')
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to override score', 500)
  }
})
