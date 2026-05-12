import Image from 'next/image'
import SectionReveal from './SectionReveal'

type Props = {
  /** Kept for CMS compatibility but intentionally not rendered — the new
   * mockup omits the section heading. */
  heading?: string
  body: string
}

/**
 * About / Neighborhood section — dark forest green band with body copy on the
 * left, vertical hairline divider, and the "UPPER EASTSIDE MIAMI" illustration
 * on the right. Section uses the supplied neighborhood.jpg as its background.
 */
export default function Neighborhood({ body }: Props) {
  return (
    <section className="relative overflow-hidden text-cream">
      <Image
        src="/backgrounds/neighborhood.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:gap-0 md:py-24">
        <SectionReveal>
          <p className="max-w-md font-body text-base leading-relaxed text-cream/90 md:pr-12 md:text-lg">
            {body}
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex justify-center md:border-l md:border-cream/25 md:pl-12 md:justify-end">
            <Image
              src="/neighborhood-illustration.png"
              alt="Upper Eastside Miami"
              width={472}
              height={558}
              priority={false}
              className="h-auto w-full max-w-[360px]"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
