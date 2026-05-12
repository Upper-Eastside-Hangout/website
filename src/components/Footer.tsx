import Image from 'next/image'

type Props = {
  address: string
  phone: string
  hours: string
  instagramUrl?: string
  facebookUrl?: string
  copyrightText: string
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.2H7.7V13h2.7v8h3.1z" />
  </svg>
)

export default function Footer({
  address,
  phone,
  hours,
  instagramUrl,
  facebookUrl,
  copyrightText,
}: Props) {
  return (
    <footer className="relative overflow-hidden text-cream">
      <Image
        src="/backgrounds/footer.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left — cream logo */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo-cream.png"
              alt="Upper Eastside Hangout"
              width={600}
              height={472}
              className="h-auto w-72 md:w-[26rem]"
            />
          </div>

          {/* Right — contact info with icons + socials */}
          <div className="space-y-4 text-center font-body text-base text-cream/90 md:text-left">
            <p className="flex items-center justify-center gap-4 md:justify-start">
              <PinIcon />
              <span>{address}</span>
            </p>
            <p className="flex items-center justify-center gap-4 md:justify-start">
              <PhoneIcon />
              <span>{phone}</span>
            </p>
            <p className="flex items-center justify-center gap-4 md:justify-start">
              <ClockIcon />
              <span>{hours}</span>
            </p>

            {(instagramUrl || facebookUrl) && (
              <div className="flex items-center justify-center gap-4 pt-2 md:justify-start">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    aria-label="Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/60 text-cream transition hover:bg-cream/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    aria-label="Facebook"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/60 text-cream transition hover:bg-cream/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="my-10 border-cream/20" />

        <p className="text-center font-body text-sm text-cream/75">
          {copyrightText}
        </p>
      </div>
    </footer>
  )
}
