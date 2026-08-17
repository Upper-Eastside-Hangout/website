import type { CollectionConfig } from 'payload'

/**
 * Media collection — backs the upload field on Events.flyer and any future
 * collection that needs uploaded images. Files go to Vercel Blob storage
 * via the @payloadcms/storage-vercel-blob plugin (configured in payload.config).
 *
 * Uploaders can drop in any reasonable size (1920×1080, 1200×628, mobile shots).
 * Payload/Sharp auto-generates the additional sizes below — the "og" size
 * (1200×628, center-cropped) is what the frontend + Open Graph tags reference,
 * so social cards render at the correct aspect regardless of source dimensions.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true, // public for site-side rendering
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    imageSizes: [
      {
        // Open Graph / social card format. Center-cropped from source.
        // Used by /events/[slug] hero + og:image + twitter:image tags.
        name: 'og',
        width: 1200,
        height: 628,
        position: 'centre',
      },
      {
        // Small thumbnail for admin previews + hover popovers.
        name: 'thumb',
        width: 400,
        height: 210,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Short alt text for accessibility (e.g. "Trivia Night flyer with retro graphics").' },
    },
  ],
}
