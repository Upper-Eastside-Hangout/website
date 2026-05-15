import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { sendConfirmationEmail } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  email: z.string().email().max(254),
  source: z.string().optional(),
})

export async function POST(req: Request) {
  let parsed
  try {
    const json = await req.json()
    parsed = Body.safeParse(json)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase().trim()
  const source = parsed.data.source || 'landing-page'
  const payload = await getPayloadClient()

  // Look for an existing subscriber so duplicate signups stay friendly.
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  let subscriberId: string | number
  let alreadyExisted = false

  if (existing.docs.length > 0) {
    alreadyExisted = true
    const doc = existing.docs[0]
    subscriberId = doc.id
    // Touch updatedAt so admin sorting reflects renewed interest.
    await payload.update({
      collection: 'subscribers',
      id: doc.id,
      data: { source: doc.source || source },
      overrideAccess: true,
    })
  } else {
    const created = await payload.create({
      collection: 'subscribers',
      data: {
        email,
        source,
        profileCompleted: false,
      },
      overrideAccess: true,
    })
    subscriberId = created.id
  }

  // Fetch the email template global and send the confirmation. Fire-and-forget
  // semantics — never block the signup response on email delivery.
  void (async () => {
    try {
      const template = (await payload.findGlobal({ slug: 'emailTemplate' })) as Parameters<
        typeof sendConfirmationEmail
      >[1]
      await sendConfirmationEmail(email, template)
    } catch (err) {
      console.error('[subscribe] email send failed:', err)
    }
  })()

  return NextResponse.json({ subscriberId, alreadyExisted })
}
