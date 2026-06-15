import Image from 'next/image'

type Props = {
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

/* -------------------- Contact-row icons (outline style) -------------------- */

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

/* -------------------- Social icons (filled brand glyphs) -------------------- */

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
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

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M19.32 5.56a5.13 5.13 0 0 1-.44-.26 6.23 6.23 0 0 1-1.14-.96c-.85-.97-1.16-1.96-1.28-2.65V1.5h-3.4v13.62c0 .18 0 .35-.01.52v.1a2.89 2.89 0 0 1-1.45 2.3 2.84 2.84 0 0 1-1.41.37c-1.58 0-2.85-1.28-2.85-2.87s1.27-2.86 2.85-2.86c.3 0 .58.04.85.13l.01-3.46a6.23 6.23 0 0 0-4.81 1.4 6.59 6.59 0 0 0-1.43 1.77c-.14.23-.65 1.17-.71 2.69-.04.86.22 1.75.35 2.12v.01c.07.22.38.96.87 1.59a6.75 6.75 0 0 0 1.39 1.36v-.01l.01.01a6.61 6.61 0 0 0 3.7 1.11c.34-.01 1.47 0 2.75-.6 1.42-.68 2.23-1.68 2.23-1.68a6.93 6.93 0 0 0 1.21-2.01c.33-.86.44-1.9.44-2.31V7.3c.04.03.63.41.63.41s.84.55 2.16.9c.94.25 2.21.3 2.21.3V5.55c-.45.05-1.35-.1-2.28-.55z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.81.5-5.81s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
)

const GoogleBusinessIcon = () => (
  // Simplified Google "G" mark — recognizable at small sizes.
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M21.35 11.1H12.18v3.39h5.59c-.56 2.5-2.67 3.5-5.5 3.5-3.45 0-6.25-2.79-6.25-6.24s2.8-6.24 6.25-6.24c1.62 0 2.94.61 3.97 1.57l2.58-2.58C16.78 2.91 14.62 2 12.18 2c-5.52 0-10 4.48-10 10s4.48 10 10 10c5 0 9.62-3.64 9.62-10 0-.61-.06-1.16-.17-1.9z" />
  </svg>
)

const YelpIcon = () => (
  // Stylized Yelp burst — five rays radiating from a center, evoking the brand mark.
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M11.3 11.6c.6.1 1-.5.7-1L8.9 4.6c-.3-.5-.9-.5-1.1 0L6 8.3c-.2.4 0 .9.4 1l4.9 2.3zM12.5 13.1c-.5-.2-1 .3-.8.8l1.6 4.4c.2.5.8.7 1.1.3l2-1.9c.3-.3.2-.9-.2-1.1l-3.7-2.5zM10.8 14c.5-.3.4-1-.1-1.2L6 11.5c-.5-.1-1 .4-.8.9l.7 3.1c.1.5.7.7 1.1.4l3.8-1.9zM14.7 11.2c-.4.4-.2 1.1.4 1.1l4.8.3c.6 0 1-.6.7-1.1L18.5 7c-.3-.5-1-.5-1.3 0l-2.5 4.2zM12.5 11c.5.3 1.1-.1 1-.7L13 2c-.1-.6-.7-1-1.3-.7l-2 1.2c-.5.3-.6.9-.3 1.4L12.5 11z" />
  </svg>
)

const TripAdvisorIcon = () => (
  // Two-eye owl silhouette — the iconic TripAdvisor shape.
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" fillRule="evenodd">
    <path d="M12 4C6.5 4 2 8.5 2 14h2.5a4.5 4.5 0 0 1 8.4-2.27A4.5 4.5 0 0 1 17.5 14H20c0-5.5-4.5-10-10-10h2zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm10 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" clipRule="evenodd" />
  </svg>
)

const NextdoorIcon = () => (
  // Stylized house silhouette — Nextdoor's brand mark.
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 2L3 9v12h6v-7h6v7h6V9l-9-7z" />
  </svg>
)

/* -------------------- Social link helper -------------------- */

type SocialLinkProps = {
  href?: string
  label: string
  children: React.ReactNode
}

const SocialLink = ({ href, label, children }: SocialLinkProps) => {
  if (!href) return null
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/60 text-cream transition hover:bg-cream/10"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

/* -------------------- Component -------------------- */

export default function Footer({
  address,
  phone,
  hours,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  youtubeUrl,
  googleBusinessUrl,
  yelpUrl,
  tripadvisorUrl,
  nextdoorUrl,
  copyrightText,
}: Props) {
  const anySocial =
    instagramUrl ||
    facebookUrl ||
    tiktokUrl ||
    youtubeUrl ||
    googleBusinessUrl ||
    yelpUrl ||
    tripadvisorUrl ||
    nextdoorUrl

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

            {anySocial && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
                <SocialLink href={instagramUrl} label="Instagram"><InstagramIcon /></SocialLink>
                <SocialLink href={facebookUrl} label="Facebook"><FacebookIcon /></SocialLink>
                <SocialLink href={tiktokUrl} label="TikTok"><TikTokIcon /></SocialLink>
                <SocialLink href={youtubeUrl} label="YouTube"><YouTubeIcon /></SocialLink>
                <SocialLink href={googleBusinessUrl} label="Google Business"><GoogleBusinessIcon /></SocialLink>
                <SocialLink href={yelpUrl} label="Yelp"><YelpIcon /></SocialLink>
                <SocialLink href={tripadvisorUrl} label="TripAdvisor"><TripAdvisorIcon /></SocialLink>
                <SocialLink href={nextdoorUrl} label="Nextdoor"><NextdoorIcon /></SocialLink>
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
