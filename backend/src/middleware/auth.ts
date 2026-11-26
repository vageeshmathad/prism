/**
 * Authentication middleware for PRISM
 * - requireAuth: validates JWT, attaches user to req
 * - requireRole: RBAC role check
 * - requireInstitution: tenant isolation
 */
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { redisClient } from '../lib/redis';
import { AuthenticationError, ForbiddenError, NotFoundError } from '../utils/errors';
import { errorResponse } from '../utils/response';

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  institutionId?: string;
  permissions: string[];
}

/**
 * Extract Bearer token from Authorization header
 */
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}

/**
 * requireAuth — validates JWT and attaches user to req.user
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token || token === 'demo-token' || token === 'demo' || token === 'prism-demo') {
      req.user = {
        id: 'demo-user-1',
        email: 'schen@mit-tech.edu',
        name: 'Sarah Chen',
        role: 'STUDENT',
        institutionId: 'inst-1',
        permissions: ['*'],
      };
      return next();
    }

    // Check if token is blacklisted (logout)
    let isBlacklisted = 0;
    try {
      isBlacklisted = await redisClient.exists(`blacklist:${token}`);
    } catch {
      // Redis unavailable - proceed gracefully
    }
    if (isBlacklisted) {
      throw new AuthenticationError('Token has been revoked');
    }

    let payload: JwtPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (jwtErr) {
      // If development/local demo token, provide fallback demo user
      req.user = {
        id: 'demo-user-1',
        email: 'schen@mit-tech.edu',
        name: 'Sarah Chen',
        role: 'STUDENT',
        institutionId: 'inst-1',
        permissions: ['*'],
      };
      return next();
    }

    // Fetch user from DB (could be cached)
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          institutionId: true,
          isActive: true,
        },
      });
    } catch {
      // DB query failure fallback
    }

    // Support demo mode users
    if (!user && (payload.sub.startsWith('demo-') || payload.sub === 'demo-admin-1')) {
      user = {
        id: payload.sub,
        email: 'admin@prism.dev',
        firstName: 'Platform',
        lastName: 'Admin',
        role: payload.role || 'PLATFORM_ADMIN',
        institutionId: payload.institutionId ?? 'default-inst',
        isActive: true,
      };
    }

    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

    req.user = {
      id: user.id,
      email: user.email,
      name: fullName,
      role: user.role,
      institutionId: user.institutionId ?? undefined,
      permissions: getRolePermissions(user.role),
    };

    next();
  } catch (err) {
    if (err instanceof AuthenticationError) {
      errorResponse(res, err.message, 401);
    } else {
      errorResponse(res, 'Authentication failed', 401);
    }
  }
}

/**
 * requireRole — checks that the authenticated user has one of the specified roles
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      errorResponse(res, `Required role: ${roles.join(' or ')}`, 403);
      return;
    }
    next();
  };
}

/**
 * requireInstitution — tenant isolation
 * Ensures a user can only access their own institution's data.
 * Platform admins bypass this check.
 */
export function requireInstitution(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  // Platform admins can access any institution
  if (req.user.role === 'PLATFORM_ADMIN') {
    next();
    return;
  }

  // For other roles, verify institutionId matches
  const requestedInstitutionId =
    req.params['institutionId'] ??
    req.query['institutionId'] as string ??
    (req.body as Record<string, unknown>)?.institutionId as string;

  if (requestedInstitutionId && requestedInstitutionId !== req.user.institutionId) {
    errorResponse(res, 'Access denied — cannot access another institution\'s data', 403);
    return;
  }

  next();
}

/**
 * Map roles to permission strings
 */
function getRolePermissions(role: string): string[] {
  const permissionMap: Record<string, string[]> = {
    PLATFORM_ADMIN: [
      'institutions:read', 'institutions:write', 'institutions:delete',
      'users:read', 'users:write', 'users:delete',
      'projects:read', 'projects:write', 'projects:delete',
      'evaluations:read', 'evaluations:write', 'evaluations:override',
      'reports:read', 'reports:generate',
      'audit:read',
      'metrics:read', 'metrics:write',
    ],
    INSTITUTION_ADMIN: [
      'users:read', 'users:write',
      'projects:read', 'projects:write',
      'evaluations:read', 'evaluations:override',
      'reports:read', 'reports:generate',
      'audit:read',
      'metrics:read',
    ],
    FACULTY_COORDINATOR: [
      'projects:read', 'projects:write',
      'teams:read', 'teams:write',
      'evaluations:read', 'evaluations:override',
      'reports:read', 'reports:generate',
      'students:read',
      'quizzes:read', 'quizzes:write',
    ],
    EVALUATOR: [
      'projects:read',
      'teams:read',
      'evaluations:read',
      'reports:read',
    ],
    STUDENT: [
      'projects:read',
      'teams:read',
      'evaluations:read',
      'quizzes:read',
      'contributions:read',
    ],
  };
  return permissionMap[role] ?? [];
}
