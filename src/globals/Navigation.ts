import type { GlobalConfig } from 'payload'

/**
 * Navigation menu — the hamburger-overlay nav on every public page.
 * Links are stored as an array and can be dragged to reorder in the admin.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation Menu',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        description:
          'Drag to reorder. The label is the visible text in the menu; the URL can be internal (e.g. /signup) or external (e.g. https://...).',
      },
      defaultValue: [
        {
          label: 'EVENTS',
          url: 'https://site.fourvenues.com/en/upper-eastside-hangout',
          openInNewTab: true,
        },
        {
          label: 'DIRECTIONS',
          url: 'https://maps.app.goo.gl/oV3tQHeEHFHxZDf79',
          openInNewTab: true,
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Displayed in the menu (e.g. EVENTS).' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Full URL or relative path.' },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Open in a new browser tab. Leave on for external links.' },
        },
      ],
    },
  ],
}
