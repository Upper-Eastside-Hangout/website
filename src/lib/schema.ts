/**
 * JSON-LD generators for the public landing page.
 */

type RestaurantSchemaArgs = {
  name: string
  url: string
  image: string
  telephone: string
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry?: string
}

export const restaurantSchema = (args: RestaurantSchemaArgs) => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: args.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: args.streetAddress,
    addressLocality: args.addressLocality,
    addressRegion: args.addressRegion,
    postalCode: args.postalCode,
    addressCountry: args.addressCountry || 'US',
  },
  telephone: args.telephone,
  url: args.url,
  image: args.image,
  servesCuisine: ['American', 'Latin American'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '11:00',
      closes: '02:00',
    },
  ],
})

/**
 * The footer stores the address as a single string. Parse "701 NE 79th St, Miami, FL 33138"
 * into its schema.org parts. Returns sensible fallbacks if parsing fails.
 */
export const parseAddress = (raw: string) => {
  // Expected shape: "<street>, <locality>, <region> <postal>"
  const parts = raw.split(',').map((s) => s.trim())
  const street = parts[0] || '701 NE 79th St'
  const locality = parts[1] || 'Miami'
  const regionPostal = (parts[2] || 'FL 33138').split(/\s+/)
  const region = regionPostal[0] || 'FL'
  const postal = regionPostal[1] || '33138'
  return { street, locality, region, postal }
}

/**
 * Convert the US phone shown in the footer to the E.164-ish form schema.org prefers.
 * "305-555-5555" -> "+1-305-555-5555". Pass-through if already prefixed.
 */
export const normalizeTelephone = (raw: string) => {
  if (raw.startsWith('+')) return raw
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) {
    return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return raw
}
