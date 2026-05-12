import type { GlobalConfig } from 'payload'

export const NeighborhoodSection: GlobalConfig = {
  slug: 'neighborhoodSection',
  label: 'Neighborhood Section',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'OUR NEIGHBORHOOD',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      defaultValue:
        "Rooted in one of the city's most quietly captivating neighborhoods, where MiMo architecture, leafy streets, and Biscayne Bay breezes set the everyday rhythm. Open-air by design, family-friendly by nature, and always happy to share a patch of shade with your four-legged best friend, it's the kind of place where Buena Vista regulars and first-time visitors end up at the same table. Whether you live around the corner or you're flying in from somewhere far colder, consider this your invitation to slow down, settle in, and hang out.",
    },
  ],
}
