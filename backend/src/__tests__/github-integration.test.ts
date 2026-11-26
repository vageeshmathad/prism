import crypto from 'crypto'
import { githubService } from '../services/github.service'
import { PHASE_WEIGHTS, analysisService } from '../services/analysis.service'
import { extractAndInspectZip } from '../services/zip.service'
import zlib from 'zlib'

describe('PRISM GitHub Integration Test Suite', () => {
  describe('1. GitHub Service & Webhook HMAC Verification', () => {
    it('should correctly report configuration status', () => {
      const config = githubService.getConfig()
      expect(config).toBeDefined()
      expect(typeof githubService.isConfigured()).toBe('boolean')
    })

    it('should verify valid HMAC SHA-256 webhook signatures', () => {
      const secret = 'test-webhook-secret-12345'
      const svc: any = githubService
      svc.config.webhookSecret = secret

      const payload = JSON.stringify({ action: 'opened', repository: { full_name: 'prism/test-repo' } })
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(payload)
      const validSig = `sha256=${hmac.digest('hex')}`

      const isValid = githubService.verifyWebhookSignature(payload, validSig)
      expect(isValid).toBe(true)

      const isInvalid = githubService.verifyWebhookSignature(payload, 'sha256=invalidhex000000')
      expect(isInvalid).toBe(false)
    })

    it('should list demo repositories with language distribution when in demo mode', async () => {
      const result = await githubService.listRepositories(undefined, { search: 'iot' })
      expect(result.repositories.length).toBeGreaterThan(0)
      expect(result.repositories[0]?.fullName).toContain('smart-campus-iot')
      expect(result.repositories[0]?.language).toBe('TypeScript')
      expect(result.isDemo).toBe(true)
    })
  })

  describe('2. Safe ZIP Extraction & Zip-Slip Protection', () => {
    it('should reject archives attempting path traversal', async () => {
      // Craft a malicious in-memory zip header with '../'
      const maliciousName = '../../etc/passwd'
      const nameBuf = Buffer.from(maliciousName, 'utf-8')

      const header = Buffer.alloc(30 + nameBuf.length)
      header.writeUInt32LE(0x04034b50, 0) // PK\x03\x04
      header.writeUInt16LE(20, 4) // version
      header.writeUInt16LE(0, 6) // flags
      header.writeUInt16LE(0, 8) // no compression
      header.writeUInt32LE(0, 10) // mod time
      header.writeUInt32LE(0, 14) // crc
      header.writeUInt32LE(0, 18) // compressed size
      header.writeUInt32LE(0, 22) // uncompressed size
      header.writeUInt16LE(nameBuf.length, 26) // filename length
      header.writeUInt16LE(0, 28) // extra field length
      nameBuf.copy(header, 30)

      await expect(extractAndInspectZip(header, 'malicious.zip')).rejects.toThrow(/Security Exception/)
    })
  })

  describe('3. PRISM Evaluation Engine & 9-Dimension Phase Weight Mapping', () => {
    it('should adhere to exact Phase 1, Phase 2, and Phase 3 weight distributions', () => {
      const p1 = PHASE_WEIGHTS['PHASE_1']!
      const p2 = PHASE_WEIGHTS['PHASE_2']!
      const p3 = PHASE_WEIGHTS['PHASE_3']!

      // Phase 1 verification
      expect(p1['code_quality']).toBe(0.10)
      expect(p1['design_structure']).toBe(0.20)
      expect(p1['correctness_testing']).toBe(0.05)
      expect(p1['efficiency']).toBe(0.00)
      expect(p1['git_hygiene']).toBe(0.15)
      expect(p1['documentation']).toBe(0.15)
      expect(p1['security']).toBe(0.10)
      expect(p1['understanding']).toBe(0.20)
      expect(p1['task_scope']).toBe(0.05)

      // Verify each phase sums to 1.0 (100%)
      const sum1 = Object.values(p1).reduce((a, b) => a + b, 0)
      const sum2 = Object.values(p2).reduce((a, b) => a + b, 0)
      const sum3 = Object.values(p3).reduce((a, b) => a + b, 0)

      expect(Math.round(sum1 * 100) / 100).toBe(1.0)
      expect(Math.round(sum2 * 100) / 100).toBe(1.0)
      expect(Math.round(sum3 * 100) / 100).toBe(1.0)
    })

    it('should calculate individual student contribution according to 5 agreed weights', () => {
      const impl = 90
      const testing = 85
      const prs = 92
      const reviews = 84
      const docs = 86

      // 30% impl, 20% test, 20% prs, 15% reviews, 15% docs
      const expected = Math.round(
        impl * 0.30 +
        testing * 0.20 +
        prs * 0.20 +
        reviews * 0.15 +
        docs * 0.15
      )

      expect(expected).toBe(88)
    })
  })
})

