'use client'
import { useEffect, useRef } from 'react'
import SectionReveal from './SectionReveal'

/**
 * FourVenues events embed.
 *
 * The FourVenues loader script (loaded from
 * https://www.fourvenues.com/assets/iframe/upper-eastside-hangout/events)
 * looks for a `<div id="fourvenues-iframe">` on the page and injects an
 * iframe of the venue's events calendar into it. It also wires up a
 * postMessage listener that auto-resizes the iframe height as the user
 * navigates inside it, so we don't need to set a fixed height.
 *
 * The loader uses `document.write()` as a fallback when the container is
 * missing, which would clobber the whole page after DOMContentLoaded —
 * so we render the container div in JSX first, then inject the script tag
 * on mount. React StrictMode double-invokes effects in dev; guarded with
 * a ref so the script only injects once.
 */
export default function HappeningNext({
  heading = 'Happening Next',
  eyebrow,
}: {
  heading?: string
  eyebrow?: string
}) {
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    injected.current = true

    const script = document.createElement('script')
    script.src = 'https://www.fourvenues.com/assets/iframe/upper-eastside-hangout/events'
    script.async = true
    script.dataset.fvEvents = 'true'
    document.body.appendChild(script)

    // No teardown — the FourVenues iframe attaches window-level postMessage
    // listeners and creating a fresh one on every re-mount would leak them.
    // The homepage doesn't unmount the section in normal navigation.
  }, [])

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
            <div
              className="mt-5 flex items-center justify-center gap-3 text-terracotta/70"
              aria-hidden="true"
            >
              <span className="h-px w-12 bg-current" />
              <span className="text-sm">✻</span>
              <span className="h-px w-12 bg-current" />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-12">
            {/* FourVenues injects the events iframe into this container */}
            <div id="fourvenues-iframe" />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
