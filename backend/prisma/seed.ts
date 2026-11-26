// prisma/seed.ts — Seeds 6 institutions with departments, academic year, admin users
import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BCRYPT_ROUNDS = 12

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

const INSTITUTIONS = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    code: 'IITB',
    adminEmail: 'admin@iitb.ac.in',
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    code: 'IITD',
    adminEmail: 'admin@iitd.ac.in',
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    code: 'NITT',
    adminEmail: 'admin@nitt.edu',
  },
  {
    name: 'Birla Institute of Technology and Science Pilani',
    slug: 'bits-pilani',
    code: 'BITS',
    adminEmail: 'admin@pilani.bits-pilani.ac.in',
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    code: 'VIT',
    adminEmail: 'admin@vit.ac.in',
  },
  {
    name: 'Delhi Technological University',
    slug: 'dtu-delhi',
    code: 'DTU',
    adminEmail: 'admin@dtu.ac.in',
  },
]

async function main() {
  console.log('🌱 Starting PRISM database seed...')

  // Platform admin (cross-institution)
  const platformAdminHash = await hashPassword('PrismAdmin@2025!')

  for (const inst of INSTITUTIONS) {
    console.log(`\n📚 Seeding institution: ${inst.name}`)

    // Upsert institution
    const institution = await prisma.institution.upsert({
      where: { slug: inst.slug },
      update: {},
      create: {
        name: inst.name,
        slug: inst.slug,
        code: inst.code,
        adminEmail: inst.adminEmail,
        isActive: true,
        settings: {
          allowSelfRegistration: false,
          defaultPhase: 'PHASE_1',
          evaluationWebhook: true,
        },
      },
    })

    // Departments
    const departments = await Promise.all([
      prisma.department.upsert({
        where: { institutionId_code: { institutionId: institution.id, code: 'CSE' } },
        update: {},
        create: {
          institutionId: institution.id,
          name: 'Computer Science & Engineering',
          code: 'CSE',
          isActive: true,
        },
      }),
      prisma.department.upsert({
        where: { institutionId_code: { institutionId: institution.id, code: 'IT' } },
        update: {},
        create: {
          institutionId: institution.id,
          name: 'Information Technology',
          code: 'IT',
          isActive: true,
        },
      }),
      prisma.department.upsert({
        where: { institutionId_code: { institutionId: institution.id, code: 'ECE' } },
        update: {},
        create: {
          institutionId: institution.id,
          name: 'Electronics & Communication Engineering',
          code: 'ECE',
          isActive: true,
        },
      }),
    ])

    // Academic year
    const academicYear = await prisma.academicYear.upsert({
      where: { institutionId_label: { institutionId: institution.id, label: '2025-26' } },
      update: {},
      create: {
        institutionId: institution.id,
        label: '2025-26',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2026-06-30'),
        isCurrent: true,
      },
    })

    // Institution admin user
    const adminEmail = `admin@${inst.slug}.prism.local`
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: platformAdminHash,
        firstName: 'Admin',
        lastName: inst.code,
        role: UserRole.INSTITUTION_ADMIN,
        institutionId: institution.id,
        departmentId: departments[0]?.id ?? null,
        isActive: true,
      },
    })

    // Faculty coordinator
    const facultyEmail = `faculty@${inst.slug}.prism.local`
    const facultyUser = await prisma.user.upsert({
      where: { email: facultyEmail },
      update: {},
      create: {
        email: facultyEmail,
        passwordHash: await hashPassword('Faculty@2025!'),
        firstName: 'Dr. Faculty',
        lastName: inst.code,
        role: UserRole.FACULTY_COORDINATOR,
        institutionId: institution.id,
        departmentId: departments[0]?.id ?? null,
        isActive: true,
      },
    })

    // Sample project
    await prisma.project.upsert({
      where: {
        // No @unique on project, use findFirst approach
        id: `seed-proj-${inst.slug}`,
      },
      update: {},
      create: {
        id: `seed-proj-${inst.slug}`,
        name: `${inst.code} Smart Campus System`,
        description: 'A full-stack smart campus management platform built by final-year students.',
        objectives: 'Build a production-grade system demonstrating mastery of software engineering practices.',
        technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
        status: ProjectStatus.ACTIVE,
        institutionId: institution.id,
        departmentId: departments[0]?.id ?? null,
        academicYearId: academicYear.id,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2026-04-30'),
        createdById: facultyUser.id,
      },
    })

    console.log(`   ✅ Institution ${inst.code} seeded with admin, faculty, departments, academic year, project`)
  }

  // Seed global metric definitions
  const globalMetrics = [
    {
      metricId: 'code_duplication',
      name: 'Code Duplication',
      category: 'code_quality',
      type: 'SCORED' as const,
      description: 'Percentage of duplicated code blocks detected by AST comparison.',
      applicablePhase: ['PHASE_1', 'PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'custom_ast',
      threshold: { warning: 15, fail: 30 },
      severity: 'MEDIUM' as const,
      weight: 1.0,
    },
    {
      metricId: 'cyclomatic_complexity',
      name: 'Cyclomatic Complexity',
      category: 'code_quality',
      type: 'SCORED' as const,
      description: 'Average cyclomatic complexity per function.',
      applicablePhase: ['PHASE_1', 'PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'custom_ast',
      threshold: { warning: 10, fail: 20 },
      severity: 'MEDIUM' as const,
      weight: 1.2,
    },
    {
      metricId: 'test_coverage',
      name: 'Test Coverage',
      category: 'testing',
      type: 'SCORED' as const,
      description: 'Percentage of code lines covered by automated tests.',
      applicablePhase: ['PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'coverage_report',
      threshold: { warning: 60, fail: 40 },
      severity: 'HIGH' as const,
      weight: 1.5,
    },
    {
      metricId: 'secret_exposure',
      name: 'Secret / Credential Exposure',
      category: 'security',
      type: 'FLAG' as const,
      description: 'Detects hardcoded secrets, API keys, or credentials in source code.',
      applicablePhase: ['PHASE_1', 'PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'semgrep',
      threshold: {},
      severity: 'CRITICAL' as const,
      weight: 2.0,
    },
    {
      metricId: 'commit_message_quality',
      name: 'Commit Message Quality',
      category: 'contribution',
      type: 'SCORED' as const,
      description: 'Evaluates commit message adherence to Conventional Commits spec.',
      applicablePhase: ['PHASE_1', 'PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'git_log',
      threshold: { warning: 60, fail: 40 },
      severity: 'LOW' as const,
      weight: 0.5,
    },
    {
      metricId: 'contribution_equity',
      name: 'Contribution Equity',
      category: 'contribution',
      type: 'SCORED' as const,
      description: 'Measures fair distribution of code contributions among team members.',
      applicablePhase: ['PHASE_1', 'PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'git_log',
      threshold: { warning: 20, fail: 40 },  // % deviation from mean
      severity: 'HIGH' as const,
      weight: 1.8,
    },
    {
      metricId: 'dependency_vulnerabilities',
      name: 'Dependency Vulnerabilities',
      category: 'security',
      type: 'SCORED' as const,
      description: 'Counts known CVEs in project dependencies via npm audit / pip-audit.',
      applicablePhase: ['PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'dep_audit',
      threshold: { warning: 1, fail: 5 },
      severity: 'HIGH' as const,
      weight: 1.5,
    },
    {
      metricId: 'documentation_coverage',
      name: 'Documentation Coverage',
      category: 'documentation',
      type: 'SCORED' as const,
      description: 'Percentage of public functions/classes with JSDoc/docstring coverage.',
      applicablePhase: ['PHASE_2', 'PHASE_3'] as any[],
      analyzer: 'doc_parser',
      threshold: { warning: 50, fail: 25 },
      severity: 'LOW' as const,
      weight: 0.8,
    },
  ]

  for (const m of globalMetrics) {
    await prisma.metricDefinition.upsert({
      where: { metricId: m.metricId },
      update: {},
      create: {
        ...m,
        supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'go'],
        evidenceRequirements: [],
        isAvailable: true,
        version: '1.0.0',
      },
    })
  }

  console.log(`\n📊 Seeded ${globalMetrics.length} global metric definitions`)
  console.log('\n✅ PRISM database seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

