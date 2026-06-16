/**
 * Event recurrence expansion + schema.org generation.
 *
 * Events live in Payload as a single record with a recurrence rule. To render
 * them on the site (week view, calendar, detail pages) and to emit
 * schema.org JSON-LD for Google Events Discovery, we expand each rule into
 * concrete instances within a date range.
 */

/* ---------- Types matching the Events collection shape ---------- */

export type MediaDoc = {
  id: number | string
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export type EventDoc = {
  id: string | number
  title: string
  slug: string
  category: EventCategory
  description?: string | null
  schedule: {
    startDateTime: string // ISO 8601
    endDateTime?: string | null
    isAllDay?: boolean | null
  }
  recurrence?: {
    pattern?: 'none' | 'weekly' | 'biweekly' | 'monthly' | null
    weekdays?: Weekday[] | null
    monthlyPattern?: MonthlyPattern | null
    endDate?: string | null
    excludedDates?: { date: string }[] | null
  } | null
  attendance: {
    type: 'open' | 'freeRSVP' | 'paidTicket'
    registrationUrl?: string | null
    price?: number | null
    priceCurrency?: string | null
  }
  /** Upload relation. When depth >= 1 (Payload default), this resolves to the
   * full Media doc; otherwise it's just the id. */
  flyer?: MediaDoc | number | string | null
  location: {
    name: string
    address: string
  }
  featured?: boolean | null
  published: boolean
}

/** Resolve a flyer URL whether the upload relation came back populated or as a bare id. */
export const flyerUrl = (flyer: EventDoc['flyer']): string | null => {
  if (!flyer) return null
  if (typeof flyer === 'number' || typeof flyer === 'string') return null
  return flyer.url || null
}

export const flyerAlt = (flyer: EventDoc['flyer'], fallback: string): string => {
  if (!flyer || typeof flyer === 'number' || typeof flyer === 'string') return fallback
  return flyer.alt || fallback
}

export type EventInstance = {
  event: EventDoc
  startsAt: Date
  endsAt: Date | null
}

export type EventCategory =
  | 'sportsScreening'
  | 'movieScreening'
  | 'liveMusic'
  | 'djSet'
  | 'performance'
  | 'comedy'
  | 'trivia'
  | 'gameNight'
  | 'tasting'
  | 'foodFestival'
  | 'market'
  | 'recordFair'
  | 'popUp'
  | 'kidsEvent'
  | 'workshop'
  | 'promotion'
  | 'community'
  | 'specialEvent'

export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

export type MonthlyPattern =
  | `first${Capitalize<Weekday>}`
  | `second${Capitalize<Weekday>}`
  | `third${Capitalize<Weekday>}`
  | `last${Capitalize<Weekday>}`

/* ---------- Category helpers ---------- */

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  sportsScreening: 'Sports Screening',
  movieScreening: 'Movie Screening',
  liveMusic: 'Live Music',
  djSet: 'DJ Set',
  performance: 'Performance',
  comedy: 'Comedy',
  trivia: 'Trivia Night',
  gameNight: 'Game Night',
  tasting: 'Tasting',
  foodFestival: 'Food Festival',
  market: 'Market',
  recordFair: 'Record Fair',
  popUp: 'Pop-Up',
  kidsEvent: 'Kids Event',
  workshop: 'Workshop / Class',
  promotion: 'Promotion',
  community: 'Community',
  specialEvent: 'Special Event',
}

/** schema.org subtype per category. Used in JSON-LD for Google Events Discovery. */
export const CATEGORY_SCHEMA_TYPE: Record<EventCategory, string> = {
  sportsScreening: 'SportsEvent',
  movieScreening: 'ScreeningEvent',
  liveMusic: 'MusicEvent',
  djSet: 'MusicEvent',
  performance: 'TheaterEvent',
  comedy: 'ComedyEvent',
  trivia: 'SocialEvent',
  gameNight: 'SocialEvent',
  tasting: 'FoodEvent',
  foodFestival: 'FoodEvent',
  market: 'SaleEvent',
  recordFair: 'Event',
  popUp: 'Event',
  kidsEvent: 'ChildrensEvent',
  workshop: 'EducationEvent',
  promotion: 'SaleEvent',
  community: 'SocialEvent',
  specialEvent: 'Event',
}

