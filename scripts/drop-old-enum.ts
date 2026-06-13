/**
 * One-off helper — drops the orphaned enum_vendors_category type from Neon
 * so Drizzle's push doesn't ask us to "rename" it to one of the new event
 * enums. Run BEFORE init-vendors-events.ts when reshaping Vendors schema.
 *
 *   Run with:  npx tsx scripts/drop-old-enum.ts
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

const sql = `
  -- Drop the orphan category column + enum from the old Vendors schema.
  ALTER TABLE vendors DROP COLUMN IF EXISTS category;
  ALTER TABLE vendors DROP COLUMN IF EXISTS illustration;
  ALTER TABLE vendors DROP COLUMN IF EXISTS description;
  DROP TYPE IF EXISTS enum_vendors_category CASCADE;
`

const result = await pool.query(sql)
console.log('[drop-old-enum] cleaned up Vendors legacy columns + category enum')
await pool.end()
process.exit(0)
