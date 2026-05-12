import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) =>
  Boolean(req.user) && (req.user as { role?: string }).role === 'admin'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'segment', 'profileCompleted', 'createdAt'],
    description:
      'Email list. Rows are created by the public signup form via /api/subscribe. Admin-only access.',
  },
  access: {
    // Public signup writes through the /api/subscribe route using a server-side Payload
    // instance (operates as system user, bypasses access control). Direct CRUD locked down.
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    {
      name: 'birthMonth',
      type: 'text',
      admin: { description: 'MM, 01-12' },
      validate: (value: unknown) => {
        if (value == null || value === '') return true
        const s = String(value)
        if (!/^\d{2}$/.test(s)) return 'Must be two digits (MM).'
        const n = parseInt(s, 10)
        if (n < 1 || n > 12) return 'Month must be between 01 and 12.'
        return true
      },
    },
    {
      name: 'birthDay',
      type: 'text',
      admin: { description: 'DD, 01-31' },
      validate: (value: unknown) => {
        if (value == null || value === '') return true
        const s = String(value)
        if (!/^\d{2}$/.test(s)) return 'Must be two digits (DD).'
        const n = parseInt(s, 10)
        if (n < 1 || n > 31) return 'Day must be between 01 and 31.'
        return true
      },
    },
    { name: 'phone', type: 'text' },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
      ],
    },
    {
      name: 'segment',
      type: 'select',
      options: [
        { label: 'Neighborhood', value: 'neighborhood' },
        { label: 'Industry', value: 'industry' },
        { label: 'Curious', value: 'curious' },
      ],
    },
    {
      name: 'profileCompleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Flips true once the profile lightbox is submitted (Save, not Skip).',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'landing-page',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
