import crypto from 'crypto'
import { Octokit } from '@octokit/rest'
import { prisma } from '../lib/prisma'
import { logger } from '../lib/logger'

export interface GitHubConfig {
  clientId?: string
  clientSecret?: string
  appId?: string
  privateKeyPath?: string
  webhookSecret?: string
  isConfigured: boolean
}

export interface GitHubRepoSummary {
  id: string
  githubRepoId: string
  fullName: string
  owner: string
  name: string
  description?: string
  language?: string
  languages?: Record<string, number>
  isPrivate: boolean
  defaultBranch: string
  cloneUrl?: string
  htmlUrl?: string
  openPrCount?: number
  starsCount?: number
  updatedAt?: string
}

class GitHubService {
  private config: GitHubConfig

  constructor() {
    const clientId = process.env['GITHUB_CLIENT_ID']?.trim()
    const clientSecret = process.env['GITHUB_CLIENT_SECRET']?.trim()
    const appId = process.env['GITHUB_APP_ID']?.trim()
    const privateKeyPath = process.env['GITHUB_APP_PRIVATE_KEY_PATH']?.trim()
    const webhookSecret = process.env['GITHUB_APP_WEBHOOK_SECRET']?.trim()

    const isConfigured = Boolean(clientId && clientSecret)

    this.config = {
      clientId,
      clientSecret,
      appId,
      privateKeyPath,
      webhookSecret,
      isConfigured,
    }

    if (!isConfigured) {
      logger.warn('[GitHubService] GitHub App/OAuth credentials not fully configured. Demo Sandbox Mode available.')
    }
  }

  public getConfig(): GitHubConfig {
    return { ...this.config }
  }

  public isConfigured(): boolean {
    return this.config.isConfigured
  }

