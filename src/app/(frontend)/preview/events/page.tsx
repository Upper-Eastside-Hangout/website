import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EventsWeekView from '@/components/EventsWeekView'
import { expandEvents, type EventDoc } from '@/lib/events'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Events · Upper Eastside Hangout',
  description: 'Upcoming events at Upper Eastside Hangout in Miami.',
  robots: { index: false, follow: false },
}

type FooterGlobal = {
  address: string
  phone: string
  hours: string
  instagramUrl?: string
  facebookUrl?: string
  copyrightText: string
}
type NavigationGlobal = {
  links: { label: string; url: string; openInNewTab?: boolean }[]
}

export default async function EventsPreview() {
  const payload = await getPayloadClient()

  const [footer] = (await Promise.all([
    payload.findGlobal({ slug: 'footer' }),
  ])) as [FooterGlobal]

  let navigation: NavigationGlobal = { links: [] }
  try {
    navigation = (await payload.findGlobal({ slug: 'navigation' })) as NavigationGlobal
  } catch {
    /* nav table may not exist; render without */
  }

  // Pull all published events. Recurrence is expanded client-of-Payload-side
  // (in this server component) so we don't need cron jobs or precomputed rows.
  const eventResult = await payload.find({
    collection: 'events',
    where: { published: { equals: true } },
    limit: 500,
  })
  const allEvents = eventResult.docs as unknown as EventDoc[]

  // Show the next 7 days (today through 7 days out).
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  const instances = expandEvents(allEvents, start, end)

  return (
    <main>
      <Header links={navigation.links} />

      <section className="bg-paper relative px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-forest md:text-5xl">
            What's Happening
          </h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-terracotta/70" aria-hidden="true">
            <span className="h-px w-12 bg-current" />
            <span className="text-sm">✻</span>
            <span className="h-px w-12 bg-current" />
          </div>
          <p className="mt-4 font-body text-base italic text-forest/80 md:text-lg">
            The next seven days at Upper Eastside Hangout
          </p>
        </div>

        <div className="mt-12">
          <EventsWeekView instances={instances} />
        </div>
      </section>

      <Footer
        address={footer.address}
        phone={footer.phone}
        hours={footer.hours}
        instagramUrl={footer.instagramUrl}
        facebookUrl={footer.facebookUrl}
        copyrightText={footer.copyrightText}
      />
    </main>
  )
}
