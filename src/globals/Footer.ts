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
    { name: 'instagramUrl', type: 'text' },
    { name: 'facebookUrl', type: 'text' },
    {
      name: 'copyrightText',
      type: 'text',
      required: true,
      defaultValue: '© 2026 Upper Eastside Hangout. All rights reserved.',
    },
  ],
}
