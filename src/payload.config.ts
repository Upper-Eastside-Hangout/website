import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Subscribers } from './collections/Subscribers'
import { Vendors } from './collections/Vendors'

import { HeroSection } from './globals/HeroSection'
import { NeighborhoodSection } from './globals/NeighborhoodSection'
import { SignupSection } from './globals/SignupSection'
import { Footer } from './globals/Footer'
import { EmailTemplate } from './globals/EmailTemplate'
import { SEO } from './globals/SEO'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-replace-in-env',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Upper Eastside Hangout',
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Subscribers, Vendors],
  globals: [HeroSection, NeighborhoodSection, SignupSection, Footer, EmailTemplate, SEO],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Seed the first admin on initial boot if env vars are set and no users exist.
  onInit: async (payload) => {
    const seedEmail = process.env.SEED_ADMIN_EMAIL
    const seedPassword = process.env.SEED_ADMIN_PASSWORD
    if (!seedEmail || !seedPassword) return

    const existing = await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
    })
    if (existing.totalDocs > 0) return

    await payload.create({
      collection: 'users',
      data: {
        email: seedEmail,
        password: seedPassword,
        role: 'admin',
      },
    })
    payload.logger.info(`Seeded first admin user: ${seedEmail}`)
  },
})
