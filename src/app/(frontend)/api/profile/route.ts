import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  subscriberId: z.union([z.string(), z.number()]),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  birthMonth: z.string().regex(/^\d{2}$/).optional().or(z.literal('')),
  birthDay: z.string().regex(/^\d{2}$/).optional().or(z.literal('')),
  phone: z.string().max(40).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']).optional(),
  segment: z.enum(['neighborhood', 'industry', 'curious']).optional(),
})

export async function PATCH(req: Request) {
  let parsed
  try {
    parsed = Body.safeParse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_payload', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { subscriberId, ...fields } = parsed.data

  // Strip empty-string optionals so they don't overwrite existing data with blanks.
  const data: Record<string, unknown> = { profileCompleted: true }
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== '') data[k] = v
  }

  const payload = await getPayloadClient()
  try {
    await payload.update({
      collection: 'subscribers',
      id: subscriberId,
      data,
      overrideAccess: true,
    })
  } catch (err) {
    console.error('[profile] update failed:', err)
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
