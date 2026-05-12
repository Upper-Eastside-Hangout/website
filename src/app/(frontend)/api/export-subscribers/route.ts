import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CSV_HEADERS = [
  'email',
  'firstName',
  'lastName',
  'birthMonth',
  'birthDay',
  'phone',
  'gender',
  'segment',
  'profileCompleted',
  'source',
  'createdAt',
  'updatedAt',
] as const

const csvEscape = (val: unknown): string => {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(req: Request) {
  const payload = await getPayloadClient()

  // Auth gate — admin only.
  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user || (auth.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  // Page through all subscribers. Payload caps page size, so loop until exhausted.
  type Row = Record<(typeof CSV_HEADERS)[number], unknown>
  const rows: Row[] = []
  let page = 1
  while (true) {
    const result = await payload.find({
      collection: 'subscribers',
      limit: 500,
      page,
      sort: 'createdAt',
      overrideAccess: true,
    })
    for (const doc of result.docs) {
      const row: Row = Object.create(null)
      for (const h of CSV_HEADERS) row[h] = (doc as unknown as Record<string, unknown>)[h]
      rows.push(row)
    }
    if (page >= result.totalPages) break
    page += 1
  }

  const lines = [
    CSV_HEADERS.join(','),
    ...rows.map((r) => CSV_HEADERS.map((h) => csvEscape(r[h])).join(',')),
  ]
  const csv = lines.join('\r\n')

  const filename = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
