import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'
  return [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ]
}
