import type { GlobalConfig } from 'payload'

export const HeroSection: GlobalConfig = {
  slug: 'heroSection',
  label: 'Hero Section',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'FOOD · DRINKS · MARKET · COMMUNITY',
    },
    {
      name: 'subtagline',
      type: 'text',
      required: true,
      defaultValue: 'Drawing roots in the Upper Eastside, Miami',
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      required: true,
      defaultValue: 'GET FIRST ACCESS',
    },
  ],
}
