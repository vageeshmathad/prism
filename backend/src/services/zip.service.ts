import fs from 'fs'
import path from 'path'
import os from 'os'
import zlib from 'zlib'
import { logger } from '../lib/logger'

export interface SecretFindingDetail {
  ruleId: string
  ruleName: string
  description: string
  filePath: string
  lineNumber: number
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  preview?: string
  remediation: string
}

export interface ZipAnalysisResult {
  tempDir: string
  totalFiles: number
  totalSize: number
  languages: Record<string, number> // language -> line count
  primaryLanguage: string
  fileTree: Array<{ path: string; size: number; language?: string; isTest?: boolean; isDoc?: boolean; lines?: number }>
  manifests: Array<{ name: string; path: string; type: string }>
  hasTests: boolean
  testFiles: string[]
  hasDocs: boolean
  docFiles: string[]
  readmeContent?: string
  totalSourceLines: number
  totalCommentLines: number
  totalBlankLines: number
  oversizedFiles: Array<{ path: string; lines: number }>
  secretsDetected: SecretFindingDetail[]
  deepNestingFiles: Array<{ path: string; maxNesting: number; lineNumber: number }>
}

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.py': 'Python',
  '.java': 'Java',
  '.c': 'C',
  '.h': 'C',
  '.cpp': 'C++',
  '.hpp': 'C++',
  '.cc': 'C++',
  '.go': 'Go',
  '.rs': 'Rust',
  '.cs': 'C#',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.html': 'HTML',
  '.css': 'CSS',
  '.sql': 'SQL',
}

const MANIFEST_PATTERNS: Record<string, string> = {
  'package.json': 'npm/node',
  'package-lock.json': 'npm/lock',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'requirements.txt': 'pip',
  'Pipfile': 'pipenv',
  'pyproject.toml': 'poetry/pip',
  'pom.xml': 'maven',
  'build.gradle': 'gradle',
  'build.gradle.kts': 'gradle',
  'CMakeLists.txt': 'cmake',
  'Makefile': 'make',
  'Cargo.toml': 'cargo',
  'go.mod': 'go-modules',
}

/**
 * Safely unpacks a ZIP buffer into a controlled temporary sandbox directory
 * with strict Zip-Slip protection and limits.
 */
