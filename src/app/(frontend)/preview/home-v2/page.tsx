import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Neighborhood from '@/components/Neighborhood'
import VendorsSection from '@/components/VendorsSection'
import SignupForm from '@/components/SignupForm'
import Footer from '@/components/Footer'
import { restaurantSchema, parseAddress, normalizeTelephone } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Preview · Home v2 — Upper Eastside Hangout',
  // Don't let search engines index preview routes.
  robots: { index: false, follow: false },
}

type HeroGlobal = { tagline: string; subtagline: string; ctaButtonText: string }
type NeighborhoodGlobal = { heading: string; body: string }
type SignupGlobal = {
  heading: string
  buttonText: string
  successMessage: string
  segmentLabel1: string
  segmentLabel2: string
  segmentLabel3: string
}
type FooterGlobal = {
  address: string
  phone: string
  hours: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  youtubeUrl?: string
  googleBusinessUrl?: string
  yelpUrl?: string
  tripadvisorUrl?: string
  nextdoorUrl?: string
  copyrightText: string
}
type NavigationGlobal = {
  links: { label: string; url: string; openInNewTab?: boolean }[]
}

export default async function HomePreview() {
  const payload = await getPayloadClient()

  const [hero, neighborhood, signup, footer] = (await Promise.all([
    payload.findGlobal({ slug: 'heroSection' }),
    payload.findGlobal({ slug: 'neighborhoodSection' }),
    payload.findGlobal({ slug: 'signupSection' }),
    payload.findGlobal({ slug: 'footer' }),
  ])) as [HeroGlobal, NeighborhoodGlobal, SignupGlobal, FooterGlobal]

  let navigation: NavigationGlobal = { links: [] }
  try {
    navigation = (await payload.findGlobal({ slug: 'navigation' })) as NavigationGlobal
  } catch {
    /* navigation table may not exist yet; render without nav */
  }

  // Vendors — only published, sorted alphabetically by name.
  const vendorResult = await payload.find({
    collection: 'vendors',
    where: { published: { equals: true } },
    sort: 'name',
    limit: 100,
  })
  const vendors = vendorResult.docs.map((d) => {
    const raw = d as unknown as Record<string, unknown>
    return {
      name: String(raw.name || ''),
      bio: (raw.bio as string) || null,
      logoUrl: (raw.logoUrl as string) || null,
      illustrationUrl: (raw.illustrationUrl as string) || null,
      websiteUrl: (raw.websiteUrl as string) || null,
      menuUrl: (raw.menuUrl as string) || null,
      instagramUrl: (raw.instagramUrl as string) || null,
      facebookUrl: (raw.facebookUrl as string) || null,
    }
  })

  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'
  const addr = parseAddress(footer.address)
  const ld = restaurantSchema({
    name: 'Upper Eastside Hangout',
    url,
    image: `${url}/og-image.jpg`,
    telephone: normalizeTelephone(footer.phone),
    streetAddress: addr.street,
    addressLocality: addr.locality,
    addressRegion: addr.region,
    postalCode: addr.postal,
  })

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Header links={navigation.links} />

      <Hero
        tagline={hero.tagline}
        subtagline={hero.subtagline}
        ctaButtonText={hero.ctaButtonText}
        ctaTarget="#signup"
      />

      {/* NEW SECTION — vendor grid, between Hero and Neighborhood */}
      <VendorsSection vendors={vendors} />

      <Neighborhood heading={neighborhood.heading} body={neighborhood.body} />

      <SignupForm
        globals={{
          heading: signup.heading,
          buttonText: signup.buttonText,
          successMessage: signup.successMessage,
          segmentLabel1: signup.segmentLabel1,
          segmentLabel2: signup.segmentLabel2,
          segmentLabel3: signup.segmentLabel3,
        }}
      />

      <Footer
        address={footer.address}
        phone={footer.phone}
        hours={footer.hours}
        instagramUrl={footer.instagramUrl}
        facebookUrl={footer.facebookUrl}
        tiktokUrl={footer.tiktokUrl}
        youtubeUrl={footer.youtubeUrl}
        googleBusinessUrl={footer.googleBusinessUrl}
        yelpUrl={footer.yelpUrl}
        tripadvisorUrl={footer.tripadvisorUrl}
        nextdoorUrl={footer.nextdoorUrl}
        copyrightText={footer.copyrightText}
      />
    </main>
  )
}
