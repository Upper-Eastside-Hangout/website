/**
 * One-off — swaps the vendors table's legacy text URL columns
 * (logo_url, illustration_url) for upload-relation FK columns
 * (logo_id, illustration_id) that reference the media table.
 *
 * Run BEFORE deploying the code change so the DB schema matches the new
 * collection config. Delete after it succeeds.
 *
 *   Run with:  npx tsx scripts/init-vendor-uploads.ts
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
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_dev_placeholder'
}

// Step 1: drop the old text columns via raw SQL so Drizzle's push doesn't
// interpret the shape change as a rename (which would trigger an interactive
// prompt that can't be answered in a script).
const { Pool } = await import('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URI })
await pool.query('ALTER TABLE vendors DROP COLUMN IF EXISTS logo_url;')
await pool.query('ALTER TABLE vendors DROP COLUMN IF EXISTS illustration_url;')
console.log('[init-vendor-uploads] dropped vendors.logo_url + illustration_url (if existed)')
await pool.end()

// Step 2: boot Payload with the new schema so push adds logo_id + illustration_id
// FK columns to vendors pointing at media.id.
const { getPayload } = await import('payload')
const config = (await import('../src/payload.config')).default
const payload = await getPayload({ config })
await payload.find({ collection: 'vendors', limit: 1, overrideAccess: true })
console.log('[init-vendor-uploads] vendors table schema refreshed')

console.log('[init-vendor-uploads] Done. Vendors → open a vendor in admin → Upload logo + illustration.')
process.exit(0)
