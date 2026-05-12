import type { Metadata } from 'next'
import { Fraunces, Libre_Baskerville, Alegreya_SC, DM_Serif_Display } from 'next/font/google'
import { getPayloadClient } from '@/lib/payload'
import '@/styles/globals.css'

// Restrained vintage Florida typography:
//   heading — Fraunces, vintage expressive serif for section headings
//   body    — Libre Baskerville, warm editorial serif (normal + italic)
//   label   — Alegreya SC, small-caps for buttons + labels + footer microcopy
const heading = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '600', '700', '800'],
})

const body = Libre_Baskerville({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const label = Alegreya_SC({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-label',
  weight: ['400', '700', '900'],
})

// Invitation-style serif — elegant, slightly oblique, high-contrast. Used for
// the signup heading where the vibe should feel more like a printed RSVP card
// than the woodtype-feel of the other section headings.
const invitation = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-invitation',
  weight: ['400'],
  style: ['normal', 'italic'],
})

export async function generateMetadata(): Promise<Metadata> {
  let seo
  try {
    const payload = await getPayloadClient()
    seo = await payload.findGlobal({ slug: 'seo' })
  } catch (err) {
    console.warn('[layout] SEO global fetch failed; using fallback metadata.', err)
    seo = null
  }

  const seoData = (seo || {}) as {
    defaultTitle?: string
    defaultDescription?: string
    ogImageUrl?: string
    twitterHandle?: string
  }

  const title =
    seoData.defaultTitle ||
    'Upper Eastside Hangout — Food, Drinks, Market, Community in Miami'
  const description =
    seoData.defaultDescription ||
    "An open-air food garden and bar in Miami's Upper Eastside. Food, drinks, market, community. Opening soon."
  const ogImage = seoData.ogImageUrl || '/og-image.png'
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'

  return {
    metadataBase: new URL(url),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Upper Eastside Hangout',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Upper Eastside Hangout' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: seoData.twitterHandle,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${label.variable} ${invitation.variable}`}>
      <body>{children}</body>
    </html>
  )
}
