import type { CollectionConfig } from 'payload'

/**
 * PHASE 2 SCAFFOLD — Vendors are NOT rendered on the public site in Phase 0.
 * The collection exists so the admin can populate it ahead of the Phase 2
 * launch, where the "A Few of the Faces" grid will read from here.
 *
 * Note: illustration is a plain text URL field (not a Payload upload relation)
 * because the @payloadcms/storage-vercel-blob plugin has been observed to
 * break the Payload admin in this stack. Images are uploaded via the custom
 * /api/upload route (signed Vercel Blob client uploads) and the resulting URL
 * is pasted here.
 */
export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'published', 'order'],
    description:
      'Phase 2 — vendor grid for "A Few of the Faces." Not rendered on the public site in Phase 0.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'food',
      options: [
        { label: 'Food', value: 'food' },
        { label: 'Drinks', value: 'drinks' },
        { label: 'Market', value: 'market' },
        { label: 'Coffee', value: 'coffee' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'illustration',
      type: 'text',
      admin: {
        description:
          'Public Vercel Blob URL for the vendor illustration. Upload via the admin upload widget (TBD) or the /api/upload route, then paste the URL.',
      },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Manual sort. Lower numbers render first.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only published vendors appear on the public site (Phase 2).' },
    },
  ],
  timestamps: true,
}
