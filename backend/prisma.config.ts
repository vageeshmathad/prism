// prisma.config.ts — Prisma v7 datasource configuration
// See https://pris.ly/d/config-datasource
import { defineConfig } from 'prisma/config'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrate: {
    adapter() {
      const connectionString = process.env['DATABASE_URL']
      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set')
      }
      return new PrismaPg({ connectionString })
    },
  },
})
