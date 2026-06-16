/**
 * One-off — create the Media collection's table in Neon and swap the
 * events.flyer_url text column for the events.flyer_id upload relation.
 *
 *   Run with:  npx tsx scripts/init-media.ts
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
// Provide a placeholder Blob token if not set locally so the storage plugin
// doesn't bail during init. Real prod uploads use the real token in Vercel env.
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_dev_placeholder'
}

// Step 1: drop the old text column FIRST so Drizzle's push doesn't
// interpret the swap to a relation as a destructive rename.
const { Pool } = await import('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URI })
await pool.query('ALTER TABLE events DROP COLUMN IF EXISTS flyer_url;')
console.log('[init-media] dropped events.flyer_url (if existed)')
await pool.end()

// Step 2: boot Payload locally so push creates the media table + adds
// events.flyer_id with FK to media.id.
const { getPayload } = await import('payload')
const config = (await import('../src/payload.config')).default
const payload = await getPayload({ config })
await payload.find({ collection: 'media', limit: 1, overrideAccess: true })
console.log('[init-media] media table provisioned via Payload push')

console.log('[init-media] Done. You can now upload flyers via Events → Media tab.')
process.exit(0)
