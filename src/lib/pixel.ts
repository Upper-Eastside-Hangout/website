/**
 * Safe wrapper around the Meta Pixel global `fbq`.
 *
 * The pixel script is loaded via <Script> in (frontend)/layout.tsx, which
 * defines `window.fbq` after the page becomes interactive. Calls before that
 * are queued by the pixel itself, but we also guard for SSR + missing pixel
 * (e.g. ad blockers) so the helper never throws.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export const trackPixel = (
  event: string,
  params?: Record<string, unknown>,
): void => {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  try {
    if (params) {
      window.fbq('track', event, params)
    } else {
      window.fbq('track', event)
    }
  } catch (err) {
    // Never let analytics break user flows.
    console.warn('[pixel] track failed:', err)
  }
}
