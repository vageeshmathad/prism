# PRISM Backend

AI-Powered Software Engineering Evaluation Platform — Express + Prisma + PostgreSQL API.

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 / TypeScript 5 |
| Framework | Express 4 |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| Queue | Bull + Redis |
| Auth | JWT (bcryptjs) |
| Validation | Zod + express-validator |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy .env and configure DATABASE_URL
cp .env .env.local   # already created with defaults

# 3. Generate Prisma client
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Seed the database (6 institutions + metrics)
npm run db:seed

# 6. Start dev server
npm run dev
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma     # Complete database schema (30 models)
│   └── seed.ts           # 6 institutions + global metrics
├── src/
│   └── index.ts          # Express app entry point
├── prisma.config.ts      # Prisma v7 datasource config (@prisma/adapter-pg)
├── package.json
├── tsconfig.json
└── .env
```

## Schema Overview

30 models covering:
- **IAM**: Institution, Department, AcademicYear, User, Role, Permission, UserRole
- **Projects**: Project, Team, TeamMember  
- **GitHub**: GithubInstallation, Repository, WebhookEvent, Commit, PullRequest, ChangedFile
- **Evaluation**: EvaluationRun, MetricDefinition, MetricResult
- **Rubric**: RubricVersion, PhaseWeight, ScoreComponent
- **Contribution**: ContributionRecord, ContributionScore
- **Quiz/Viva**: Quiz, Question, Answer, AnswerEvaluation
- **Security**: SecurityFinding, IntegrityFlag
- **Review**: FacultyReview, ScoreOverride, Appeal
- **System**: Notification, AuditLog

## GitHub Integration Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/github/status` | Get GitHub configuration & connection status |
| `GET` | `/api/v1/github/auth/url` | Get OAuth authorization redirect URL |
| `POST` | `/api/v1/github/auth/callback` | Exchange OAuth code for access token |
| `POST` | `/api/v1/github/disconnect` | Disconnect GitHub account |
| `GET` | `/api/v1/github/repositories` | List accessible repositories (search & filter) |
| `POST` | `/api/v1/github/repositories/import` | Import & link repository to Project & Team |
| `GET` | `/api/v1/github/repositories/connected` | List all connected PRISM repositories |
| `GET` | `/api/v1/github/repositories/:id` | Repository details, commits, PRs & findings |
| `POST` | `/api/v1/github/repositories/:id/sync` | Manually sync commits and pull requests |
| `POST` | `/api/v1/github/repositories/:id/analyze` | Run full analysis & map to 9 PRISM dimensions |
| `POST` | `/api/v1/github/upload-zip` | Upload & evaluate project ZIP archive |
| `POST` | `/api/v1/github/webhook` | GitHub webhook receiver with HMAC SHA256 check |
| `GET` | `/api/v1/github/repositories/:id/contributors` | 5-parameter student contribution breakdown |


