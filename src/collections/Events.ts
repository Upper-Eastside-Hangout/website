import type { CollectionConfig } from 'payload'

/**
 * Events at the venue. Supports one-time events, weekly/biweekly recurring
 * (e.g. Taco Tuesday), monthly patterns (e.g. first Friday), and per-event
 * exclusions for skipping individual occurrences.
 *
 * Categories map to schema.org Event subtypes so Google Events Discovery can
 * surface the right kind of card (SportsEvent, MusicEvent, FoodEvent, etc.).
 *
 * The slug field powers the /events/[slug] detail page URLs.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'startDateTime', 'recurrence', 'published'],
    description:
      'All events at the venue. Recurring entries (weekly trivia, monthly markets) live as a single entry with a recurrence rule.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // ---------- Identity ----------
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Event name (e.g. "World Cup: Argentina vs. Brazil").' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'URL-safe identifier for the /events/[slug] detail page. Use lowercase letters, numbers, and hyphens (e.g. "world-cup-arg-bra").',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'specialEvent',
      options: [
        { label: 'Sports Screening', value: 'sportsScreening' },
        { label: 'Movie Screening', value: 'movieScreening' },
        { label: 'Live Music', value: 'liveMusic' },
        { label: 'DJ Set', value: 'djSet' },
        { label: 'Performance', value: 'performance' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Trivia Night', value: 'trivia' },
        { label: 'Game Night', value: 'gameNight' },
        { label: 'Tasting', value: 'tasting' },
        { label: 'Food Festival', value: 'foodFestival' },
        { label: 'Market', value: 'market' },
        { label: 'Record Fair', value: 'recordFair' },
        { label: 'Pop-Up', value: 'popUp' },
        { label: 'Kids Event', value: 'kidsEvent' },
        { label: 'Workshop / Class', value: 'workshop' },
        { label: 'Promotion (Taco Tuesday etc.)', value: 'promotion' },
        { label: 'Community / Meetup', value: 'community' },
        { label: 'Special Event', value: 'specialEvent' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Short description shown on the event detail page. Supports Markdown for **bold**, *italic*, and [links](https://example.com).',
      },
    },

    // ---------- When ----------
    {
      type: 'group',
      name: 'schedule',
      label: 'Schedule',
      fields: [
        {
          name: 'startDateTime',
          type: 'date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description:
              'For recurring events, this is the FIRST occurrence date+time. The system generates future instances from here.',
          },
        },
        {
          name: 'endDateTime',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description:
              'When the event ends. Required for sports/movies/concerts so we can schema the duration. Leave blank for promos/all-day events.',
          },
        },
        {
          name: 'isAllDay',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Check if the event runs all day (no specific time).' },
        },
      ],
    },

    // ---------- Recurrence ----------
    {
      type: 'group',
      name: 'recurrence',
      label: 'Recurrence',
      admin: {
        description:
          'Leave Pattern as "None" for one-time events. Use Weekly/Biweekly for things like Taco Tuesday or Trivia; Monthly for "first Friday of the month" style events.',
      },
      fields: [
        {
          name: 'pattern',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None (one-time event)', value: 'none' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Biweekly (every 2 weeks)', value: 'biweekly' },
            { label: 'Monthly (specific weekday pattern)', value: 'monthly' },
          ],
        },
        {
          name: 'weekdays',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          admin: {
            description:
              'For Weekly/Biweekly only. Which days of the week the event repeats on.',
            condition: (_, { recurrence }) =>
              recurrence?.pattern === 'weekly' || recurrence?.pattern === 'biweekly',
          },
        },
        {
          name: 'monthlyPattern',
          type: 'select',
          options: [
            { label: 'First Monday of the month', value: 'firstMonday' },
            { label: 'First Tuesday of the month', value: 'firstTuesday' },
            { label: 'First Wednesday of the month', value: 'firstWednesday' },
            { label: 'First Thursday of the month', value: 'firstThursday' },
            { label: 'First Friday of the month', value: 'firstFriday' },
            { label: 'First Saturday of the month', value: 'firstSaturday' },
            { label: 'First Sunday of the month', value: 'firstSunday' },
            { label: 'Second Monday', value: 'secondMonday' },
            { label: 'Second Tuesday', value: 'secondTuesday' },
            { label: 'Second Wednesday', value: 'secondWednesday' },
            { label: 'Second Thursday', value: 'secondThursday' },
            { label: 'Second Friday', value: 'secondFriday' },
            { label: 'Second Saturday', value: 'secondSaturday' },
            { label: 'Second Sunday', value: 'secondSunday' },
            { label: 'Third Monday', value: 'thirdMonday' },
            { label: 'Third Tuesday', value: 'thirdTuesday' },
            { label: 'Third Wednesday', value: 'thirdWednesday' },
            { label: 'Third Thursday', value: 'thirdThursday' },
            { label: 'Third Friday', value: 'thirdFriday' },
            { label: 'Third Saturday', value: 'thirdSaturday' },
            { label: 'Third Sunday', value: 'thirdSunday' },
            { label: 'Last Monday of the month', value: 'lastMonday' },
            { label: 'Last Tuesday', value: 'lastTuesday' },
            { label: 'Last Wednesday', value: 'lastWednesday' },
            { label: 'Last Thursday', value: 'lastThursday' },
            { label: 'Last Friday', value: 'lastFriday' },
            { label: 'Last Saturday', value: 'lastSaturday' },
            { label: 'Last Sunday', value: 'lastSunday' },
          ],
          admin: {
            description: 'For Monthly only. Which weekday of the month the event falls on.',
            condition: (_, { recurrence }) => recurrence?.pattern === 'monthly',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description:
              'Optional. If set, the recurring event stops generating instances after this date. Leave blank for "indefinite".',
            condition: (_, { recurrence }) =>
              recurrence?.pattern && recurrence.pattern !== 'none',
          },
        },
        {
          name: 'excludedDates',
          type: 'array',
          labels: { singular: 'Excluded Date', plural: 'Excluded Dates' },
          admin: {
            description:
              'Specific dates to skip (e.g. holidays). Add a row per date.',
            condition: (_, { recurrence }) =>
              recurrence?.pattern && recurrence.pattern !== 'none',
          },
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
          ],
        },
      ],
    },

    // ---------- Attendance / Tickets ----------
    {
      type: 'group',
      name: 'attendance',
      label: 'Attendance & Tickets',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'open',
          options: [
            { label: 'Open to the public (no RSVP)', value: 'open' },
            { label: 'Free RSVP required', value: 'freeRSVP' },
            { label: 'Paid ticket', value: 'paidTicket' },
          ],
        },
        {
          name: 'registrationUrl',
          type: 'text',
          admin: {
            description: 'RSVP or ticket purchase URL. Required for Free RSVP and Paid Ticket types.',
            condition: (_, { attendance }) =>
              attendance?.type === 'freeRSVP' || attendance?.type === 'paidTicket',
          },
        },
        {
          name: 'price',
          type: 'number',
          admin: {
            description: 'Ticket price (numeric only, e.g. 15 for $15).',
            condition: (_, { attendance }) => attendance?.type === 'paidTicket',
          },
        },
        {
          name: 'priceCurrency',
          type: 'text',
          defaultValue: 'USD',
          admin: {
            description: 'ISO currency code (USD, EUR, etc.).',
            condition: (_, { attendance }) => attendance?.type === 'paidTicket',
          },
        },
      ],
    },

    // ---------- Media ----------
    {
      name: 'flyerUrl',
      type: 'text',
      admin: {
        description:
          'Optional event flyer at 1200×628 px (Open Graph–compatible). Drop file in /public/events/ and reference as /events/your-file.jpg. Used for hover preview and social sharing.',
      },
    },

    // ---------- Location ----------
    {
      type: 'group',
      name: 'location',
      label: 'Location',
      admin: {
        description: 'Defaults to the venue. Override for off-site events.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Upper Eastside Hangout',
        },
        {
          name: 'address',
          type: 'text',
          defaultValue: '701 NE 79th St, Miami, FL 33138',
        },
      ],
    },

    // ---------- Publishing ----------
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Highlight on the events page and homepage upcoming list.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Uncheck to keep as draft. Drafts are hidden from the public site.' },
    },
  ],
  timestamps: true,
}
