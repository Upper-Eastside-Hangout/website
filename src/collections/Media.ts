import type { CollectionConfig } from 'payload'

/**
 * Media collection — backs the upload field on Events.flyer and any future
 * collection that needs uploaded images. Files go to Vercel Blob storage
 * via the @payloadcms/storage-vercel-blob plugin (configured in payload.config).
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
    // Limit uploads to images. Flyers should be 1200x628 (Open Graph aspect),
    // but we don't enforce dimensions — uploader can pick anything image-like.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Short alt text for accessibility (e.g. "Trivia Night flyer with retro graphics").' },
    },
  ],
}
