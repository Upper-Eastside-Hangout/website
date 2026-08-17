import type { CollectionConfig } from 'payload'

/**
 * Short-link redirects. A row like { slug: 'tix', destinationUrl: '...' }
 * makes uppereastsidehangout.com/tix 302-redirect to the destination.
 *
 * The redirect logic lives in src/app/(frontend)/[slug]/page.tsx — that
 * dynamic route only fires for root paths that don't match a static route,
 * so /admin, /api, /events, /preview etc. all still work.
 */

// Root-level paths that must NEVER be usable as a redirect slug (would collide
// with real routes, static assets, or Next.js internals). Belt-and-suspenders
// on top of Next's static-route precedence.
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'events',
  'preview',
  '_next',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  'og-image.jpg',
  'og-image.png',
  'logo-primary.png',
  'logo-cream.png',
  'backgrounds',
  'vendors',
  'ornaments',
])

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'label', 'destinationUrl', 'published'],
    description:
      'Root-level short links. Each row makes uppereastsidehangout.com/[slug] redirect to the destination URL.',
  },
  access: {
    read: () => true, // needed for the redirect lookup on the public route
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'The URL path after the domain. Lowercase letters, numbers, and hyphens only. Example: "tix" → uppereastsidehangout.com/tix',
        placeholder: 'tix',
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value) return 'Slug is required.'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Slug can only contain lowercase letters, numbers, and hyphens.'
        }
        if (RESERVED_SLUGS.has(value)) {
          return `"${value}" is reserved and would collide with an existing site route.`
        }
        return true
      },
    },
    {
      name: 'destinationUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'The full destination URL, including https://.',
        placeholder: 'https://www.example.com/some-page',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value) return 'Destination URL is required.'
        if (!/^https?:\/\//i.test(value)) {
          return 'Destination URL must start with http:// or https://.'
        }
        return true
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Optional friendly name for the admin list (e.g. "Ticket link — printed on flyers").',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Freeform notes about where/how this link is used.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to temporarily disable this redirect (visitors get 404).',
      },
    },
  ],
  timestamps: true,
}
