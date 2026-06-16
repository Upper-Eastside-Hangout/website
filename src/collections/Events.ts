import type { CollectionConfig } from 'payload'

/**
 * Events at the venue. Top-level identity fields are always visible; the
 * heavier sections (Schedule, Recurrence, Tickets, Media, Location) live in
 * tabs so the form fits on screen without long scrolling. Row layouts pack
 * narrow fields side-by-side inside each tab.
 *
 * Recurrence supports one-time, weekly/biweekly (day-of-week pick), and
 * monthly-by-weekday. schema.org JSON-LD per instance powers Google Events
 * Discovery from the /events/[slug] pages.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published'],
    description:
      'Events at the venue. Recurring entries live as a single record with a recurrence rule.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // ===== Always-visible identity fields =====
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { placeholder: 'World Cup: Argentina vs. Brazil' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '50%',
            description: 'URL path: /events/[slug]. Lowercase, hyphens only.',
            placeholder: 'world-cup-arg-bra',
          },
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'specialEvent',
          admin: { width: '50%' },
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
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'Highlight on homepage upcoming list.' },
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'Uncheck to keep as draft.' },
        },
      ],
    },

    // ===== Tabs =====
    {
      type: 'tabs',
      tabs: [
        // --- Schedule + Recurrence ---
        {
          label: 'When',
          description:
            'For recurring events (Taco Tuesday, weekly trivia), set Schedule to the FIRST occurrence and use Recurrence below.',
          fields: [
            {
              type: 'group',
              name: 'schedule',
              label: 'Schedule',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startDateTime',
                      type: 'date',
                      required: true,
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayAndTime' },
                      },
                    },
                    {
                      name: 'endDateTime',
                      type: 'date',
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayAndTime' },
                        description: 'Optional.',
                      },
                    },
                  ],
                },
                {
                  name: 'isAllDay',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Event runs all day.' },
                },
              ],
            },
            {
              type: 'group',
              name: 'recurrence',
              label: 'Recurrence',
              fields: [
                {
                  name: 'pattern',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None (one-time)', value: 'none' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Biweekly', value: 'biweekly' },
                    { label: 'Monthly (specific weekday)', value: 'monthly' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'weekdays',
                      type: 'select',
                      hasMany: true,
                      options: [
                        { label: 'Mon', value: 'monday' },
                        { label: 'Tue', value: 'tuesday' },
                        { label: 'Wed', value: 'wednesday' },
                        { label: 'Thu', value: 'thursday' },
                        { label: 'Fri', value: 'friday' },
                        { label: 'Sat', value: 'saturday' },
                        { label: 'Sun', value: 'sunday' },
                      ],
                      admin: {
                        width: '60%',
                        description: 'Days of week.',
                        condition: (_, siblingData: { pattern?: string } | undefined) =>
                          siblingData?.pattern === 'weekly' || siblingData?.pattern === 'biweekly',
                      },
                    },
                    {
                      name: 'endDate',
                      type: 'date',
                      admin: {
                        width: '40%',
                        date: { pickerAppearance: 'dayOnly' },
                        description: 'Optional end.',
                        condition: (_, siblingData: { pattern?: string } | undefined) =>
                          Boolean(siblingData?.pattern) && siblingData?.pattern !== 'none',
                      },
                    },
                  ],
                },
                {
                  name: 'monthlyPattern',
                  type: 'select',
                  admin: {
                    description: 'Which weekday of the month.',
                    condition: (_, siblingData: { pattern?: string } | undefined) =>
                      siblingData?.pattern === 'monthly',
                  },
                  options: [
                    'firstMonday', 'firstTuesday', 'firstWednesday', 'firstThursday',
                    'firstFriday', 'firstSaturday', 'firstSunday',
                    'secondMonday', 'secondTuesday', 'secondWednesday', 'secondThursday',
                    'secondFriday', 'secondSaturday', 'secondSunday',
                    'thirdMonday', 'thirdTuesday', 'thirdWednesday', 'thirdThursday',
                    'thirdFriday', 'thirdSaturday', 'thirdSunday',
                    'lastMonday', 'lastTuesday', 'lastWednesday', 'lastThursday',
                    'lastFriday', 'lastSaturday', 'lastSunday',
                  ].map((v) => ({
                    label: v.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
                    value: v,
                  })),
                },
                {
                  name: 'excludedDates',
                  type: 'array',
                  labels: { singular: 'Skip Date', plural: 'Skip Dates' },
                  admin: {
                    description: 'Specific dates to skip (e.g. holidays).',
                    condition: (_, siblingData: { pattern?: string } | undefined) =>
                      Boolean(siblingData?.pattern) && siblingData?.pattern !== 'none',
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
          ],
        },

        // --- Tickets ---
        {
          label: 'Tickets',
          fields: [
            {
              type: 'group',
              name: 'attendance',
              label: false,
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  defaultValue: 'open',
                  options: [
                    { label: 'Open to public (no RSVP)', value: 'open' },
                    { label: 'Free RSVP required', value: 'freeRSVP' },
                    { label: 'Paid ticket', value: 'paidTicket' },
                  ],
                },
                {
                  name: 'registrationUrl',
                  type: 'text',
                  admin: {
                    description: 'RSVP or ticket purchase URL.',
                    condition: (_, siblingData: { type?: string } | undefined) =>
                      siblingData?.type === 'freeRSVP' || siblingData?.type === 'paidTicket',
                  },
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData: { type?: string } | undefined) =>
                      siblingData?.type === 'paidTicket',
                  },
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      admin: { width: '50%', description: 'Numeric (e.g. 15).' },
                    },
                    {
                      name: 'priceCurrency',
                      type: 'text',
                      defaultValue: 'USD',
                      admin: { width: '50%', description: 'ISO code.' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // --- Media & Description ---
        {
          label: 'Media & Description',
          fields: [
            {
              name: 'flyer',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload event flyer. Recommended 1200×628 (Open Graph format).',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Markdown supported: **bold**, *italic*, [links](https://example.com).',
              },
            },
          ],
        },

        // --- Location ---
        {
          label: 'Location',
          description: 'Defaults to the venue. Override only for off-site events.',
          fields: [
            {
              type: 'group',
              name: 'location',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      defaultValue: 'Upper Eastside Hangout',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'address',
                      type: 'text',
                      defaultValue: '701 NE 79th St, Miami, FL 33138',
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