/* ---------- Recurrence expansion ---------- */

const WEEKDAY_INDEX: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

const WEEKDAY_NAMES: Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const parseMonthlyPattern = (
  s: string,
): { ordinal: 'first' | 'second' | 'third' | 'last'; weekday: Weekday } | null => {
  const m = s.match(
    /^(first|second|third|last)(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i,
  )
  if (!m) return null
  const ord = m[1].toLowerCase() as 'first' | 'second' | 'third' | 'last'
  const wd = m[2].toLowerCase() as Weekday
  return { ordinal: ord, weekday: wd }
}

const getNthWeekdayOfMonth = (
  year: number,
  month: number, // 0-indexed
  ordinal: 'first' | 'second' | 'third' | 'last',
  weekday: Weekday,
): Date | null => {
  const targetDay = WEEKDAY_INDEX[weekday]

  if (ordinal === 'last') {
    const lastOfMonth = new Date(year, month + 1, 0)
    const lastDayOfWeek = lastOfMonth.getDay()
    const diff = (lastDayOfWeek - targetDay + 7) % 7
    return new Date(year, month, lastOfMonth.getDate() - diff)
  }

  const ordIdx = { first: 0, second: 1, third: 2 }[ordinal]
  const firstOfMonth = new Date(year, month, 1)
  const firstDayOfWeek = firstOfMonth.getDay()
  const diff = (targetDay - firstDayOfWeek + 7) % 7
  const day = 1 + diff + ordIdx * 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  if (day > daysInMonth) return null
  return new Date(year, month, day)
}

const dateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

/**
 * Expand a single event into concrete instances within [rangeStart, rangeEnd].
 * Handles one-time, weekly, biweekly, and monthly-by-weekday recurrence patterns.
 * Respects excludedDates and recurrence.endDate.
 */
export const expandEvent = (
  event: EventDoc,
  rangeStart: Date,
  rangeEnd: Date,
): EventInstance[] => {
  const instances: EventInstance[] = []
  if (!event.published) return instances

  const startDT = new Date(event.schedule.startDateTime)
  const endDT = event.schedule.endDateTime ? new Date(event.schedule.endDateTime) : null
  const duration = endDT ? endDT.getTime() - startDT.getTime() : 0

  const excluded = new Set(
    (event.recurrence?.excludedDates || []).map((e) => dateKey(new Date(e.date))),
  )

  const recurrenceEnd = event.recurrence?.endDate ? new Date(event.recurrence.endDate) : null
  const effectiveEnd = recurrenceEnd
    ? new Date(Math.min(rangeEnd.getTime(), recurrenceEnd.getTime()))
    : rangeEnd

  const pattern = event.recurrence?.pattern || 'none'

  if (pattern === 'none') {
    if (startDT >= rangeStart && startDT <= rangeEnd) {
      const endsAt = endDT || (duration > 0 ? new Date(startDT.getTime() + duration) : null)
      instances.push({ event, startsAt: startDT, endsAt })
    }
    return instances
  }

  if (pattern === 'weekly' || pattern === 'biweekly') {
    const stride = pattern === 'biweekly' ? 14 : 7
    let weekdays = (event.recurrence?.weekdays || []) as Weekday[]
    if (weekdays.length === 0) {
      // Fallback to the weekday implied by the start datetime
      weekdays = [WEEKDAY_NAMES[startDT.getDay()]]
    }

    for (const wd of weekdays) {
      const target = WEEKDAY_INDEX[wd]
      if (target == null) continue

      // First occurrence of this weekday on or after the event start
      const first = new Date(startDT)
      const diff = (target - first.getDay() + 7) % 7
      first.setDate(first.getDate() + diff)

      let cursor = new Date(first)
      // Stride safety cap to avoid runaway loops on bad data
      let iterations = 0
      while (cursor <= effectiveEnd && iterations < 520) {
        if (
          cursor >= rangeStart &&
          cursor >= startDT &&
          !excluded.has(dateKey(cursor))
        ) {
          const endsAt =
            duration > 0 ? new Date(cursor.getTime() + duration) : null
          instances.push({
            event,
            startsAt: new Date(cursor),
            endsAt,
          })
        }
        cursor.setDate(cursor.getDate() + stride)
        iterations += 1
      }
    }
    return instances
  }

  if (pattern === 'monthly') {
    if (!event.recurrence?.monthlyPattern) return instances
    const parsed = parseMonthlyPattern(event.recurrence.monthlyPattern)
    if (!parsed) return instances

    let cursor = new Date(startDT.getFullYear(), startDT.getMonth(), 1)
    let iterations = 0
    while (cursor <= effectiveEnd && iterations < 36) {
      const occ = getNthWeekdayOfMonth(
        cursor.getFullYear(),
        cursor.getMonth(),
        parsed.ordinal,
        parsed.weekday,
      )
      if (occ) {
        occ.setHours(
          startDT.getHours(),
          startDT.getMinutes(),
          startDT.getSeconds(),
        )
        if (
          occ >= startDT &&
          occ >= rangeStart &&
          occ <= effectiveEnd &&
          !excluded.has(dateKey(occ))
        ) {
          const endsAt = duration > 0 ? new Date(occ.getTime() + duration) : null
          instances.push({ event, startsAt: occ, endsAt })
        }
      }
      cursor.setMonth(cursor.getMonth() + 1)
      iterations += 1
    }
    return instances
  }

  return instances
}

/** Expand multiple events into a single time-sorted instance list. */
export const expandEvents = (
  events: EventDoc[],
  rangeStart: Date,
  rangeEnd: Date,
): EventInstance[] => {
  const all: EventInstance[] = []
  for (const e of events) {
    all.push(...expandEvent(e, rangeStart, rangeEnd))
  }
  all.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  return all
}

/* ---------- Formatting helpers (America/New_York timezone) ---------- */

export const TZ = 'America/New_York'

export const formatEventDate = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  }).format(d)

