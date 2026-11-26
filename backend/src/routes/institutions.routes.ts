import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'

export const institutionsRouter = Router()

/**
 * GET /institutions
 */
institutionsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)

    try {
      const [total, items] = await Promise.all([
        prisma.institution.count(),
        prisma.institution.findMany({
          skip,
          take: pageSize,
          include: {
            departments: true,
            academicYears: { where: { isCurrent: true } },
            _count: { select: { users: true, projects: true, teams: true } },
          },
          orderBy: { name: 'asc' },
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
    return errorResponse(res, err.message || 'Failed to fetch institutions', 500)
  }
})

/**
 * GET /institutions/:id
 */
institutionsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        departments: true,
        academicYears: true,
        _count: { select: { users: true, projects: true, teams: true } },
      },
    })

    if (!institution) {
      return errorResponse(res, 'Institution not found', 404)
    }

    return successResponse(res, institution)
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to fetch institution', 500)
  }
})
