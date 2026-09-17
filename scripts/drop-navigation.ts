/**
 * One-off — drops the navigation tables from the Neon DB now that the
 * Payload Navigation global has been removed from the config and the
 * frontend hardcodes its menu (see src/components/Header.tsx).
 *
 *   Run with:  npx tsx scripts/drop-navigation.ts
 *   Delete this file after the run completes.
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

// CASCADE handles the linked-rows / relationships tables Payload created
// for the `links` array field, regardless of their exact names.
await pool.query('DROP TABLE IF EXISTS navigation_links CASCADE;')
await pool.query('DROP TABLE IF EXISTS navigation CASCADE;')
console.log('[migrate] dropped navigation + navigation_links')

await pool.end()
process.exit(0)