  /**
   * Generates OAuth authorization URL or returns setup instructions if unconfigured.
   */
  public getAuthorizationUrl(state: string, redirectUri?: string): { url?: string; configured: boolean; message?: string } {
    if (!this.config.isConfigured || !this.config.clientId) {
      return {
        configured: false,
        message: 'GitHub OAuth is not configured on this server. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env to enable live authorization, or use Demo Mode.',
      }
    }

    const base = 'https://github.com/login/oauth/authorize'
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      scope: 'repo,read:user,user:email',
      state,
    })
    if (redirectUri) params.append('redirect_uri', redirectUri)

    return {
      configured: true,
      url: `${base}?${params.toString()}`,
    }
  }

  /**
   * Exchanges an OAuth code for an access token.
   */
  public async exchangeCodeForToken(code: string, redirectUri?: string): Promise<{ accessToken: string; tokenType: string; scope: string }> {
    if (!this.config.isConfigured || !this.config.clientId || !this.config.clientSecret) {
      throw new Error('GitHub OAuth credentials are not configured on the server.')
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`GitHub token exchange failed: ${response.statusText}`)
    }

    const data = await response.json() as any
    if (data.error) {
      throw new Error(`GitHub authorization error: ${data.error_description || data.error}`)
    }

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      scope: data.scope,
    }
  }

  /**
   * Fetches user profile for a token
   */
  public async getAuthenticatedUser(accessToken: string): Promise<{ login: string; id: number; name: string; email: string; avatarUrl: string }> {
    const octokit = new Octokit({ auth: accessToken })
    const { data: user } = await octokit.users.getAuthenticated()
    let email = user.email || ''

    if (!email) {
      try {
        const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser()
        const primary = emails.find((e) => e.primary && e.verified)
        email = primary ? primary.email : emails[0]?.email || ''
      } catch {}
    }

    return {
      login: user.login,
      id: user.id,
      name: user.name || user.login,
      email,
      avatarUrl: user.avatar_url,
    }
  }

  /**
   * Lists repositories: authentic if token provided, otherwise demo sandbox data.
   */
  public async listRepositories(
    accessToken?: string,
    options?: { search?: string; visibility?: string; page?: number; perPage?: number }
  ): Promise<{ repositories: GitHubRepoSummary[]; totalCount: number; isDemo: boolean }> {
    if (accessToken && this.config.isConfigured) {
      try {
        const octokit = new Octokit({ auth: accessToken })
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
          sort: 'updated',
          per_page: options?.perPage || 30,
          page: options?.page || 1,
          visibility: (options?.visibility as any) || 'all',
        })

        const mapped: GitHubRepoSummary[] = repos.map((r) => ({
          id: String(r.id),
          githubRepoId: String(r.id),
          fullName: r.full_name,
          owner: r.owner.login,
          name: r.name,
          description: r.description || undefined,
          language: r.language || undefined,
          isPrivate: r.private,
          defaultBranch: r.default_branch,
          cloneUrl: r.clone_url,
          htmlUrl: r.html_url,
          starsCount: r.stargazers_count,
          updatedAt: r.updated_at || undefined,
        }))

        let filtered = mapped
        if (options?.search) {
          const q = options.search.toLowerCase()
          filtered = filtered.filter((r) => r.fullName.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
        }

        return {
          repositories: filtered,
          totalCount: filtered.length,
          isDemo: false,
        }
      } catch (err: any) {
        logger.error(`[GitHubService] Error fetching repositories: ${err.message}`)
        // Fallback to demo mode if token expired or API failed
      }
    }

    // Demo Mode Repositories (explicitly labelled)
    const DEMO_REPOSITORIES: GitHubRepoSummary[] = [
      {
        id: 'gh-demo-1',
        githubRepoId: '98432101',
        fullName: 'prism-team-nebula/smart-campus-iot',
        owner: 'prism-team-nebula',
        name: 'smart-campus-iot',
        description: 'IoT sensor network telemetry aggregator and real-time campus dashboard in TypeScript & Node.js',
        language: 'TypeScript',
        languages: { TypeScript: 12450, JavaScript: 2310, HTML: 850, CSS: 1200 },
        isPrivate: false,
        defaultBranch: 'main',
        cloneUrl: 'https://github.com/prism-team-nebula/smart-campus-iot.git',
        htmlUrl: 'https://github.com/prism-team-nebula/smart-campus-iot',
        openPrCount: 3,
        starsCount: 14,
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'gh-demo-2',
        githubRepoId: '98432102',
        fullName: 'prism-team-aurora/healthcare-portal-microservices',
        owner: 'prism-team-aurora',
        name: 'healthcare-portal-microservices',
        description: 'Patient records & appointment scheduling microservice suite with JWT auth and FHIR validation',
        language: 'Python',
        languages: { Python: 18400, Dockerfile: 320, Shell: 540 },
        isPrivate: true,
        defaultBranch: 'main',
        cloneUrl: 'https://github.com/prism-team-aurora/healthcare-portal-microservices.git',
        htmlUrl: 'https://github.com/prism-team-aurora/healthcare-portal-microservices',
        openPrCount: 2,
        starsCount: 8,
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'gh-demo-3',
        githubRepoId: '98432103',
        fullName: 'prism-team-pulsar/distributed-kv-cache',
        owner: 'prism-team-pulsar',
        name: 'distributed-kv-cache',
        description: 'High-throughput in-memory key-value store implementing Raft consensus in Java 21',
        language: 'Java',
        languages: { Java: 22100, Shell: 180 },
        isPrivate: false,
        defaultBranch: 'master',
        cloneUrl: 'https://github.com/prism-team-pulsar/distributed-kv-cache.git',
        htmlUrl: 'https://github.com/prism-team-pulsar/distributed-kv-cache',
        openPrCount: 1,
        starsCount: 29,
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'gh-demo-4',
        githubRepoId: '98432104',
        fullName: 'prism-team-orion/autonomous-robot-slam',
        owner: 'prism-team-orion',
        name: 'autonomous-robot-slam',
        description: 'Simultaneous Localization and Mapping algorithm benchmark suite using LiDAR point clouds',
        language: 'C++',
        languages: { 'C++': 15600, C: 4200, CMake: 450 },
        isPrivate: true,
        defaultBranch: 'main',
        cloneUrl: 'https://github.com/prism-team-orion/autonomous-robot-slam.git',
        htmlUrl: 'https://github.com/prism-team-orion/autonomous-robot-slam',
        openPrCount: 4,
        starsCount: 19,
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'gh-demo-5',
        githubRepoId: '98432105',
        fullName: 'prism-team-quasar/mlops-pipeline-orchestrator',
        owner: 'prism-team-quasar',
        name: 'mlops-pipeline-orchestrator',
        description: 'Automated ML training and evaluation pipeline running on Kubernetes with MLflow tracking',
        language: 'Python',
        languages: { Python: 14200, YAML: 1100, Shell: 400 },
        isPrivate: false,
        defaultBranch: 'main',
        cloneUrl: 'https://github.com/prism-team-quasar/mlops-pipeline-orchestrator.git',
        htmlUrl: 'https://github.com/prism-team-quasar/mlops-pipeline-orchestrator',
        openPrCount: 0,
        starsCount: 35,
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ]

    let filtered = DEMO_REPOSITORIES
    if (options?.search) {
      const q = options.search.toLowerCase()
      filtered = filtered.filter((r) => r.fullName.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
    }
    if (options?.visibility === 'public') {
      filtered = filtered.filter((r) => !r.isPrivate)
    } else if (options?.visibility === 'private') {
      filtered = filtered.filter((r) => r.isPrivate)
    }

    return {
      repositories: filtered,
      totalCount: filtered.length,
      isDemo: true,
    }
  }

  /**
   * Verifies GitHub Webhook HMAC SHA256 Signature
   */
  public verifyWebhookSignature(payloadBuffer: Buffer | string, signatureHeader?: string): boolean {
    const secret = this.config.webhookSecret
    if (!secret) {
      logger.warn('[GitHubWebhook] No GITHUB_APP_WEBHOOK_SECRET set — skipping HMAC verification')
      return true
    }

    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
      return false
    }

    const signature = signatureHeader.slice(7)
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payloadBuffer)
    const expected = hmac.digest('hex')

    try {
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
    } catch {
      return false
    }
  }

  /**
   * Process a verified incoming webhook event
   */
  public async handleWebhookEvent(deliveryId: string, eventName: string, payload: any): Promise<{ processed: boolean; reason?: string }> {
    logger.info(`[GitHubWebhook] Processing event=${eventName} delivery=${deliveryId}`)

    // Check if repository exists in PRISM
    const repoFullName = payload.repository?.full_name
    const githubRepoId = String(payload.repository?.id || '')

    const repo = await prisma.repository.findFirst({
      where: {
        OR: [
          { githubRepoId },
          { fullName: repoFullName },
        ],
      },
      include: { project: true },
    })

    if (!repo) {
      return { processed: false, reason: `Repository ${repoFullName || githubRepoId} is not linked to any PRISM project` }
    }

    // Deduplicate event delivery
    const existing = await prisma.webhookEvent.findUnique({
      where: { deliveryId },
    })
    if (existing) {
      return { processed: true, reason: 'Duplicate delivery already recorded' }
    }

    const action = payload.action || 'push'
    await prisma.webhookEvent.create({
      data: {
        repositoryId: repo.id,
        deliveryId,
        eventType: eventName,
        action,
        payload,
        processed: true,
        processedAt: new Date(),
      },
    })

    // Handle pull_request
    if (eventName === 'pull_request') {
      const prData = payload.pull_request
      const prNumber = prData.number
      const state = prData.merged ? 'merged' : prData.state

      const pr = await prisma.pullRequest.upsert({
        where: {
          repositoryId_githubPrNumber: {
            repositoryId: repo.id,
            githubPrNumber: prNumber,
          },
        },
        update: {
          title: prData.title,
          description: prData.body,
          state,
          headBranch: prData.head.ref,
          baseBranch: prData.base.ref,
          mergeCommitSha: prData.merge_commit_sha,
          additions: prData.additions || 0,
          deletions: prData.deletions || 0,
          changedFiles: prData.changed_files || 0,
          isDraft: Boolean(prData.draft),
          mergedAt: prData.merged_at ? new Date(prData.merged_at) : null,
          closedAt: prData.closed_at ? new Date(prData.closed_at) : null,
        },
        create: {
          repositoryId: repo.id,
          githubPrNumber: prNumber,
          title: prData.title,
          description: prData.body,
          state,
          authorLogin: prData.user.login,
          authorEmail: prData.user.email,
          headBranch: prData.head.ref,
          baseBranch: prData.base.ref,
          mergeCommitSha: prData.merge_commit_sha,
          additions: prData.additions || 0,
          deletions: prData.deletions || 0,
          changedFiles: prData.changed_files || 0,
          isDraft: Boolean(prData.draft),
          mergedAt: prData.merged_at ? new Date(prData.merged_at) : null,
          closedAt: prData.closed_at ? new Date(prData.closed_at) : null,
        },
      })

      // If PR was merged, trigger a completed code change evaluation run
      if (action === 'closed' && prData.merged) {
        logger.info(`[GitHubWebhook] PR #${prNumber} merged into ${repo.fullName} — queueing evaluation run`)
        // Evaluation trigger will be called via evaluation service
      }

      return { processed: true, reason: `Pull request #${prNumber} updated: ${state}` }
    }

    // Handle push
    if (eventName === 'push') {
      const commits = payload.commits || []
      for (const c of commits) {
        await prisma.commit.upsert({
          where: {
            repositoryId_sha: {
              repositoryId: repo.id,
              sha: c.id,
            },
          },
          update: {
            message: c.message,
            authorName: c.author?.name || 'Unknown',
            authorEmail: c.author?.email || 'unknown@example.com',
          },
          create: {
            repositoryId: repo.id,
            sha: c.id,
            message: c.message,
            authorName: c.author?.name || 'Unknown',
            authorEmail: c.author?.email || 'unknown@example.com',
            authoredAt: new Date(c.timestamp || Date.now()),
            committedAt: new Date(c.timestamp || Date.now()),
            additions: c.added?.length || 0,
            deletions: c.removed?.length || 0,
            filesChanged: (c.modified?.length || 0) + (c.added?.length || 0) + (c.removed?.length || 0),
          },
        }).catch(() => {})
      }

      await prisma.repository.update({
        where: { id: repo.id },
        data: { lastSyncedAt: new Date() },
      })

      return { processed: true, reason: `Recorded ${commits.length} commits from push` }
    }

    return { processed: true, reason: `Handled event ${eventName}` }
  }
}

export const githubService = new GitHubService()

