import SectionReveal from './SectionReveal'
import VendorCard from './VendorCard'

type Vendor = React.ComponentProps<typeof VendorCard>['vendor']

type Props = {
  vendors: Vendor[]
  /** Section heading. Defaults to "A Few of the Faces" (matches original mockup). */
  heading?: string
  /** Optional italic line above the heading. */
  eyebrow?: string
}

export default function VendorsSection({
  vendors,
  heading = 'A Few of the Faces',
  eyebrow,
}: Props) {
  if (!vendors.length) return null

  return (
    <section className="bg-paper relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="text-center">
            {eyebrow && (
              <p className="mb-3 font-body text-base italic text-forest/70">{eyebrow}</p>
            )}
            <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-forest md:text-5xl">
              {heading}
            </h2>
            <div className="mx-auto mt-5 flex items-center gap-3 text-terracotta/70" aria-hidden="true">
              <span className="h-px w-12 bg-current" />
              <span className="text-sm">✻</span>
              <span className="h-px w-12 bg-current" />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {vendors.map((v, i) => (
              <VendorCard key={i} vendor={v} />
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
