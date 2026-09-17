'use client'
import { useEffect, useRef } from 'react'
import SectionReveal from './SectionReveal'

/**
 * FourVenues events embed.
 *
 * The loader script at
 * https://www.fourvenues.com/assets/iframe/upper-eastside-hangout/events
 * looks for `<div id="fourvenues-iframe">` on the page and injects an
 * iframe of the venue's events calendar into it, plus a postMessage
 * listener that auto-resizes the iframe height as the user navigates.
 *
 * SCROLL-JUMP AVOIDANCE: the loader also listens for
 * `postMessage({key: 'toTop'})` from the child iframe and responds with
 * `element.scrollIntoView({behavior: 'smooth', block: 'start'})`. The
 * child fires that message on its own initial load, which yanks the
 * parent page down to this section on first paint.
 *
 * Fix: register a capture-phase message listener BEFORE appending the
 * loader script, and swallow the first 'toTop' message so FV's own
 * (bubble-phase) handler never runs. Later 'toTop' messages — sent
 * when the user clicks an event inside the iframe — still pass through
 * so navigating into event detail views scrolls correctly.
 *
 * The loader also uses `document.write()` as a fallback when the
 * container is missing, which would clobber the page after
 * DOMContentLoaded. We render the container in JSX first, then
 * append the script on mount. Guarded with a ref for StrictMode.
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

    // Capture-phase interceptor for the initial 'toTop' scroll-jump.
    let firstToTopSwallowed = false
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { key?: string } | null
      if (!firstToTopSwallowed && d && d.key === 'toTop') {
        firstToTopSwallowed = true
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener('message', onMessage, true)
    // Safety net: uninstall the interceptor after 15s regardless.
    const timer = window.setTimeout(() => {
      window.removeEventListener('message', onMessage, true)
    }, 15000)

    const script = document.createElement('script')
    script.src = 'https://www.fourvenues.com/assets/iframe/upper-eastside-hangout/events'
    script.async = true
    script.dataset.fvEvents = 'true'
    document.body.appendChild(script)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('message', onMessage, true)
    }
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
          <div className="mt-12">
            {/* FourVenues injects the events iframe into this container */}
            <div id="fourvenues-iframe" />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
