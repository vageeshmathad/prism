import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { successResponse, errorResponse, buildPagination, parsePagination } from '../utils/response'

export const notificationsRouter = Router()

/**
 * GET /notifications
 */
notificationsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page, pageSize, skip } = parsePagination(req.query as Record<string, unknown>)
    const userId = req.user!.id

    try {
      const [total, items] = await Promise.all([
        prisma.notification.count({ where: { userId } }),
        prisma.notification.findMany({
          where: { userId },
          skip,
          take: pageSize,
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
    return errorResponse(res, err.message || 'Failed to fetch notifications', 500)
  }
})

/**
 * PATCH /notifications/:id/read
 */
notificationsRouter.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
    return successResponse(res, updated, 'Notification marked as read')
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to update notification', 500)
  }
})

/**
 * POST /notifications/read-all
 */
notificationsRouter.post('/read-all', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    })
    return successResponse(res, { message: 'All notifications marked as read' })
  } catch (err: any) {
    return errorResponse(res, err.message || 'Failed to mark all as read', 500)
  }
})

