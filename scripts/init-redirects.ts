/**
 * One-off — creates the redirects table in Neon and seeds the two initial
 * short links (/tix and /wine, both pointing at the fourvenues page).
 * Delete this script after it succeeds.
 *
 *   Run with:  npx tsx scripts/init-redirects.ts
 */

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
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  // Not needed for this migration but the plugin fails to init without something.
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_dev_placeholder'
}

const { getPayload } = await import('payload')
const config = (await import('../src/payload.config')).default
const payload = await getPayload({ config })

// Touch the collection so Drizzle push creates the table on first access.
await payload.find({ collection: 'redirects', limit: 1, overrideAccess: true })
console.log('[init-redirects] redirects table provisioned')

const seeds = [
  {
    slug: 'tix',
    destinationUrl: 'https://www.fourvenues.com/upper-eastside-hangout',
    label: 'Tickets — Fourvenues',
    published: true,
  },
  {
    slug: 'wine',
    destinationUrl: 'https://www.fourvenues.com/upper-eastside-hangout',
    label: 'Wine — Fourvenues',
    published: true,
  },
]

for (const s of seeds) {
  const existing = await payload.find({
    collection: 'redirects',
    where: { slug: { equals: s.slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    console.log(`[init-redirects] "${s.slug}" already exists (id ${existing.docs[0].id}); skipping`)
    continue
  }
  await payload.create({ collection: 'redirects', data: s, overrideAccess: true })
  console.log(`[init-redirects] seeded ${s.slug} → ${s.destinationUrl}`)
}

console.log('[init-redirects] Done. Redirects collection is live in admin.')
process.exit(0)
