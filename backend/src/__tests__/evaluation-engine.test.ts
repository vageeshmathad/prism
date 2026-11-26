import { analysisService, PHASE_WEIGHTS } from '../services/analysis.service'
import { ZipAnalysisResult } from '../services/zip.service'

describe('PRISM Evaluation Engine — Fairness, Accuracy & Evidence-Based Scoring Test Suite', () => {
  const createMockZip = (overrides: Partial<ZipAnalysisResult> = {}): ZipAnalysisResult => ({
    tempDir: '/tmp/prism_test',
    totalFiles: 5,
    totalSize: 12000,
    languages: { TypeScript: 450 },
    primaryLanguage: 'TypeScript',
    fileTree: [
      { path: 'src/index.ts', size: 2000, language: 'TypeScript', isTest: false, lines: 80 },
      { path: 'src/service.ts', size: 3000, language: 'TypeScript', isTest: false, lines: 120 },
      { path: 'src/service.test.ts', size: 2500, language: 'TypeScript', isTest: true, lines: 90 },
      { path: 'package.json', size: 800, isTest: false },
      { path: 'README.md', size: 1200, isDoc: true },
    ],
    manifests: [{ name: 'package.json', path: 'package.json', type: 'npm/node' }],
    hasTests: true,
    testFiles: ['src/service.test.ts'],
    hasDocs: true,
    docFiles: ['README.md'],
    readmeContent: '# Sample Project\n\nComprehensive instructions and architecture overview.',
    totalSourceLines: 290,
    totalCommentLines: 35,
    totalBlankLines: 25,
    oversizedFiles: [],
    secretsDetected: [],
    deepNestingFiles: [],
    ...overrides,
  })

  describe('1. Mathematical Integrity & Phase Weight Normalization', () => {
    it('should maintain exact 1.0 (100%) sum across Phase 1, Phase 2, and Phase 3 weights', () => {
      for (const phase of ['PHASE_1', 'PHASE_2', 'PHASE_3']) {
        const weights = PHASE_WEIGHTS[phase]!
        const sum = Object.values(weights).reduce((a, b) => a + b, 0)
        expect(Math.round(sum * 100) / 100).toBe(1.0)
      }
    })

    it('should keep overall score strictly bounded within [0, 100]', async () => {
      const mockZip = createMockZip()
      const result = await analysisService.analyzeRepository({
        repositoryId: 'test-repo-bounds',
        institutionId: 'inst-1',
        phase: 'PHASE_2',
        zipAnalysis: mockZip,
      })

      expect(result.overallScore).toBeGreaterThanOrEqual(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)
      for (const dim of result.dimensionScores) {
        expect(dim.rawScore).toBeGreaterThanOrEqual(0)
        expect(dim.rawScore).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('2. Fairness Across Project Sizes & Lines of Code', () => {
    it('should NOT penalize small projects for having few files (low LOC fairness)', () => {
      // 3 files, 90 lines of clean code, README present
      const smallZip = createMockZip({
        totalFiles: 3,
        totalSourceLines: 90,
        oversizedFiles: [],
        fileTree: [
          { path: 'main.py', size: 1000, language: 'Python', isTest: false, lines: 50 },
          { path: 'utils.py', size: 800, language: 'Python', isTest: false, lines: 40 },
          { path: 'README.md', size: 600, isDoc: true },
        ],
        languages: { Python: 90 },
        primaryLanguage: 'Python',
      })

      const qual = analysisService.evaluateCodeQuality(smallZip)
      // Must not be penalized for being concise; expect high maintainability (>= 90)
      expect(qual.score).toBeGreaterThanOrEqual(90)
      expect(qual.status).toBe('PASSED')
      expect(qual.positiveEvidence.some((e) => e.parameter === 'Concise Scope')).toBe(true)
    })

    it('should flag oversized monolithic files with traceable evidence without double counting', () => {
      const monolithZip = createMockZip({
        totalFiles: 2,
        totalSourceLines: 1200,
        oversizedFiles: [{ path: 'src/giantMonolith.ts', lines: 1100 }],
        fileTree: [
          { path: 'src/giantMonolith.ts', size: 25000, language: 'TypeScript', isTest: false, lines: 1100 },
          { path: 'package.json', size: 500, isTest: false },
        ],
      })

      const qual = analysisService.evaluateCodeQuality(monolithZip)
      expect(qual.findings.length).toBeGreaterThan(0)
      expect(qual.findings[0]?.ruleId).toBe('PRISM-QUAL-001')
      expect(qual.findings[0]?.filePath).toBe('src/giantMonolith.ts')
      expect(qual.findings[0]?.scoreImpact).toBeLessThan(0)
    })
  })

  describe('3. Language Agnostic Fairness', () => {
    it('should fairly evaluate Python repositories without requiring Java/Node web patterns', () => {
      const pythonZip = createMockZip({
        primaryLanguage: 'Python',
        languages: { Python: 500 },
        manifests: [{ name: 'requirements.txt', path: 'requirements.txt', type: 'pip' }],
        fileTree: [
          { path: 'app.py', size: 3000, language: 'Python', isTest: false, lines: 120 },
          { path: 'models.py', size: 2000, language: 'Python', isTest: false, lines: 80 },
          { path: 'tests/test_app.py', size: 2500, language: 'Python', isTest: true, lines: 90 },
          { path: 'requirements.txt', size: 200, isTest: false },
          { path: 'README.md', size: 800, isDoc: true },
        ],
        hasTests: true,
        testFiles: ['tests/test_app.py'],
      })

      const design = analysisService.evaluateDesignStructure(pythonZip)
      expect(design.score).toBeGreaterThanOrEqual(85)
      expect(design.status).toBe('PASSED')
      expect(design.positiveEvidence.some((p) => p.parameter === 'Dependency & Build Manifests')).toBe(true)
    })

    it('should fairly evaluate C / C++ repositories with Makefile or CMake', () => {
      const cppZip = createMockZip({
        primaryLanguage: 'C++',
        languages: { 'C++': 800 },
        manifests: [{ name: 'CMakeLists.txt', path: 'CMakeLists.txt', type: 'cmake' }],
        fileTree: [
          { path: 'src/main.cpp', size: 4000, language: 'C++', isTest: false, lines: 150 },
          { path: 'include/engine.hpp', size: 2000, language: 'C++', isTest: false, lines: 80 },
          { path: 'CMakeLists.txt', size: 500, isTest: false },
          { path: 'README.md', size: 900, isDoc: true },
        ],
      })

      const design = analysisService.evaluateDesignStructure(cppZip)
      expect(design.score).toBeGreaterThanOrEqual(85)
      expect(design.positiveEvidence.some((p) => p.detail.includes('CMakeLists.txt'))).toBe(true)
    })
  })

  describe('4. Evidence-Based Security Scanning without False Positives', () => {
    it('should award 100/100 to clean repositories with 0 fabricated flags', () => {
      const cleanZip = createMockZip({ secretsDetected: [] })
      const sec = analysisService.evaluateSecurity(cleanZip)

      expect(sec.score).toBe(100)
      expect(sec.status).toBe('PASSED')
      expect(sec.findings.length).toBe(0)
      expect(sec.positiveEvidence[0]?.parameter).toBe('Secret & Credential Scanning')
    })

    it('should produce concrete, traceable findings for confirmed private keys or tokens', () => {
      const compromisedZip = createMockZip({
        secretsDetected: [
          {
            ruleId: 'PRISM-SEC-001',
            ruleName: 'Hardcoded Private Key',
            description: 'Exposed unencrypted cryptographic private key detected in source code',
            filePath: 'src/config/jwt.key',
            lineNumber: 12,
            severity: 'CRITICAL',
            remediation: 'Remove private keys from repository immediately.',
          },
        ],
      })

      const sec = analysisService.evaluateSecurity(compromisedZip)
      expect(sec.score).toBeLessThanOrEqual(75)
      expect(sec.status).toBe('FAILED')
      expect(sec.findings.length).toBe(1)
      expect(sec.findings[0]?.filePath).toBe('src/config/jwt.key')
      expect(sec.findings[0]?.lineNumber).toBe(12)
      expect(sec.findings[0]?.severity).toBe('CRITICAL')
    })
  })

  describe('5. Handling Unavailable Analysis without Unfair Zero Penalties', () => {
    it('should mark Git Hygiene as NOT_APPLICABLE for ZIP uploads and renormalize weights', async () => {
      const mockZip = createMockZip()
      // Zero git commits (ZIP archive upload)
      const result = await analysisService.analyzeRepository({
        repositoryId: 'zip-repo-no-git',
        institutionId: 'inst-1',
        phase: 'PHASE_2',
        zipAnalysis: mockZip,
        commits: [],
      })

      const gitDim = result.dimensionScores.find((d) => d.dimension === 'git_hygiene')
      expect(gitDim).toBeDefined()
      expect(gitDim?.status).toBe('NOT_APPLICABLE')
      expect(gitDim?.effectiveWeight).toBe(0)

      // Overall score must still reflect high marks from evaluated dimensions (>= 80)
      // rather than being dragged down by a 0 for missing git history
      expect(result.overallScore).toBeGreaterThanOrEqual(80)
    })

    it('should handle completely unavailable source files gracefully as UNAVAILABLE', () => {
      const emptyZip = undefined
      const qual = analysisService.evaluateCodeQuality(emptyZip)
      const sec = analysisService.evaluateSecurity(emptyZip)
      const test = analysisService.evaluateTesting(emptyZip)

      expect(qual.status).toBe('UNAVAILABLE')
      expect(sec.status).toBe('UNAVAILABLE')
      expect(test.status).toBe('UNAVAILABLE')
    })
  })

  describe('6. Fair Contribution Attribution without Commit Spam Bias', () => {
    it('should award 100% share to solo developers on solo projects with high confidence', () => {
      const soloCommits = [
        { sha: 'c1', message: 'feat: init core module', authorName: 'Solo Dev', authorEmail: 'solo@dev.local', additions: 150 },
        { sha: 'c2', message: 'test: add test suite', authorName: 'Solo Dev', authorEmail: 'solo@dev.local', additions: 80 },
      ]

      const contribs = analysisService.calculateIndividualContributions([], soloCommits, [])
      expect(contribs.length).toBe(1)
      expect(contribs[0]?.overallScore).toBeGreaterThanOrEqual(90)
      expect(contribs[0]?.confidence).toBeGreaterThanOrEqual(90)
      expect(contribs[0]?.breakdown.implementation).toBeGreaterThanOrEqual(90)
    })

    it('should dampen commit spamming through non-linear scaling across team members', () => {
      const members = [
        { user: { id: 'u1', firstName: 'Alice', email: 'alice@team.local' }, isLead: true },
        { user: { id: 'u2', firstName: 'Bob', email: 'bob@team.local' }, isLead: false },
      ]

      // Alice has 5 thoughtful commits, Bob spammed 50 tiny commits
      const commits = [
        ...Array.from({ length: 5 }, (_, i) => ({
          sha: `a${i}`,
          message: `feat(core): implementation phase ${i}`,
          authorEmail: 'alice@team.local',
          authorName: 'Alice',
          additions: 100,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          sha: `b${i}`,
          message: `fix: typo ${i}`,
          authorEmail: 'bob@team.local',
          authorName: 'Bob',
          additions: 2,
        })),
      ]

      const contribs = analysisService.calculateIndividualContributions(members, commits, [])
      const alice = contribs.find((c) => c.email === 'alice@team.local')!
      const bob = contribs.find((c) => c.email === 'bob@team.local')!

      // Bob's 50 commits must NOT overshadow Alice unfairly:
      // Both should have reasonable scores within 15 points of each other
      expect(Math.abs(bob.overallScore - alice.overallScore)).toBeLessThanOrEqual(15)
    })
  })
})
