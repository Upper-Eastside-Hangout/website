'use client'

import { useState } from 'react'
import Image from 'next/image'

type Vendor = {
  name: string
  bio?: string | null
  logoUrl?: string | null
  illustrationUrl?: string | null
  websiteUrl?: string | null
  menuUrl?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
}

type Props = { vendor: Vendor }

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
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
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18" />
    <path d="M12 3a13 13 0 0 0 0 18" />
  </svg>
)
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
)

type IconLinkProps = {
  href?: string | null
  label: string
  children: React.ReactNode
}

const IconLink = ({ href, label, children }: IconLinkProps) => {
  if (!href) return null
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-forest/40 text-forest transition hover:bg-forest hover:text-cream"
    >
      {children}
    </a>
  )
}

export default function VendorCard({ vendor }: Props) {
  const [bioOpen, setBioOpen] = useState(false)

  const hasIllustration = Boolean(vendor.illustrationUrl)
  const hasLogo = Boolean(vendor.logoUrl)
  const hoverSwap = hasIllustration && hasLogo
  const hasBio = Boolean(vendor.bio && vendor.bio.trim())

  return (
    <article className="group flex h-full flex-col rounded-sm border border-forest/15 bg-cream-50 p-6 text-center shadow-sm">
      {/* Title — now at the top */}
      <h3 className="font-label text-base tracking-[0.16em] text-forest md:text-lg">
        {vendor.name}
      </h3>
      <div className="mx-auto mt-2 h-px w-10 bg-forest/30" aria-hidden="true" />

      {/* Toggle area — image by default, bio on click. Fixed height so the
          card doesn't reflow when state changes. */}
      <button
        type="button"
        onClick={() => hasBio && setBioOpen((v) => !v)}
        aria-expanded={bioOpen}
        aria-label={
          hasBio ? (bioOpen ? `Hide ${vendor.name} bio` : `Show ${vendor.name} bio`) : vendor.name
        }
        disabled={!hasBio}
        className="relative mx-auto my-5 flex h-40 w-40 cursor-pointer items-center justify-center md:h-48 md:w-48 disabled:cursor-default"
      >
        {/* Image layer — hidden when bio is shown */}
        <div
          className={[
            'absolute inset-0 transition-opacity duration-300',
            bioOpen ? 'opacity-0 pointer-events-none' : 'opacity-100',
          ].join(' ')}
        >
          {hasIllustration && (
            <Image
              src={vendor.illustrationUrl as string}
              alt={hoverSwap ? '' : vendor.name}
              aria-hidden={hoverSwap ? 'true' : undefined}
              fill
              sizes="(min-width: 768px) 200px, 160px"
              className={[
                'object-contain mix-blend-multiply transition-opacity duration-300',
                hoverSwap ? 'group-hover:opacity-0' : '',
              ].join(' ')}
            />
          )}
          {hasLogo && (
            <Image
              src={vendor.logoUrl as string}
              alt={vendor.name}
              fill
              sizes="(min-width: 768px) 200px, 160px"
              className={[
                'object-contain mix-blend-multiply transition-opacity duration-300',
                hoverSwap ? 'absolute inset-0 opacity-0 group-hover:opacity-100' : '',
              ].join(' ')}
            />
          )}
          {!hasIllustration && !hasLogo && (
            <div className="h-full w-full rounded-full bg-forest/10" />
          )}
        </div>

        {/* Bio layer — visible when bioOpen */}
        {hasBio && (
          <div
            className={[
              'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
              bioOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            ].join(' ')}
          >
            <p className="font-body text-sm leading-relaxed text-forest/90 md:text-[0.95rem]">
              {vendor.bio}
            </p>
          </div>
        )}
      </button>

      {/* Action icons — always visible */}
      {(vendor.instagramUrl || vendor.facebookUrl || vendor.websiteUrl || vendor.menuUrl) && (
        <div className="mt-auto flex items-center justify-center gap-3 pt-2">
          <IconLink href={vendor.instagramUrl} label={`${vendor.name} on Instagram`}>
            <InstagramIcon />
          </IconLink>
          <IconLink href={vendor.facebookUrl} label={`${vendor.name} on Facebook`}>
            <FacebookIcon />
          </IconLink>
          <IconLink href={vendor.websiteUrl} label={`${vendor.name} website`}>
            <GlobeIcon />
          </IconLink>
          <IconLink href={vendor.menuUrl} label={`${vendor.name} menu`}>
            <MenuIcon />
          </IconLink>
        </div>
      )}
    </article>
  )
}
