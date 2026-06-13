'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  type EventInstance,
  CATEGORY_LABELS,
  formatEventTimeRange,
} from '@/lib/events'

type Props = {
  instance: EventInstance
  /** Show the date prefix in the card. Used in calendar grid; week view groups by date instead. */
  showDate?: boolean
}

const AttendanceBadge = ({
  type,
  price,
  currency,
}: {
  type: 'open' | 'freeRSVP' | 'paidTicket'
  price?: number | null
  currency?: string | null
}) => {
  if (type === 'open') {
    return (
      <span className="rounded-full bg-forest/10 px-2.5 py-0.5 font-label text-[0.65rem] tracking-[0.1em] text-forest/70">
        OPEN
      </span>
    )
  }
  if (type === 'freeRSVP') {
    return (
      <span className="rounded-full bg-mustard/15 px-2.5 py-0.5 font-label text-[0.65rem] tracking-[0.1em] text-mustard">
        FREE · RSVP
      </span>
    )
  }
  return (
    <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 font-label text-[0.65rem] tracking-[0.1em] text-terracotta">
      {currency === 'USD' || !currency
        ? `$${price ?? 0}`
        : `${price ?? 0} ${currency}`}
    </span>
  )
}

const FlyerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
)

export default function EventCard({ instance }: Props) {
  const { event, startsAt, endsAt } = instance
  const [flyerOpen, setFlyerOpen] = useState(false)
  const hasFlyer = Boolean(event.flyerUrl)

  const timeRange = formatEventTimeRange(
    startsAt,
    endsAt,
    Boolean(event.schedule.isAllDay),
  )

  return (
    <article className="group relative rounded-sm border border-forest/15 bg-cream-50/80 p-4 transition hover:bg-cream-50 md:p-5">
      <Link
        href={`/events/${event.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-label text-xs tracking-[0.18em] text-forest/60">
              {timeRange}
            </p>
            <h3 className="mt-1 font-heading text-lg font-semibold leading-tight text-forest md:text-xl">
              {event.title}
            </h3>
            <p className="mt-1 font-body text-xs italic text-forest/60">
              {CATEGORY_LABELS[event.category]}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <AttendanceBadge
              type={event.attendance.type}
              price={event.attendance.price}
              currency={event.attendance.priceCurrency}
            />
            {hasFlyer && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setFlyerOpen(true)
                }}
                aria-label={`Preview flyer for ${event.title}`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-forest/30 text-forest/70 transition hover:bg-forest hover:text-cream"
              >
                <FlyerIcon />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Hover-flyer preview (desktop only). Click also opens the modal below. */}
      {hasFlyer && (
        <div className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-2 hidden -translate-x-1/2 rounded-sm border border-forest/20 bg-cream-50 p-2 opacity-0 shadow-xl transition-opacity duration-200 group-hover:visible group-hover:opacity-100 md:block">
          <div className="relative h-[210px] w-[400px]">
            <Image
              src={event.flyerUrl as string}
              alt={`${event.title} flyer`}
              fill
              sizes="400px"
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Click-to-open flyer modal (works on touch + desktop) */}
      {flyerOpen && hasFlyer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${event.title} flyer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/80 p-4"
          onClick={() => setFlyerOpen(false)}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFlyerOpen(false)
              }}
              aria-label="Close flyer"
              className="absolute -right-3 -top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-forest shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <div className="relative aspect-[1200/628] w-full overflow-hidden rounded-sm bg-cream-50">
              <Image
                src={event.flyerUrl as string}
                alt={`${event.title} flyer`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
