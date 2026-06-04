'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

type NavLink = {
  label: string
  url: string
  openInNewTab?: boolean | null
}

type Props = {
  links: NavLink[]
}

/**
 * Header — hamburger button fixed at the top-right corner of every public
 * page. Clicking the button opens a full-screen vintage-style overlay menu
 * with all nav links (sourced from the Payload navigation global).
 */
export default function Header({ links }: Props) {
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

  // Don't render anything if there are no links to show.
  if (!links || links.length === 0) return null

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed right-5 top-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-forest/15 bg-cream-50/85 text-forest shadow-sm backdrop-blur transition hover:bg-cream-50 md:right-8 md:top-8"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <HamburgerIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-forest text-cream"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav className="px-6">
              <ul className="space-y-7 text-center md:space-y-10">
                {links.map((link, i) => (
                  <li key={`${link.label}-${i}`}>
                    <a
                      href={link.url}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="inline-block font-label text-3xl uppercase tracking-[0.22em] text-cream transition hover:text-mustard md:text-5xl"
                    >
                      {link.label}
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
