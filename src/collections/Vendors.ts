import type { CollectionConfig } from 'payload'

/**
 * Resident vendors — the recurring food/drink operators based at the venue.
 * Shown in a grid on the homepage. Temporary/event-based pop-up vendors are
 * NOT stored here; those live in the Events collection as one-off occurrences.
 */
export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'published', 'order'],
    description:
      'Resident vendors with a permanent presence at the venue. Reorder by changing the Order field.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Vendor display name (e.g. "Cheese Burger Baby").' },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short 1–2 sentence description shown on the vendor card.',
      },
    },
    {
      name: 'logoUrl',
      type: 'text',
      admin: {
        description:
          'Vendor brand logo as transparent PNG. Drop file at /public/vendors/ and reference as /vendors/your-file.png. Recommended 600×600 px.',
      },
    },
    {
      name: 'illustrationUrl',
      type: 'text',
      admin: {
        description:
          'Vintage illustration for the card (matches the site’s drawn aesthetic). Transparent PNG, drop at /public/vendors/ and reference as /vendors/your-file.png. Recommended 800×800 px.',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: {
        description: 'Vendor website. Icon shown on card only when populated.',
      },
    },
    {
      name: 'menuUrl',
      type: 'text',
      admin: {
        description: 'Direct link to menu. Icon shown on card only when populated.',
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      admin: {
        description: 'Full Instagram profile URL. Icon shown only when populated.',
      },
    },
    {
      name: 'facebookUrl',
      type: 'text',
      admin: {
        description: 'Full Facebook page URL. Icon shown only when populated.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order. Lower numbers render first.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uncheck to hide a vendor from the public site.' },
    },
  ],
  timestamps: true,
}
