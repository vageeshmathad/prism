/**
 * Zod validation schemas for all request bodies
 */
import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─── Users ────────────────────────────────────────────────────────────────────

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['PLATFORM_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY_COORDINATOR', 'EVALUATOR', 'STUDENT']),
  institutionId: z.string().uuid().optional(),
  studentId: z.string().optional(),
  department: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ─── Institutions ─────────────────────────────────────────────────────────────

export const CreateInstitutionSchema = z.object({
  name: z.string().min(2).max(200),
  domain: z.string().min(2).max(100),
  logoUrl: z.string().url().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const UpdateInstitutionSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  domain: z.string().optional(),
  logoUrl: z.string().url().optional(),
  settings: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const CreateProjectSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  repositoryUrl: z.string().url().optional(),
  institutionId: z.string().uuid(),
  phaseId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  repositoryUrl: z.string().url().optional(),
  phaseId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED', 'DRAFT']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  settings: z.record(z.unknown()).optional(),
});

// ─── Teams ────────────────────────────────────────────────────────────────────

export const CreateTeamSchema = z.object({
  name: z.string().min(2).max(100),
  projectId: z.string().uuid(),
  repositoryUrl: z.string().url().optional(),
  description: z.string().optional(),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  repositoryUrl: z.string().url().optional(),
  description: z.string().optional(),
});

export const AddMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['LEAD', 'MEMBER']).default('MEMBER'),
});

// ─── Evaluations ──────────────────────────────────────────────────────────────

export const OverrideEvaluationSchema = z.object({
  overriddenScore: z.number().min(0).max(100),
  overrideReason: z.string().min(10, 'Override reason must be at least 10 characters'),
});

// ─── Phases ───────────────────────────────────────────────────────────────────

export const CreatePhaseSchema = z.object({
  name: z.string().min(2).max(100),
  institutionId: z.string().uuid(),
  description: z.string().optional(),
  weights: z.object({
    codeQuality: z.number().min(0).max(1),
    testCoverage: z.number().min(0).max(1),
    documentation: z.number().min(0).max(1),
    security: z.number().min(0).max(1),
    performance: z.number().min(0).max(1),
    maintainability: z.number().min(0).max(1),
    contribution: z.number().min(0).max(1),
    quizScore: z.number().min(0).max(1),
    peerReview: z.number().min(0).max(1),
  }).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const UpdatePhaseWeightsSchema = z.object({
  weights: z.object({
    codeQuality: z.number().min(0).max(1).optional(),
    testCoverage: z.number().min(0).max(1).optional(),
    documentation: z.number().min(0).max(1).optional(),
    security: z.number().min(0).max(1).optional(),
    performance: z.number().min(0).max(1).optional(),
    maintainability: z.number().min(0).max(1).optional(),
    contribution: z.number().min(0).max(1).optional(),
    quizScore: z.number().min(0).max(1).optional(),
    peerReview: z.number().min(0).max(1).optional(),
  }),
});

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export const GenerateQuizSchema = z.object({
  projectId: z.string().uuid(),
  teamId: z.string().uuid(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  questionCount: z.number().int().min(5).max(30).default(10),
  topics: z.array(z.string()).optional(),
});

export const SubmitAnswersSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    selectedOption: z.number().int().min(0).max(3),
  })),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const GenerateReportSchema = z.object({
  type: z.enum(['PROJECT_SUMMARY', 'TEAM_PERFORMANCE', 'STUDENT_GRADES', 'SECURITY_AUDIT']),
  projectId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  institutionId: z.string().uuid().optional(),
  format: z.enum(['PDF', 'CSV', 'JSON']).default('JSON'),
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }).optional(),
});

// ─── GitHub ───────────────────────────────────────────────────────────────────

export const ConnectGitHubSchema = z.object({
  installationId: z.number().int(),
  repositoryIds: z.array(z.number().int()),
  projectId: z.string().uuid(),
});

// ─── Security Findings ────────────────────────────────────────────────────────

export const UpdateFindingSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'WONT_FIX', 'FALSE_POSITIVE']),
  notes: z.string().optional(),
});

// ─── Metric Definitions ───────────────────────────────────────────────────────

export const UpdateMetricDefinitionSchema = z.object({
  weight: z.number().min(0).max(1).optional(),
  enabled: z.boolean().optional(),
  config: z.record(z.unknown()).optional(),
  thresholds: z.object({
    excellent: z.number(),
    good: z.number(),
    acceptable: z.number(),
    poor: z.number(),
  }).optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!fields[path]) fields[path] = [];
      fields[path]!.push(issue.message);
    }
    const { ValidationError } = require('./errors');
    throw new ValidationError('Validation failed', fields);
  }
  return result.data;
}
