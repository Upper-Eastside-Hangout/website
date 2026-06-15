import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'address',
      type: 'text',
      required: true,
      defaultValue: '701 NE 79th St, Miami, FL 33138',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '305-555-5555',
    },
    {
      name: 'hours',
      type: 'text',
      required: true,
      defaultValue: 'Tuesday – Sunday · 11am – 12am',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      admin: { description: 'Icon shown on footer only when populated.' },
    },
    {
      name: 'facebookUrl',
      type: 'text',
      admin: { description: 'Icon shown on footer only when populated.' },
    },
    {
      name: 'tiktokUrl',
      type: 'text',
      admin: { description: 'TikTok profile URL. Icon shown only when populated.' },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'YouTube channel URL. Icon shown only when populated.' },
    },
    {
      name: 'googleBusinessUrl',
      type: 'text',
      admin: { description: 'Google Business profile URL. Icon shown only when populated.' },
    },
    {
      name: 'yelpUrl',
      type: 'text',
      admin: { description: 'Yelp business URL. Icon shown only when populated.' },
    },
    {
      name: 'tripadvisorUrl',
      type: 'text',
      admin: { description: 'TripAdvisor listing URL. Icon shown only when populated.' },
    },
    {
      name: 'nextdoorUrl',
      type: 'text',
      admin: { description: 'Nextdoor business URL. Icon shown only when populated.' },
    },
    {
      name: 'copyrightText',
      type: 'text',
      required: true,
      defaultValue: '© 2026 Upper Eastside Hangout. All rights reserved.',
    },
  ],
}
