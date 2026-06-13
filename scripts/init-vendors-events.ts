/**
 * Pass 1 init: pushes the Events table schema into Neon, applies the new
 * Vendors schema, and seeds the four resident vendor names so they appear
 * in the admin immediately. Team fills in bio/logos/social links via the
 * admin after this runs.
 *
 *   Run with:  npx tsx scripts/init-vendors-events.ts
 *   Delete after the live admin shows the new collections.
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
console.log('[init] DATABASE_URI loaded:', process.env.DATABASE_URI ? 'yes' : 'NO')

const { getPayload } = await import('payload')
const config = (await import('../src/payload.config')).default

const payload = await getPayload({ config })

// ---------- Touch Events to force table creation ----------
// findGlobal/find triggers Drizzle's schema sync if a new table is needed.
await payload.find({ collection: 'events', limit: 1, overrideAccess: true })
console.log('[init] Events table ready')

// ---------- Vendors ----------
// Existing Vendors table from earlier (empty in production) gets its schema
// updated to match the new field set. Then we seed the 4 resident vendors
// so they appear in admin immediately for the team to fill in details.
const existing = await payload.find({
  collection: 'vendors',
  limit: 100,
  overrideAccess: true,
})
console.log(`[init] Existing vendors in DB: ${existing.docs.length}`)

const residents = [
  { name: 'Cheese Burger Baby', order: 1 },
  { name: 'Noodle Bar', order: 2 },
  { name: 'Tacomiendo Tacos', order: 3 },
  { name: 'Professor Snacks', order: 4 },
]

for (const v of residents) {
  const match = existing.docs.find((d) => (d as { name: string }).name === v.name)
  if (match) {
    console.log(`[init] Vendor "${v.name}" already exists (id ${match.id})`)
    continue
  }
  await payload.create({
    collection: 'vendors',
    data: { ...v, published: true },
    overrideAccess: true,
  })
  console.log(`[init] Seeded vendor: ${v.name}`)
}

console.log('[init] Done. Open admin → Vendors to fill in bios, logos, and links.')
process.exit(0)
