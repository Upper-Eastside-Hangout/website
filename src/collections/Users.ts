import type { Access, CollectionConfig, FieldAccess } from 'payload'

const userIsAdmin = (user: unknown): boolean =>
  Boolean(user) && (user as { role?: string }).role === 'admin'

const isAdmin: Access = ({ req }) => userIsAdmin(req.user)
const isAdminField: FieldAccess = ({ req }) => userIsAdmin(req.user)

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  access: {
    // Any authenticated user can read the user list (so editors see their own row).
    read: ({ req }) => Boolean(req.user),
    // Only admins can create or delete users.
    create: isAdmin,
    delete: isAdmin,
    // Admins can update anyone; users can update their own row.
    update: ({ req }) => {
      if (!req.user) return false
      const u = req.user as { id: string | number; role?: string }
      if (u.role === 'admin') return true
      return { id: { equals: u.id } }
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins can change roles (prevents an editor from self-promoting).
        update: isAdminField,
      },
    },
  ],
}
