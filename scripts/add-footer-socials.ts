/**
 * One-off — adds the 6 new social URL columns to the footer table so the
 * code's view of the schema matches the DB. Run when Payload's push: true
 * skips the migration (which happens with simple text-column additions in
 * production).
 *
 *   Run with:  npx tsx scripts/add-footer-socials.ts
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

const { Pool } = await import('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URI })

const columns = [
  'tiktok_url',
  'youtube_url',
  'google_business_url',
  'yelp_url',
  'tripadvisor_url',
  'nextdoor_url',
]

for (const col of columns) {
  await pool.query(`ALTER TABLE footer ADD COLUMN IF NOT EXISTS ${col} TEXT;`)
  console.log(`[migrate] added footer.${col}`)
}

await pool.end()
console.log('[migrate] Done — Footer global will now load.')
process.exit(0)
