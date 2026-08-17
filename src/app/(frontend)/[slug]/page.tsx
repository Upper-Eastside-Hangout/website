import type { Metadata } from 'next'
import { notFound, redirect, RedirectType } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

/**
 * Root-level short-link redirect handler.
 *
 * Matches any single path segment at the root that isn't a defined static
 * route. Next.js App Router prefers static routes over dynamic ones, so
 * /admin, /api/*, /events/*, /preview/* are all handled by their existing
 * static files before this dynamic route ever fires.
 *
 * Data source: the `redirects` Payload collection.
 */

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

export const generateMetadata = async (): Promise<Metadata> => ({
  // Never index the intermediate redirect page. Search engines that follow
  // the 302 will land on the destination and index that instead.
  robots: { index: false, follow: false },
})

export default async function ShortLinkRedirect({ params }: Args) {
  const { slug } = await params

  const payload = await getPayloadClient()
  let result
  try {
    result = await payload.find({
      collection: 'redirects',
      where: {
        and: [
          { slug: { equals: slug.toLowerCase() } },
          { published: { equals: true } },
        ],
      },
      limit: 1,
    })
  } catch (err) {
    // Table may not yet exist on first deploy — fail closed as 404, not 500.
    console.warn('[redirects] lookup failed for slug', slug, err)
    notFound()
  }

  const row = result.docs[0] as
    | { destinationUrl?: string | null }
    | undefined
  if (!row?.destinationUrl) notFound()

  // 307 Temporary Redirect (default from next/redirect). Using temporary
  // rather than permanent so search-engine caches don't cling to old
  // destinations when the team edits the row.
  redirect(row.destinationUrl, RedirectType.replace)
}
