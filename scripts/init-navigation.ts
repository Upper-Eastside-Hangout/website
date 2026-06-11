/**
 * One-off seeder to create the navigation table(s) in Neon and populate
 * the default EVENTS + DIRECTIONS links.
 *
 * Runs Payload locally against the prod Neon DB. Locally, push: true
 * actually runs (NODE_ENV is dev), so the table gets created. Once the
 * tables exist, production Vercel can read/write them normally.
 *
 *   Run with:  npx tsx scripts/init-navigation.ts
 *   Delete after the live site shows the hamburger menu.
 */

// ---------- Load env BEFORE importing payload.config ----------
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envText = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
  if (!m) continue
  let val = m[2]
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  if (process.env[m[1]] === undefined) process.env[m[1]] = val
}
console.log('[init-navigation] DATABASE_URI loaded:', process.env.DATABASE_URI ? 'yes' : 'NO')

// ---------- Dynamic imports — env now visible to payload.config ----------
const { getPayload } = await import('payload')
const config = (await import('../src/payload.config')).default

const payload = await getPayload({ config })

// Seeding the global with defaults. This update triggers table creation via
// Payload's push mode, then inserts the navigation row + linked rows.
await payload.updateGlobal({
  slug: 'navigation',
  data: {
    links: [
      {
        label: 'EVENTS',
        url: 'https://site.fourvenues.com/en/upper-eastside-hangout',
        openInNewTab: true,
      },
      {
        label: 'DIRECTIONS',
        url: 'https://maps.app.goo.gl/oV3tQHeEHFHxZDf79',
        openInNewTab: true,
      },
    ],
  },
})

console.log('[init-navigation] Navigation global seeded with EVENTS + DIRECTIONS')
process.exit(0)
