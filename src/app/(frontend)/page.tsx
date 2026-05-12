import { getPayloadClient } from '@/lib/payload'
import Hero from '@/components/Hero'
import Neighborhood from '@/components/Neighborhood'
import SignupForm from '@/components/SignupForm'
import Footer from '@/components/Footer'
import { restaurantSchema, parseAddress, normalizeTelephone } from '@/lib/schema'

export const revalidate = 60 // ISR — admin edits land within ~1 min.

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
  copyrightText: string
}

export default async function Page() {
  const payload = await getPayloadClient()

  // Run global fetches in parallel.
  const [hero, neighborhood, signup, footer] = (await Promise.all([
    payload.findGlobal({ slug: 'heroSection' }),
    payload.findGlobal({ slug: 'neighborhoodSection' }),
    payload.findGlobal({ slug: 'signupSection' }),
    payload.findGlobal({ slug: 'footer' }),
  ])) as [HeroGlobal, NeighborhoodGlobal, SignupGlobal, FooterGlobal]

  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://uppereastsidehangout.com'
  const addr = parseAddress(footer.address)
  const ld = restaurantSchema({
    name: 'Upper Eastside Hangout',
    url,
    image: `${url}/og-image.png`,
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

      <Hero
        tagline={hero.tagline}
        subtagline={hero.subtagline}
        ctaButtonText={hero.ctaButtonText}
        ctaTarget="#signup"
      />

      {/* PHASE 2: vendor grid renders here ("A Few of the Faces") */}

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
        copyrightText={footer.copyrightText}
      />
    </main>
  )
}
