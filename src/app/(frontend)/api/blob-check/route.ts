import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint — reports whether the Vercel Blob env vars are present
 * at runtime and (optionally) tries a list-blobs call to confirm the token
 * works. Safe to expose because we only report presence and prefixes, never
 * secrets. Delete after debugging.
 *
 * GET /api/blob-check
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  const storeId = process.env.BLOB_STORE_ID || ''
  const legacyMediaStoreId = process.env.media_STORE_ID || ''

  const report: Record<string, unknown> = {
    BLOB_READ_WRITE_TOKEN: {
      present: Boolean(token),
      length: token.length,
      prefix: token.slice(0, 20) || null,
    },
    BLOB_STORE_ID: {
      present: Boolean(storeId),
      value: storeId || null,
    },
    legacy_media_STORE_ID: {
      present: Boolean(legacyMediaStoreId),
      value: legacyMediaStoreId || null,
    },
  }

  // If a token is present, try a tiny list() call to confirm it actually works.
  if (token) {
    try {
      const { list } = await import('@vercel/blob')
      const result = await list({ limit: 3, token })
      report.list_result = {
        ok: true,
        count: result.blobs.length,
        first: result.blobs[0]?.url || null,
      }
    } catch (err) {
      report.list_result = {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  return NextResponse.json(report, { status: 200 })
}
