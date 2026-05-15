import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
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

// Trusted origins for CSRF + CORS. Without these explicitly declared in
// production, Payload 3 rejects mutations from the admin UI with a generic
// "You are not allowed to perform this action" error. Include both the
// custom domain and the *.vercel.app preview URLs.
const trustedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  'https://uppereastsidehangout.com',
  'https://www.uppereastsidehangout.com',
  'http://localhost:3000',
].filter(Boolean)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-replace-in-env',
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Upper Eastside Hangout',
    },
  },
  editor: lexicalEditor(),
  // Route Payload's system emails (password reset, account verification) through
  // the same Resend account that already has uppereastsidehangout.com verified.
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'hello@uppereastsidehangout.com',
    defaultFromName: process.env.RESEND_FROM_NAME || 'Upper Eastside Hangout',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
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