export const formatEventDateShort = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: TZ,
  }).format(d)

export const formatEventTime = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  }).format(d)

export const formatEventTimeRange = (start: Date, end: Date | null, isAllDay?: boolean) => {
  if (isAllDay) return 'All day'
  const s = formatEventTime(start)
  if (!end) return s
  return `${s} – ${formatEventTime(end)}`
}

/* ---------- schema.org Event JSON-LD ---------- */

const parsePostalAddress = (raw: string) => {
  const parts = raw.split(',').map((s) => s.trim())
  const street = parts[0] || ''
  const locality = parts[1] || 'Miami'
  const regionPostal = (parts[2] || 'FL').split(/\s+/)
  return {
    streetAddress: street,
    addressLocality: locality,
    addressRegion: regionPostal[0] || 'FL',
    postalCode: regionPostal[1] || '',
    addressCountry: 'US',
  }
}

/**
 * Build a schema.org Event JSON-LD object for a single event instance.
 * Required for Google Events Discovery: name, startDate, location, image.
 * Maps the category to the most specific schema.org subtype.
 */
export const eventToJsonLd = (
  instance: EventInstance,
  opts: { siteUrl: string; pageUrl: string; defaultImageUrl?: string },
) => {
  const { event, startsAt, endsAt } = instance
  const type = CATEGORY_SCHEMA_TYPE[event.category] || 'Event'

  const offers =
    event.attendance.type === 'paidTicket'
      ? {
          '@type': 'Offer',
          price: event.attendance.price ?? 0,
          priceCurrency: event.attendance.priceCurrency || 'USD',
          url: event.attendance.registrationUrl || opts.pageUrl,
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
        }
      : event.attendance.type === 'freeRSVP'
        ? {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
            url: event.attendance.registrationUrl || opts.pageUrl,
            availability: 'https://schema.org/InStock',
            validFrom: new Date().toISOString(),
          }
        : undefined

  const rawFlyer = flyerUrl(event.flyer)
  const image = rawFlyer
    ? [rawFlyer.startsWith('http') ? rawFlyer : `${opts.siteUrl}${rawFlyer}`]
    : opts.defaultImageUrl
      ? [opts.defaultImageUrl]
      : undefined

  const addr = parsePostalAddress(event.location.address)

  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: event.title,
    description: event.description || '',
    startDate: startsAt.toISOString(),
    endDate: endsAt ? endsAt.toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: { '@type': 'PostalAddress', ...addr },
    },
    image,
    offers,
    organizer: {
      '@type': 'Organization',
      name: 'Upper Eastside Hangout',
      url: opts.siteUrl,
    },
    url: opts.pageUrl,
  }
}
