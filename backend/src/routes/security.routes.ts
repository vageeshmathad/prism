import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'

export const securityRouter = Router()

/**
 * GET /security/findings
 */
securityRouter.get('/findings', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const severity = req.query['severity'] as any
    const status = req.query['status'] as any
    const institutionId = req.user?.role === 'PLATFORM_ADMIN'
      ? (req.query['institutionId'] as string | undefined)
      : req.user?.institutionId

    const where: any = {}
    if (institutionId) where.institutionId = institutionId
    if (severity) where.severity = severity
    if (status) where.status = status

    try {
      const [total, items] = await Promise.all([
        prisma.securityFinding.count({ where }),
        prisma.securityFinding.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            evaluationRun: {
              select: {
                id: true,
                team: { select: { id: true, name: true } },
                project: { select: { id: true, name: true } },
              },
            },
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
    return errorResponse(res, err.message || 'Failed to fetch security findings', 500)
  }
})

/**
 * PATCH /security/findings/:id/status
 */
securityRouter.patch('/findings/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const updated = await prisma.securityFinding.update({
      where: { id },
      data: { status },
    })

    return successResponse(res, updated, 'Finding status updated')
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to update finding status', 500)
  }
})
