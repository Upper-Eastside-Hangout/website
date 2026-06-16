import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  expandEvent,
  eventToJsonLd,
  formatEventDate,
  formatEventTimeRange,
  flyerUrl,
  CATEGORY_LABELS,
  type EventDoc,
} from '@/lib/events'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

type FooterGlobal = {
  address: string
  phone: string
  hours: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  youtubeUrl?: string
  googleBusinessUrl?: string
  yelpUrl?: string
  tripadvisorUrl?: string
  nextdoorUrl?: string
  copyrightText: string
}
type NavigationGlobal = {
  links: { label: string; url: string; openInNewTab?: boolean }[]
}

const fetchEvent = async (slug: string): Promise<EventDoc | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })
  return (result.docs[0] as unknown as EventDoc) || null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const event = await fetchEvent(slug)
  if (!event) return { title: 'Event not found' }

  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'
  const rawFlyer = flyerUrl(event.flyer)
  const flyer = rawFlyer
    ? rawFlyer.startsWith('http')
      ? rawFlyer
      : `${url}${rawFlyer}`
    : `${url}/og-image.jpg`

  return {
    title: `${event.title} · Upper Eastside Hangout`,
    description: event.description || `${event.title} at Upper Eastside Hangout, Miami.`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      images: [{ url: flyer, width: 1200, height: 628 }],
    },
    // Keep noindex while events feature is in preview. Remove once promoting.
    robots: { index: false, follow: false },
  }
}

export default async function EventDetailPage({ params }: Args) {
  const { slug } = await params
  const event = await fetchEvent(slug)
  if (!event) notFound()

  // Find the next upcoming instance (or last past one if none upcoming).
  const now = new Date()
  const horizon = new Date(now)
  horizon.setFullYear(horizon.getFullYear() + 2)
  const upcoming = expandEvent(event, now, horizon)
  const instance = upcoming[0]

  const payload = await getPayloadClient()
  const footer = (await payload.findGlobal({ slug: 'footer' })) as FooterGlobal
  let navigation: NavigationGlobal = { links: [] }
  try {
    navigation = (await payload.findGlobal({ slug: 'navigation' })) as NavigationGlobal
  } catch { /* nav table may not exist */ }

  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'
  const pageUrl = `${url}/events/${event.slug}`
  const ld = instance
    ? eventToJsonLd(instance, {
        siteUrl: url,
        pageUrl,
        defaultImageUrl: `${url}/og-image.jpg`,
      })
    : null

  // Next 5 upcoming instances for recurring events
  const upcomingList = upcoming.slice(0, 5)

  const rawFlyer = flyerUrl(event.flyer)

  return (
    <main>
      {ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      )}

      <Header links={navigation.links} />

      <article className="bg-paper relative px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Category eyebrow */}
          <p className="text-center font-label text-xs tracking-[0.22em] text-forest/60 md:text-sm">
            {CATEGORY_LABELS[event.category]}
          </p>

          {/* Title */}
          <h1 className="mt-3 text-center font-heading text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-forest md:text-5xl">
            {event.title}
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-terracotta/70" aria-hidden="true">
            <span className="h-px w-12 bg-current" />
            <span className="text-sm">✻</span>
            <span className="h-px w-12 bg-current" />
          </div>

          {/* Flyer */}
          {rawFlyer && (
            <div className="relative mx-auto mt-8 aspect-[1200/628] w-full max-w-2xl overflow-hidden rounded-sm bg-cream-50">
              <Image
                src={rawFlyer}
                alt={`${event.title} flyer`}
                fill
                sizes="(min-width: 768px) 672px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* When + where summary */}
          {instance && (
            <div className="mx-auto mt-8 max-w-xl rounded-sm border border-forest/15 bg-cream-50/70 p-5 text-center">
              <p className="font-label text-xs tracking-[0.18em] text-forest/60">When</p>
              <p className="mt-1 font-body text-base text-forest md:text-lg">
                {formatEventDate(instance.startsAt)}
              </p>
              <p className="mt-0.5 font-body text-sm text-forest/80">
                {formatEventTimeRange(
                  instance.startsAt,
                  instance.endsAt,
                  Boolean(event.schedule.isAllDay),
                )}
              </p>
              <p className="mt-4 font-label text-xs tracking-[0.18em] text-forest/60">Where</p>
              <p className="mt-1 font-body text-base text-forest">{event.location.name}</p>
              <p className="font-body text-sm text-forest/70">{event.location.address}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="mx-auto mt-8 max-w-2xl font-body text-base leading-relaxed text-forest/85 md:text-lg">
              {event.description.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          )}

          {/* Registration CTA */}
          {event.attendance.type !== 'open' && event.attendance.registrationUrl && (
            <div className="mt-8 flex justify-center">
              <a
                href={event.attendance.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm bg-forest px-10 py-3.5 font-label text-sm tracking-[0.18em] text-cream transition hover:bg-forest-dark"
              >
                {event.attendance.type === 'paidTicket' ? 'Get Tickets' : 'RSVP'}
              </a>
            </div>
          )}

          {/* Additional upcoming instances for recurring events */}
          {upcomingList.length > 1 && (
            <div className="mx-auto mt-12 max-w-xl">
              <h2 className="text-center font-label text-sm tracking-[0.18em] text-forest/70">
                Also coming up
              </h2>
              <ul className="mt-4 space-y-2 text-center font-body text-sm text-forest/80">
                {upcomingList.slice(1).map((u, i) => (
                  <li key={i}>
                    {formatEventDate(u.startsAt)} ·{' '}
                    {formatEventTimeRange(u.startsAt, u.endsAt, Boolean(event.schedule.isAllDay))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      <Footer
        address={footer.address}
        phone={footer.phone}
        hours={footer.hours}
        instagramUrl={footer.instagramUrl}
        facebookUrl={footer.facebookUrl}
        tiktokUrl={footer.tiktokUrl}
        youtubeUrl={footer.youtubeUrl}
        googleBusinessUrl={footer.googleBusinessUrl}
        yelpUrl={footer.yelpUrl}
        tripadvisorUrl={footer.tripadvisorUrl}
        nextdoorUrl={footer.nextdoorUrl}
        copyrightText={footer.copyrightText}
      />
    </main>
  )
}
