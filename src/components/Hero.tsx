'use client'
import Image from 'next/image'

type Props = {
  tagline: string
  subtagline: string
  ctaButtonText: string
  /** Where the CTA should jump. Defaults to '#signup'. */
  ctaTarget?: string
}

/**
 * Hero — fills exactly one viewport (min-h-[100svh] with flex-centered content)
 * so the logo, category line, flourish, italic subtagline, and CTA all sit
 * above the fold on any reasonable laptop height. Logo dominates but is
 * capped so the rest of the content fits.
 */
export default function Hero({
  tagline,
  subtagline,
  ctaButtonText,
  ctaTarget = '#signup',
}: Props) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <Image
        src="/backgrounds/hero2.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-6 text-center md:py-10">
        <Image
          src="/logo-primary.png"
          alt="Upper Eastside Hangout"
          width={1200}
          height={944}
          priority
          className="h-auto w-full"
          style={{
            maxWidth: 'min(86vw, 940px)',
            maxHeight: 'min(56vh, 600px)',
            objectFit: 'contain',
          }}
        />

        <p className="mt-6 font-label text-sm tracking-[0.22em] text-forest md:text-base">
          {tagline}
        </p>

        {/* Decorative divider — hairline + small flower + hairline, terracotta */}
        <div className="mt-4 flex items-center gap-3 text-terracotta/70" aria-hidden="true">
          <span className="h-px w-10 bg-current" />
          <span className="text-sm">✻</span>
          <span className="h-px w-10 bg-current" />
        </div>

        <p className="mt-4 max-w-xl font-body text-base italic text-forest/85 md:text-lg">
          {subtagline}
        </p>

        <a
          href={ctaTarget}
          className="mt-6 inline-block rounded-sm bg-forest px-10 py-3.5 font-label text-sm tracking-[0.18em] text-cream transition hover:bg-forest-dark"
        >
          {ctaButtonText}
        </a>
      </div>
    </section>
  )
}
