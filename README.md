# PRISM — Project Review & Intelligence for Software Metrics

> See beyond the code.

PRISM is an AI-powered software engineering evaluation platform that analyzes GitHub repositories, tracks individual student contributions, assesses code quality, and verifies technical understanding through personalized AI assessments.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 24.0+
- Docker Compose v2.0+
- 8GB RAM recommended
- 20GB disk space

### Start in 3 Commands
```bash
git clone <repo-url> prism
cd prism
cp .env.example .env
docker compose up --build
```

Then open: http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Platform Admin | admin@prism.dev | Admin@123 |
| Institution Admin | inst.admin@mit-tech.edu | Admin@123 |
| Faculty Coordinator | coordinator@mit-tech.edu | Faculty@123 |
| Faculty Evaluator | evaluator@mit-tech.edu | Faculty@123 |
| Project Guide | guide@mit-tech.edu | Faculty@123 |
| Team Lead | teamlead@mit-tech.edu | Student@123 |
| Student | student1@mit-tech.edu | Student@123 |
| Stakeholder | stakeholder@mit-tech.edu | View@123 |

> ⚠️ **Demo credentials are for development only.** Change all passwords before production deployment.

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js 14    │────▶│  Express + TS   │
│   Frontend      │     │  Backend API     │
│   :3000         │     │  :4000           │
└─────────────────┘     └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼              ▼
              ┌──────────┐ ┌──────────┐ ┌──────────────┐
              │PostgreSQL│ │  Redis   │ │Python FastAPI │
              │   :5432  │ │  :6379   │ │Analysis :8000 │
              └──────────┘ └──────────┘ └──────────────┘
```

## 🔧 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js 14 App Router |
| Backend API | 4000 | Express.js + TypeScript |
| Analysis Service | 8000 | Python FastAPI analyzer |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache & job queue |

## 📋 Features

### ✅ Implemented
- 8-role RBAC with backend enforcement
- 6-institution multi-tenant architecture
- Project & Team management
- GitHub integration (with demo mode)
- 98-parameter metric evaluation engine
- 9-dimensional scoring (Quality, Design, Testing, Efficiency, Git, Docs, Security, Understanding, Scope)
- Individual contribution scoring
- AI quiz generation (with demo mode)
- Security findings center
- PDF/CSV report generation
- Real-time notifications
- Audit log system
- Evaluation evidence breakdown

### 🔧 External Credentials & GitHub Integration Setup

PRISM supports both **Live GitHub App / OAuth Integration** and a zero-configuration **Demo Sandbox Mode** with an alternative **Project ZIP Upload Pipeline**.

#### 1. Configuring Live GitHub OAuth & Webhooks
In `backend/.env`:
```env
# GitHub OAuth / App
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY_PATH=./secrets/github-app.pem
GITHUB_APP_WEBHOOK_SECRET=your_webhook_hmac_secret
```

#### 2. GitHub Webhook Configuration
In your GitHub Organization or Repository settings:
- **Payload URL**: `https://<your-domain>/api/v1/github/webhook`
- **Content type**: `application/json`
- **Secret**: Match `GITHUB_APP_WEBHOOK_SECRET`
- **Events subscribed**:
  - `Pull requests` (opened, synchronize, reopened, closed, merged)
  - `Pushes`
  - `Pull request reviews`

#### 3. Zero-Credential Demo & ZIP Upload Mode
If GitHub credentials are not supplied:
- **Demo Mode**: Explicitly labelled sandbox mode with pre-configured capstone repositories, pull requests, commits, and AST analysis.
- **Project ZIP Upload**: Drag & drop or select any student project ZIP (up to 25MB) with automatic safe sandboxed extraction, language detection, manifest inspection, and direct evaluation across the 9 PRISM dimensions.

### 🔧 Other Credentials
- OpenAI API Key (OPENAI_API_KEY) — demo quiz mode active without
- SMTP Email (optional) — in-app notifications work without

## 🏃 Development Setup

### Backend (Node.js)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Analysis Service (Python)
```bash
cd analysis-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 🗄️ Database

### Reset & Reseed
```bash
docker compose exec backend npm run db:reset
docker compose exec backend npm run db:seed
```

### View Database
```bash
docker compose exec backend npx prisma studio
```

## 📊 Scoring System

### Three Independent Scores
1. **Push Quality Score (PQS)** — Engineering quality across 9 dimensions
2. **Individual Contribution Score (ICS)** — Verified work attribution
3. **Understanding Score (US)** — Quiz-based comprehension

### Grade Bands
| Score | Grade |
|-------|-------|
| 90–100 | Excellent |
| 75–89 | Good |
| 60–74 | Satisfactory |
| 40–59 | Needs Work |
| 0–39 | Weak |

## 🔒 Security

- All passwords hashed with bcrypt (12 rounds)
- JWT access tokens (15 min) + refresh tokens (7 days)
- Backend RBAC enforcement on every route
- Tenant isolation — users cannot access cross-institution data
- Webhook signature validation
- No secrets in frontend
- Docker non-root containers

## 🧪 Running Tests
```bash
docker compose exec backend npm test
```

## 🚢 Production Deployment

Before deploying to production:
1. Change all JWT secrets in .env
2. Use a managed PostgreSQL (not Docker)
3. Set up Redis Sentinel for HA
4. Configure SMTP for email notifications
5. Add GitHub App credentials
6. Add OpenAI API key for live AI assessment
7. Set NODE_ENV=production
8. Enable SSL/TLS termination
9. Configure rate limiting
10. Set up backups

---

Built with ❤️ by the PRISM team.
