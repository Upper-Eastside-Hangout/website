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
 * IMPORTANT: the loader's postMessage handler calls
 * `element.scrollIntoView({behavior: 'smooth', block: 'start'})` on a
 * message from the child iframe that fires immediately on load. If we
 * inject the script on mount, the browser scroll-jumps to this section
 * on first paint. To avoid that we gate injection behind an
 * IntersectionObserver — the script only runs once the section is
 * already in the viewport, so the scrollIntoView call is a no-op.
 *
 * The loader uses `document.write()` as a fallback when the container is
 * missing, which would clobber the whole page after DOMContentLoaded —
 * so we render the container div in JSX first, then inject the script tag
 * once observed. React StrictMode double-invokes effects in dev; guarded
 * with a ref so the script only injects once.
 */
export default function HappeningNext({
  heading = 'Happening Next',
  eyebrow,
}: {
  heading?: string
  eyebrow?: string
}) {
  const injected = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const target = containerRef.current
    if (!target || injected.current) return

    const inject = () => {
      if (injected.current) return
      injected.current = true
      const script = document.createElement('script')
      script.src = 'https://www.fourvenues.com/assets/iframe/upper-eastside-hangout/events'
      script.async = true
      script.dataset.fvEvents = 'true'
      document.body.appendChild(script)
    }

    // Fall back to eager injection if IntersectionObserver isn't available.
    if (typeof IntersectionObserver === 'undefined') {
      inject()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inject()
            io.disconnect()
            break
          }
        }
      },
      // rootMargin lets us start the load a bit before the section enters
      // view so the iframe is ready by the time the user gets there.
      { rootMargin: '200px 0px' },
    )
    io.observe(target)
    return () => io.disconnect()
  }, [])

  return (
    <section id="events" className="bg-paper relative scroll-mt-24 px-6 py-16 md:py-24">
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
          <div className="mt-12" ref={containerRef}>
            {/* FourVenues injects the events iframe into this container */}
            <div id="fourvenues-iframe" />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
