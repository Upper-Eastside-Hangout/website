import type { GlobalConfig } from 'payload'

export const SEO: GlobalConfig = {
  slug: 'seo',
  label: 'SEO Defaults',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'defaultTitle',
      type: 'text',
      required: true,
      defaultValue:
        'Upper Eastside Hangout — Food, Drinks, Market, Community in Miami',
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      required: true,
      defaultValue:
        "An open-air food garden and bar in Miami's Upper Eastside. Food, drinks, market, community. Opening soon.",
    },
    {
      name: 'ogImageUrl',
      type: 'text',
      admin: {
        description:
          'Public URL of a 1200x630 OG image. Upload via /api/upload, then paste the URL. Falls back to /og-image.png if empty.',
      },
    },
    {
      name: 'twitterHandle',
      type: 'text',
      admin: { description: 'Optional. Include the leading @.' },
    },
  ],
}
