'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/**
 * Header — hardcoded site navigation.
 *
 * Menu is code-owned because each item (except DIRECTIONS) scrolls to a
 * specific homepage section by id. Letting an admin edit these in the CMS
 * would risk silently breaking the scroll target if labels/hrefs drift.
 *
 * Mobile: hamburger button pinned top-LEFT, opens a full-screen forest
 * overlay with the same links stacked vertically.
 *
 * Desktop (md ≥ 768px): a fixed top nav bar renders across the page with
 * links right-aligned; hamburger + overlay hidden.
 *
 * All hash hrefs use plain <a>. Smooth-scroll is handled by the global
 * `html { scroll-behavior: smooth }` rule (respects prefers-reduced-motion).
 */

type NavItem = {
  label: string
  href: string
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'EVENTS', href: '/#events' },
  { label: 'VENDORS', href: '/#vendors' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'CONTACT', href: '/#contact' },
  { label: 'DIRECTIONS', href: 'https://maps.app.goo.gl/oV3tQHeEHFHxZDf79', external: true },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* Mobile hamburger — pinned top-left, hidden on md+ */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed left-5 top-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-forest/15 bg-cream-50/85 text-forest shadow-sm backdrop-blur transition hover:bg-cream-50 md:hidden"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <HamburgerIcon open={open} />
      </button>

      {/* Desktop nav — fixed top bar, hidden on mobile */}
      <nav
        aria-label="Site"
        className="fixed left-0 right-0 top-0 z-40 hidden border-b border-cream/10 bg-forest/85 backdrop-blur-sm md:block"
      >
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-8 px-8 py-4 font-label text-sm uppercase tracking-[0.22em] text-cream">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="transition hover:text-mustard"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-forest text-cream md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav className="px-6">
              <ul className="space-y-7 text-center">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="inline-block font-label text-3xl uppercase tracking-[0.22em] text-cream transition hover:text-mustard"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ) : (
      <>
        <path d="M4 8h16" />
        <path d="M4 16h16" />
      </>
    )}
  </svg>
)