export async function extractAndInspectZip(
  zipBuffer: Buffer,
  originalFilename = 'project.zip'
): Promise<ZipAnalysisResult> {
  const sandboxId = `prism_zip_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  const destDir = path.join(os.tmpdir(), sandboxId)
  fs.mkdirSync(destDir, { recursive: true, mode: 0o700 })

  logger.info(`[ZipService] Extracting ${originalFilename} to sandbox: ${destDir}`)

  // Parse zip using Central Directory records to prevent Zip-Slip
  const entries = parseZipBuffer(zipBuffer)

  const MAX_FILES = 5000
  const MAX_TOTAL_BYTES = 100 * 1024 * 1024 // 100 MB decompressed limit

  if (entries.length > MAX_FILES) {
    throw new Error(`Archive exceeds maximum allowed file count (${MAX_FILES})`)
  }

  let totalDecompressedBytes = 0
  const fileTree: Array<{ path: string; size: number; language?: string; isTest?: boolean; isDoc?: boolean; lines?: number }> = []
  const languageLineCounts: Record<string, number> = {}
  const manifests: Array<{ name: string; path: string; type: string }> = []
  const testFiles: string[] = []
  const docFiles: string[] = []
  let hasTests = false
  let hasDocs = false
  let readmeContent = ''
  let totalSourceLines = 0
  let totalCommentLines = 0
  let totalBlankLines = 0
  const oversizedFiles: Array<{ path: string; lines: number }> = []
  const secretsDetected: SecretFindingDetail[] = []
  const deepNestingFiles: Array<{ path: string; maxNesting: number; lineNumber: number }> = []

  for (const entry of entries) {
    // Normalise path and verify target is strictly inside destDir
    const safeName = entry.fileName.replace(/\\/g, '/')
    if (safeName.includes('..') || path.isAbsolute(safeName)) {
      throw new Error(`Security Exception: Detected illegal path traversal in ZIP entry: ${safeName}`)
    }

    const targetFilePath = path.resolve(destDir, safeName)
    const normalizedDest = path.resolve(destDir) + path.sep
    if (!targetFilePath.startsWith(normalizedDest) && targetFilePath !== path.resolve(destDir)) {
      throw new Error(`Security Exception: ZIP entry escapes sandbox directory: ${safeName}`)
    }

    if (entry.isDirectory) {
      fs.mkdirSync(targetFilePath, { recursive: true, mode: 0o700 })
      continue
    }

    totalDecompressedBytes += entry.uncompressedSize
    if (totalDecompressedBytes > MAX_TOTAL_BYTES) {
      throw new Error(`Archive decompressed size exceeds maximum safe limit (100MB)`)
    }

    // Ensure parent dir exists
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true, mode: 0o700 })

    // Decompress data
    let fileData: Buffer
    if (entry.compressionMethod === 0) {
      fileData = entry.compressedData
    } else if (entry.compressionMethod === 8) {
      // Deflate
      fileData = zlib.inflateRawSync(entry.compressedData)
    } else {
      continue // Skip unsupported compression methods
    }

    fs.writeFileSync(targetFilePath, fileData, { mode: 0o600 })

    const ext = path.extname(safeName).toLowerCase()
    const baseName = path.basename(safeName).toLowerCase()
    const language = LANGUAGE_EXTENSIONS[ext]

    const isTest =
      safeName.includes('/tests/') ||
      safeName.includes('/test/') ||
      safeName.includes('/__tests__/') ||
      baseName.includes('.test.') ||
      baseName.includes('.spec.') ||
      baseName.startsWith('test_') ||
      baseName.endsWith('_test.py') ||
      baseName.endsWith('_test.go') ||
      baseName.endsWith('test.java')

    const isDoc =
      baseName.startsWith('readme') ||
      safeName.includes('/docs/') ||
      safeName.includes('/doc/') ||
      ext === '.md' ||
      ext === '.rst'

    if (isTest) {
      hasTests = true
      testFiles.push(safeName)
    }
    if (isDoc) {
      hasDocs = true
      docFiles.push(safeName)
    }

    if (baseName === 'readme.md' && !readmeContent) {
      try {
        readmeContent = fileData.toString('utf-8').slice(0, 5000)
      } catch {}
    }

    // Detect manifests
    if (MANIFEST_PATTERNS[baseName]) {
      manifests.push({
        name: baseName,
        path: safeName,
        type: MANIFEST_PATTERNS[baseName]!,
      })
    }

    let fileLineCount = 0
    if (language) {
      const fileText = fileData.toString('utf-8')
      const lines = fileText.split('\n')
      fileLineCount = lines.length
      languageLineCounts[language] = (languageLineCounts[language] || 0) + fileLineCount
      totalSourceLines += fileLineCount

      let fileComments = 0
      let fileBlanks = 0
      let maxNestingInFile = 0
      let maxNestingLine = 0

      // Line-by-line inspection for comments, blanks, nesting, and secrets
      const isExampleOrTest =
        safeName.includes('.example') ||
        safeName.includes('.sample') ||
        safeName.includes('.template') ||
        isTest

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] || ''
        const trimmed = line.trim()
        if (!trimmed) {
          fileBlanks++
          continue
        }

        // Comment detection across languages
        if (
          trimmed.startsWith('//') ||
          trimmed.startsWith('#') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*') ||
          trimmed.startsWith('<!--') ||
          trimmed.startsWith('--')
        ) {
          fileComments++
        }

        // Indentation / nesting depth check
        const leadingSpaces = line.search(/\S/)
        if (leadingSpaces > 0) {
          const indentLevel = Math.floor(leadingSpaces / 2) // assuming 2-4 spaces
          if (indentLevel > maxNestingInFile) {
            maxNestingInFile = indentLevel
            maxNestingLine = i + 1
          }
        }

        // Real security scanning (only in non-example/non-template files)
        if (!isExampleOrTest) {
          if (/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/.test(line)) {
            secretsDetected.push({
              ruleId: 'PRISM-SEC-001',
              ruleName: 'Hardcoded Private Key',
              description: 'Exposed unencrypted cryptographic private key detected in source code',
              filePath: safeName,
              lineNumber: i + 1,
              severity: 'CRITICAL',
              preview: line.substring(0, 35) + '...',
              remediation: 'Remove private keys from repository immediately and rotate compromised credentials.',
            })
          } else if (/\bgh[pousr]_[A-Za-z0-9_]{36,}\b/.test(line)) {
            secretsDetected.push({
              ruleId: 'PRISM-SEC-002',
              ruleName: 'GitHub Personal Access Token',
              description: 'Active GitHub personal access token exposed in source code',
              filePath: safeName,
              lineNumber: i + 1,
              severity: 'CRITICAL',
              preview: 'ghp_****************************',
              remediation: 'Revoke token in GitHub Security Settings and migrate to environment variables.',
            })
          } else if (/\bAKIA[0-9A-Z]{16}\b/.test(line)) {
            secretsDetected.push({
              ruleId: 'PRISM-SEC-003',
              ruleName: 'AWS Access Key ID',
              description: 'AWS credential access key identifier hardcoded in source file',
              filePath: safeName,
              lineNumber: i + 1,
              severity: 'CRITICAL',
              preview: 'AKIA****************',
              remediation: 'Migrate to AWS IAM Roles or AWS Secrets Manager.',
            })
          }
        }
      }

      totalCommentLines += fileComments
      totalBlankLines += fileBlanks

      if (fileLineCount > 500 && !isTest) {
        oversizedFiles.push({ path: safeName, lines: fileLineCount })
      }

      if (maxNestingInFile >= 6 && !isTest) {
        deepNestingFiles.push({ path: safeName, maxNesting: maxNestingInFile, lineNumber: maxNestingLine })
      }
    }

    fileTree.push({
      path: safeName,
      size: fileData.length,
      language,
      isTest,
      isDoc,
      lines: fileLineCount,
    })
  }

  // Determine primary language
  let primaryLanguage = 'Unknown'
  let maxLines = 0
  for (const [lang, lines] of Object.entries(languageLineCounts)) {
    if (lines > maxLines) {
      maxLines = lines
      primaryLanguage = lang
    }
  }

  return {
    tempDir: destDir,
    totalFiles: fileTree.length,
    totalSize: totalDecompressedBytes,
    languages: languageLineCounts,
    primaryLanguage,
    fileTree,
    manifests,
    hasTests,
    testFiles,
    hasDocs,
    docFiles,
    readmeContent,
    totalSourceLines,
    totalCommentLines,
    totalBlankLines,
    oversizedFiles,
    secretsDetected,
    deepNestingFiles,
  }
}

/**
 * Clean up extracted sandbox folder
 */
export function cleanupSandbox(tempDir: string): void {
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      logger.info(`[ZipService] Cleaned up sandbox: ${tempDir}`)
    }
  } catch (err: any) {
    logger.warn(`[ZipService] Failed to clean up ${tempDir}: ${err.message}`)
  }
}

interface ZipEntryHeader {
  fileName: string
  isDirectory: boolean
  compressionMethod: number
  compressedSize: number
  uncompressedSize: number
  compressedData: Buffer
}

/**
 * Pure Node.js synchronous ZIP buffer reader
 */
function parseZipBuffer(buf: Buffer): ZipEntryHeader[] {
  const entries: ZipEntryHeader[] = []
  let offset = 0

  while (offset + 30 <= buf.length) {
    const signature = buf.readUInt32LE(offset)

    // Local file header signature: 0x04034b50 (PK\x03\x04)
    if (signature === 0x04034b50) {
      const compressionMethod = buf.readUInt16LE(offset + 8)
      const compressedSize = buf.readUInt32LE(offset + 18)
      const uncompressedSize = buf.readUInt32LE(offset + 22)
      const fileNameLength = buf.readUInt16LE(offset + 26)
      const extraFieldLength = buf.readUInt16LE(offset + 28)

      const fileName = buf.toString('utf-8', offset + 30, offset + 30 + fileNameLength)
      const dataStart = offset + 30 + fileNameLength + extraFieldLength
      const dataEnd = dataStart + compressedSize

      if (dataEnd <= buf.length) {
        const compressedData = buf.subarray(dataStart, dataEnd)
        const isDirectory = fileName.endsWith('/') || fileName.endsWith('\\')

        entries.push({
          fileName,
          isDirectory,
          compressionMethod,
          compressedSize,
          uncompressedSize,
          compressedData,
        })
      }

      offset = dataEnd
    } else if (signature === 0x02014b50 || signature === 0x06054b50) {
      // Central directory header or End of Central Directory
      break
    } else {
      offset++
    }
  }

  return entries
}

